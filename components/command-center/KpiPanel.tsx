"use client";

import { CheckSquare, Users, Trophy, DollarSign, Activity } from "lucide-react";
import { FestivalEvent, Task } from "@/lib/types";

interface KpiPanelProps {
  event: FestivalEvent;
  readinessPercentage: number;
  tasks: Task[];
  participantCount?: number;
  competitionCount?: number;
}

export function KpiPanel({
  event,
  readinessPercentage,
  tasks,
  participantCount = 200,
  competitionCount = 8,
}: KpiPanelProps) {
  const completedTasks = tasks.filter(t => t.status === "DONE").length;
  const totalTasks = tasks.length;
  const taskPct = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {/* KPI 1: EVENT READINESS */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-emerald-500/50 transition-colors">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-bold uppercase tracking-wider">EVENT READINESS</span>
          <Activity className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="mt-4">
          <div className="text-3xl font-extrabold text-white font-mono">{readinessPercentage}%</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            Status Terhitung Otomatis
          </div>
        </div>
      </div>

      {/* KPI 2: PARTICIPANTS */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-teal-500/50 transition-colors">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-bold uppercase tracking-wider">PARTICIPANTS</span>
          <Users className="w-4 h-4 text-teal-400" />
        </div>
        <div className="mt-4">
          <div className="text-3xl font-extrabold text-white font-mono">{participantCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Terdaftar Dari 12 Desa</div>
        </div>
      </div>

      {/* KPI 3: COMPETITIONS */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-cyan-500/50 transition-colors">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-bold uppercase tracking-wider">COMPETITIONS</span>
          <Trophy className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="mt-4">
          <div className="text-3xl font-extrabold text-white font-mono">{competitionCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Cabang Lomba Aktif</div>
        </div>
      </div>

      {/* KPI 4: TASKS */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-emerald-500/50 transition-colors">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-bold uppercase tracking-wider">TASKS ENGINE</span>
          <CheckSquare className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="mt-4">
          <div className="text-3xl font-extrabold text-white font-mono">
            {completedTasks}<span className="text-slate-500 text-lg font-normal">/{totalTasks}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{taskPct}% Selesai Sesuai Schedule</div>
        </div>
      </div>

      {/* KPI 5: BUDGET */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-amber-500/50 transition-colors col-span-2 sm:col-span-1">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-bold uppercase tracking-wider">BUDGET EVENT</span>
          <DollarSign className="w-4 h-4 text-amber-400" />
        </div>
        <div className="mt-4">
          <div className="text-2xl font-extrabold text-white font-mono truncate">
            Rp {(event.budget || 0).toLocaleString("id-ID")}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Anggaran Disetujui Panitia</div>
        </div>
      </div>
    </div>
  );
}
