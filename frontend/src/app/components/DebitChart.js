"use client";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function DebitChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/monthly-trend", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        setData(json.data || []);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
      <h2 className="text-sm font-semibold text-white/70 mb-4">Debit vs Time</h2>
      <div className="h-48 flex items-center justify-center text-white/20 text-sm">Loading...</div>
    </div>
  );

  if (data.length === 0) {
    return (
      <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
        <h2 className="text-sm font-semibold text-white/70 mb-4">Monthly Trend</h2>
        <div className="h-48 flex items-center justify-center text-white/20 text-sm">No transaction data yet</div>
      </div>
    );
  }

  return (
    <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
      <h2 className="text-sm font-semibold text-white/70 mb-4">Monthly Trend</h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="month"
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value, name) => [`₹${value.toLocaleString()}`, name]}
            contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
            labelStyle={{ color: "#fff" }}
          />
          <Line type="monotone" dataKey="spending" stroke="#EF4444" strokeWidth={2} dot={false} name="Spending" />
          <Line type="monotone" dataKey="income" stroke="#22C55E" strokeWidth={2} dot={false} name="Income" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
