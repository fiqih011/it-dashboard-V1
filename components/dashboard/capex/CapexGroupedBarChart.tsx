"use client";

import React, { useMemo, useState, useCallback } from "react";

// ── Types ──────────────────────────────────────────────
export type CapexGroupedBarItem = {
  code: string;        // budgetId e.g. "CA-250001"
  name: string;        // itemDescription
  totalBudget: number;
  used: number;
};

type Props = {
  data: CapexGroupedBarItem[] | null;
  loading?: boolean;
  error?: string | null;
};

type Status = "NOT_USED" | "UNDER" | "ON" | "OVER";

type ProcessedItem = CapexGroupedBarItem & {
  remaining: number;
  pct: number;
  status: Status;
};

type TooltipState = {
  visible: boolean;
  item: ProcessedItem | null;
  x: number;
  y: number;
};

// ── Constants ──────────────────────────────────────────
const BAR_H     = 300;
const BAR_W     = 36;
const TT_W      = 276;
const TT_H      = 360;

const CHIP: Record<Status, string> = {
  NOT_USED: "— Not yet utilized",
  UNDER:    "✓ Under Budget",
  ON:       "● On Budget (100%)",
  OVER:     "⚠ Over Budget",
};

const ICON: Record<Status, string> = {
  NOT_USED: "—",
  UNDER:    "✓",
  ON:       "●",
  OVER:     "⚠",
};

const Y_LABELS = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];

// ── Helpers ────────────────────────────────────────────
function getStatus(pct: number): Status {
  if (pct === 0)   return "NOT_USED";
  if (pct < 100)   return "UNDER";
  if (pct === 100) return "ON";
  return "OVER";
}

function fmt(n: number): string {
  if (!n || n === 0) return "0";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)         return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

function fmtFull(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

// ── Loading / Error / Empty ────────────────────────────
function LoadingState() {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 flex items-center justify-center" style={{ minHeight: 420 }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-400 font-medium">Loading chart data...</span>
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 flex items-center justify-center" style={{ minHeight: 420 }}>
      <div className="text-center">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-red-500 font-semibold">{error}</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 flex items-center justify-center" style={{ minHeight: 420 }}>
      <p className="text-sm text-gray-400">No component data available.</p>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────
export default function CapexGroupedBarChart({ data, loading = false, error = null }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, item: null, x: 0, y: 0 });

  // ── Process data ──
  const items = useMemo<ProcessedItem[]>(() => {
    if (!data?.length) return [];
    return data
      .map((d) => {
        const pct    = d.totalBudget > 0 ? Math.round((d.used / d.totalBudget) * 1000) / 10 : 0;
        const status = getStatus(pct);
        return { ...d, remaining: Math.max(d.totalBudget - d.used, 0), pct, status };
      })
      .sort((a, b) => b.pct - a.pct);
  }, [data]);

  // ── Totals ──
  const totals = useMemo(() => {
    if (!items.length) return null;
    const budget = items.reduce((s, i) => s + i.totalBudget, 0);
    const used   = items.reduce((s, i) => s + i.used, 0);
    const pct    = budget > 0 ? Math.round((used / budget) * 1000) / 10 : 0;
    return { budget, used, pct };
  }, [items]);

  // ── Tooltip handlers ──
  const showTooltip = useCallback((e: React.MouseEvent, item: ProcessedItem) => {
    setTooltip({ visible: true, item, x: e.clientX, y: e.clientY });
  }, []);

  const moveTooltip = useCallback((e: React.MouseEvent) => {
    setTooltip((p) => ({ ...p, x: e.clientX, y: e.clientY }));
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltip((p) => ({ ...p, visible: false }));
  }, []);

  // ── Early returns ──
  if (loading) return <LoadingState />;
  if (error)   return <ErrorState error={error} />;
  if (!items.length) return <EmptyState />;

  // Tooltip position
  const ttLeft = typeof window !== "undefined" && tooltip.x + 16 + TT_W > window.innerWidth - 8
    ? tooltip.x - TT_W - 16
    : tooltip.x + 16;
  const ttTop = typeof window !== "undefined"
    ? Math.min(Math.max(tooltip.y - 40, 8), window.innerHeight - TT_H - 8)
    : tooltip.y - 40;

  const ttItem      = tooltip.item;
  const ttDiff      = ttItem ? ttItem.totalBudget - ttItem.used : 0;
  const ttIsOver    = ttItem ? ttItem.used > ttItem.totalBudget : false;
  const ttDiffAmt   = Math.abs(ttDiff);
  const ttDiffColor = ttItem?.status === "OVER" ? "#ef4444" : "#94a3b8";
  const ttDiffLbl   = ttIsOver ? "Over" : ttItem?.status === "NOT_USED" ? "Utilized" : "Remaining";

  return (
    <div
      className="w-full bg-white overflow-hidden"
      style={{ borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 4px 28px rgba(15,37,71,.10)" }}
    >
      {/* ── TOP BAR ── */}
      <div className="flex justify-between items-center px-5 pt-2.5">

        {/* Component count badge */}
        <div
          className="flex items-center gap-2"
          style={{ padding: "7px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10 }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6ee7b7" }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: "#475569" }}>
            {items.length} Components
          </span>
        </div>

        {/* Overall Usage pill */}
        <div
          className="flex items-center gap-2.5"
          style={{ padding: "7px 16px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10 }}
        >
          <div>
            <p style={{ fontSize: 10, color: "#94a3b8", marginBottom: 4 }}>Overall Usage</p>
            <div style={{ width: 100, height: 5, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ width: `${Math.min(totals?.pct ?? 0, 100)}%`, height: "100%", background: "#4f46e5", borderRadius: 99 }} />
            </div>
          </div>
          <span style={{ fontSize: 20, fontWeight: 900, color: "#4f46e5" }}>
            {totals?.pct.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* ── CHART ── */}
      <div style={{ padding: "14px 16px 0" }}>
        <div className="flex">

          {/* Y Axis */}
          <div
            className="flex-shrink-0 flex flex-col justify-between"
            style={{ width: 40, paddingBottom: 40 }}
          >
            {Y_LABELS.map((v) => (
              <span key={v} style={{ fontSize: 10, fontWeight: 600, color: "#475569", textAlign: "right", paddingRight: 8, lineHeight: 1 }}>
                {v}%
              </span>
            ))}
          </div>

          {/* Chart body */}
          <div className="flex-1 relative">

            {/* Grid lines */}
            <div
              className="absolute left-0 right-0 flex flex-col justify-between pointer-events-none"
              style={{ top: 40, height: BAR_H, zIndex: 0 }}
            >
              {Y_LABELS.map((v, i) => (
                <div
                  key={v}
                  style={{
                    width: "100%",
                    borderTop: i === Y_LABELS.length - 1
                      ? "2px solid #d1dde8"
                      : i === 0 || i === Y_LABELS.length - 2
                      ? "1px solid #e2e8f0"
                      : "1px solid #f0f4f8",
                  }}
                />
              ))}
            </div>

            {/* Bars scroll */}
            <div
              className="overflow-x-auto relative"
              style={{ height: BAR_H + 40, zIndex: 1, scrollbarWidth: "thin", scrollbarColor: "#c7d2fe #f1f5f9" }}
            >
              <div
                className="flex items-end gap-4 px-2"
                style={{ height: BAR_H + 40, minWidth: "max-content" }}
              >
                {items.map((it) => {
                  const usedH   = it.used > 0 ? Math.max((Math.min(it.pct, 100) / 100) * BAR_H, 4) : 0;
                  const budgetH = BAR_H;
                  const isHov   = tooltip.visible && tooltip.item?.code === it.code;

                  return (
                    <div
                      key={it.code}
                      className="flex-shrink-0 flex flex-col items-center cursor-pointer"
                      style={{ transform: isHov ? "translateY(-4px)" : "translateY(0)", transition: "transform .15s ease" }}
                      onMouseEnter={(e) => showTooltip(e, it)}
                      onMouseMove={moveTooltip}
                      onMouseLeave={hideTooltip}
                    >
                      {/* Bars */}
                      <div className="flex items-end" style={{ height: BAR_H, gap: 5 }}>

                        {/* Budget Plan bar — LEFT, always 100% height, emerald */}
                        <div
                          style={{
                            width: BAR_W,
                            height: budgetH,
                            borderRadius: "6px 6px 3px 3px",
                            background: "#6ee7b7",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            opacity: tooltip.visible && !isHov ? 0.2 : 1,
                            boxShadow: isHov ? "0 0 0 2px #34d399" : "none",
                            transition: "opacity .15s, box-shadow .15s",
                          }}
                        >
                          <span style={{ fontSize: 8, fontWeight: 500, color: "#0b0e11", textAlign: "center", padding: "0 2px", lineHeight: 1.2 }}>
                            {fmt(it.totalBudget)}
                          </span>
                        </div>

                        {/* Budget Actual bar — RIGHT, proportional height, indigo */}
                        <div
                          style={{
                            width: BAR_W,
                            height: Math.max(usedH, it.used > 0 ? 4 : 0),
                            borderRadius: "6px 6px 3px 3px",
                            background: it.used === 0
                              ? "repeating-linear-gradient(45deg,#dde3ea 0px,#dde3ea 3px,#eef1f5 3px,#eef1f5 8px)"
                              : "#4f46e5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            opacity: tooltip.visible && !isHov ? 0.2 : 1,
                            boxShadow: isHov ? "0 0 0 2px #4338ca" : "none",
                            transition: "opacity .15s, box-shadow .15s",
                          }}
                        >
                          {it.used > 0 && usedH >= 14 && (
                            <span style={{ fontSize: 8, fontWeight: 500, color: "#fff", textAlign: "center", padding: "0 2px", lineHeight: 1.2 }}>
                              {fmt(it.used)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Axis line */}
                      <div style={{ width: 68, height: 2, background: "#e2e8f0", marginTop: 3 }} />

                      {/* Code */}
                      <p
                        className="font-mono font-bold text-center mt-1.5"
                        style={{ fontSize: 10, color: isHov ? "#4f46e5" : "#475569", transition: "color .15s", whiteSpace: "nowrap" }}
                      >
                        {it.code}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── LEGEND ── */}
      <div
        className="flex items-center justify-between flex-wrap gap-2 px-6 py-3"
        style={{ background: "#f8fafc", borderTop: "1px solid #f1f5f9" }}
      >
        <div className="flex items-center gap-4 flex-wrap">
          {[
            { bg: "#6ee7b7", border: "1px solid #34d399", stripe: false, label: "Budget Plan (Alokasi)" },
            { bg: "#4f46e5", border: undefined,            stripe: false, label: "Budget Actual (Realisasi)" },
            { bg: undefined, border: "1px solid #b8c4d0", stripe: true,  label: "Not Used (0%)" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5" style={{ fontSize: 11, fontWeight: 500, color: "#475569" }}>
              <div style={{
                width: 11, height: 11, borderRadius: 3,
                background: l.stripe
                  ? "repeating-linear-gradient(45deg,#dde3ea 0,#dde3ea 3px,#eef1f5 3px,#eef1f5 6px)"
                  : l.bg,
                border: l.border,
              }} />
              {l.label}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 10, color: "#94a3b8", fontStyle: "italic" }}>* Bar height proportional to usage %</p>
      </div>

      {/* ── TOOLTIP ── */}
      {tooltip.visible && ttItem && (
        <div className="fixed pointer-events-none" style={{ left: ttLeft, top: ttTop, width: TT_W, zIndex: 9999 }}>
          <div style={{ background: "#0f0e2a", border: "1px solid #1e1b4b", borderRadius: 14, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.5), 0 0 0 1px rgba(99,102,241,.12)" }}>
            <div style={{ height: 3, background: "linear-gradient(90deg,#4f46e5,transparent)" }} />
            <div style={{ padding: 15 }}>

              {/* Head */}
              <div className="flex items-start gap-2.5" style={{ marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#eef2ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>
                  {ICON[ttItem.status]}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", lineHeight: 1.3 }}>{ttItem.name}</p>
                  <p style={{ fontSize: 9.5, fontFamily: "monospace", color: "#818cf8", marginTop: 2 }}>{ttItem.code}</p>
                </div>
              </div>

              {/* Usage */}
              <div className="flex justify-between items-center" style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px", color: "#6b7280" }}>Usage</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: "#4f46e5", letterSpacing: -1 }}>{ttItem.pct.toFixed(1)}%</span>
              </div>
              <div style={{ width: "100%", height: 6, background: "#1e1b4b", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ width: `${Math.min(ttItem.pct, 100)}%`, height: "100%", background: "#4f46e5", borderRadius: 99, maxWidth: "100%" }} />
              </div>

              {/* Stats */}
              <div style={{ display: "flex", flexDirection: "column", gap: 7, borderTop: "1px solid #1e1b4b", marginTop: 12, paddingTop: 12 }}>
                {[
                  { dot: "#6ee7b7", label: "Budget Plan",  value: fmtFull(ttItem.totalBudget), color: "#6ee7b7" },
                  { dot: "#4f46e5", label: "Budget Used",  value: fmtFull(ttItem.used),         color: "#a5b4fc" },
                  { dot: ttDiffColor, label: ttDiffLbl,    value: fmtFull(ttDiffAmt),           color: ttDiffColor },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between" style={{ fontSize: 11 }}>
                    <div className="flex items-center gap-1.5" style={{ color: "#6b7280" }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: row.dot }} />
                      {row.label}
                    </div>
                    <span style={{ fontWeight: 700, color: row.color }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Chip */}
              <div style={{ marginTop: 10, borderRadius: 8, padding: "7px 10px", textAlign: "center", fontSize: 11, fontWeight: 700, background: "#eef2ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                {CHIP[ttItem.status]}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}