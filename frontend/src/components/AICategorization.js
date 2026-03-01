"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Rent", amount: 15000 },
  { name: "Food & Dining", amount: 8700 },
  { name: "Shopping", amount: 6200 },
  { name: "Travelling", amount: 5400 },
  { name: "Utilities", amount: 3200 },
  { name: "Gaming", amount: 1800 },
];

const totalCategorized = data.reduce((s, d) => s + d.amount, 0);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#111824] border rounded-[4px] px-2.5 py-1.5 text-[11px]">
        <p className="text-gray-300">{payload[0].payload.name}</p>
        <p className="text-gray-500">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function AICategorization() {
  return (
    <div className="bg-[#0c1017] border rounded-[6px] p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-[10px] text-gray-600 uppercase tracking-[0.15em] font-medium">AI-Categorized Spending</p>
            <span className="text-[8px] text-blue-400 border border-blue-500/30 px-1 py-px rounded-[2px] font-medium">LLM</span>
          </div>
          <p className="text-[11px] text-gray-600">Auto-classified from raw bank statement text</p>
        </div>
        <p className="text-[11px] text-gray-500 tabular-nums">₹{totalCategorized.toLocaleString()} total</p>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 12, top: 0, bottom: 0 }}>
            <XAxis
              type="number"
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              tick={{ fill: "#4b5563", fontSize: 10 }}
              axisLine={{ stroke: "#1a2332" }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "#6b7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={85}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.01)" }} />
            <Bar dataKey="amount" radius={[0, 2, 2, 0]} barSize={16} fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
