"use client";

/**
 * =====================================================
 * STATUS LEGEND - ENTERPRISE STANDARD
 * =====================================================
 * Background: bg-slate-50
 * Border: border-gray-200
 * Text: text-gray-700
 */
export default function StatusLegend() {
  return (
    <div className="bg-slate-50 rounded-xl shadow-md p-6 border border-gray-200">
      <h3 className="text-base font-bold text-gray-700 mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-gray-900 rounded-full"></span>
        Status Legend
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 
          =====================================================
          NOT USED
          =====================================================
          bg-slate-100 text-slate-500 border-slate-300
        */}
        <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-lg border border-slate-300 hover:shadow-sm transition-shadow">
          <div className="w-4 h-4 rounded-full bg-slate-500 shadow-sm flex-shrink-0"></div>
          <div>
            <div className="text-sm font-semibold text-slate-700">
              Not Used
            </div>
            <div className="text-xs text-slate-500">0%</div>
          </div>
        </div>

        {/* 
          =====================================================
          UNDER BUDGET
          =====================================================
          bg-green-50 text-green-700 border-green-300
        */}
        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-300 hover:shadow-sm transition-shadow">
          <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm flex-shrink-0"></div>
          <div>
            <div className="text-sm font-semibold text-green-700">
              Under Budget
            </div>
            <div className="text-xs text-green-600">&lt;100%</div>
          </div>
        </div>

        {/* 
          =====================================================
          ON BUDGET
          =====================================================
          bg-amber-50 text-amber-700 border-amber-300
        */}
        <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-300 hover:shadow-sm transition-shadow">
          <div className="w-4 h-4 rounded-full bg-amber-500 shadow-sm flex-shrink-0"></div>
          <div>
            <div className="text-sm font-semibold text-amber-700">
              On Budget
            </div>
            <div className="text-xs text-amber-600">100%</div>
          </div>
        </div>

        {/* 
          =====================================================
          OVER BUDGET
          =====================================================
          bg-red-50 text-red-700 border-red-300
        */}
        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-300 hover:shadow-sm transition-shadow">
          <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm flex-shrink-0"></div>
          <div>
            <div className="text-sm font-semibold text-red-700">
              Over Budget
            </div>
            <div className="text-xs text-red-600">&gt;100%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
