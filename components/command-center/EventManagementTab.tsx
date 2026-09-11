"use client";

import { useState } from "react";
import { FestivalEvent } from "@/lib/types";
import { Calendar, MapPin, DollarSign, Clock, Edit, Plus, CheckCircle } from "lucide-react";
import { Modal } from "@/components/ui/modal";

interface EventManagementTabProps {
  currentEvent: FestivalEvent;
  events: FestivalEvent[];
  onSaveEvent: (updated: FestivalEvent) => void;
  onCreateEvent: (newEvent: FestivalEvent) => void;
}

export function EventManagementTab({
  currentEvent,
  events,
  onSaveEvent,
  onCreateEvent,
}: EventManagementTabProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState(currentEvent.title);
  const [description, setDescription] = useState(currentEvent.description || "");
  const [startDate, setStartDate] = useState(currentEvent.start_date);
  const [endDate, setEndDate] = useState(currentEvent.end_date);
  const [startTime, setStartTime] = useState(currentEvent.start_time || "08:00");
  const [endTime, setEndTime] = useState(currentEvent.end_time || "17:00");
  const [venue, setVenue] = useState(currentEvent.venue);
  const [budget, setBudget] = useState(currentEvent.budget || 0);
  const [status, setStatus] = useState(currentEvent.status);

  // New Event Form State
  const [newTitle, setNewTitle] = useState("");
  const [newVenue, setNewVenue] = useState("Gedung Serbaguna Utama");
  const [newStartDate, setNewStartDate] = useState("2026-12-11");
  const [newEndDate, setNewEndDate] = useState("2026-12-13");

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveEvent({
      ...currentEvent,
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      start_time: startTime,
      end_time: endTime,
      venue,
      budget: Number(budget),
      status: status as any,
    });
    setIsEditModalOpen(false);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: FestivalEvent = {
      id: `evt-${Date.now()}`,
      title: newTitle || "Event Generus Baru",
      start_date: newStartDate,
      end_date: newEndDate,
      venue: newVenue,
      status: "open",
      budget: 25000000,
    };
    onCreateEvent(created);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white">Event Context & Configuration</h2>
          <p className="text-xs text-slate-400 mt-1">
            Pengaturan tanggal pelaksanaan, lokasi gedung, waktu jam, dan anggaran event.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
          >
            <Edit className="w-4 h-4" /> Edit Event Config
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Buat Event Baru
          </button>
        </div>
      </div>

      {/* Active Event Specs Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Aktif & Configured</span>
            <h3 className="text-2xl font-black text-white">{currentEvent.title}</h3>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-lg uppercase">
            {currentEvent.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" /> Tanggal Pelaksanaan
            </div>
            <div className="text-sm font-bold text-white">{currentEvent.start_date} s/d {currentEvent.end_date}</div>
            <div className="text-[11px] text-slate-500">Default Target: 11 Desember 2026</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-400" /> Jam Waktu Operational
            </div>
            <div className="text-sm font-bold text-white">{currentEvent.start_time || "08:00"} - {currentEvent.end_time || "17:00"} WIB</div>
            <div className="text-[11px] text-slate-500">Standar Waktu Lomba</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-cyan-400" /> Lokasi / Venue
            </div>
            <div className="text-sm font-bold text-white">{currentEvent.venue}</div>
            <div className="text-[11px] text-slate-500">Tempat Utama</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-amber-400" /> Budget Anggaran
            </div>
            <div className="text-sm font-bold text-emerald-400 font-mono">
              Rp {(currentEvent.budget || 0).toLocaleString("id-ID")}
            </div>
            <div className="text-[11px] text-slate-500">Total Alokasi Panitia</div>
          </div>
        </div>

        {currentEvent.description && (
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
            <span className="font-bold text-white block mb-1">Deskripsi & Catatan Event:</span>
            {currentEvent.description}
          </div>
        )}
      </div>

      {/* Modal Edit Event */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Configuration Event">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Judul Event</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Tanggal Mulai</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Tanggal Selesai</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Jam Mulai</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Jam Selesai</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Lokasi / Venue</label>
            <input
              type="text"
              required
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Total Budget (Rp)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Deskripsi</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm flex items-center gap-2 shadow-md shadow-emerald-500/20"
            >
              <CheckCircle className="w-4 h-4" /> Simpan Perubahan
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Create Event */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Buat Event Baru">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Nama Event</label>
            <input
              type="text"
              required
              placeholder="Festival Generus 2027"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Tanggal Mulai</label>
              <input
                type="date"
                required
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Tanggal Selesai</label>
              <input
                type="date"
                required
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Lokasi Gedung</label>
            <input
              type="text"
              required
              value={newVenue}
              onChange={(e) => setNewVenue(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm flex items-center gap-2 shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" /> Buat & Aktifkan Event
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
