"use client";

import { useState } from "react";
import { Participant, Registration, Competition, ParticipantLifecycleStatus, RegistrationStatus } from "@/lib/types";
import { 
  UserCheck, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Building, 
  Award, 
  ShieldCheck,
  Eye,
  FileCheck
} from "lucide-react";
import { Modal } from "@/components/ui/modal";

interface ParticipantsTabProps {
  participants: Participant[];
  registrations: Registration[];
  competitions: Competition[];
  onAddParticipant: (participant: Participant, competitionIds: string[]) => void;
  onUpdateParticipantStatus: (participantId: string, status: ParticipantLifecycleStatus) => void;
  onUpdateRegistrationStatus: (registrationId: string, status: RegistrationStatus) => void;
}

export function ParticipantsTab({
  participants,
  registrations,
  competitions,
  onAddParticipant,
  onUpdateParticipantStatus,
  onUpdateRegistrationStatus,
}: ParticipantsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGroup, setFilterGroup] = useState<string>("ALL");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Add Form State
  const [name, setName] = useState("");
  const [participantType, setParticipantType] = useState<"INDIVIDUAL" | "GROUP" | "DELEGATION">("INDIVIDUAL");
  const [category, setCategory] = useState("Cabe Rawit");
  const [school, setSchool] = useState("");
  const [groupName, setGroupName] = useState("Desa Kebon Jeruk");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCompetitionIds, setSelectedCompetitionIds] = useState<string[]>([]);

  const handleOpenAdd = () => {
    setName("");
    setParticipantType("INDIVIDUAL");
    setCategory("Cabe Rawit");
    setSchool("");
    setGroupName("Desa Kebon Jeruk");
    setPhone("");
    setEmail("");
    setSelectedCompetitionIds([]);
    setIsAddModalOpen(true);
  };

  const handleOpenDetail = (p: Participant) => {
    setSelectedParticipant(p);
    setIsDetailModalOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newP: Participant = {
      id: `part-${Date.now()}`,
      name,
      participant_type: participantType,
      category,
      school,
      group_name: groupName,
      phone,
      email,
      status: "REGISTERED",
      created_at: new Date().toISOString(),
    };
    onAddParticipant(newP, selectedCompetitionIds);
    setIsAddModalOpen(false);
  };

  const toggleCompetitionSelect = (id: string) => {
    if (selectedCompetitionIds.includes(id)) {
      setSelectedCompetitionIds(prev => prev.filter(cId => cId !== id));
    } else {
      setSelectedCompetitionIds(prev => [...prev, id]);
    }
  };

  // Filter Logic
  const filteredParticipants = participants.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.group_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.school && p.school.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGroup = filterGroup === "ALL" || p.group_name === filterGroup;
    const matchesCategory = filterCategory === "ALL" || p.category === filterCategory;
    const matchesStatus = filterStatus === "ALL" || p.status === filterStatus;
    return matchesSearch && matchesGroup && matchesCategory && matchesStatus;
  });

  const getLifecycleBadge = (s: ParticipantLifecycleStatus) => {
    switch (s) {
      case "APPROVED":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold";
      case "VERIFICATION":
        return "bg-teal-500/20 text-teal-300 border border-teal-500/40";
      case "CHECK_IN":
        return "bg-cyan-500 text-slate-950 font-black";
      case "COMPETITION":
        return "bg-purple-500 text-slate-950 font-black animate-pulse";
      case "RESULT":
      case "CERTIFICATE":
        return "bg-amber-400 text-slate-950 font-black";
      default:
        return "bg-slate-800 text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white">Engine Peserta & Registrasi Single Source of Truth</h2>
          <p className="text-xs text-slate-400 mt-1">
            Data peserta unik terintegrasi (1 Participant → N Registrations), alur verifikasi berkas, & persetujuan panitia.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" /> Registrasi Peserta Baru
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Cari nama / desa / sekolah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">Semua Utusan Desa/Kelompok</option>
          <option value="Desa Kebon Jeruk">Desa Kebon Jeruk</option>
          <option value="Desa Sukamaju">Desa Sukamaju</option>
          <option value="Desa Mekar Sari">Desa Mekar Sari</option>
          <option value="Desa Cempaka">Desa Cempaka</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">Semua Kategori Usia</option>
          <option value="Cabe Rawit">Cabe Rawit</option>
          <option value="Pra-Remaja">Pra-Remaja</option>
          <option value="Remaja">Remaja</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">Semua Status Lifecycle</option>
          <option value="REGISTERED">REGISTERED</option>
          <option value="VERIFICATION">VERIFICATION</option>
          <option value="APPROVED">APPROVED</option>
          <option value="CHECK_IN">CHECK_IN</option>
        </select>
      </div>

      {/* Participant Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Nama Peserta</th>
                <th className="py-3.5 px-4">Kategori & Tipe</th>
                <th className="py-3.5 px-4">Utusan / Sekolah</th>
                <th className="py-3.5 px-4">Cabang Lomba Diikuti</th>
                <th className="py-3.5 px-4">Status Lifecycle</th>
                <th className="py-3.5 px-4 text-right">Aksi Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredParticipants.map((p) => {
                const pRegs = registrations.filter(r => r.participant_id === p.id);

                return (
                  <tr key={p.id} className="hover:bg-slate-950/50">
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono text-emerald-400 font-bold">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <div>{p.name}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{p.phone || p.email || "No Contact"}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-white">{p.category}</span>
                        <div className="text-[10px] text-slate-400 uppercase font-mono">{p.participant_type}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-semibold text-emerald-400">{p.group_name}</div>
                        <div className="text-[10px] text-slate-400">{p.school || "Utusan Desa"}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {pRegs.map((r) => (
                          <div key={r.id} className="flex items-center gap-1.5 text-[11px] bg-slate-950 px-2 py-1 rounded border border-slate-800">
                            <Award className="w-3 h-3 text-teal-400 shrink-0" />
                            <span className="truncate max-w-[140px] text-slate-200">{r.competition_name || "Lomba"}</span>
                            <span className={`ml-auto px-1.5 py-0.2 rounded text-[9px] font-black ${
                              r.status === "APPROVED" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-300"
                            }`}>
                              {r.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${getLifecycleBadge(p.status)}`}>
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(p)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-400" /> Detail & Approval
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Register Participant */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Registrasi Peserta Baru (Single Source of Truth)"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Nama Peserta / Tim</label>
            <input
              type="text"
              required
              placeholder="Muhammad Faiz"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Tipe Peserta</label>
              <select
                value={participantType}
                onChange={(e) => setParticipantType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="INDIVIDUAL">Perorangan (INDIVIDUAL)</option>
                <option value="GROUP">Grup / Kelompok (GROUP)</option>
                <option value="DELEGATION">Utusan Resmi (DELEGATION)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Kategori Usia</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Cabe Rawit">Cabe Rawit</option>
                <option value="Pra-Remaja">Pra-Remaja</option>
                <option value="Remaja">Remaja</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Utusan Desa / Kelompok</label>
              <input
                type="text"
                required
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Asal Sekolah / TPQ</label>
              <input
                type="text"
                placeholder="TPQ Al-Fattah"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Pilih Cabang Lomba Diikuti (Multi-Select):</label>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {competitions.map((cmp) => {
                const isSelected = selectedCompetitionIds.includes(cmp.id);
                return (
                  <button
                    key={cmp.id}
                    type="button"
                    onClick={() => toggleCompetitionSelect(cmp.id)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <span>{cmp.name} ({cmp.category})</span>
                    {isSelected && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm transition-colors shadow-md shadow-emerald-500/20"
            >
              Simpan Registrasi Peserta
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Detail & Approval */}
      {selectedParticipant && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Detail & Verifikasi: ${selectedParticipant.name}`}
        >
          <div className="space-y-6">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{selectedParticipant.name}</span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold ${getLifecycleBadge(selectedParticipant.status)}`}>
                  {selectedParticipant.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-400 pt-2 border-t border-slate-800/80">
                <div>Utusan: <span className="text-emerald-400 font-semibold">{selectedParticipant.group_name}</span></div>
                <div>Kategori: <span className="text-white font-semibold">{selectedParticipant.category}</span></div>
                <div>Sekolah: <span className="text-slate-200">{selectedParticipant.school || "-"}</span></div>
                <div>Kontak: <span className="text-slate-200">{selectedParticipant.phone || selectedParticipant.email || "-"}</span></div>
              </div>
            </div>

            {/* Registrations List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Pendaftaran Cabang Lomba:</h4>
              {registrations.filter(r => r.participant_id === selectedParticipant.id).map((r) => (
                <div key={r.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-white">{r.competition_name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">No. Reg: {r.registration_number}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onUpdateRegistrationStatus(r.id, "VERIFICATION");
                        onUpdateParticipantStatus(selectedParticipant.id, "VERIFICATION");
                      }}
                      className="px-2.5 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 rounded text-[10px] font-bold"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => {
                        onUpdateRegistrationStatus(r.id, "APPROVED");
                        onUpdateParticipantStatus(selectedParticipant.id, "APPROVED");
                      }}
                      className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-[10px]"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        onUpdateRegistrationStatus(r.id, "REJECTED");
                      }}
                      className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 rounded text-[10px] font-bold"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-xs"
              >
                Selesai
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
