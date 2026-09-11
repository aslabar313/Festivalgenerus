"use client";

import { EventHealthDetails } from "@/lib/types";
import { ShieldCheck, AlertTriangle, XCircle, CheckCircle2, Info } from "lucide-react";

interface EventHealthBannerProps {
  health: EventHealthDetails;
}

export function EventHealthBanner({ health }: EventHealthBannerProps) {
  const isHealthy = health.status === "HEALTHY";
  const isAttention = health.status === "ATTENTION REQUIRED";
  const isCritical = health.status === "CRITICAL";

  return (
    <div
      className={`border rounded-2xl p-6 shadow-xl transition-all ${
        isCritical
          ? "bg-rose-950/40 border-rose-800/80 text-rose-100"
          : isAttention
          ? "bg-amber-950/40 border-amber-800/80 text-amber-100"
          : "bg-emerald-950/40 border-emerald-800/80 text-emerald-100"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Status Badge & Summary */}
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-2xl shrink-0 ${
              isCritical
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                : isAttention
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
            }`}
          >
            {isCritical ? (
              <XCircle className="w-8 h-8" />
            ) : isAttention ? (
              <AlertTriangle className="w-8 h-8" />
            ) : (
              <ShieldCheck className="w-8 h-8" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                EVENT HEALTH STATUS
              </span>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  isCritical
                    ? "bg-rose-500 text-slate-950 shadow-md shadow-rose-500/30"
                    : isAttention
                    ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30"
                    : "bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/30"
                }`}
              >
                {health.status}
              </span>
            </div>

            <h2 className="text-xl font-black text-white mt-1">
              {isCritical
                ? "Perhatian Kritis! Membutuhkan Tindakan Ketua Segera"
                : isAttention
                ? "Perlu Perhatian! Terdapat Tugas Overdue / Risiko Aktif"
                : "Kondisi Event Sehat & Berjalan Sesuai Rencana"}
            </h2>

            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Health indicator ditentukan berdasarkan kalkulasi otomatis terhadap status tugas overdue, level risiko kritis, dan kesiapan tiap divisi.
            </p>
          </div>
        </div>

        {/* Right Score Gauge */}
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex items-center gap-4 shrink-0 self-start md:self-auto">
          <div className="relative w-16 h-16 flex items-center justify-center font-mono font-black text-xl text-white">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={isCritical ? "text-rose-500" : isAttention ? "text-amber-400" : "text-emerald-400"}
                strokeDasharray={`${health.readiness_percentage}, 100`}
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-sm font-bold">{health.readiness_percentage}%</span>
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">EVENT READINESS</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Kesiapan Keseluruhan Panitia</div>
          </div>
        </div>
      </div>

      {/* Breakdown WHY Reasons */}
      <div className="mt-6 pt-4 border-t border-slate-800/80">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-emerald-400" /> Kriteria Diagnosa Kesiapan (Why?):
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {health.reasons.map((r, idx) => (
            <div
              key={idx}
              className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                r.status === "critical"
                  ? "bg-rose-950/60 border-rose-800/80 text-rose-300"
                  : r.status === "warning"
                  ? "bg-amber-950/60 border-amber-800/80 text-amber-300"
                  : "bg-slate-900 border-slate-800 text-slate-200"
              }`}
            >
              {r.status === "critical" ? (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : r.status === "warning" ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span className="truncate">{r.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
