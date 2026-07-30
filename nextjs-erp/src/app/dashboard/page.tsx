'use client'

import { useState, useEffect, useMemo } from 'react'
import { DashboardStats, Alert, CashFlowMonth, ProfitabilityPoint } from '@/types'

const months: CashFlowMonth[] = [
  { month: 'JUL', inflow: 4200000, outflow: 2800000 },
  { month: 'AUG', inflow: 5800000, outflow: 3200000 },
  { month: 'SEP', inflow: 6500000, outflow: 3800000 },
  { month: 'OCT', inflow: 8200000, outflow: 4200000 },
  { month: 'NOV', inflow: 6100000, outflow: 3600000 },
  { month: 'DEC', inflow: 7500000, outflow: 4000000 },
]

const quickActions = [
  { label: 'New Project', icon: 'add_circle', color: 'primary' },
  { label: 'Create PO', icon: 'shopping_cart', color: 'secondary' },
  { label: 'Record Payment', icon: 'payments', color: 'tertiary' },
  { label: 'Run Report', icon: 'analytics', color: 'info' },
]

function formatIDR(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 animate-pulse">
      <div className="h-4 w-24 bg-surface-container rounded mb-3" />
      <div className="h-8 w-32 bg-surface-container rounded mb-2" />
      <div className="h-2 w-full bg-surface-container rounded-full" />
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [entity, setEntity] = useState('Global Consolidation')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/dashboard/stats?entity=${encodeURIComponent(entity)}`)
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [entity])

  const totalInflow = useMemo(() => stats?.cashFlow.reduce((s, m) => s + m.inflow, 0) ?? 0, [stats])
  const totalOutflow = useMemo(() => stats?.cashFlow.reduce((s, m) => s + m.outflow, 0) ?? 0, [stats])
  const netCash = useMemo(() => totalInflow - totalOutflow, [totalInflow, totalOutflow])

  return (
    <div className="p-4 sm:p-6 max-w-[1440px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">Executive Overview</h2>
          <p className="text-sm text-secondary mt-1">
            Consolidated performance metrics for Q3 — Last updated 12 mins ago
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider">Entity:</label>
            <select
              value={entity}
              onChange={(e) => setEntity(e.target.value)}
              className="bg-surface border border-border rounded-xl text-sm font-bold text-primary px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option>Global Consolidation</option>
              <option>North Region Ops</option>
              <option>South Region Ops</option>
              <option>Logistics Entity</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl text-sm font-bold text-secondary hover:bg-surface-container-low transition-all">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-container transition-all">
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 sm:gap-6">
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          {loading ? (
            <SkeletonCard />
          ) : (
            <div className="rounded-2xl border border-border bg-surface p-6 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 bg-primary/10 rounded-xl text-primary">
                    <span className="material-symbols-outlined text-[20px]">trending_up</span>
                  </span>
                  <span className="text-xs font-bold text-success flex items-center gap-1">
                    +12.5%
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  </span>
                </div>
                <h3 className="text-sm text-secondary font-medium">Total Group Revenue</h3>
                <p className="text-2xl font-bold text-on-surface mt-2">{formatIDR(stats?.totalRevenue ?? 0)}</p>
              </div>
              <div className="mt-4 h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
          )}
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          {loading ? (
            <SkeletonCard />
          ) : (
            <div className="rounded-2xl border border-danger/20 bg-danger/[0.02] p-6 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 bg-danger/10 rounded-xl text-danger">
                    <span className="material-symbols-outlined text-[20px]">warning</span>
                  </span>
                  <span className="text-xs font-bold text-danger flex items-center gap-1">
                    +4.2%
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  </span>
                </div>
                <h3 className="text-sm text-secondary font-medium">Budget Overruns</h3>
                <p className="text-2xl font-bold text-on-surface mt-2">{formatIDR(stats?.budgetOverruns ?? 0)}</p>
              </div>
              <p className="text-[11px] text-danger font-medium mt-2">
                Critical: 4 major projects exceeding 15%
              </p>
            </div>
          )}
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          {loading ? (
            <SkeletonCard />
          ) : (
            <div className="rounded-2xl border border-border bg-surface p-6 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 bg-success/10 rounded-xl text-success">
                    <span className="material-symbols-outlined text-[20px]">account_balance</span>
                  </span>
                  <span className="text-xs font-bold text-success">Healthy</span>
                </div>
                <h3 className="text-sm text-secondary font-medium">Projects Completed</h3>
                <p className="text-2xl font-bold text-on-surface mt-2">{stats?.projectsCompleted ?? 0}</p>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success" />
                <span className="text-[11px] text-secondary">On track for Q3</span>
              </div>
            </div>
          )}
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          {loading ? (
            <SkeletonCard />
          ) : (
            <div className="rounded-2xl border border-border bg-surface p-6 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="p-2 bg-info/10 rounded-xl text-info">
                    <span className="material-symbols-outlined text-[20px]">engineering</span>
                  </span>
                  <span className="text-xs font-bold text-info">
                    {Math.round((stats?.budgetUtilization ?? 0) * 100)}% Utilized
                  </span>
                </div>
                <h3 className="text-sm text-secondary font-medium">Active POs</h3>
                <p className="text-2xl font-bold text-on-surface mt-2">{stats?.activePOs ?? 0}</p>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-1">
                <div className="h-1 bg-info rounded-full" />
                <div className="h-1 bg-info rounded-full" />
                <div className="h-1 bg-info rounded-full" />
                <div className="h-1 bg-surface-container rounded-full" />
              </div>
            </div>
          )}
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-on-surface">6-Month Cashflow Forecast</h3>
                <p className="text-sm text-secondary">Inflow vs Outflow Projection</p>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-tighter text-secondary">
                  <span className="w-2 h-2 bg-primary rounded-full" /> Inflow
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-tighter text-secondary">
                  <span className="w-2 h-2 bg-outline rounded-full" /> Outflow
                </span>
              </div>
            </div>
            {loading ? (
              <div className="h-[300px] bg-surface-container-lowest/50 rounded-xl animate-pulse" />
            ) : (
              <div className="flex items-end gap-4 px-2">
                {months.map((m) => {
                  const maxVal = Math.max(...months.map((x) => Math.max(x.inflow, x.outflow)))
                  const inflowH = (m.inflow / maxVal) * 100
                  const outflowH = (m.outflow / maxVal) * 100
                  return (
                    <div key={m.month} className="flex-1 flex flex-col gap-1 items-center">
                      <div className="w-full flex gap-1 items-end justify-center h-48">
                        <div
                          className="w-4 bg-primary/20 hover:bg-primary transition-all rounded-t-sm"
                          style={{ height: `${inflowH}%` }}
                        />
                        <div
                          className="w-4 bg-outline/20 hover:bg-outline transition-all rounded-t-sm"
                          style={{ height: `${outflowH}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-secondary">{m.month}</span>
                    </div>
                  )
                })}
              </div>
            )}
            {!loading && (
              <div className="mt-4 flex gap-6 text-sm">
                <div>
                  <span className="text-secondary">Total Inflow: </span>
                  <span className="font-bold text-on-surface">{formatIDR(totalInflow)}</span>
                </div>
                <div>
                  <span className="text-secondary">Total Outflow: </span>
                  <span className="font-bold text-on-surface">{formatIDR(totalOutflow)}</span>
                </div>
                <div>
                  <span className="text-secondary">Net: </span>
                  <span className={`font-bold ${netCash >= 0 ? 'text-success' : 'text-danger'}`}>
                    {formatIDR(netCash)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <div className="rounded-2xl border border-border bg-surface p-6 h-full">
            <h3 className="text-lg font-bold text-on-surface mb-4">Attention Required</h3>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-surface-container rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {(stats?.recentAlerts ?? []).map((alert: Alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-4 p-4 bg-surface-container-lowest border border-border rounded-2xl hover:shadow-md transition-all cursor-pointer"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                        alert.type === 'danger'
                          ? 'bg-danger/10 text-danger'
                          : alert.type === 'warning'
                          ? 'bg-warning/10 text-warning'
                          : 'bg-info/10 text-info'
                      }`}
                    >
                      <span className="material-symbols-outlined">
                        {alert.type === 'danger' ? 'dangerous' : alert.type === 'warning' ? 'pending_actions' : 'verified_user'}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">{alert.title}</h4>
                      <p className="text-xs text-secondary mt-0.5">{alert.message}</p>
                      {alert.actionText && (
                        <button className="mt-2 text-xs font-bold text-primary hover:underline">
                          {alert.actionText}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-on-surface">Profitability Matrix</h3>
              <span className="text-[10px] font-bold bg-surface-container px-2 py-1 rounded-lg text-secondary uppercase">
                Estimated vs Realized
              </span>
            </div>
            {loading ? (
              <div className="h-[300px] bg-surface-container-lowest/50 rounded-xl animate-pulse" />
            ) : (
              <div className="relative h-[300px] bg-surface-container-lowest/50 rounded-xl border border-dashed border-border p-4">
                <div className="absolute left-4 top-4 text-[10px] font-bold text-outline uppercase -rotate-90 origin-left">
                  Realization (%)
                </div>
                <div className="absolute bottom-4 right-4 text-[10px] font-bold text-outline uppercase">
                  Estimated Margin (%)
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-px bg-border" />
                  <div className="h-full w-px bg-border absolute" />
                </div>
                {(stats?.profitabilityData ?? []).map((point: ProfitabilityPoint) => {
                  const colorMap = {
                    success: 'bg-success',
                    primary: 'bg-primary',
                    warning: 'bg-warning',
                    danger: 'bg-danger',
                  }
                  return (
                    <div
                      key={point.id}
                      title={`${point.name}: Est. ${point.estimatedMargin}%, Real. ${point.realizedMargin}%`}
                      className={`absolute w-4 h-4 rounded-full ${colorMap[point.color]} shadow-lg border-2 border-white hover:scale-150 transition-transform cursor-pointer`}
                      style={{
                        left: `${point.estimatedMargin}%`,
                        bottom: `${point.realizedMargin}%`,
                      }}
                    />
                  )
                })}
              </div>
            )}
            {!loading && (
              <div className="mt-4 flex justify-between">
                <p className="text-[11px] text-secondary">
                  N={(stats?.profitabilityData?.length ?? 0)} Active Projects
                </p>
                <a href="#" className="text-[11px] font-bold text-primary hover:underline">
                  View Detailed Matrix
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="text-lg font-bold text-on-surface mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-border hover:shadow-md transition-all ${
                    action.color === 'primary'
                      ? 'bg-primary/5 hover:bg-primary/10'
                      : action.color === 'secondary'
                      ? 'bg-secondary/5 hover:bg-secondary/10'
                      : action.color === 'tertiary'
                      ? 'bg-tertiary/5 hover:bg-tertiary/10'
                      : 'bg-info/5 hover:bg-info/10'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[28px] ${
                    action.color === 'primary'
                      ? 'text-primary'
                      : action.color === 'secondary'
                      ? 'text-secondary'
                      : action.color === 'tertiary'
                      ? 'text-tertiary'
                      : 'text-info'
                  }`}>
                    {action.icon}
                  </span>
                  <span className="text-xs font-bold text-on-surface">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
