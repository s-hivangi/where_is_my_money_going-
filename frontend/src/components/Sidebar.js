"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: "/transactions",
    label: "Transactions",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    ),
  },
  {
    href: "/budgets",
    label: "Budgets",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[200px] min-h-screen bg-[#0c1017] border-r flex flex-col">
      <div className="px-5 pt-6 pb-5 border-b">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[4px] bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold tracking-tight">
            F
          </div>
          <span className="font-[family-name:var(--font-heading)] text-[17px] text-white tracking-tight">
            FinSight
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 pt-5">
        <p className="text-[9px] uppercase tracking-[0.2em] text-gray-600 px-3 mb-3 font-medium">Navigation</p>
        <div className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-[13px] rounded-[4px] transition-colors duration-150 ${
                  active
                    ? "bg-blue-600/10 text-blue-400 border-l-2 border-l-blue-500"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="px-3 pb-5">
        <div className="border rounded-[4px] p-3 bg-[#0a0e15]">
          <p className="text-[9px] text-gray-600 uppercase tracking-wider font-medium mb-2">Statements</p>
          <div className="w-full bg-[#1a2332] rounded-sm h-[3px] mb-2">
            <div className="h-[3px] rounded-sm bg-blue-600 w-[35%]" />
          </div>
          <p className="text-[10px] text-gray-500">3 of 10 uploaded</p>
        </div>
      </div>
    </aside>
  );
}
