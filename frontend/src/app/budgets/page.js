export default function Budgets() {
  const budgets = [
    { category: "Food & Dining", spent: 4500, limit: 6000, color: "bg-orange-500" },
    { category: "Transport", spent: 1200, limit: 2000, color: "bg-blue-500" },
    { category: "Shopping", spent: 8500, limit: 7000, color: "bg-pink-500" },
    { category: "Entertainment", spent: 900, limit: 1500, color: "bg-purple-500" },
    { category: "Utilities", spent: 2100, limit: 3000, color: "bg-yellow-500" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Budget Goals</h1>
        <p className="text-white/40 text-sm mt-1">Track your monthly spending limits</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {budgets.map((budget) => {
          const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
          const isOver = budget.spent > budget.limit;

          return (
            <div key={budget.category} className="bg-[#12121a] rounded-xl border border-white/10 p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-white">{budget.category}</h3>
                <span className={`text-xs ${isOver ? "text-red-400" : "text-white/40"}`}>
                  ₹{budget.spent.toLocaleString()} / ₹{budget.limit.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${isOver ? "bg-red-500" : budget.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-white/30 mt-2">
                {isOver
                  ? `₹${(budget.spent - budget.limit).toLocaleString()} over budget`
                  : `₹${(budget.limit - budget.spent).toLocaleString()} remaining`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
