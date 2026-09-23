"use client";

import { useState, useEffect } from "react";
import { FestivalEvent } from "@/lib/types";
import { Clock, Calendar, MapPin, ShieldCheck, Trophy, Lock } from "lucide-react";

interface EventCountdownTabProps {
  event: FestivalEvent;
  userRole?: string;
  userName?: string;
}

export function EventCountdownTab({ event, userRole = "Admin Kelompok", userName = "Pengguna" }: EventCountdownTabProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(event.start_date + "T" + (event.start_time || "08:00") + ":00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [event]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-tr from-amber-500 to-orange-400 rounded-2xl text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            <Lock className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Pendaftaran Ditutup
            </span>
            <h2 className="text-2xl font-black text-white mt-1">{event.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Portal Pendaftaran Kelompok & Desa Sementara Dikunci Panitia. Memantau Hitung Mundur Event.
            </p>
          </div>
        </div>

        <div className="text-right border-l border-slate-800 pl-6 hidden md:block">
          <span className="text-xs text-slate-400 block">Login Sebagai:</span>
          <span className="text-sm font-bold text-emerald-400 block">{userName}</span>
          <span className="text-[11px] text-slate-500 block">{userRole}</span>
        </div>
      </div>

      {/* Countdown Clock Display */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl text-center space-y-6">
        <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold uppercase tracking-widest text-xs">
          <Clock className="w-4 h-4" /> COUNTDOWN HARI-H EVENT
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
            <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono">{String(timeLeft.days).padStart(2, "0")}</div>
            <div className="text-xs font-semibold text-slate-400 uppercase mt-2">HARI</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
            <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono">{String(timeLeft.hours).padStart(2, "0")}</div>
            <div className="text-xs font-semibold text-slate-400 uppercase mt-2">JAM</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
            <div className="text-4xl sm:text-5xl font-extrabold text-white font-mono">{String(timeLeft.minutes).padStart(2, "0")}</div>
            <div className="text-xs font-semibold text-slate-400 uppercase mt-2">MENIT</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
            <div className="text-4xl sm:text-5xl font-extrabold text-emerald-400 font-mono">{String(timeLeft.seconds).padStart(2, "0")}</div>
            <div className="text-xs font-semibold text-slate-400 uppercase mt-2">DETIK</div>
          </div>
        </div>

        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Pada Hari-H pelaksanaan acara, fitur penilaian **Live Score** & **Hasil Juara Realtime** akan otomatis terbuka untuk dipantau oleh Admin Kelompok dan Admin Desa.
        </p>
      </div>

      {/* Event Details Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Calendar className="w-4 h-4 text-emerald-400" /> Tanggal Pelaksanaan
          </div>
          <p className="text-sm font-semibold text-white">{event.start_date} s/d {event.end_date}</p>
          <p className="text-xs text-slate-400">Pukul: {event.start_time || "08:00"} - {event.end_time || "17:00"} WIB</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <MapPin className="w-4 h-4 text-teal-400" /> Lokasi / Venue Utama
          </div>
          <p className="text-sm font-semibold text-white">{event.venue || "Gedung Serbaguna Utama"}</p>
          <p className="text-xs text-slate-400">Pastikan seluruh official kontingen hadir tepat waktu.</p>
        </div>
      </div>
    </div>
  );
}
