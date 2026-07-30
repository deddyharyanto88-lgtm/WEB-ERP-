import { NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase'
import { DashboardStats } from '@/types'

export async function GET(request: Request) {
  try {
    const supabase = createServerComponentClient()
    const url = new URL(request.url)
    const entity = url.searchParams.get('entity') || undefined

    let projectsQuery = supabase.from('projects').select('*')
    let posQuery = supabase.from('purchase_orders').select('*')
    let paymentsQuery = supabase.from('payments').select('*')

    if (entity) {
      projectsQuery = projectsQuery.eq('entity_id', entity)
    }

    const [projectsRes, posRes, paymentsRes] = await Promise.all([
      projectsQuery,
      posQuery,
      paymentsQuery,
    ])

    const projects = projectsRes.data ?? []
    const purchaseOrders = posRes.data ?? []
    const payments = paymentsRes.data ?? []

    const totalRevenue = payments
      .filter((p) => p.type === 'inflow')
      .reduce((sum, p) => sum + p.amount, 0)

    const projectsCompleted = projects.filter((p) => p.status === 'completed').length

    const activePOs = purchaseOrders.filter((po) => po.status === 'pending').length

    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0)
    const totalSpent = projects.reduce((sum, p) => sum + (p.spent || 0), 0)
    const budgetUtilization = totalBudget > 0 ? totalSpent / totalBudget : 0

    const budgetOverruns = projects
      .filter((p) => (p.spent || 0) > (p.budget || 0))
      .reduce((sum, p) => sum + ((p.spent || 0) - (p.budget || 0)), 0)

    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date()
      d.setMonth(d.getMonth() - (5 - i))
      return d.toLocaleString('en-US', { month: 'short' }).toUpperCase()
    })

    const cashFlow = last6Months.map((month) => {
      const monthInflow = payments
        .filter((p) => {
          const d = new Date(p.date)
          return p.type === 'inflow' && d.toLocaleString('en-US', { month: 'short' }).toUpperCase() === month
        })
        .reduce((sum, p) => sum + p.amount, 0)

      const monthOutflow = payments
        .filter((p) => {
          const d = new Date(p.date)
          return p.type === 'outflow' && d.toLocaleString('en-US', { month: 'short' }).toUpperCase() === month
        })
        .reduce((sum, p) => sum + p.amount, 0)

      return { month, inflow: monthInflow, outflow: monthOutflow }
    })

    const recentAlerts: DashboardStats['recentAlerts'] = []

    const pendingPOs = purchaseOrders.filter((po) => po.status === 'pending')
    if (pendingPOs.length > 0) {
      const totalPendingValue = pendingPOs.reduce((sum, po) => sum + po.amount, 0)
      recentAlerts.push({
        id: 'pending-pos',
        type: 'warning',
        title: `${pendingPOs.length} POs Pending Approval`,
        message: `Total Value: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalPendingValue)}. Aging: >48hrs`,
        actionText: 'Review All',
      })
    }

    const overruns = projects.filter((p) => (p.spent || 0) > (p.budget || 0))
    if (overruns.length > 0) {
      const worst = overruns.reduce((max, p) => ((p.spent || 0) / (p.budget || 1)) > ((max.spent || 0) / (max.budget || 1)) ? p : max, overruns[0])
      const pct = worst.budget ? Math.round(((worst.spent || 0) / worst.budget) * 100) : 0
      recentAlerts.push({
        id: 'budget-overrun',
        type: 'danger',
        title: 'Budget Overrun Alert',
        message: `Project '${worst.name}' at ${pct}% spend`,
        actionText: 'Open Ledger',
      })
    }

    const vendorCounts = new Map<string, { rejected: number; pending: number }>()
    purchaseOrders.forEach((po) => {
      const current = vendorCounts.get(po.vendor_name) || { rejected: 0, pending: 0 }
      if (po.status === 'rejected') current.rejected += 1
      if (po.status === 'pending') current.pending += 1
      vendorCounts.set(po.vendor_name, current)
    })

    const riskyVendors = Array.from(vendorCounts.entries())
      .filter(([, counts]) => counts.rejected > 0 || counts.pending > 3)
      .map(([name]) => name)

    if (riskyVendors.length > 0) {
      recentAlerts.push({
        id: 'high-risk-vendors',
        type: 'info',
        title: 'High Risk Vendors',
        message: `${riskyVendors.length} vendors with compliance issues`,
        actionText: 'Vendor Portal',
      })
    }

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

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
