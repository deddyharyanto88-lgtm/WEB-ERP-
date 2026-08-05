import { NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase'
import { DashboardStats } from '@/types'

// Cache for dashboard stats (5 minute TTL)
const cache = new Map<string, { data: DashboardStats; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const entity = url.searchParams.get('entity') || ''
    const cacheKey = `dashboard:${entity}`
    
    // Check cache first
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data)
    }

    const supabase = createServerComponentClient()

    // Use database-level aggregation and filtering instead of client-side
    const [projectsRes, posRes, paymentsRes] = await Promise.all([
      supabase
        .from('projects')
        .select('id, name, budget, spent, status, entity_id')
        .eq('entity_id', entity)
        .limit(100),
      supabase
        .from('purchase_orders')
        .select('id, vendor_name, amount, status, entity_id')
        .eq('entity_id', entity)
        .limit(500),
      supabase
        .from('payments')
        .select('id, amount, date, type, entity_id')
        .eq('entity_id', entity)
        .order('date', { ascending: false })
        .limit(1000),
    ])

    const projects = projectsRes.data ?? []
    const purchaseOrders = posRes.data ?? []
    const payments = paymentsRes.data ?? []

    // Single-pass calculations for payments
    let totalRevenue = 0
    const paymentsByMonth = new Map<string, { inflow: number; outflow: number }>()
    const now = new Date()
    
    for (const payment of payments) {
      if (payment.type === 'inflow') {
        totalRevenue += payment.amount
      }
      
      const paymentDate = new Date(payment.date)
      const monthKey = paymentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase()
      
      if (!paymentsByMonth.has(monthKey)) {
        paymentsByMonth.set(monthKey, { inflow: 0, outflow: 0 })
      }
      const monthData = paymentsByMonth.get(monthKey)!
      if (payment.type === 'inflow') {
        monthData.inflow += payment.amount
      } else {
        monthData.outflow += payment.amount
      }
    }

    const projectsCompleted = projects.filter((p) => p.status === 'completed').length
    const activePOs = purchaseOrders.filter((po) => po.status === 'pending').length

    // Single-pass calculations for projects
    let totalBudget = 0
    let totalSpent = 0
    let budgetOverruns = 0
    let worstOverrunProject = null
    let worstOverrunRatio = 0

    for (const project of projects) {
      const budget = project.budget || 0
      const spent = project.spent || 0
      totalBudget += budget
      totalSpent += spent
      
      if (spent > budget) {
        budgetOverruns += spent - budget
        const ratio = budget > 0 ? spent / budget : Infinity
        if (ratio > worstOverrunRatio) {
          worstOverrunRatio = ratio
          worstOverrunProject = project
        }
      }
    }

    const budgetUtilization = totalBudget > 0 ? totalSpent / totalBudget : 0

    // Generate last 6 months
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now)
      d.setMonth(d.getMonth() - (5 - i))
      return d.toLocaleString('en-US', { month: 'short' }).toUpperCase()
    })

    const cashFlow = last6Months.map((month) => {
      const data = paymentsByMonth.get(month) || { inflow: 0, outflow: 0 }
      return { month, inflow: data.inflow, outflow: data.outflow }
    })

    const recentAlerts: DashboardStats['recentAlerts'] = []

    // Pending POs alert
    let pendingCount = 0
    let totalPendingValue = 0
    for (const po of purchaseOrders) {
      if (po.status === 'pending') {
        pendingCount++
        totalPendingValue += po.amount
      }
    }
    
    if (pendingCount > 0) {
      recentAlerts.push({
        id: 'pending-pos',
        type: 'warning',
        title: `${pendingCount} POs Pending Approval`,
        message: `Total Value: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalPendingValue)}. Aging: >48hrs`,
        actionText: 'Review All',
      })
    }

    // Budget overrun alert
    if (worstOverrunProject) {
      const pct = worstOverrunProject.budget 
        ? Math.round(((worstOverrunProject.spent || 0) / worstOverrunProject.budget) * 100) 
        : 0
      recentAlerts.push({
        id: 'budget-overrun',
        type: 'danger',
        title: 'Budget Overrun Alert',
        message: `Project '${worstOverrunProject.name}' at ${pct}% spend`,
        actionText: 'Open Ledger',
      })
    }

    // Vendor risk analysis - single pass
    const vendorCounts = new Map<string, { rejected: number; pending: number }>()
    for (const po of purchaseOrders) {
      const current = vendorCounts.get(po.vendor_name) || { rejected: 0, pending: 0 }
      if (po.status === 'rejected') current.rejected += 1
      if (po.status === 'pending') current.pending += 1
      vendorCounts.set(po.vendor_name, current)
    }

    let riskyVendorCount = 0
    for (const [, counts] of vendorCounts) {
      if (counts.rejected > 0 || counts.pending > 3) {
        riskyVendorCount++
      }
    }

    if (riskyVendorCount > 0) {
      recentAlerts.push({
        id: 'high-risk-vendors',
        type: 'info',
        title: 'High Risk Vendors',
        message: `${riskyVendorCount} vendors with compliance issues`,
        actionText: 'Vendor Portal',
      })
    }

    // Profitability data - limit to 6 projects
    const profitabilityData: DashboardStats['profitabilityData'] = projects.slice(0, 6).map((p, idx) => {
      const budget = p.budget || 1
      const spent = p.spent || 0
      const estimatedMargin = Math.max(0, Math.min(100, Math.round(((budget - budget * 0.15) / budget) * 100)))
      const realizedMargin = Math.max(0, Math.min(100, Math.round(((budget - spent) / budget) * 100)))
      const colors: Array<'success' | 'primary' | 'warning' | 'danger'> = ['success', 'primary', 'warning', 'danger']
      return {
        id: p.id,
        name: p.name,
        estimatedMargin,
        realizedMargin,
        color: colors[idx % colors.length],
      }
    })

    const stats: DashboardStats = {
      totalRevenue,
      projectsCompleted,
      activePOs,
      budgetUtilization,
      budgetOverruns,
      cashFlow,
      recentAlerts,
      profitabilityData,
    }

    // Update cache
    cache.set(cacheKey, { data: stats, timestamp: Date.now() })

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
