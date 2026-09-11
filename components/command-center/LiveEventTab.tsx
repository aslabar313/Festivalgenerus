"use client";

import { useState } from "react";
import { Participant, Competition, ScheduleItem, IncidentItem, CompetitionJudge } from "@/lib/types";
import { Flame, CheckCircle2, Clock, MapPin, AlertTriangle, ShieldAlert, User, Award, RefreshCw, UserCheck } from "lucide-react";

interface LiveEventTabProps {
  participants: Participant[];
  competitions: Competition[];
  schedules: ScheduleItem[];
  incidents: IncidentItem[];
  judges: CompetitionJudge[];
  onCheckInParticipant: (participantId: string) => void;
}

export function LiveEventTab({
  participants,
  competitions,
  schedules,
  incidents,
  judges,
  onCheckInParticipant,
}: LiveEventTabProps) {
  const [activeCheckInSearch, setActiveCheckInSearch] = useState("");

  const checkedInCount = participants.filter(p => p.status === "CHECK_IN" || p.status === "COMPETITION" || p.status === "RESULT").length;
  const totalApproved = participants.filter(p => p.status === "APPROVED" || p.status === "CHECK_IN" || p.status === "COMPETITION" || p.status === "RESULT").length || 450;

  const currentRunComp = competitions.find(c => c.status === "RUNNING") || competitions[0];
  const nextComp = competitions.find(c => c.status === "READY") || competitions[1];
  const openIncidents = incidents.filter(i => i.status === "OPEN" || i.status === "IN_PROGRESS");

  return (
    <div className="space-y-6">
      {/* Live Operational Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-2 border-emerald-500 p-6 rounded-2xl shadow-2xl relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500 rounded-2xl text-slate-950 font-black shadow-lg shadow-emerald-500/30 animate-pulse">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">OPERATIONAL MODE</span>
              <h2 className="text-2xl font-black text-white">LIVE EVENT COMMAND CENTER (HARI-H)</h2>
            </div>
          </div>

          {/* Quick Counter */}
          <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3 font-mono">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">STATUS CHECK-IN HARI-H</span>
              <span className="text-xl font-extrabold text-white">{checkedInCount} / {totalApproved} CHECKED IN</span>
            </div>
          </div>
        </div>

        {/* WHAT IS HAPPENING NOW? Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Current Running Event */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-emerald-500/40 space-y-2">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> CURRENT RUNNING
            </span>
            <h3 className="font-bold text-white text-base">{currentRunComp?.name}</h3>
            <div className="text-xs text-slate-300 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {currentRunComp?.venue}
            </div>
          </div>

          {/* Next Up Event */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest flex items-center gap-1">
              <Clock className="w-3 h-3 text-teal-400" /> NEXT UP (NEXT 30 MINS)
            </span>
            <h3 className="font-bold text-white text-base">{nextComp?.name}</h3>
            <div className="text-xs text-slate-300 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {nextComp?.venue} (10:30 WIB)
            </div>
          </div>

          {/* Incidents & Alerts Quick Widget */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-rose-400" /> ACTIVE ALERTS & INCIDENTS
            </span>
            {openIncidents.length > 0 ? (
              <div className="text-xs font-bold text-rose-300 truncate">
                ⚠️ {openIncidents[0].title}
              </div>
            ) : (
              <div className="text-xs text-emerald-400 font-semibold">
                ✓ 0 Insiden Aktif
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Check-in Counter Desk */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-base">Loket Check-in & Kehadiran Peserta Hari-H</h3>
            <p className="text-xs text-slate-400">Verifikasi fisik kehadiran peserta & penyerahan nomor dada</p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Cari nama peserta check-in..."
              value={activeCheckInSearch}
              onChange={(e) => setActiveCheckInSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {participants
            .filter(p => p.name.toLowerCase().includes(activeCheckInSearch.toLowerCase()))
            .slice(0, 6)
            .map((p) => {
              const isCheckedIn = p.status === "CHECK_IN" || p.status === "COMPETITION" || p.status === "RESULT";

              return (
                <div key={p.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-white text-sm">{p.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{p.group_name} • {p.category}</div>
                  </div>

                  {isCheckedIn ? (
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-black uppercase">
                      ✓ CHECKED IN
                    </span>
                  ) : (
                    <button
                      onClick={() => onCheckInParticipant(p.id)}
                      className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-lg text-[10px] shadow-md shadow-emerald-500/20"
                    >
                      DO CHECK-IN
                    </button>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
