import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between px-5 py-2.5 bg-[#0c1017] border-b">
      <div className="flex items-center gap-3">
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-600" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search transactions, merchants..."
            className="w-72 bg-[#0a0e15] border rounded-sm pl-8 pr-3 py-1.5 text-[12px] text-gray-300 placeholder-gray-600 outline-none focus:border-blue-600 transition-colors"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <select className="bg-[#0a0e15] border rounded-sm px-3 py-1.5 text-[12px] text-gray-400 outline-none cursor-pointer hover:border-gray-600 transition-colors">
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
          <option value="180">Last 6 Months</option>
          <option value="365">This Year</option>
        </select>
        <Link href="/upload" className="text-[12px] px-3 py-1.5 rounded-sm bg-blue-600 text-white font-medium hover:bg-blue-500 active:bg-blue-700 transition-colors tracking-tight flex items-center gap-1.5 group">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="group-hover:-translate-y-0.5 transition-transform">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload
        </Link>
        <div className="w-px h-5 bg-[#1a2332]" />
        <Link href="/account" className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-7 h-7 rounded-sm bg-[#1a2332] flex items-center justify-center text-[11px] text-gray-400 font-medium group-hover:border-gray-500 border border-transparent transition-colors">
            S
          </div>
          <div>
            <p className="text-[11px] text-gray-300 leading-tight">Shivangi</p>
            <p className="text-[9px] text-gray-600 leading-tight">Personal</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
