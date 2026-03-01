"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";

const data = [
  { day: "01", debit: 1200 },
  { day: "04", debit: 3400 },
  { day: "07", debit: 800 },
  { day: "10", debit: 2100 },
  { day: "13", debit: 5200 },
  { day: "16", debit: 15800 },
  { day: "19", debit: 2900 },
  { day: "22", debit: 1500 },
  { day: "25", debit: 3600 },
  { day: "28", debit: 2200 },
];

const avg = Math.round(data.reduce((s, d) => s + d.debit, 0) / data.length);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#111824] border rounded-[4px] px-2.5 py-1.5 text-[11px]">
        <p className="text-gray-500 mb-0.5">Feb {label}</p>
        <p className="text-gray-300 tabular-nums">₹{payload[0]?.value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function DebitChart() {
  return (
    <div className="bg-[#0c1017] border rounded-[6px] p-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] text-gray-600 uppercase tracking-[0.15em] font-medium">Debit Over Time</p>
        <p className="text-[10px] text-gray-600">Avg: <span className="text-gray-400 tabular-nums">₹{avg.toLocaleString()}/day</span></p>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 8, top: 5, bottom: 0 }}>
            <defs>
              <linearGradient id="debitFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1a2332" strokeDasharray="none" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: "#4b5563", fontSize: 10 }}
              axisLine={{ stroke: "#1a2332" }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              tick={{ fill: "#4b5563", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={avg} stroke="#374151" strokeDasharray="4 4" strokeWidth={1} />
            <Area
              type="monotone"
              dataKey="debit"
              stroke="#2563eb"
              strokeWidth={1.5}
              fill="url(#debitFill)"
              dot={{ fill: "#060910", stroke: "#2563eb", strokeWidth: 1.5, r: 2.5 }}
              activeDot={{ r: 4, fill: "#2563eb", stroke: "#060910", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
