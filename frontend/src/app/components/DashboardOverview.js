"use client";

import { useEffect, useState } from "react";

export default function DashboardOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/overview", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        setData(json.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-[1.4fr_1fr_0.7fr] gap-3 mb-5">
        <div className="bg-[#0c1017] border rounded-md p-4 animate-pulse">
          <div className="h-3 w-24 bg-white/10 rounded mb-4" />
          <div className="h-9 w-32 bg-white/10 rounded mb-3" />
          <div className="h-3 w-36 bg-white/10 rounded" />
        </div>
        <div className="bg-[#0c1017] border rounded-md p-4 animate-pulse">
          <div className="h-3 w-16 bg-white/10 rounded mb-4" />
          <div className="h-9 w-28 bg-white/10 rounded mb-3" />
          <div className="h-3 w-28 bg-white/10 rounded" />
        </div>
        <div className="bg-[#0c1017] border rounded-md p-4 animate-pulse">
          <div className="h-3 w-24 bg-white/10 rounded mb-4" />
          <div className="h-9 w-24 bg-white/10 rounded mb-3" />
          <div className="h-3 w-20 bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  const totalSpent = data?.total_spending || 0;
  const savingsRate = data?.savings_rate || 0;
  const saved = data?.saved || 0;
  const totalIncome = data?.total_income || 0;
  const transactions = data?.total_transactions || 0;
  const banks = data?.bank_count || 0;
  const topCategory = data?.top_category || 'No data';
  const topCategoryTotal = data?.top_category_total || 0;

  return (
    <div className="grid grid-cols-[1.4fr_1fr_0.7fr] gap-3 mb-5">
      <div className="bg-[#0c1017] border rounded-md p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.15em] font-medium">Total Spent</p>
          <span className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-px rounded-xs">
            {savingsRate >= 0 ? `${savingsRate.toFixed(1)}% saved` : '0% saved'}
          </span>
        </div>
        <p className="text-[28px] font-(family-name:--font-heading) text-white tracking-tight leading-none">₹{totalSpent.toLocaleString()}</p>
        <div className="mt-3 flex items-center gap-3 text-[10px] text-gray-600">
          <span>{transactions} transactions</span>
          <span className="w-0.75 h-0.75 bg-gray-700 rounded-full" />
          <span>{banks} banks</span>
        </div>
      </div>
      <div className="bg-[#0c1017] border rounded-md p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.15em] font-medium">Saved</p>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-px rounded-xs">{savingsRate.toFixed(1)}%</span>
        </div>
        <p className="text-[28px] font-(family-name:--font-heading) text-white tracking-tight leading-none">₹{saved.toLocaleString()}</p>
        <div className="mt-3 text-[10px] text-gray-600">of ₹{totalIncome.toLocaleString()} income</div>
      </div>
      <div className="bg-[#0c1017] border rounded-md p-4">
        <p className="text-[10px] text-gray-600 uppercase tracking-[0.15em] font-medium mb-3">Top Category</p>
        <p className="text-[28px] font-(family-name:--font-heading) text-white tracking-tight leading-none">{topCategory}</p>
        <div className="mt-3 text-[10px] text-gray-600">₹{topCategoryTotal.toLocaleString()} this month</div>
      </div>
    </div>
  );
}