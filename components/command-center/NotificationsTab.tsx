"use client";

import { NotificationItem } from "@/lib/types";
import { Bell, CheckCircle2, AlertTriangle, Info, Clock, Check } from "lucide-react";

interface NotificationsTabProps {
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
}

export function NotificationsTab({ notifications, onMarkAllAsRead }: NotificationsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400" /> In-App Notification Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pemberitahuan real-time untuk status pendaftaran, persetujuan verifikasi, & pengumuman jadwal lomba.
          </p>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
        >
          <Check className="w-4 h-4 text-emerald-400" /> Tandai Semua Dibaca
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-5 flex items-start gap-4 transition-colors ${
              !n.is_read ? "bg-slate-950/80 font-medium" : "hover:bg-slate-950/40"
            }`}
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-white text-sm">{n.title}</h4>
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {new Date(n.created_at).toLocaleDateString("id-ID")}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
