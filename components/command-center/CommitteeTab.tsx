"use client";

import { useState } from "react";
import { CommitteeMember, CommitteeRole, Division } from "@/lib/types";
import { Users, Plus, ShieldCheck, Mail, Phone, Building, CheckSquare, Edit, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";

interface CommitteeTabProps {
  committee: CommitteeMember[];
  divisions: Division[];
  onAddMember: (member: CommitteeMember) => void;
  onUpdateMember: (member: CommitteeMember) => void;
  onDeleteMember: (id: string) => void;
}

export function CommitteeTab({
  committee,
  divisions,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
}: CommitteeTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<CommitteeRole>("panitia");
  const [divisionId, setDivisionId] = useState("");

  const handleOpenAdd = () => {
    setEditingMember(null);
    setName("");
    setEmail("");
    setPhone("");
    setRole("panitia");
    setDivisionId("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: CommitteeMember) => {
    setEditingMember(m);
    setName(m.name);
    setEmail(m.email);
    setPhone(m.phone || "");
    setRole(m.role);
    setDivisionId(m.division_id || "");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedDiv = divisions.find(d => d.id === divisionId);

    if (editingMember) {
      onUpdateMember({
        ...editingMember,
        name,
        email,
        phone,
        role,
        division_id: divisionId,
        division_name: selectedDiv?.name,
      });
    } else {
      onAddMember({
        id: `com-${Date.now()}`,
        event_id: "evt-fg2026",
        name,
        email,
        phone,
        role,
        division_id: divisionId,
        division_name: selectedDiv?.name,
        status: "ACTIVE",
        active_tasks_count: 0,
      });
    }
    setIsModalOpen(false);
  };

  const getRoleBadge = (r: CommitteeRole) => {
    switch (r) {
      case "ketua":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "sekretaris":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
      case "bendahara":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "koordinator":
        return "bg-teal-500/20 text-teal-300 border-teal-500/40";
      default:
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white">Struktur Panitia Event</h2>
          <p className="text-xs text-slate-400 mt-1">
            Manajemen personel: Ketua, Sekretaris, Bendahara, Koordinator Divisi, & Panitia Pelaksana.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" /> Tambah Anggota Panitia
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Anggota Panitia</th>
                <th className="py-3.5 px-4">Jabatan / Role</th>
                <th className="py-3.5 px-4">Divisi Assigned</th>
                <th className="py-3.5 px-4">Kontak</th>
                <th className="py-3.5 px-4">Active Tasks</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {committee.map((m) => (
                <tr key={m.id} className="hover:bg-slate-950/50">
                  <td className="py-3.5 px-4 font-bold text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono text-emerald-400 font-bold">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <div>{m.name}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{m.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getRoleBadge(m.role)}`}>
                      {m.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {m.division_name ? (
                      <span className="flex items-center gap-1.5 text-slate-200 font-medium">
                        <Building className="w-3.5 h-3.5 text-teal-400" /> {m.division_name}
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">Umum / Inti</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-500" /> {m.phone || "-"}</div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="flex items-center gap-1 font-mono font-bold text-emerald-400">
                      <CheckSquare className="w-3.5 h-3.5" /> {m.active_tasks_count || 0} Tugas
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(m)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        title="Edit Member"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteMember(m.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                        title="Hapus Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? "Edit Anggota Panitia" : "Tambah Panitia Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              placeholder="Ahmad Fulan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="ahmad@generus.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Nomor WhatsApp / HP</label>
            <input
              type="text"
              placeholder="081234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Jabatan / Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as CommitteeRole)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="ketua">Ketua</option>
                <option value="sekretaris">Sekretaris</option>
                <option value="bendahara">Bendahara</option>
                <option value="koordinator">Koordinator</option>
                <option value="panitia">Panitia Pelaksana</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Divisi</label>
              <select
                value={divisionId}
                onChange={(e) => setDivisionId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- Inti / Non-Divisi --</option>
                {divisions.map((d) => (
                  <option key={d.id} value={d.id}>
                    Divisi {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm transition-colors shadow-md shadow-emerald-500/20"
            >
              Simpan Panitia
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
