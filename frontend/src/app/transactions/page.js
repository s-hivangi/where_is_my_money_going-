export default function Transactions() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-white/40 text-sm mt-1">Search and filter across all your banks</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search transactions..."
          className="flex-1 bg-[#12121a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-purple-500 transition"
        />
        <select className="bg-[#12121a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white/70 outline-none">
          <option>All Banks</option>
          <option>HDFC</option>
          <option>SBI</option>
          <option>ICICI</option>
        </select>
        <select className="bg-[#12121a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white/70 outline-none">
          <option>All Categories</option>
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
        </select>
        <select className="bg-[#12121a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white/70 outline-none">
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
          <option>This Year</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#12121a] rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/40 text-left">
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Merchant</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Bank</th>
              <th className="px-5 py-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5 text-white/60">
              <td className="px-5 py-3">Feb 24, 2026</td>
              <td className="px-5 py-3 text-white">Swiggy</td>
              <td className="px-5 py-3"><span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full text-xs">Food</span></td>
              <td className="px-5 py-3">HDFC</td>
              <td className="px-5 py-3 text-right text-red-400">- ₹450</td>
            </tr>
            <tr className="border-b border-white/5 text-white/60">
              <td className="px-5 py-3">Feb 23, 2026</td>
              <td className="px-5 py-3 text-white">Uber</td>
              <td className="px-5 py-3"><span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-xs">Transport</span></td>
              <td className="px-5 py-3">SBI</td>
              <td className="px-5 py-3 text-right text-red-400">- ₹230</td>
            </tr>
            <tr className="border-b border-white/5 text-white/60">
              <td className="px-5 py-3">Feb 22, 2026</td>
              <td className="px-5 py-3 text-white">Salary</td>
              <td className="px-5 py-3"><span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs">Income</span></td>
              <td className="px-5 py-3">HDFC</td>
              <td className="px-5 py-3 text-right text-green-400">+ ₹85,000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
