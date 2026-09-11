"use client";

import { useState } from "react";
import { Division } from "@/lib/types";
import { Building, Plus, User, CheckSquare, Edit, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";

interface DivisionsTabProps {
  divisions: Division[];
  onAddDivision: (division: Division) => void;
  onUpdateDivision: (division: Division) => void;
  onDeleteDivision: (id: string) => void;
}

export function DivisionsTab({
  divisions,
  onAddDivision,
  onUpdateDivision,
  onDeleteDivision,
}: DivisionsTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState<Division | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coordinatorName, setCoordinatorName] = useState("");

  const handleOpenAdd = () => {
    setEditingDivision(null);
    setName("");
    setDescription("");
    setCoordinatorName("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (div: Division) => {
    setEditingDivision(div);
    setName(div.name);
    setDescription(div.description || "");
    setCoordinatorName(div.coordinator_name || "");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDivision) {
      onUpdateDivision({
        ...editingDivision,
        name,
        description,
        coordinator_name: coordinatorName,
      });
    } else {
      onAddDivision({
        id: `div-${Date.now()}`,
        event_id: "evt-fg2026",
        name,
        description,
        coordinator_name: coordinatorName,
        status: "ACTIVE",
        total_tasks: 0,
        completed_tasks: 0,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white">Struktur Divisi Panitia</h2>
          <p className="text-xs text-slate-400 mt-1">
            Pengelolaan 7 divisi operasional: Acara, Registrasi, Humas, Logistik, Konsumsi, Dokumentasi, & Keamanan.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" /> Tambah Divisi Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {divisions.map((div) => {
          const total = div.total_tasks || 0;
          const completed = div.completed_tasks || 0;
          const pct = total ? Math.round((completed / total) * 100) : 0;
          const isLagging = total > 0 && pct < 50;

          return (
            <div
              key={div.id}
              className={`bg-slate-900 border p-6 rounded-2xl space-y-4 flex flex-col justify-between transition-all ${
                isLagging
                  ? "border-amber-800/80 shadow-lg shadow-amber-950/20"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">Divisi {div.name}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {div.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(div)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit Divisi"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteDivision(div.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Hapus Divisi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-400 min-h-[32px]">{div.description || "Divisi operasional panitia"}</p>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-2 text-xs">
                  <User className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="text-slate-400">Koordinator:</span>
                  <span className="font-semibold text-white truncate">{div.coordinator_name || "Belum Ditunjuk"}</span>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="space-y-1.5 pt-3 border-t border-slate-800/80">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> Task Completion
                  </span>
                  <span className="font-mono font-bold text-white">{completed}/{total} ({pct}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all ${
                      pct >= 80 ? "bg-emerald-400" : pct >= 50 ? "bg-teal-400" : "bg-amber-400"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDivision ? "Edit Divisi" : "Tambah Divisi Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Nama Divisi</label>
            <input
              type="text"
              required
              placeholder="Acara / Logistik / Humas"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Nama Koordinator</label>
            <input
              type="text"
              placeholder="Ustadz H. Ahmad"
              value={coordinatorName}
              onChange={(e) => setCoordinatorName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Deskripsi Tugas Divisi</label>
            <textarea
              rows={3}
              placeholder="Tanggung jawab utama divisi ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm transition-colors shadow-md shadow-emerald-500/20"
            >
              Simpan Divisi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
