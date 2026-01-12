"use client";

export default function StatusLegend() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Status Legend
      </h3>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">Good (&lt;70%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-sm text-gray-600">Warning (70-90%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm text-gray-600">Critical (≥90%)</span>
        </div>
      </div>
    </div>
  );
}