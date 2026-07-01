const merchants = [
  { name: "Amazon", amount: 5800, txns: 12, change: "+18%" },
  { name: "Swiggy", amount: 4200, txns: 28, change: "+7%" },
  { name: "Uber", amount: 3200, txns: 15, change: "-12%" },
  { name: "BigBasket", amount: 2800, txns: 8, change: "+3%" },
  { name: "Starbucks", amount: 1900, txns: 9, change: "+24%" },
];

const maxAmount = Math.max(...merchants.map((m) => m.amount));

export default function TopMerchants() {
    return (
    <div className="bg-[#0c1017] border rounded-md p-4">
      <p className="text-[10px] text-gray-600 uppercase tracking-[0.15em] font-medium mb-4">Top Merchants</p>

      <div className="flex flex-col">
        {merchants.map((m, i) => (
          <div
            key={m.name}
            className="flex items-center gap-3 py-2.5 border-b last:border-0 hover:bg-white/1 transition-colors"
          >
            <span className="text-[10px] text-gray-700 w-3 text-right tabular-nums font-mono">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] text-gray-300">{m.name}</span>
                <span className="text-[12px] text-white tabular-nums font-medium">₹{m.amount.toLocaleString()}</span>
              </div>
              <div className="w-full bg-[#1a2332] h-0.5">
                <div className="h-0.5 bg-blue-600" style={{ width: `${(m.amount / maxAmount) * 100}%` }} />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[9px] text-gray-600">{m.txns} txns</span>
                <span className={`text-[9px] tabular-nums ${m.change.startsWith("+") ? "text-red-500/60" : "text-emerald-500/60"}`}>
                  {m.change} vs prev
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
