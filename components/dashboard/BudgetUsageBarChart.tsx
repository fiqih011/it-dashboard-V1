"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type Item = {
  name: string;
  percentage: number;
};

type Props = {
  items: Item[];
};

function getColor(pct: number) {
  if (pct > 100) return "#dc2626"; // red-600
  if (pct === 100) return "#f59e0b"; // amber-500
  return "#10b981"; // emerald-500
}

export default function BudgetUsageBarChart({ items }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="mb-3">
        <h3 className="font-semibold text-gray-800">
          Usage per componen
        </h3>
        <p className="text-xs text-gray-500">
          Persentase pemakaian budget OPEX
        </p>
      </div>

      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={items}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 40, bottom: 10 }}
          >
            <XAxis type="number" domain={[0, 120]} hide />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(v: number) => [`${v.toFixed(1)}%`, "Usage"]}
            />
            <Bar dataKey="percentage" radius={[4, 4, 4, 4]}>
              {items.map((it, idx) => (
                <Cell key={idx} fill={getColor(it.percentage)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <i className="w-2 h-2 rounded-full bg-emerald-500" /> Under
        </span>
        <span className="flex items-center gap-1">
          <i className="w-2 h-2 rounded-full bg-amber-500" /> On
        </span>
        <span className="flex items-center gap-1">
          <i className="w-2 h-2 rounded-full bg-red-600" /> Over
        </span>
      </div>
    </div>
  );
}
