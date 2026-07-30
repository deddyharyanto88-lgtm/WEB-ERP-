'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Project, Payment } from '@/types';

function formatIDR(value: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
}

export default function FinancePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [activeTab, setActiveTab] = useState<'payments' | 'reports'>('payments');

  useEffect(() => {
    async function fetchData() {
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) console.error('Projects error:', projectsError);
      else if (projectsData) setProjects(projectsData as Project[]);

      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (paymentsError) console.error('Payments error:', paymentsError);
      else if (paymentsData) setPayments(paymentsData as Payment[]);

      setLoading(false);
    }
    fetchData();
  }, []);

  const totalInflow = payments
    .filter((p) => p.type === 'inflow')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalOutflow = payments
    .filter((p) => p.type === 'outflow')
    .reduce((sum, p) => sum + p.amount, 0);
  const netBalance = totalInflow - totalOutflow;
  const pendingCount = payments.filter((p) => p.status === 'pending').length;

  const filteredProjects = projects.filter((p) => {
    if (dateRange.start && p.created_at < dateRange.start) return false;
    if (dateRange.end && p.created_at > dateRange.end) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-secondary font-body-md">Loading financial data...</p>
      </div>
    );
  }

  return (
    <div className="p-container-margin max-w-[1440px] mx-auto space-y-section-gap">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Financial Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface rounded-xl p-6 border border-border shadow-sm">
          <p className="text-secondary font-label-md mb-1">Total Inflow</p>
          <p className="font-display text-display text-primary tracking-tighter">{formatIDR(totalInflow)}</p>
        </div>
        <div className="bg-surface rounded-xl p-6 border border-border shadow-sm">
          <p className="text-secondary font-label-md mb-1">Total Outflow</p>
          <p className="font-display text-display text-danger tracking-tighter">{formatIDR(totalOutflow)}</p>
        </div>
        <div className="bg-surface rounded-xl p-6 border border-border shadow-sm">
          <p className="text-secondary font-label-md mb-1">Net Balance</p>
          <p className={`font-display text-display tracking-tighter ${netBalance >= 0 ? 'text-success' : 'text-danger'}`}>
            {formatIDR(netBalance)}
          </p>
        </div>
        <div className="bg-surface rounded-xl p-6 border border-border shadow-sm">
          <p className="text-secondary font-label-md mb-1">Pending</p>
          <p className="font-display text-display text-warning tracking-tighter">{pendingCount}</p>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="font-headline-md text-headline-md">Project Profitability</h2>
          <div className="flex gap-3 items-center">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
              className="px-3 py-1.5 bg-surface-container-low border border-border rounded-lg text-sm font-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
              className="px-3 py-1.5 bg-surface-container-low border border-border rounded-lg text-sm font-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-secondary font-label-sm border-b border-border">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Project Name</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Budget</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Spent</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-5 font-table-data text-table-data font-semibold text-on-surface">
                    {project.name}
                  </td>
                  <td className="px-6 py-5 font-table-data text-table-data">{formatIDR(project.budget)}</td>
                  <td className="px-6 py-5 font-table-data text-table-data">{formatIDR(project.spent)}</td>
                  <td className="px-6 py-5 font-table-data text-table-data">
                    <span className={project.margin >= 0 ? 'text-success' : 'text-danger'}>
                      {project.margin}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="font-headline-md text-headline-md">Payments Management</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-all ${
                activeTab === 'payments'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-secondary hover:bg-surface-container-high'
              }`}
            >
              Payments
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-all ${
                activeTab === 'reports'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-secondary hover:bg-surface-container-high'
              }`}
            >
              Reports
            </button>
          </div>
        </div>

        {activeTab === 'payments' ? (
          <div className="divide-y divide-border">
            {payments.map((payment) => (
              <div key={payment.id} className="p-6 flex justify-between items-center hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary">
                    {payment.vendor.charAt(0)}
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">{payment.vendor}</p>
                    <p className="text-[11px] text-secondary">{payment.invoice_number}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-headline-md text-headline-md text-on-surface">{formatIDR(payment.amount)}</p>
                  <p className="text-[11px] text-secondary uppercase tracking-wider font-bold">{payment.type}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    payment.status === 'pending'
                      ? 'bg-warning/10 text-warning'
                      : payment.status === 'completed'
                        ? 'bg-success/10 text-success'
                        : 'bg-surface-container-high text-secondary'
                  }`}
                >
                  {payment.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <a
              href="#"
              className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-all border border-border"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">account_balance</span>
                <span className="font-label-md text-label-md">General Ledger</span>
              </div>
              <span className="material-symbols-outlined text-sm text-secondary">arrow_forward_ios</span>
            </a>
            <a
              href="#"
              className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-all border border-border"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">analytics</span>
                <span className="font-label-md text-label-md">Balance Sheet</span>
              </div>
              <span className="material-symbols-outlined text-sm text-secondary">arrow_forward_ios</span>
            </a>
            <a
              href="#"
              className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl hover:bg-surface-container-high transition-all border border-border"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">receipt_long</span>
                <span className="font-label-md text-label-md">Profit &amp; Loss (P&amp;L)</span>
              </div>
              <span className="material-symbols-outlined text-sm text-secondary">arrow_forward_ios</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}