"use client";

import { FileText, Clock, User, ShieldCheck } from "lucide-react";

export function AuditLogTab() {
  const auditLogs = [
    { id: "log-1", action: "CREATE_TASK", entity: "Tasks Engine", details: "Menambahkan Task Kritis: Sewa Sound System & Genset 10KVA", user: "H. Zaki (Ketua)", timestamp: "2026-09-11 21:40:12" },
    { id: "log-2", action: "UPDATE_EVENT", entity: "Event Configuration", details: "Memperbarui venue ke Gedung Serbaguna Utama", user: "Rahmat (Sekretaris)", timestamp: "2026-09-11 20:15:00" },
    { id: "log-3", action: "ADD_COMMITTEE", entity: "Committee", details: "Menambahkan Ustadz H. Ahmad sebagai Koordinator Divisi Acara", user: "H. Zaki (Ketua)", timestamp: "2026-09-10 14:22:10" },
    { id: "log-4", action: "UPDATE_RISK", entity: "Risk Matrix", details: "Menambahkan Rencana Mitigasi untuk Risiko Listrik Genset", user: "Budi Santoso (Logistik)", timestamp: "2026-09-10 11:05:44" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" /> Audit Log System
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Catatan riwayat perubahan data, aksi panitia, dan jejak aktivitas aplikasi SaaS.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="divide-y divide-slate-800">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-slate-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {log.action}
                  </span>
                  <span className="text-slate-400">[{log.entity}]</span>
                </div>
                <p className="text-slate-200 font-medium">{log.details}</p>
              </div>

              <div className="flex items-center gap-4 text-slate-400 shrink-0">
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-teal-400" /> {log.user}</span>
                <span className="flex items-center gap-1 font-mono"><Clock className="w-3.5 h-3.5 text-slate-500" /> {log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
