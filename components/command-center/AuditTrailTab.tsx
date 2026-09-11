"use client";

import { AuditTrailItem } from "@/lib/types";
import { FileText, Clock, User, ShieldCheck, Tag } from "lucide-react";

interface AuditTrailTabProps {
  auditItems: AuditTrailItem[];
}

export function AuditTrailTab({ auditItems }: AuditTrailTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" /> System Audit Trail (Single Source of Truth)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Jejak audit otomatis mencatat seluruh peristiwa penting dengan format standar: <b>WHO DID WHAT WHEN ON WHAT</b>.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">WHO (Pelaku Action)</th>
                <th className="py-3.5 px-4">DID WHAT (Aksi)</th>
                <th className="py-3.5 px-4">ON WHAT (Target Entitas)</th>
                <th className="py-3.5 px-4">WHEN (Waktu)</th>
                <th className="py-3.5 px-4">Catatan Rinci</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {auditItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-950/50">
                  <td className="py-3.5 px-4 font-bold text-emerald-400 font-sans">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" /> {item.who}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      {item.did_what}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-sans font-semibold text-white">
                    {item.on_what}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" /> {item.when}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-sans text-slate-400 text-[11px]">
                    {item.details || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
