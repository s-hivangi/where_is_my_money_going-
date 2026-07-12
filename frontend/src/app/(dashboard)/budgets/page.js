"use client";
import { useState } from "react";

const initialBudgets = [
  { category: "Food & Dining", spent: 4500, limit: 6000 },
  { category: "Transport", spent: 1200, limit: 2000 },
  { category: "Shopping", spent: 8500, limit: 7000 },
  { category: "Entertainment", spent: 900, limit: 1500 },
  { category: "Utilities", spent: 2100, limit: 3000 },
  { category: "Rent", spent: 15000, limit: 15000 },
  { category: "Groceries", spent: 2800, limit: 4000 },
  { category: "Health", spent: 1500, limit: 2500 },
];

export default function Budgets() {
  const [budgets] = useState(initialBudgets);

  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const overBudgetCount = budgets.filter((b) => b.spent > b.limit).length;
  const nearLimitCount = budgets.filter((b) => !(b.spent > b.limit) && b.spent / b.limit > 0.85).length;
  const usagePercent = Math.round((totalSpent / totalLimit) * 100);

  return (
    <div>
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] mb-1 font-medium">Month Budget</p>
          <h1 className="font-(family-name:--font-heading) text-[22px] text-white tracking-tight">Budget Goals</h1>
        </div>
        <button className="text-[11px] px-3.5 py-1.5 rounded-sm bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center gap-1.5 group">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:rotate-90"><path d="M12 5v14M5 12h14" /></svg>
          Add Budget
        </button>
      </div>

      {/* Summary strip */}
      <div className="flex items-center gap-0 border rounded-md divide-x divide-[#1a2332] mb-5 text-[11px]">
        <div className="flex-1 px-4 py-3">
          <p className="text-gray-600 mb-0.5">Total Budget</p>
          <p className="text-gray-200 tabular-nums font-medium font-(family-name:--font-heading) text-[15px]">₹{totalLimit.toLocaleString()}</p>
        </div>
        <div className="flex-1 px-4 py-3">
          <p className="text-gray-600 mb-0.5">Total Spent</p>
          <p className="text-gray-200 tabular-nums font-medium font-(family-name:--font-heading) text-[15px]">₹{totalSpent.toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 h-0.5 bg-[#1a2332] rounded-full overflow-hidden">
              <div className={`h-full transition-all ${usagePercent > 95 ? "bg-red-500" : "bg-blue-600"}`} style={{ width: `${Math.min(usagePercent, 100)}%` }} />
            </div>
            <span className="text-[9px] text-gray-500 tabular-nums">{usagePercent}%</span>
          </div>
        </div>
        <div className="px-4 py-3">
          <p className="text-gray-600 mb-0.5">Over Budget</p>
          <p className={`tabular-nums font-medium ${overBudgetCount > 0 ? "text-red-400" : "text-emerald-400"}`}>{overBudgetCount}</p>
        </div>
        <div className="px-4 py-3">
          <p className="text-gray-600 mb-0.5">Near Limit</p>
          <p className={`tabular-nums font-medium ${nearLimitCount > 0 ? "text-amber-400" : "text-emerald-400"}`}>{nearLimitCount}</p>
        </div>
      </div>

      {/* Budget table */}
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b text-gray-600 text-left">
              <th className="px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider w-8">#</th>
              <th className="px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider">Category</th>
              <th className="px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider">Spent</th>
              <th className="px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider">Limit</th>
              <th className="px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider w-50">Usage</th>
              <th className="px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((b, i) => {
              const pct = Math.round((b.spent / b.limit) * 100);
              const isOver = b.spent > b.limit;
              const isNear = !isOver && b.spent / b.limit > 0.85;

              return (
                <tr key={b.category} className={`border-b border-[#1a2332]/50 hover:bg-white/1 transition-colors ${isOver ? "border-l-2 border-l-red-500" : isNear ? "border-l-2 border-l-amber-500" : ""}`}>
                  <td className="px-4 py-3 text-gray-600 tabular-nums font-mono text-[10px]">{String(i + 1).padStart(2, "0")}</td>
                  <td className="px-4 py-3 text-gray-200 font-medium">{b.category}</td>
                  <td className={`px-4 py-3 tabular-nums font-medium ${isOver ? "text-red-400" : "text-gray-300"}`}>₹{b.spent.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500 tabular-nums">₹{b.limit.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-0.75 bg-[#1a2332] rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${isOver ? "bg-red-500" : isNear ? "bg-amber-500" : "bg-blue-600"}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 tabular-nums w-7 text-right">{pct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isOver ? (
                      <span className="text-[9px] text-red-500 bg-red-500/10 border border-red-500/20 px-1.5 py-px rounded-xs">Over by ₹{(b.spent - b.limit).toLocaleString()}</span>
                    ) : isNear ? (
                      <span className="text-[9px] text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-px rounded-xs">₹{(b.limit - b.spent).toLocaleString()} left</span>
                    ) : (
                      <span className="text-[9px] text-gray-500">₹{(b.limit - b.spent).toLocaleString()} left</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
