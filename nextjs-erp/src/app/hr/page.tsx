"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Employee } from "@/types";

const statusBadgeColors: Record<Employee["status"], string> = {
  active: "bg-emerald-100 text-emerald-800",
  on_leave: "bg-amber-100 text-amber-800",
  inactive: "bg-slate-100 text-slate-800",
  new_hire: "bg-blue-100 text-blue-800",
};

const statusLabel: Record<Employee["status"], string> = {
  active: "Active",
  on_leave: "On Leave",
  inactive: "Inactive",
  new_hire: "New Hire",
};

const departmentOptions = ["All", "Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "IT"];

export default function HRPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [deptFilter, setDeptFilter] = useState("All");

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("employees").select("*");
      if (error) {
        console.error("Error fetching employees:", error);
      } else {
        setEmployees(data ?? []);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const filtered =
    deptFilter === "All" ? employees : employees.filter((e) => e.department === deptFilter);

  const stats = {
    total: employees.length,
    active: employees.filter((e) => e.status === "active").length,
    onLeave: employees.filter((e) => e.status === "on_leave").length,
    newHires: employees.filter((e) => e.status === "new_hire").length,
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <h1 className="text-3xl font-semibold text-on-surface tracking-tight mb-8">HR Management</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Employees" value={stats.total} color="text-primary" bgColor="bg-primary/10" />
        <StatCard label="Active" value={stats.active} color="text-emerald-700" bgColor="bg-emerald-100" />
        <StatCard label="On Leave" value={stats.onLeave} color="text-amber-700" bgColor="bg-amber-100" />
        <StatCard label="New Hires" value={stats.newHires} color="text-blue-700" bgColor="bg-blue-100" />
      </div>

      <div className="bg-surface rounded-2xl border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-border gap-4">
          <h2 className="text-lg font-semibold text-on-surface">Employee Directory</h2>
          <div className="flex items-center gap-3">
            <label htmlFor="dept-filter" className="text-sm font-medium text-secondary">
              Department:
            </label>
            <select
              id="dept-filter"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-surface-container-low border border-border rounded-lg px-3 py-1.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {departmentOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-secondary">Loading employees...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-container-lowest">
                  <th className="text-left px-5 py-3 font-semibold text-secondary text-xs uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-secondary text-xs uppercase tracking-wider">
                    Department
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-secondary text-xs uppercase tracking-wider">
                    Position
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-secondary text-xs uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-secondary text-xs uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-secondary">
                      No employees found
                    </td>
                  </tr>
                ) : (
                  filtered.map((emp) => (
                    <tr key={emp.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-5 py-3 font-medium text-on-surface">{emp.name}</td>
                      <td className="px-5 py-3 text-secondary">{emp.department}</td>
                      <td className="px-5 py-3 text-secondary">{emp.position}</td>
                      <td className="px-5 py-3 text-secondary">{formatDate(emp.join_date)}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeColors[emp.status]}`}
                        >
                          {statusLabel[emp.status]}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  bgColor,
}: {
  label: string;
  value: number;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm">
      <p className="text-sm font-medium text-secondary mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <div className={`mt-2 w-8 h-1 rounded-full ${bgColor}`} />
    </div>
  );
}