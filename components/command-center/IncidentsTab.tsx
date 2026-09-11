"use client";

import { useState } from "react";
import { IncidentItem, CommitteeMember } from "@/lib/types";
import { AlertTriangle, Plus, ShieldAlert, CheckCircle2, User, MapPin } from "lucide-react";
import { Modal } from "@/components/ui/modal";

interface IncidentsTabProps {
  incidents: IncidentItem[];
  committee: CommitteeMember[];
  onAddIncident: (inc: IncidentItem) => void;
  onUpdateIncidentStatus: (id: string, status: IncidentItem["status"]) => void;
}

export function IncidentsTab({
  incidents,
  committee,
  onAddIncident,
  onUpdateIncidentStatus,
}: IncidentsTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<IncidentItem["severity"]>("HIGH");
  const [location, setLocation] = useState("Panggung Utama Gedung A");
  const [reportedBy, setReportedBy] = useState("Panitia Lapangan");
  const [assignedTo, setAssignedTo] = useState(committee[0]?.name || "Budi Santoso (Logistik)");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddIncident({
      id: `inc-${Date.now()}`,
      title,
      description,
      severity,
      location,
      reported_by: reportedBy,
      assigned_to: assignedTo,
      status: "OPEN",
      created_at: new Date().toISOString(),
    });
    setIsModalOpen(false);
  };

  const getSeverityBadge = (sev: IncidentItem["severity"]) => {
    switch (sev) {
      case "CRITICAL":
        return "bg-rose-500 text-slate-950 font-black animate-pulse";
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
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" /> Incident Management System (Hari-H)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pelaporan insiden darurat di lapangan, penunjukan PIC penanganan, & tracking resolusi.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-rose-500 hover:bg-rose-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-rose-500/20"
        >
          <Plus className="w-4 h-4" /> Laporkan Insiden Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className={`bg-slate-900 border p-6 rounded-2xl space-y-4 flex flex-col justify-between transition-all ${
              inc.status === "OPEN" || inc.status === "IN_PROGRESS"
                ? "border-rose-800/80 bg-rose-950/20 shadow-lg shadow-rose-950/30"
                : "border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold ${getSeverityBadge(inc.severity)}`}>
                    {inc.severity}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-950 text-slate-400 border border-slate-800 uppercase">
                    {inc.status}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" /> {inc.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1">{inc.description}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs text-slate-400">
                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-cyan-400" /> Lokasi: <span className="text-white font-semibold">{inc.location}</span></div>
                <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-teal-400" /> Pelapor: <span className="text-slate-200">{inc.reported_by}</span> • PIC: <span className="text-emerald-400 font-bold">{inc.assigned_to}</span></div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              {inc.status !== "RESOLVED" && inc.status !== "CLOSED" ? (
                <>
                  <button
                    onClick={() => onUpdateIncidentStatus(inc.id, "IN_PROGRESS")}
                    className="px-3 py-1.5 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold rounded-lg"
                  >
                    Set In Progress
                  </button>
                  <button
                    onClick={() => onUpdateIncidentStatus(inc.id, "RESOLVED")}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg shadow-md shadow-emerald-500/20"
                  >
                    Resolve Incident
                  </button>
                </>
              ) : (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Insiden Terselesaikan
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Laporkan Insiden Darurat">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Judul Insiden</label>
            <input
              type="text"
              required
              placeholder="Gangguan Sound System & Mic Panggung B"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Tingkat Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Lokasi Kejadian</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">PIC Penanggung Jawab Penanganan</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              {committee.map((c) => (
                <option key={c.id} value={`${c.name} (${c.role})`}>
                  {c.name} ({c.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Deskripsi & Masalah</label>
            <textarea
              rows={3}
              required
              placeholder="Rincian kendala teknis atau situasi di lokasi..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-rose-500 hover:bg-rose-400 text-slate-950 font-black rounded-lg text-sm transition-colors shadow-md shadow-rose-500/20"
            >
              Kirim Laporan Insiden
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
