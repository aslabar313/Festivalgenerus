"use client";

import { useState } from "react";
import { Risk, RiskSeverity, CommitteeMember } from "@/lib/types";
import { AlertTriangle, Plus, ShieldAlert, User, Edit, Trash2, CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";

interface RisksTabProps {
  risks: Risk[];
  committee: CommitteeMember[];
  onAddRisk: (risk: Risk) => void;
  onUpdateRisk: (risk: Risk) => void;
  onDeleteRisk: (id: string) => void;
}

export function RisksTab({
  risks,
  committee,
  onAddRisk,
  onUpdateRisk,
  onDeleteRisk,
}: RisksTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [probability, setProbability] = useState<number>(3);
  const [impact, setImpact] = useState<number>(4);
  const [ownerName, setOwnerName] = useState("");
  const [mitigation, setMitigation] = useState("");
  const [status, setStatus] = useState<Risk["status"]>("IDENTIFIED");

  const calculateSeverity = (score: number): RiskSeverity => {
    if (score >= 16) return "CRITICAL";
    if (score >= 10) return "HIGH";
    if (score >= 5) return "MEDIUM";
    return "LOW";
  };

  const handleOpenAdd = () => {
    setEditingRisk(null);
    setTitle("");
    setDescription("");
    setProbability(3);
    setImpact(4);
    setOwnerName("");
    setMitigation("");
    setStatus("IDENTIFIED");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (r: Risk) => {
    setEditingRisk(r);
    setTitle(r.title);
    setDescription(r.description || "");
    setProbability(r.probability);
    setImpact(r.impact);
    setOwnerName(r.owner_name || "");
    setMitigation(r.mitigation || "");
    setStatus(r.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const risk_score = probability * impact;
    const severity = calculateSeverity(risk_score);

    if (editingRisk) {
      onUpdateRisk({
        ...editingRisk,
        title,
        description,
        probability,
        impact,
        risk_score,
        severity,
        owner_name: ownerName,
        mitigation,
        status,
      });
    } else {
      onAddRisk({
        id: `rsk-${Date.now()}`,
        event_id: "evt-fg2026",
        title,
        description,
        probability,
        impact,
        risk_score,
        severity,
        owner_name: ownerName,
        mitigation,
        status,
      });
    }
    setIsModalOpen(false);
  };

  const getSeverityBadge = (sev: RiskSeverity) => {
    switch (sev) {
      case "CRITICAL":
        return "bg-rose-500 text-slate-950 font-black shadow-md shadow-rose-500/30 animate-pulse";
      case "HIGH":
        return "bg-amber-400 text-slate-950 font-bold";
      case "MEDIUM":
        return "bg-teal-500/20 text-teal-300 border border-teal-500/40";
      default:
        return "bg-slate-800 text-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white">Risk Matrix & Mitigation</h2>
          <p className="text-xs text-slate-400 mt-1">
            Analisis potensi risiko operasional (Risk Score = Probabilitas × Dampak), penunjukan Risk Owner, & strategi mitigasi.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" /> Identifikasi Risiko Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {risks.map((r) => {
          const isCritical = r.severity === "CRITICAL";

          return (
            <div
              key={r.id}
              className={`bg-slate-900 border p-6 rounded-2xl space-y-4 flex flex-col justify-between transition-all ${
                isCritical
                  ? "border-rose-800/80 bg-rose-950/20"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded text-[10px] uppercase tracking-wider ${getSeverityBadge(r.severity)}`}>
                      {r.severity} (Score {r.risk_score})
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-950 text-slate-400 border border-slate-800 uppercase">
                      {r.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(r)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit Risk"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteRisk(r.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Hapus Risk"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                    {r.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{r.description || "Tidak ada rincian risiko"}</p>
                </div>

                {/* Score Formula Visual */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-center text-xs font-mono">
                  <div>
                    <div className="text-[10px] text-slate-500">PROBABILITY</div>
                    <div className="font-bold text-white">{r.probability} / 5</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">IMPACT</div>
                    <div className="font-bold text-white">{r.impact} / 5</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">RISK SCORE</div>
                    <div className="font-bold text-emerald-400">{r.risk_score}</div>
                  </div>
                </div>

                {/* Mitigation Plan */}
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Rencana Mitigasi:
                  </div>
                  <p className="text-slate-300">{r.mitigation || "Belum ada rencana mitigasi tertulis"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <User className="w-3.5 h-3.5 text-teal-400" />
                <span>Risk Owner:</span>
                <span className="font-semibold text-white">{r.owner_name || "Belum Ditunjuk"}</span>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRisk ? "Edit Risk Matrix" : "Identifikasi Risk Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Judul / Potensi Risiko</label>
            <input
              type="text"
              required
              placeholder="Pemadaman Listrik Gedung Saat Perlombaan Final"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Probabilitas Kemunculan (1 - 5)</label>
              <input
                type="number"
                min={1}
                max={5}
                required
                value={probability}
                onChange={(e) => setProbability(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Dampak Kerugian (1 - 5)</label>
              <input
                type="number"
                min={1}
                max={5}
                required
                value={impact}
                onChange={(e) => setImpact(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Risk Score Hasil Kalkulasi:</span>
            <span className="font-bold text-emerald-400 text-sm">{probability * impact} ({calculateSeverity(probability * impact)})</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Risk Owner (Panitia Penanggung Jawab)</label>
            <select
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">-- Pilih Risk Owner --</option>
              {committee.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Strategi Mitigasi Darurat</label>
            <textarea
              rows={3}
              placeholder="Langkah pencegahan dan penanganan jika risiko terjadi..."
              value={mitigation}
              onChange={(e) => setMitigation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Status Penanganan</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="IDENTIFIED">IDENTIFIED</option>
              <option value="MITIGATING">MITIGATING</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm transition-colors shadow-md shadow-emerald-500/20"
            >
              Simpan Risk Matrix
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
