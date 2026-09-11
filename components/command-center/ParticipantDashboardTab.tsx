"use client";

import { Participant, Registration, Competition } from "@/lib/types";
import { User, Award, Calendar, Clock, CheckCircle2, FileText, MapPin } from "lucide-react";

interface ParticipantDashboardTabProps {
  currentParticipant?: Participant;
  registrations: Registration[];
  competitions: Competition[];
}

export function ParticipantDashboardTab({
  currentParticipant = {
    id: "part-101",
    name: "Muhammad Faiz",
    participant_type: "INDIVIDUAL",
    category: "Cabe Rawit",
    school: "TPQ Al-Fattah",
    group_name: "Desa Kebon Jeruk",
    phone: "081234111222",
    email: "faiz@gmail.com",
    status: "APPROVED",
  },
  registrations,
  competitions,
}: ParticipantDashboardTabProps) {
  const myRegistrations = registrations.filter(r => r.participant_id === currentParticipant.id);

  return (
    <div className="space-y-6">
      {/* Participant Personal Profile Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold text-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            {currentParticipant.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{currentParticipant.name}</h2>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {currentParticipant.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Utusan: <span className="text-emerald-400 font-semibold">{currentParticipant.group_name}</span> • Kategori: <span className="text-white">{currentParticipant.category}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs text-slate-300">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Asal TPQ / Sekolah:</span>
            <span className="font-semibold text-white">{currentParticipant.school || "-"}</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Kontak WhatsApp:</span>
            <span className="font-semibold text-white">{currentParticipant.phone || "-"}</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Email Terdaftar:</span>
            <span className="font-semibold text-white">{currentParticipant.email || "-"}</span>
          </div>
        </div>
      </div>

      {/* Registrations & Schedule List */}
      <div className="space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-400" /> Cabang Lomba Diikuti ({myRegistrations.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myRegistrations.map((r) => {
            const cmp = competitions.find(c => c.id === r.competition_id);

            return (
              <div key={r.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">NO. REGISTRASI: {r.registration_number}</span>
                    <h4 className="font-bold text-white text-lg mt-0.5">{r.competition_name}</h4>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    r.status === "APPROVED" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-amber-500/20 text-amber-300"
                  }`}>
                    {r.status}
                  </span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Lokasi: <span className="font-semibold text-white">{cmp?.venue || "Panggung Utama"}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Jadwal Tampil: <span className="font-semibold text-white">11 Desember 2026 (09:00 WIB)</span></span>
                  </div>
                </div>

                {cmp?.juknis && (
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> Petunjuk Teknis Lomba:
                    </span>
                    <p className="text-slate-400 line-clamp-3 leading-relaxed">{cmp.juknis}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
