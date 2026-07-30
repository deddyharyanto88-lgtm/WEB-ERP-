'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Risk {
  id: string;
  project_id: string;
  project_name?: string;
  description: string;
  level: 'high' | 'medium' | 'low';
  probability: number;
  impact: number;
  mitigation: string;
  status: 'open' | 'mitigating' | 'monitored' | 'resolved';
  created_at: string;
  updated_at: string;
}

export default function RiskPage() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    project_id: '',
    description: '',
    level: 'medium' as 'high' | 'medium' | 'low',
    probability: 50,
    impact: 50,
    mitigation: '',
    status: 'open' as 'open' | 'mitigating' | 'monitored' | 'resolved',
  });

  const fetchRisks = async () => {
    try {
      const res = await fetch('/api/risks');
      const data = await res.json();
      setRisks(data);
    } catch (error) {
      console.error('Failed to fetch risks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRisks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/risks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({
          project_id: '',
          description: '',
          level: 'medium',
          probability: 50,
          impact: 50,
          mitigation: '',
          status: 'open',
        });
        fetchRisks();
      }
    } catch (error) {
      console.error('Failed to create risk:', error);
    }
  };

  const filteredRisks = levelFilter === 'all'
    ? risks
    : risks.filter((r) => r.level === levelFilter);

  const summary = {
    total: risks.length,
    high: risks.filter((r) => r.level === 'high').length,
    medium: risks.filter((r) => r.level === 'medium').length,
    low: risks.filter((r) => r.level === 'low').length,
    mitigated: risks.filter((r) => r.status === 'mitigating' || r.status === 'monitored').length,
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-amber-100 text-amber-700';
      case 'low':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-red-600';
      case 'mitigating':
        return 'text-amber-600';
      case 'monitored':
        return 'text-blue-600';
      case 'resolved':
        return 'text-emerald-600';
      default:
        return 'text-gray-600';
    }
  };

  const getMatrixColor = (prob: number, impact: number) => {
    const avg = (prob + impact) / 2;
    if (avg >= 70) return 'bg-red-500';
    if (avg >= 40) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <header className="bg-white border-b border-[#e2e8f0] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0058be]">Risk Management</h1>
            <p className="text-sm text-gray-500 mt-1">Early Warning Dashboard</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-[#0058be] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Register Risk
            </button>
            <Link
              href="/dashboard"
              className="px-4 py-2 border border-[#e2e8f0] rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-[24px] border border-[#e2e8f0] p-6">
            <p className="text-sm text-gray-500 mb-1">Total Risks</p>
            <p className="text-3xl font-bold text-gray-900">{summary.total}</p>
          </div>
          <div className="bg-white rounded-[24px] border border-[#e2e8f0] p-6">
            <p className="text-sm text-gray-500 mb-1">High</p>
            <p className="text-3xl font-bold text-red-600">{summary.high}</p>
          </div>
          <div className="bg-white rounded-[24px] border border-[#e2e8f0] p-6">
            <p className="text-sm text-gray-500 mb-1">Medium</p>
            <p className="text-3xl font-bold text-amber-600">{summary.medium}</p>
          </div>
          <div className="bg-white rounded-[24px] border border-[#e2e8f0] p-6">
            <p className="text-sm text-gray-500 mb-1">Low</p>
            <p className="text-3xl font-bold text-emerald-600">{summary.low}</p>
          </div>
          <div className="bg-white rounded-[24px] border border-[#e2e8f0] p-6">
            <p className="text-sm text-gray-500 mb-1">Mitigated</p>
            <p className="text-3xl font-bold text-blue-600">{summary.mitigated}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-[24px] border border-[#e2e8f0] p-6">
            <h3 className="text-lg font-semibold mb-4">Risk Matrix</h3>
            <div className="grid grid-cols-10 gap-1 aspect-square max-h-96">
              {[...Array(10)].map((_, row) =>
                [...Array(10)].map((_, col) => {
                  const count = risks.filter(
                    (r) =>
                      r.probability >= col * 10 &&
                      r.probability < (col + 1) * 10 &&
                      r.impact >= row * 10 &&
                      r.impact < (row + 1) * 10
                  ).length;
                  return (
                    <div
                      key={`${row}-${col}`}
                      className={`rounded-sm flex items-center justify-center text-xs font-medium ${
                        count > 0 ? getMatrixColor(col * 10, row * 10) : 'bg-gray-100'
                      } ${count > 0 ? 'text-white' : 'text-gray-400'}`}
                    >
                      {count}
                    </div>
                  );
                })
              )}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Low Probability</span>
              <span>High Probability</span>
            </div>
            <div className="flex justify-center mt-2 text-xs text-gray-500">
              <span>Low Impact</span>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-[#e2e8f0] p-6">
            <h3 className="text-lg font-semibold mb-4">Early Warning Indicators</h3>
            <div className="space-y-4">
              {(summary.high > 0 || summary.medium > 0) && (
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-600 text-xl">&#9888;</span>
                  </div>
                  <div>
                    <p className="font-medium text-red-900">Critical Attention Required</p>
                    <p className="text-sm text-red-700">
                      {summary.high} high risk{summary.high !== 1 && 's'} require immediate action
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-amber-600 text-xl">&#9888;</span>
                </div>
                <div>
                  <p className="font-medium text-amber-900">Watch List</p>
                  <p className="text-sm text-amber-700">
                    {summary.medium} medium risk{summary.medium !== 1 && 's'} under observation
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-emerald-600 text-xl">&#10003;</span>
                </div>
                <div>
                  <p className="font-medium text-emerald-900">Mitigation Progress</p>
                  <p className="text-sm text-emerald-700">
                    {summary.mitigated} risk{summary.mitigated !== 1 && 's'} in mitigation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] border border-[#e2e8f0] overflow-hidden">
          <div className="p-6 border-b border-[#e2e8f0] flex items-center justify-between">
            <h3 className="text-lg font-semibold">Active Risk Register</h3>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-4 py-2 border border-[#e2e8f0] rounded-xl text-sm bg-white"
            >
              <option value="all">All Levels</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-500">Project</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Description</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Level</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Probability</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Impact</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Mitigation</th>
                  <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Loading risks...
                    </td>
                  </tr>
                ) : filteredRisks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No risks found
                    </td>
                  </tr>
                ) : (
                  filteredRisks.map((risk) => (
                    <tr key={risk.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {risk.project_name || risk.project_id}
                      </td>
                      <td className="px-6 py-4 text-gray-700 max-w-xs truncate">
                        {risk.description}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(
                            risk.level
                          )}`}
                        >
                          {risk.level.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#0058be] rounded-full"
                              style={{ width: `${risk.probability}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{risk.probability}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#0058be] rounded-full"
                              style={{ width: `${risk.impact}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{risk.impact}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                        {risk.mitigation}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              risk.status === 'open'
                                ? 'bg-red-500'
                                : risk.status === 'mitigating'
                                ? 'bg-amber-500'
                                : risk.status === 'monitored'
                                ? 'bg-blue-500'
                                : 'bg-emerald-500'
                            }`}
                          />
                          <span className={`capitalize ${getStatusColor(risk.status)}`}>
                            {risk.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[24px] p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Register New Risk</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project ID
                </label>
                <input
                  type="text"
                  required
                  value={formData.project_id}
                  onChange={(e) =>
                    setFormData({ ...formData, project_id: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#e2e8f0] rounded-xl text-sm"
                  placeholder="PROJ-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#e2e8f0] rounded-xl text-sm"
                  placeholder="Describe the risk..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        level: e.target.value as 'high' | 'medium' | 'low',
                      })
                    }
                    className="w-full px-4 py-2 border border-[#e2e8f0] rounded-xl text-sm"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as Risk['status'],
                      })
                    }
                    className="w-full px-4 py-2 border border-[#e2e8f0] rounded-xl text-sm"
                  >
                    <option value="open">Open</option>
                    <option value="mitigating">Mitigating</option>
                    <option value="monitored">Monitored</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Probability (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={(e) =>
                      setFormData({ ...formData, probability: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-[#e2e8f0] rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impact (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.impact}
                    onChange={(e) =>
                      setFormData({ ...formData, impact: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-[#e2e8f0] rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mitigation Plan
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.mitigation}
                  onChange={(e) =>
                    setFormData({ ...formData, mitigation: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#e2e8f0] rounded-xl text-sm"
                  placeholder="How will this risk be mitigated?"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#0058be] text-white rounded-xl text-sm font-medium hover:opacity-90"
                >
                  Save Risk
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-[#e2e8f0] rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
