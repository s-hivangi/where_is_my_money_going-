"use client";
import { useState } from "react";

const allTransactions = [
  { date: "Feb 28, 2026", merchant: "Swiggy", category: "Food", bank: "HDFC", amount: -450, status: "completed" },
  { date: "Feb 27, 2026", merchant: "Amazon", category: "Shopping", bank: "ICICI", amount: -2340, status: "completed" },
  { date: "Feb 27, 2026", merchant: "Uber", category: "Transport", bank: "SBI", amount: -230, status: "completed" },
  { date: "Feb 26, 2026", merchant: "Starbucks", category: "Food", bank: "HDFC", amount: -380, status: "completed" },
  { date: "Feb 26, 2026", merchant: "Netflix", category: "Entertainment", bank: "HDFC", amount: -649, status: "completed" },
  { date: "Feb 25, 2026", merchant: "BigBasket", category: "Groceries", bank: "SBI", amount: -1200, status: "completed" },
  { date: "Feb 25, 2026", merchant: "Spotify", category: "Entertainment", bank: "ICICI", amount: -799, status: "pending" },
  { date: "Feb 24, 2026", merchant: "Zomato", category: "Food", bank: "HDFC", amount: -520, status: "completed" },
  { date: "Feb 24, 2026", merchant: "Ola", category: "Transport", bank: "SBI", amount: -180, status: "completed" },
  { date: "Feb 23, 2026", merchant: "Flipkart", category: "Shopping", bank: "ICICI", amount: -3500, status: "completed" },
  { date: "Feb 22, 2026", merchant: "Salary", category: "Income", bank: "HDFC", amount: 85000, status: "completed" },
  { date: "Feb 22, 2026", merchant: "Electric Bill", category: "Utilities", bank: "HDFC", amount: -1800, status: "completed" },
  { date: "Feb 21, 2026", merchant: "Gym Membership", category: "Health", bank: "SBI", amount: -1500, status: "completed" },
  { date: "Feb 20, 2026", merchant: "Swiggy", category: "Food", bank: "HDFC", amount: -350, status: "completed" },
  { date: "Feb 19, 2026", merchant: "Amazon Prime", category: "Entertainment", bank: "ICICI", amount: -1499, status: "completed" },
  { date: "Feb 18, 2026", merchant: "CloudKitchen", category: "Food", bank: "HDFC", amount: -380, status: "failed" },
  { date: "Feb 17, 2026", merchant: "Uber", category: "Transport", bank: "SBI", amount: -290, status: "completed" },
  { date: "Feb 16, 2026", merchant: "Rent Transfer", category: "Rent", bank: "HDFC", amount: -15000, status: "completed" },
];

const statusStyles = {
  completed: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  pending: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  failed: "text-red-500 bg-red-500/10 border-red-500/20",
};

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [bankFilter, setBankFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = ["All", ...new Set(allTransactions.map((t) => t.category))];
  const banks = ["All", ...new Set(allTransactions.map((t) => t.bank))];

  const filtered = allTransactions.filter((t) => {
    const matchSearch = t.merchant.toLowerCase().includes(search.toLowerCase());
    const matchBank = bankFilter === "All" || t.bank === bankFilter;
    const matchCategory = categoryFilter === "All" || t.category === categoryFilter;
    const matchTab = tab === "all" || (tab === "debit" && t.amount < 0) || (tab === "credit" && t.amount > 0);
    return matchSearch && matchBank && matchCategory && matchTab;
  });

  const totalDebit = filtered.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalCredit = filtered.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);

  return (
    <div>
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] mb-1 font-medium">Transaction Explorer</p>
          <h1 className="font-(family-name:--font-heading) text-[22px] text-white tracking-tight">All Transactions</h1>
        </div>
        <div className="flex gap-5 text-[11px]">
          <div>
            <p className="text-gray-600 mb-0.5">Showing</p>
            <p className="text-gray-300 tabular-nums font-medium">{filtered.length} results</p>
          </div>
          <div className="border-l pl-5">
            <p className="text-gray-600 mb-0.5">Total Debit</p>
            <p className="text-red-400 tabular-nums font-medium">₹{totalDebit.toLocaleString()}</p>
          </div>
          <div className="border-l pl-5">
            <p className="text-gray-600 mb-0.5">Total Credit</p>
            <p className="text-emerald-400 tabular-nums font-medium">₹{totalCredit.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Tabs + Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex">
          {["all", "debit", "credit"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-[11px] px-3 py-1.5 border transition-colors ${
                tab === t
                  ? "bg-blue-600 text-white border-blue-600"
                  : "text-gray-500 border-[#1a2332] hover:text-gray-300 hover:bg-white/2"
              } ${t === "all" ? "rounded-l-sm" : t === "credit" ? "rounded-r-sm" : ""} -ml-px first:ml-0`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <svg className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-600" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search merchant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-45 bg-[#0a0e15] border rounded-sm pl-7 pr-3 py-1.5 text-[11px] text-gray-300 placeholder-gray-600 outline-none focus:border-blue-600 transition-colors"
            />
          </div>
          <select
            value={bankFilter}
            onChange={(e) => setBankFilter(e.target.value)}
            className="bg-[#0a0e15] border rounded-sm px-2.5 py-1.5 text-[11px] text-gray-400 outline-none cursor-pointer hover:border-gray-600 transition-colors"
          >
            {banks.map((b) => <option key={b} value={b}>{b === "All" ? "All Banks" : b}</option>)}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#0a0e15] border rounded-sm px-2.5 py-1.5 text-[11px] text-gray-400 outline-none cursor-pointer hover:border-gray-600 transition-colors"
          >
            {categories.map((c) => <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b text-gray-600 text-left">
              <th className="px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider">Date</th>
              <th className="px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider">Merchant</th>
              <th className="px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider">Category</th>
              <th className="px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider">Bank</th>
              <th className="px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider">Status</th>
              <th className="px-4 py-2.5 font-medium text-[10px] uppercase tracking-wider text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-600 text-[12px]">
                  No transactions match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((t, i) => (
                <tr key={i} className="border-b border-[#1a2332]/50 hover:bg-white/1 transition-colors">
                  <td className="px-4 py-2.5 text-gray-500 tabular-nums">{t.date}</td>
                  <td className="px-4 py-2.5 text-gray-200 font-medium">{t.merchant}</td>
                  <td className="px-4 py-2.5">
                    <span className="text-[10px] text-gray-400 border px-1.5 py-px rounded-xs">{t.category}</span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-500">{t.bank}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[9px] border px-1.5 py-px rounded-xs capitalize ${statusStyles[t.status]}`}>{t.status}</span>
                  </td>
                  <td className={`px-4 py-2.5 text-right tabular-nums font-medium ${t.amount > 0 ? "text-emerald-400" : "text-gray-300"}`}>
                    {t.amount > 0 ? "+" : "−"}₹{Math.abs(t.amount).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
