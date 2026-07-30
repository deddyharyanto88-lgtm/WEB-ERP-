'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PurchaseOrder } from '@/types';

function formatIDR(value: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
}

const statusConfig = {
  draft: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' },
  pending: { bg: 'bg-warning/10', text: 'text-warning', label: 'Pending' },
  approved: { bg: 'bg-info/10', text: 'text-info', label: 'Approved' },
  completed: { bg: 'bg-success/10', text: 'text-success', label: 'Completed' },
};

export default function ProcurementPage() {
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error('Purchase orders error:', error);
      else if (data) setPos(data as PurchaseOrder[]);

      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredPos = statusFilter === 'all' ? pos : pos.filter((po) => po.status === statusFilter);

  const totalPOs = pos.length;
  const pendingApproval = pos.filter((p) => p.status === 'pending').length;
  const inProgress = pos.filter((p) => p.status === 'approved').length;
  const completed = pos.filter((p) => p.status === 'completed').length;

  const vendorStats = pos.reduce<Record<string, { count: number; total: number }>>((acc, po) => {
    if (!acc[po.vendor]) acc[po.vendor] = { count: 0, total: 0 };
    acc[po.vendor].count += 1;
    acc[po.vendor].total += po.amount;
    return acc;
  }, {});

  const sortedVendors = Object.entries(vendorStats)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-secondary font-body-md">Loading procurement data...</p>
      </div>
    );
  }

  return (
    <div className="p-container-margin max-w-[1440px] mx-auto space-y-section-gap">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Procurement / PO Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface rounded-xl p-6 border border-border shadow-sm">
          <p className="text-secondary font-label-md mb-1">Total POs</p>
          <p className="font-display text-display text-primary tracking-tighter">{totalPOs}</p>
        </div>
        <div className="bg-surface rounded-xl p-6 border border-border shadow-sm">
          <p className="text-secondary font-label-md mb-1">Pending Approval</p>
          <p className="font-display text-display text-warning tracking-tighter">{pendingApproval}</p>
        </div>
        <div className="bg-surface rounded-xl p-6 border border-border shadow-sm">
          <p className="text-secondary font-label-md mb-1">In Progress</p>
          <p className="font-display text-display text-info tracking-tighter">{inProgress}</p>
        </div>
        <div className="bg-surface rounded-xl p-6 border border-border shadow-sm">
          <p className="text-secondary font-label-md mb-1">Completed</p>
          <p className="font-display text-display text-success tracking-tighter">{completed}</p>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="font-headline-md text-headline-md">Purchase Orders</h2>
          <div className="flex gap-2">
            {['all', 'draft', 'pending', 'approved', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all ${
                  statusFilter === status
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-low text-secondary hover:bg-surface-container-high'
                }`}
              >
                {status === 'all' ? 'All' : statusConfig[status as keyof typeof statusConfig]?.label ?? status}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-secondary font-label-sm border-b border-border">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">PO Number</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPos.map((po) => {
                const config = statusConfig[po.status];
                return (
                  <tr key={po.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-5 font-table-data text-table-data font-semibold text-on-surface">
                      {po.po_number}
                    </td>
                    <td className="px-6 py-5 font-table-data text-table-data">{po.vendor}</td>
                    <td className="px-6 py-5 font-table-data text-table-data">{formatIDR(po.amount)}</td>
                    <td className="px-6 py-5 font-table-data text-table-data">{po.date}</td>
                    <td className="px-6 py-5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${config.bg} ${config.text}`}>
                        {config.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="font-headline-md text-headline-md">Vendor Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-secondary font-label-sm border-b border-border">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">PO Count</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedVendors.map(([vendor, stats]) => (
                <tr key={vendor} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-5 font-table-data text-table-data font-semibold text-on-surface">
                    {vendor}
                  </td>
                  <td className="px-6 py-5 font-table-data text-table-data">{stats.count}</td>
                  <td className="px-6 py-5 font-table-data text-table-data">{formatIDR(stats.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}