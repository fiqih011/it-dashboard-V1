"use client";

export default function StatusLegend() {
  const statuses = [
    {
      label: "Not Used",
      desc: "0% utilized",
      dot: "bg-slate-400",
      bg: "bg-slate-50",
      border: "border-slate-200",
      text: "text-slate-600",
    },
    {
      label: "Under Budget",
      desc: "< 100%",
      dot: "bg-green-500",
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
    },
    {
      label: "On Budget",
      desc: "= 100%",
      dot: "bg-amber-500",
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
    },
    {
      label: "Over Budget",
      desc: "> 100%",
      dot: "bg-red-500",
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-4">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">Budget Status Indicator</p>
      <div className="flex flex-wrap gap-3">
        {statuses.map((s) => (
          <div
            key={s.label}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${s.bg} ${s.border}`}
          >
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.dot}`} />
            <span className={`text-xs font-semibold ${s.text}`}>{s.label}</span>
            <span className="text-xs text-gray-400">{s.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}