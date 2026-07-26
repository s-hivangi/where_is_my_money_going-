"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      router.push("/");
    } else {
      setError(data.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center relative overflow-hidden">

      {/* cinematic background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-150 h-150 rounded-full bg-purple-900/30 blur-[120px]" /> 
      </div>

      {/* card */}
      <div className="relative z-10 w-full max-w-md px-8 flex flex-col items-center">

        {/* app icon */}
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <div className="w-7 h-7 bg-black rounded-lg" />
        </div>

        {/* heading */}
        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-white/40 text-sm mb-8">Start tracking your finances today.</p>

        {/* error */}
        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* inputs */}
        <div className="w-full flex flex-col gap-3 mb-4">
          <div className="flex items-center gap-3 bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              className="bg-transparent flex-1 text-sm text-white placeholder-white/20 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="bg-transparent flex-1 text-sm text-white placeholder-white/20 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="bg-transparent flex-1 text-sm text-white placeholder-white/20 outline-none"
            />
          </div>
        </div>

        {/* create account button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-white hover:bg-white/90 disabled:opacity-50 text-black font-semibold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 mb-6"
        >
          {loading ? "Creating account..." : <>Create Account <span>→</span></>}
        </button>

        {/* divider */}
        <div className="w-full flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-xs tracking-widest">OR CONTINUE WITH</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* google button */}
        <button className="w-full bg-[#0d0d1a] border border-white/10 hover:border-white/20 text-white font-medium py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 mb-8">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>

        {/* login link */}
        <p className="text-white/30 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}

