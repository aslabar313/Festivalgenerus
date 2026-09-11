"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, User, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      // Allow username login: if input doesn't contain '@', convert username to username@festivalgenerus.internal
      const formattedEmail = usernameOrEmail.includes("@") 
        ? usernameOrEmail.trim().toLowerCase() 
        : `${usernameOrEmail.trim().toLowerCase()}@festivalgenerus.internal`;

      const { error } = await supabase.auth.signInWithPassword({
        email: formattedEmail,
        password,
      });

      if (error) {
        setErrorMsg("Username atau kata sandi tidak valid.");
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat masuk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="bg-emerald-500 p-2 rounded-xl text-slate-950">
              <Trophy className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="font-bold text-xl text-white">FestivalGenerus</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Masuk ke Akun</h1>
          <p className="text-sm text-slate-400 mt-1">Masukkan Username & Kata Sandi Anda</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Username / ID Pengguna
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="misal: superadminaldi"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all mt-6"
          >
            {loading ? "Memproses..." : "Masuk"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          Belum punya akun?{" "}
          <Link href="/register" className="text-emerald-400 hover:underline font-medium">
            Daftar Akun Baru
          </Link>
        </div>
      </div>
    </div>
  );
}
