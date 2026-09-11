"use client";

import { ActionNeededItem } from "@/lib/types";
import { AlertCircle, ArrowRight, ShieldAlert, Clock, AlertTriangle, Building } from "lucide-react";

interface ActionNeededPanelProps {
  items: ActionNeededItem[];
  onNavigateTab: (tab: string, targetId?: string) => void;
}

export function ActionNeededPanel({ items, onNavigateTab }: ActionNeededPanelProps) {
  if (items.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <h3 className="font-bold text-white uppercase tracking-wider text-sm">
            WHAT NEEDS MY ATTENTION?
          </h3>
        </div>
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Semua aman! Tidak ada tugas overdue atau risiko kritis yang membutuhkan tindakan darurat saat ini.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <h3 className="font-bold text-white uppercase tracking-wider text-sm flex items-center gap-2">
            WHAT NEEDS MY ATTENTION?
          </h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-extrabold font-mono">
          {items.length} Action Needed
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const isCritical = item.severity === "CRITICAL";

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                isCritical
                  ? "bg-rose-950/30 border-rose-800/80 hover:bg-rose-950/50"
                  : "bg-amber-950/30 border-amber-800/80 hover:bg-amber-950/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {item.type === "critical_risk" ? (
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                  ) : item.type === "overdue_task" ? (
                    <Clock className="w-5 h-5 text-rose-400" />
                  ) : item.type === "division_lagging" ? (
                    <Building className="w-5 h-5 text-amber-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">{item.title}</h4>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        isCritical ? "bg-rose-500 text-slate-950" : "bg-amber-400 text-slate-950"
                      }`}
                    >
                      {item.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{item.subtitle}</p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab(item.target_tab, item.target_id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-all ${
                  isCritical
                    ? "bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-md shadow-rose-500/20"
                    : "bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/20"
                }`}
              >
                VIEW ACTION <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
