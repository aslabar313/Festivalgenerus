"use client";

import { useState } from "react";
import { MusyawarohItem, Task, Division, CommitteeMember, TaskPriority } from "@/lib/types";
import { MessageSquare, Plus, Lock, Calendar, MapPin, User, FileText, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, BookOpen, Send, Clock, UserCheck } from "lucide-react";
import { Modal } from "@/components/ui/modal";

interface MusyawarohTabProps {
  musyawarohList: MusyawarohItem[];
  divisions: Division[];
  committee: CommitteeMember[];
  currentUserUsername?: string;
  currentUserRole?: string;
  onAddMusyawaroh: (item: MusyawarohItem) => void;
  onAddTaskFromMusyawaroh: (task: Task) => void;
}

export function MusyawarohTab({
  musyawarohList,
  divisions,
  committee,
  currentUserUsername = "",
  currentUserRole = "",
  onAddMusyawaroh,
  onAddTaskFromMusyawaroh,
}: MusyawarohTabProps) {
  // Check access permission: Only superadmin, wakilketua, sekretaris, or admin/ketua role
  const usernameClean = currentUserUsername.toLowerCase().trim();
  const roleClean = currentUserRole.toLowerCase().trim();

  const isAuthorized =
    usernameClean.includes("superadmin") ||
    usernameClean.includes("wakilketua") ||
    usernameClean.includes("sekretaris") ||
    roleClean.includes("superadmin") ||
    roleClean.includes("wakil") ||
    roleClean.includes("sekretaris") ||
    roleClean.includes("ketua");

  const [selectedMusy, setSelectedMusy] = useState<MusyawarohItem | null>(musyawarohList[0] || null);
  const [isAddMusyModalOpen, setIsAddMusyModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  // Form State for Musyawaroh
  const [title, setTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().slice(0, 16));
  const [location, setLocation] = useState("Ruang Rapat Utama Gedung PPG");
  const [leaderName, setLeaderName] = useState("Super Admin PPG / Ketua Panitia");
  const [notulisName, setNotulisName] = useState("Sekretaris Utama");
  const [attendeesList, setAttendeesList] = useState("");
  const [agenda, setAgenda] = useState("");
  const [resultsSummary, setResultsSummary] = useState("");
  const [decisionsText, setDecisionsText] = useState("");

  // Form State for Task Assignment
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [targetDivisionId, setTargetDivisionId] = useState("");
  const [picName, setPicName] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("HIGH");
  const [deadline, setDeadline] = useState("");

  if (!isAuthorized) {
    return (
      <div className="bg-slate-900 border-2 border-rose-500/40 rounded-3xl p-8 max-w-3xl mx-auto text-center space-y-6 shadow-2xl shadow-rose-950/30 animate-fade-in">
        <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto text-rose-400">
          <Lock className="w-8 h-8 stroke-[2.5]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white uppercase tracking-wide">
            🔒 FITUR TERBATAS (RESTRICTED ACCESS)
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Halaman <strong className="text-amber-400">Notulensi Musyawaroh & Penugasan Instruksi Rapat</strong> ini khusus diakses oleh Pimpinan Panitia:
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-bold">1. Superadmin</span>
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-bold">2. Wakil Ketua</span>
            <span className="px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-lg text-xs font-bold">3. Sekretaris Utama</span>
          </div>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 text-left space-y-1">
          <span className="font-bold text-slate-200">Sesi Akun Saat Ini:</span>
          <div>Username: <code className="text-emerald-400 font-mono">{currentUserUsername || "Tamu/Panitia"}</code></div>
          <div>Role: <span className="text-slate-300">{currentUserRole || "Panitia Pelaksana"}</span></div>
        </div>
      </div>
    );
  }

  const handleCreateMusyawaroh = (e: React.FormEvent) => {
    e.preventDefault();
    const decisionsArr = decisionsText
      .split("\n")
      .map(d => d.trim())
      .filter(d => d.length > 0);

    const newMusy: MusyawarohItem = {
      id: `musy-${Date.now()}`,
      event_id: "evt-fg2026",
      title,
      meeting_date: meetingDate,
      location,
      leader_name: leaderName,
      notulis_name: notulisName,
      attendees_count: attendeesList ? attendeesList.split(",").length : 5,
      attendees_list: attendeesList,
      agenda,
      results_summary: resultsSummary,
      decisions: decisionsArr,
      assigned_tasks_count: 0,
      created_by: currentUserUsername || "Sekretaris",
      created_at: new Date().toISOString(),
    };

    onAddMusyawaroh(newMusy);
    setSelectedMusy(newMusy);
    setIsAddMusyModalOpen(false);
    resetMusyForm();
  };

  const resetMusyForm = () => {
    setTitle("");
    setAgenda("");
    setResultsSummary("");
    setDecisionsText("");
    setAttendeesList("");
  };

  const handleCreateTaskFromMusy = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedDiv = divisions.find(d => d.id === targetDivisionId);

    const newTask: Task = {
      id: `tsk-musy-${Date.now()}`,
      event_id: "evt-fg2026",
      division_id: targetDivisionId,
      division_name: selectedDiv?.name || "Acara",
      title: `[Musyawaroh] ${taskTitle}`,
      description: `${taskDesc}\n\n📌 Sumber Instruksi: ${selectedMusy?.title || "Musyawaroh Pimpinan"}`,
      pic_name: picName || selectedDiv?.coordinator_name || "Tim Divisi",
      priority,
      status: "TODO",
      start_date: new Date().toISOString().slice(0, 10),
      deadline: deadline ? new Date(deadline).toISOString() : new Date(Date.now() + 86400000 * 3).toISOString(),
    };

    onAddTaskFromMusyawaroh(newTask);
    if (selectedMusy) {
      selectedMusy.assigned_tasks_count = (selectedMusy.assigned_tasks_count || 0) + 1;
    }
    setIsAddTaskModalOpen(false);
    resetTaskForm();
  };

  const resetTaskForm = () => {
    setTaskTitle("");
    setTaskDesc("");
    setTargetDivisionId("");
    setPicName("");
    setPriority("HIGH");
    setDeadline("");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-md text-[10px] font-black uppercase tracking-wider">
              Khusus Pimpinan (Superadmin, Waket, Sekretaris)
            </span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" /> Musyawaroh / Rapat & Notulensi Pimpinan
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            PencatatanNotulensi Keputusan Musyawaroh serta Instruksi Penugasan Tugas Tambahan kepada Tim Panitia berdasarkan Tupoksi.
          </p>
        </div>

        <button
          onClick={() => setIsAddMusyModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" /> Catat Musyawaroh Baru
        </button>
      </div>

      {/* Main Grid: Left List, Right Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Musyawaroh */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Daftar Musyawaroh ({musyawarohList.length})
          </h3>

          <div className="space-y-3">
            {musyawarohList.map((m) => {
              const isSelected = selectedMusy?.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMusy(m)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? "bg-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-950/20"
                      : "bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-white text-sm leading-snug">{m.title}</h4>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-mono shrink-0">
                      {m.assigned_tasks_count || 0} Tugas
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>{new Date(m.meeting_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <User className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate">{m.leader_name}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 italic">
                    "{m.results_summary}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Musyawaroh Detail & Action Tasks */}
        <div className="lg:col-span-7">
          {selectedMusy ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              {/* Detail Header */}
              <div className="border-b border-slate-800 pb-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold">
                    ID: {selectedMusy.id}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-500" /> {new Date(selectedMusy.meeting_date).toLocaleString("id-ID")}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white">{selectedMusy.title}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Lokasi / Tempat:</span>
                    <span className="text-slate-200 font-medium flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" /> {selectedMusy.location}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Pimpinan & Notulis:</span>
                    <span className="text-slate-200 font-medium flex items-center gap-1 mt-0.5">
                      <UserCheck className="w-3.5 h-3.5 text-purple-400" /> {selectedMusy.leader_name} (Notulis: {selectedMusy.notulis_name})
                    </span>
                  </div>
                </div>

                {selectedMusy.attendees_list && (
                  <div className="text-xs text-slate-400">
                    <span className="font-bold text-slate-300">Peserta Hadir ({selectedMusy.attendees_count} orang):</span> {selectedMusy.attendees_list}
                  </div>
                )}
              </div>

              {/* Agenda & Decisions */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-teal-400" /> Agenda Rapat
                  </h4>
                  <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                    {selectedMusy.agenda}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Ringkasan Hasil Keputusan Musyawaroh
                  </h4>
                  <p className="text-xs text-emerald-200 bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/30 leading-relaxed">
                    {selectedMusy.results_summary}
                  </p>
                </div>

                {selectedMusy.decisions && selectedMusy.decisions.length > 0 && (
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                      Poin-Poin Keputusan Resmi:
                    </h4>
                    <ul className="space-y-2">
                      {selectedMusy.decisions.map((dec, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                            {idx + 1}
                          </span>
                          <span>{dec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Task Assignment Action */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Send className="w-4 h-4 text-amber-400" /> Penugasan Instruksi Musyawaroh ke Tim
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Tambahkan tugas tambahan kepada divisi/tim panitia sesuai Tupoksi kerja mereka.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddTaskModalOpen(true)}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
                  >
                    <Plus className="w-4 h-4" /> Tambah Instruksi Tim
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
              Pilih salah satu musyawaroh dari daftar di sebelah kiri untuk melihat notulensi & instruksi tim.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Tambah Musyawaroh */}
      <Modal
        isOpen={isAddMusyModalOpen}
        onClose={() => setIsAddMusyModalOpen(false)}
        title="Catat Notulensi Musyawaroh Baru"
      >
        <form onSubmit={handleCreateMusyawaroh} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Judul Musyawaroh / Rapat</label>
            <input
              type="text"
              required
              placeholder="misal: Musyawaroh Pleno Evaluasi H-7 Festival Generus"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Tanggal & Waktu</label>
              <input
                type="datetime-local"
                required
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Lokasi / Ruang Rapat</label>
              <input
                type="text"
                required
                placeholder="Gedung PPG / Masjid / Zoom"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Pimpinan Musyawaroh</label>
              <input
                type="text"
                required
                placeholder="Super Admin PPG / Wakil Ketua"
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Notulis Rapat</label>
              <input
                type="text"
                required
                placeholder="Sekretaris Utama"
                value={notulisName}
                onChange={(e) => setNotulisName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Peserta Hadir (pisahkan koma)</label>
            <input
              type="text"
              placeholder="Superadmin, Wakil Ketua, Sekretaris, Bendahara, Divisi Acara"
              value={attendeesList}
              onChange={(e) => setAttendeesList(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Agenda Musyawaroh</label>
            <textarea
              rows={2}
              required
              placeholder="Tuliskan agenda utama pembahasan rapat..."
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Ringkasan Hasil Keputusan</label>
            <textarea
              rows={3}
              required
              placeholder="Ringkasan poin-poin kesepakatan akhir rapat..."
              value={resultsSummary}
              onChange={(e) => setResultsSummary(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Poin-Poin Keputusan (1 per baris)</label>
            <textarea
              rows={3}
              placeholder="Point 1: Sewa Genset 10KVA&#10;Point 2: Pengiriman Surat Polsek"
              value={decisionsText}
              onChange={(e) => setDecisionsText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm transition-colors shadow-md shadow-emerald-500/20"
            >
              Simpan Notulensi Musyawaroh
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Tambah Instruksi / Tugas Tambahan Tim */}
      <Modal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        title="Penugasan Instruksi Musyawaroh ke Tim / Divisi"
      >
        <form onSubmit={handleCreateTaskFromMusy} className="space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg text-xs text-amber-300">
            <strong>Musyawaroh:</strong> {selectedMusy?.title}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Tim / Divisi Sasaran (Tupoksi)</label>
            <select
              required
              value={targetDivisionId}
              onChange={(e) => {
                setTargetDivisionId(e.target.value);
                const d = divisions.find(div => div.id === e.target.value);
                if (d) setPicName(d.coordinator_name || "");
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">-- Pilih Divisi / Tim Panitia --</option>
              {divisions.map((d) => (
                <option key={d.id} value={d.id}>
                  Divisi {d.name} ({d.description || "Tupoksi Divisi"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Judul Tugas Tambahan</label>
            <input
              type="text"
              required
              placeholder="misal: Pengadaan Genset 10KVA Cadangan ATS"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Detail Instruksi Musyawaroh</label>
            <textarea
              rows={3}
              required
              placeholder="Jelaskan spesifikasi dan kebutuhan instruksi dari pimpinan rapat..."
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">PIC (Penanggung Jawab)</label>
              <input
                type="text"
                required
                placeholder="Budi Santoso (Logistik)"
                value={picName}
                onChange={(e) => setPicName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Tingkat Prioritas</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="CRITICAL">🔴 CRITICAL (Sangat Kritis)</option>
                <option value="HIGH">🟠 HIGH (Tinggi)</option>
                <option value="MEDIUM">🟡 MEDIUM (Sedang)</option>
                <option value="LOW">🟢 LOW (Rendah)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Deadline Penyelesaian</label>
            <input
              type="datetime-local"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-sm transition-colors shadow-md shadow-amber-500/20"
            >
              Kirim Instruksi Tugas ke Tim Engine
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
