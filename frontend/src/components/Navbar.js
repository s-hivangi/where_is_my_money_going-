export default function Navbar() {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#12121a] rounded-xl border border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">S</div>
        <h1 className="text-lg font-semibold tracking-tight">FinSight Analytics</h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="text-sm px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">Last 90 Days ▾</button>
        <button className="text-sm px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition font-medium">Upload Statement</button>
      </div>
    </div>
  );
}
