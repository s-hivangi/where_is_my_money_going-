"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Uber", value: 3200, color: "#2563eb" },
  { name: "Amazon", value: 5800, color: "#06d6a0" },
  { name: "Starbucks", value: 1900, color: "#8b5cf6" },
  { name: "Spotify", value: 799, color: "#f59e0b" },
  { name: "Netflix", value: 649, color: "#ef4444" },
  { name: "Swiggy", value: 4200, color: "#06b6d4" },
];

const total = data.reduce((s, d) => s + d.value, 0);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-[#111824] border rounded-[4px] px-2.5 py-1.5 text-[11px]">
        <p className="text-gray-300 font-medium">{d.name}</p>
        <p className="text-gray-500">₹{d.value.toLocaleString()} · {((d.value / total) * 100).toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

export default function SpendingBreakdown() {
  return (
    <div className="bg-[#0c1017] border rounded-[6px] p-4">
      <p className="text-[10px] text-gray-600 uppercase tracking-[0.15em] font-medium mb-3">By App</p>

      <div className="relative h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[11px] text-gray-600">Total</span>
          <span className="text-[18px] font-[family-name:var(--font-heading)] text-white tracking-tight">₹{(total / 1000).toFixed(1)}k</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-3 pt-3 border-t">
        {data.map((d) => (
          <div key={d.name} className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="w-[6px] h-[6px] rounded-[1px] flex-shrink-0" style={{ background: d.color }} />
              <span className="text-gray-500">{d.name}</span>
            </div>
            <span className="text-gray-600 tabular-nums">{((d.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
