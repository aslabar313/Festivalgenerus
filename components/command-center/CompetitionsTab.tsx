"use client";

import { useState } from "react";
import { Competition, CompetitionStatus } from "@/lib/types";
import { Award, Plus, Edit, Trash2, BookOpen, Clock, MapPin, CheckCircle, Users } from "lucide-react";
import { Modal } from "@/components/ui/modal";

interface CompetitionsTabProps {
  competitions: Competition[];
  onAddCompetition: (competition: Competition) => void;
  onUpdateCompetition: (competition: Competition) => void;
  onDeleteCompetition: (id: string) => void;
}

export function CompetitionsTab({
  competitions,
  onAddCompetition,
  onUpdateCompetition,
  onDeleteCompetition,
}: CompetitionsTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJuknisModalOpen, setIsJuknisModalOpen] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Cabe Rawit");
  const [description, setDescription] = useState("");
  const [juknis, setJuknis] = useState("");
  const [quota, setQuota] = useState(50);
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [venue, setVenue] = useState("Panggung Utama Gedung A");
  const [status, setStatus] = useState<CompetitionStatus>("OPEN");

  const handleOpenAdd = () => {
    setEditingCompetition(null);
    setName("");
    setCategory("Cabe Rawit");
    setDescription("");
    setJuknis("1. Wajib hadir 15 menit sebelum tampil.\n2. Menggunakan pakaian muslim/muslimah rapi.\n3. Keputusan dewan juri mutlak.");
    setQuota(50);
    setDurationMinutes(15);
    setVenue("Panggung Utama Gedung A");
    setStatus("OPEN");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cmp: Competition) => {
    setEditingCompetition(cmp);
    setName(cmp.name);
    setCategory(cmp.category);
    setDescription(cmp.description || "");
    setJuknis(cmp.juknis || "");
    setQuota(cmp.quota);
    setDurationMinutes(cmp.duration_minutes);
    setVenue(cmp.venue);
    setStatus(cmp.status);
    setIsModalOpen(true);
  };

  const handleOpenJuknis = (cmp: Competition) => {
    setSelectedCompetition(cmp);
    setIsJuknisModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCompetition) {
      onUpdateCompetition({
        ...editingCompetition,
        name,
        category,
        description,
        juknis,
        quota: Number(quota),
        duration_minutes: Number(durationMinutes),
        venue,
        status,
      });
    } else {
      onAddCompetition({
        id: `cmp-${Date.now()}`,
        event_id: "evt-fg2026",
        name,
        category,
        description,
        juknis,
        quota: Number(quota),
        registered_count: 0,
        duration_minutes: Number(durationMinutes),
        venue,
        status,
      });
    }
    setIsModalOpen(false);
  };

  const getStatusBadge = (s: CompetitionStatus) => {
    switch (s) {
      case "OPEN":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black";
      case "READY":
        return "bg-teal-500/20 text-teal-300 border border-teal-500/40";
      case "RUNNING":
        return "bg-cyan-500 text-slate-950 font-black animate-pulse";
      case "CLOSED":
        return "bg-amber-500/20 text-amber-300 border border-amber-500/40";
      case "FINISHED":
      case "PUBLISHED":
        return "bg-purple-500/20 text-purple-300 border border-purple-500/40";
      default:
        return "bg-slate-800 text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white">Manajemen Cabang Lomba (Competitions)</h2>
          <p className="text-xs text-slate-400 mt-1">
            Pengaturan cabang perlombaan, kuota peserta, petunjuk teknis (Juknis), lokasi panggung, & status pendaftaran.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" /> Buat Cabang Lomba Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitions.map((cmp) => {
          const registered = cmp.registered_count || 0;
          const pct = Math.round((registered / cmp.quota) * 100);

          return (
            <div key={cmp.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">{cmp.category}</span>
                      <h3 className="font-bold text-white text-base leading-tight">{cmp.name}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(cmp)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit Competition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteCompetition(cmp.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Hapus Competition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${getStatusBadge(cmp.status)}`}>
                    {cmp.status}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" /> {cmp.duration_minutes} Menit
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">{cmp.description || "Perlombaan tingkat daerah"}</p>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-300 font-medium">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-teal-400" /> Kuota Peserta:</span>
                    <span className="font-mono font-bold text-white">{registered} / {cmp.quota} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${pct >= 100 ? "bg-rose-500" : pct >= 80 ? "bg-amber-400" : "bg-emerald-400"}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{cmp.venue}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                <button
                  onClick={() => handleOpenJuknis(cmp)}
                  className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-emerald-400 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Lihat / Edit Juknis
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add/Edit Competition */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCompetition ? "Edit Cabang Lomba" : "Buat Cabang Lomba Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Nama Cabang Lomba</label>
            <input
              type="text"
              required
              placeholder="Musabaqah Tahfidz Al-Qur'an Juz 30"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Kategori Usia</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Cabe Rawit">Cabe Rawit (SD)</option>
                <option value="Pra-Remaja">Pra-Remaja (SMP)</option>
                <option value="Remaja">Remaja (SMA/Umum)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Status Lomba</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CompetitionStatus)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="OPEN">OPEN (Pendaftaran Buka)</option>
                <option value="CLOSED">CLOSED (Tutup)</option>
                <option value="READY">READY (Siap Tampil)</option>
                <option value="RUNNING">RUNNING (Berlangsung)</option>
                <option value="FINISHED">FINISHED</option>
                <option value="PUBLISHED">PUBLISHED</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Kuota Peserta</label>
              <input
                type="number"
                min={1}
                required
                value={quota}
                onChange={(e) => setQuota(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Durasi Tampil (Menit)</label>
              <input
                type="number"
                min={1}
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Lokasi / Panggung Lomba</label>
            <input
              type="text"
              required
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Petunjuk Teknis (Juknis & Rules)</label>
            <textarea
              rows={3}
              placeholder="Aturan lomba dan kriteria penilaian juri..."
              value={juknis}
              onChange={(e) => setJuknis(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm transition-colors shadow-md shadow-emerald-500/20"
            >
              Simpan Cabang Lomba
            </button>
          </div>
        </form>
      </Modal>

      {/* Juknis Viewer Modal */}
      {selectedCompetition && (
        <Modal
          isOpen={isJuknisModalOpen}
          onClose={() => setIsJuknisModalOpen(false)}
          title={`Juknis: ${selectedCompetition.name}`}
        >
          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">PETUNJUK TEKNIS RESMI</span>
              <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                {selectedCompetition.juknis || "Belum ada petunjuk teknis tertulis."}
              </pre>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsJuknisModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
