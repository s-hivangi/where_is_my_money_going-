"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function AICategorization() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/spending-by-category")
      .then((res) => res.json())
      .then((json) => {
        setData(json.data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
      <h2 className="text-sm font-semibold text-white/70 mb-4">AI-Powered Categorization</h2>
      <div className="h-64 flex items-center justify-center text-white/20 text-sm">Loading...</div>
    </div>
  );

  return (
    <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-sm font-semibold text-white/70">AI-Powered Categorization</h2>
        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">LLM</span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="category"
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [`$${value.toLocaleString()}`, "Total"]}
            contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
            labelStyle={{ color: "#fff" }}
          />
          <Bar dataKey="total" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

