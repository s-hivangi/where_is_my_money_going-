"use client";

const savings = 18;
const spending = 82;
const income = 85000;
const spent = 69700;
const saved = income - spent;

export default function SavingsRate() {
  const radius = 60;
  const circumference = Math.PI * radius;
  const savingsArc = (savings / 100) * circumference;

  return (
    <div className="bg-[#0c1017] border rounded-md p-4">
      <p className="text-[10px] text-gray-600 uppercase tracking-[0.15em] font-medium mb-4">Savings Rate</p>

      <div className="flex justify-center mb-4">
        <svg width="160" height="95" viewBox="0 0 160 95">
          <path d="M 15 85 A 65 65 0 0 1 145 85" fill="none" stroke="#1a2332" strokeWidth="10" strokeLinecap="butt" />
          <path d="M 15 85 A 65 65 0 0 1 145 85" fill="none" stroke="#ef4444" strokeWidth="10" strokeLinecap="butt" opacity="0.25" />
          <path
            d="M 15 85 A 65 65 0 0 1 145 85"
            fill="none"
            stroke="#06d6a0"
            strokeWidth="10"
            strokeLinecap="butt"
            strokeDasharray={`${savingsArc} ${circumference}`}
          />
          <text x="80" y="62" textAnchor="middle" fill="white" fontSize="22" fontWeight="600">
            {savings}%
          </text>
          <text x="80" y="80" textAnchor="middle" fill="#6b7280" fontSize="9">
            saved this month
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="border rounded-md p-2.5">
          <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-0.5">Saved</p>
          <p className="text-[15px] text-emerald-400 font-(family-name:--font-heading) tabular-nums">₹{(saved / 1000).toFixed(1)}k</p>
        </div>
        <div className="border rounded-md p-2.5">
          <p className="text-[9px] text-gray-600 uppercase tracking-wider mb-0.5">Spent</p>
          <p className="text-[15px] text-red-400 font-(family-name:--font-heading) tabular-nums">₹{(spent / 1000).toFixed(1)}k</p>
        </div>
      </div>
    </div>
  );
}
