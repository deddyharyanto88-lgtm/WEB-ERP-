"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Inspection } from "@/types";

const scoreColors = (score: number) => {
  if (score >= 80) return "text-emerald-700 bg-emerald-100";
  if (score >= 60) return "text-amber-700 bg-amber-100";
  return "text-red-700 bg-red-100";
};

const scoreBarColor = (score: number) => {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
};

const statusBadgeColors: Record<Inspection["status"], string> = {
  pass: "bg-emerald-100 text-emerald-800",
  fail: "bg-red-100 text-red-800",
  pending: "bg-amber-100 text-amber-800",
};

const statusLabel: Record<Inspection["status"], string> = {
  pass: "Pass",
  fail: "Fail",
  pending: "Pending",
};

export default function QHSSEPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("inspections").select("*");
      if (error) {
        console.error("Error fetching inspections:", error);
      } else {
        setInspections(data ?? []);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const stats = {
    total: inspections.length,
    passed: inspections.filter((i) => i.status === "pass").length,
    failed: inspections.filter((i) => i.status === "fail").length,
    pending: inspections.filter((i) => i.status === "pending").length,
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <h1 className="text-3xl font-semibold text-on-surface tracking-tight mb-8">
        QHSSE Inspection
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={stats.total} color="text-primary" bgColor="bg-primary/10" />
        <StatCard label="Passed" value={stats.passed} color="text-emerald-700" bgColor="bg-emerald-100" />
        <StatCard label="Failed" value={stats.failed} color="text-red-700" bgColor="bg-red-100" />
        <StatCard label="Pending" value={stats.pending} color="text-amber-700" bgColor="bg-amber-100" />
      </div>

      <div className="bg-surface rounded-2xl border border-border shadow-sm">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-on-surface">Inspection Records</h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-secondary">Loading inspections...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-container-lowest">
                  <th className="text-left px-5 py-3 font-semibold text-secondary text-xs uppercase tracking-wider">
                    Inspector
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-secondary text-xs uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-secondary text-xs uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-secondary text-xs uppercase tracking-wider">
                    Project
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-secondary text-xs uppercase tracking-wider">
                    Score
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-secondary text-xs uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {inspections.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-secondary">
                      No inspections found
                    </td>
                  </tr>
                ) : (
                  inspections.map((insp) => (
                    <tr key={insp.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="px-5 py-3 font-medium text-on-surface">{insp.inspector}</td>
                      <td className="px-5 py-3 text-secondary">
                        {new Date(insp.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3 text-secondary">{insp.type}</td>
                      <td className="px-5 py-3 text-secondary">{insp.project}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-2 bg-surface-container-high rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${scoreBarColor(insp.score)}`}
                              style={{ width: `${insp.score}%` }}
                            />
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${scoreColors(insp.score)}`}
                          >
                            {insp.score}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeColors[insp.status]}`}
                        >
                          {statusLabel[insp.status]}
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