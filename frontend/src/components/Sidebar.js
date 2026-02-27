"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: "📊" },
    { href: "/transactions", label: "Transactions", icon: "💳" },
    { href: "/budgets", label: "Budget Goals", icon: "🎯" },
  ];

  return (
    <aside className="w-56 min-h-screen bg-[#12121a] border-r border-white/10 flex flex-col p-4 gap-2">
      <div className="mb-6 px-2">
        <h1 className="text-xl font-bold text-purple-400">FinSight</h1>
        <p className="text-xs text-white/30 mt-1">Personal Finance AI</p>
      </div>

      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
            pathname === link.href
              ? "bg-purple-600 text-white font-medium"
              : "text-white/50 hover:text-white hover:bg-white/10"
          }`}
        >
          <span>{link.icon}</span>
          <span>{link.label}</span>
        </Link>
      ))}
    </aside>
  );
}
