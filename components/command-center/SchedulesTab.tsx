"use client";

import { useState } from "react";
import { ScheduleItem, Venue, Competition, CompetitionJudge, Registration, ScheduleConflict } from "@/lib/types";
import { detectScheduleConflicts } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock, MapPin, Plus, AlertCircle, ShieldAlert, CheckCircle2, Building, Trash2, Edit } from "lucide-react";
import { Modal } from "@/components/ui/modal";

interface SchedulesTabProps {
  schedules: ScheduleItem[];
  venues: Venue[];
  competitions: Competition[];
  competitionJudges: CompetitionJudge[];
  registrations: Registration[];
  onAddSchedule: (sch: ScheduleItem) => void;
  onDeleteSchedule: (id: string) => void;
  onAddVenue: (venue: Venue) => void;
}

export function SchedulesTab({
  schedules,
  venues,
  competitions,
  competitionJudges,
  registrations,
  onAddSchedule,
  onDeleteSchedule,
  onAddVenue,
}: SchedulesTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<"schedules" | "venues">("schedules");
  const [isSchModalOpen, setIsSchModalOpen] = useState(false);
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);

  // Schedule Form State
  const [competitionId, setCompetitionId] = useState(competitions[0]?.id || "");
  const [venueId, setVenueId] = useState(venues[0]?.id || "");
  const [startTime, setStartTime] = useState("2026-12-11T08:00");
  const [endTime, setEndTime] = useState("2026-12-11T10:00");

  // Venue Form State
  const [venueName, setVenueName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState(200);

  const [formErrorMsg, setFormErrorMsg] = useState<string | null>(null);

  // DETECT CONFLICTS AUTOMATICALLY
  const conflicts: ScheduleConflict[] = detectScheduleConflicts(schedules, competitionJudges, registrations);

  const handleAddScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrorMsg(null);

    const comp = competitions.find(c => c.id === competitionId);
    const vn = venues.find(v => v.id === venueId);

    const newSch: ScheduleItem = {
      id: `sch-${Date.now()}`,
      competition_id: competitionId,
      competition_name: comp?.name,
      venue_id: venueId,
      venue_name: vn?.name,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      status: "SCHEDULED",
    };

    // Test conflict BEFORE adding
    const testList = [...schedules, newSch];
    const testConflicts = detectScheduleConflicts(testList, competitionJudges, registrations);

    if (testConflicts.length > conflicts.length) {
      setFormErrorMsg(`Ditolak: Jadwal yang Anda buat menyebabkan bentrok (${testConflicts[testConflicts.length - 1].title}). Harap ganti jam atau gedung.`);
      return;
    }

    onAddSchedule(newSch);
    setIsSchModalOpen(false);
  };

  const handleAddVenueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVenue({
      id: `vn-${Date.now()}`,
      name: venueName,
      location,
      capacity: Number(capacity),
      status: "AVAILABLE",
    });
    setIsVenueModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" /> Scheduling & Conflict Detection Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manajemen alokasi panggung/gedung, jam waktu tampil, & proteksi otomatis bentrok (Venue, Juri, Peserta).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setFormErrorMsg(null); setIsSchModalOpen(true); }}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" /> Susun Jadwal Lomba
          </button>
          <button
            onClick={() => setIsVenueModalOpen(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-2 transition-all"
          >
            <Building className="w-4 h-4" /> Tambah Venue
          </button>
        </div>
      </div>

      {/* CONFLICT DETECTION WARNING PANEL */}
      {conflicts.length > 0 ? (
        <div className="p-5 bg-rose-950/50 border-2 border-rose-600 rounded-2xl space-y-3 animate-fade-in shadow-xl shadow-rose-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-black text-sm uppercase tracking-wider">
              <ShieldAlert className="w-5 h-5 animate-pulse" /> 🔴 CRITICAL: Terdeteksi {conflicts.length} Konflik Jadwal (Conflict Engine Alert)
            </div>
            <span className="px-2.5 py-0.5 rounded bg-rose-500 text-slate-950 font-black text-[10px]">
              BLOCKING VALIDATION ACTIVE
            </span>
          </div>

          <div className="space-y-2">
            {conflicts.map((cf) => (
              <div key={cf.id} className="bg-slate-950 p-3 rounded-xl border border-rose-800/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-white block">{cf.title}</span>
                  <p className="text-slate-300 mt-0.5">{cf.details}</p>
                </div>
                <span className="px-2 py-1 bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold rounded shrink-0 self-start sm:self-auto">
                  {new Date(cf.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} WIB
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>0 Konflik! Seluruh jadwal panggung, dewan juri, dan peserta aman tanpa tumpang tindih.</span>
        </div>
      )}

      {/* Schedule Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedules.map((sch) => (
          <div key={sch.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {sch.status}
                </span>
                <button
                  onClick={() => onDeleteSchedule(sch.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="font-bold text-white text-base leading-tight">{sch.competition_name}</h3>
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{sch.venue_name}</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-400" /> Jam Tampil:</span>
                  <span className="font-bold text-emerald-400">
                    {new Date(sch.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(sch.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} WIB
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-sans">
                  {new Date(sch.start_time).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Schedule */}
      <Modal
        isOpen={isSchModalOpen}
        onClose={() => setIsSchModalOpen(false)}
        title="Susun Jadwal Lomba Baru"
      >
        <form onSubmit={handleAddScheduleSubmit} className="space-y-4">
          {formErrorMsg && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-lg text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formErrorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Pilih Cabang Lomba</label>
            <select
              value={competitionId}
              onChange={(e) => setCompetitionId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              {competitions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Pilih Gedung / Venue</label>
            <select
              value={venueId}
              onChange={(e) => setVenueId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              {venues.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.location})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Waktu Mulai</label>
              <input
                type="datetime-local"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Waktu Selesai</label>
              <input
                type="datetime-local"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm transition-colors shadow-md shadow-emerald-500/20"
            >
              Simpan & Validasi Jadwal
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Add Venue */}
      <Modal
        isOpen={isVenueModalOpen}
        onClose={() => setIsVenueModalOpen(false)}
        title="Tambah Venue / Gedung Panggung Baru"
      >
        <form onSubmit={handleAddVenueSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Nama Panggung / Venue</label>
            <input
              type="text"
              required
              placeholder="Panggung Utama Gedung A"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Lokasi Gedung</label>
            <input
              type="text"
              required
              placeholder="Gedung Utama Lt. 1"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Kapasitas Penonton / Peserta</label>
            <input
              type="number"
              min={10}
              required
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm transition-colors shadow-md shadow-emerald-500/20"
            >
              Simpan Venue
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
