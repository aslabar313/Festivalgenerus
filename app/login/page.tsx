"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, User, Lock, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// List of preset main accounts for instant validation and smooth local session fallback
const PRESET_ACCOUNTS: Record<string, { full_name: string; role: string; email: string }> = {
  superadmin: {
    full_name: "Super Admin PPG",
    role: "Superadmin (PPG Magetan Timur)",
    email: "superadmin@festivalgenerus.internal",
  },
  wakilketua: {
    full_name: "Wakil Ketua Panitia",
    role: "Wakil Ketua (PPG Magetan Timur)",
    email: "wakilketua@festivalgenerus.internal",
  },
  sekretaris: {
    full_name: "Sekretaris Utama",
    role: "Sekretaris (PPG Magetan Timur)",
    email: "sekretaris@festivalgenerus.internal",
  },
  bendahara: {
    full_name: "Bendahara Utama",
    role: "Bendahara (PPG Magetan Timur)",
    email: "bendahara@festivalgenerus.internal",
  },
  timacara: {
    full_name: "Tim Divisi Acara",
    role: "Koordinator Acara (PPG Magetan Timur)",
    email: "timacara@festivalgenerus.internal",
  },
};

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const inputClean = usernameOrEmail.trim().toLowerCase();
    const isPreset = PRESET_ACCOUNTS[inputClean];

    try {
      // 1. Try Supabase Client Login if credentials are set
      let supabaseSuccess = false;
      try {
        const supabase = createClient();
        const formattedEmail = inputClean.includes("@")
          ? inputClean
          : `${inputClean}@festivalgenerus.internal`;

        const { data, error } = await supabase.auth.signInWithPassword({
          email: formattedEmail,
          password,
        });

        if (!error && data.user) {
          supabaseSuccess = true;
          const userMeta = data.user.user_metadata || {};
          const sessionUser = {
            username: inputClean,
            full_name: userMeta.full_name || isPreset?.full_name || inputClean,
            role: userMeta.role || isPreset?.role || "Panitia PPG Magetan Timur",
            email: formattedEmail,
          };
          localStorage.setItem("fg_user", JSON.stringify(sessionUser));
          document.cookie = `fg_session=true; path=/; max-age=86400`;
          window.location.href = "/dashboard";
          return;
        }
      } catch (sbErr) {
        console.warn("Supabase client connection error, checking local preset validation...", sbErr);
      }

      // 2. Local Preset Fallback for the 5 Main Accounts with password: ppgmagtim123
      if (isPreset) {
        if (password === "ppgmagtim123") {
          const sessionUser = {
            username: inputClean,
            full_name: isPreset.full_name,
            role: isPreset.role,
            email: isPreset.email,
          };
          localStorage.setItem("fg_user", JSON.stringify(sessionUser));
          document.cookie = `fg_session=true; path=/; max-age=86400`;
          window.location.href = "/dashboard";
          return;
        } else {
          setErrorMsg("Kata sandi salah. Gunakan password: ppgmagtim123");
          setLoading(false);
          return;
        }
      }

      // 3. Fallback if not preset and Supabase failed
      if (!supabaseSuccess) {
        setErrorMsg("Username atau kata sandi tidak ditemukan. Pastikan username dan password benar.");
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
                placeholder="misal: superadmin"
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
            {loading ? "Memproses..." : "Masuk ke Dashboard"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1">
          <div className="font-semibold text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Akun Utama Terdaftar:
          </div>
          <p className="text-[11px] text-slate-400">
            <code className="text-emerald-400 font-mono">superadmin</code>, <code className="text-emerald-400 font-mono">wakilketua</code>, <code className="text-emerald-400 font-mono">sekretaris</code>, <code className="text-emerald-400 font-mono">bendahara</code>, <code className="text-emerald-400 font-mono">timacara</code>
          </p>
          <p className="text-[10px] text-slate-500">Password default: <code className="text-slate-300">ppgmagtim123</code></p>
        </div>

        <div className="mt-6 text-center text-sm text-slate-400">
          Belum punya akun?{" "}
          <Link href="/register" className="text-emerald-400 hover:underline font-medium">
            Daftar Akun Baru
          </Link>
        </div>
      </div>
    </div>
  );
}
