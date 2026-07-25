"use client";
import { useEffect, useState } from "react";

export default function SavingsRate() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/savings-rate")
      .then((res) => res.json())
      .then((json) => {
        setData(json.data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
      <h2 className="text-sm font-semibold text-white/70 mb-4">Savings Rate</h2>
      <div className="h-48 flex items-center justify-center text-white/20 text-sm">Loading...</div>
    </div>
  );

  const rate = data?.savings_rate || 0;
  const spent = data?.total_spending || 0;
  const income = data?.total_income || 0;

  return (
    <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
      <h2 className="text-sm font-semibold text-white/70 mb-4">Savings vs Spending Rate</h2>
      
      <div className="flex flex-col items-center justify-center py-4">
        <div className="text-5xl font-bold text-white">{rate.toFixed(1)}%</div>
        <div className="text-white/40 text-sm mt-2">saved this month</div>
      </div>

      <div className="w-full bg-white/10 rounded-full h-2 mt-4">
        <div
          className="h-2 rounded-full bg-green-500"
          style={{ width: `${Math.min(rate, 100)}%` }}
        />
      </div>

      <div className="flex justify-between mt-4">
        <div>
          <div className="text-xs text-white/40">Income</div>
          <div className="text-sm font-medium text-green-400">${income.toLocaleString()}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/40">Spent</div>
          <div className="text-sm font-medium text-red-400">${spent.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}