"use client";

import { FestivalEvent } from "@/lib/types";
import { getDaysRemaining, formatDate } from "@/lib/utils";
import { Calendar, MapPin, DollarSign, Clock, Flame } from "lucide-react";

interface EventContextBarProps {
  event: FestivalEvent;
}

export function EventContextBar({ event }: EventContextBarProps) {
  const daysLeft = getDaysRemaining(event.start_date);
  const isOverdueEvent = daysLeft < 0;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left Info: Event Title & Date */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              OFFICIAL EVENT
            </span>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Start: {event.start_time || "08:00"} WIB
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-1.5 font-medium text-slate-200">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>{formatDate(event.start_date)} - {formatDate(event.end_date)}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>{event.venue}</span>
            </div>
            {event.budget ? (
              <>
                <span>•</span>
                <div className="flex items-center gap-1 text-slate-300 font-mono">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span>Rp {event.budget.toLocaleString("id-ID")}</span>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* Right Info: Countdown Badge */}
        <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 p-4 rounded-xl self-start lg:self-auto">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              COUNTDOWN EVENT
            </div>
            <div className="text-2xl font-black text-white font-mono flex items-baseline gap-1">
              {isOverdueEvent ? (
                <span className="text-slate-400">SELESAI</span>
              ) : (
                <>
                  <span className="text-emerald-400">H-{daysLeft}</span>
                  <span className="text-xs font-normal text-slate-400">HARI</span>
                </>
              )}
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              11 Desember 2026 Target
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
