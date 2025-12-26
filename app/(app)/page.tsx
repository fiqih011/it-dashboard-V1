// app/(app)/page.tsx
"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import Button from "@/components/ui/Button";

type Summary = {
  plan: string;
  used: string;
  remaining: string;
};

type DashboardData = {
  opex: Summary;
  capex: Summary;
  total: Summary;
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();
        setData(json);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="p-6 text-sm text-gray-600">Loading...</div>;
  }

  if (!data) {
    return (
      <div className="p-6 text-sm text-red-600">
        Gagal memuat data dashboard.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Total Budget" value={data.total.plan} />
        <StatCard title="Total Terpakai" value={data.total.used} />
        <StatCard title="Total Sisa" value={data.total.remaining} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StatCard title="OPEX - Budget" value={data.opex.plan} />
        <StatCard title="OPEX - Terpakai" value={data.opex.used} />
        <StatCard title="CAPEX - Budget" value={data.capex.plan} />
        <StatCard title="CAPEX - Terpakai" value={data.capex.used} />
      </div>
    </div>
  );
}
