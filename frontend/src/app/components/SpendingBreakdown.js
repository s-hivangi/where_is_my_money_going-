"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function SpendingBreakdown() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/spending-by-category", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        setData(json.data || []);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
      <h2 className="text-sm font-semibold text-white/70 mb-4">App Spending Breakdown</h2>
      <div className="h-48 flex items-center justify-center text-white/20 text-sm">Loading...</div>
    </div>
  );

  if (data.length === 0) {
    return (
      <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
        <h2 className="text-sm font-semibold text-white/70 mb-4">Spending Breakdown</h2>
        <div className="h-48 flex items-center justify-center text-white/20 text-sm">No category data yet</div>
      </div>
    );
  }

  return (
    <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
      <h2 className="text-sm font-semibold text-white/70 mb-4">Spending Breakdown</h2>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`₹${value.toLocaleString()}`, "Total"]}
            contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
            labelStyle={{ color: "#fff" }}
          />
          <Legend
            formatter={(value) => <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
