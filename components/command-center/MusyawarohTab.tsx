"use client";

import { useState } from "react";
import { MusyawarohItem, MusyawarohTopic, Task, Division, CommitteeMember, TaskPriority } from "@/lib/types";
import { 
  MessageSquare, 
  Plus, 
  Lock, 
  Calendar, 
  MapPin, 
  User, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  BookOpen, 
  Send, 
  Clock, 
  UserCheck,
  Printer,
  ChevronDown,
  ChevronRight,
  Trash2,
  ListOrdered,
  FileDown,
  CheckSquare,
  Square
} from "lucide-react";
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

const DEFAULT_COMMITTEE_LIST = [
  { id: "com-1", name: "H. Muhammad Zaki", position_title: "Ketua Panitia Utama" },
  { id: "com-2", name: "Rahmat Hidayat", position_title: "Sekretaris Utama" },
  { id: "com-3", name: "Anisa Fitri", position_title: "Bendahara Utama" },
  { id: "com-4", name: "Ustadz H. Ahmad", position_title: "Koordinator Divisi Acara" },
  { id: "com-5", name: "Budi Santoso", position_title: "Koordinator Divisi Logistik" },
  { id: "com-6", name: "Siti Rahma", position_title: "Koordinator Divisi Registrasi" },
  { id: "com-7", name: "Faisal Abdullah", position_title: "Koordinator Divisi Humas" },
  { id: "com-8", name: "Hj. Maryam", position_title: "Koordinator Divisi Konsumsi" },
  { id: "com-9", name: "Rizky Kamera", position_title: "Koordinator Divisi Dokumentasi" },
  { id: "com-10", name: "Hasanuddin", position_title: "Koordinator Divisi Keamanan" },
];

export function MusyawarohTab({
  musyawarohList,
  divisions,
  committee,
  currentUserUsername = "",
  currentUserRole = "",
  onAddMusyawaroh,
  onAddTaskFromMusyawaroh,
}: MusyawarohTabProps) {
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
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  const [isAddMusyModalOpen, setIsAddMusyModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);

  // Form State for Musyawaroh
  const [title, setTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().slice(0, 16));
  const [location, setLocation] = useState("Ruang Rapat Utama Gedung PPG");
  const [leaderName, setLeaderName] = useState("Super Admin PPG / Ketua Panitia");
  const [notulisName, setNotulisName] = useState("Sekretaris Utama");

  // Attendance Checklist State
  const availableCommittee = committee.length > 0 ? committee : DEFAULT_COMMITTEE_LIST;
  const [selectedAttendeeIds, setSelectedAttendeeIds] = useState<string[]>([]);

  // Bahan Musyawaroh (Point by Point) Form State
  const [topics, setTopics] = useState<{ id: string; topic_title: string; discussion: string; decision: string }[]>([
    { id: "top-1", topic_title: "", discussion: "", decision: "" }
  ]);

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

  const toggleAttendee = (id: string) => {
    setSelectedAttendeeIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAddTopicRow = () => {
    setTopics(prev => [...prev, { id: `top-${Date.now()}`, topic_title: "", discussion: "", decision: "" }]);
  };

  const handleRemoveTopicRow = (id: string) => {
    if (topics.length <= 1) return;
    setTopics(prev => prev.filter(t => t.id !== id));
  };

  const handleTopicChange = (id: string, field: "topic_title" | "discussion" | "decision", value: string) => {
    setTopics(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleCreateMusyawaroh = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedMembers = availableCommittee.filter(c => selectedAttendeeIds.includes(c.id));
    const attendeesListFormatted = selectedMembers.map(m => m.name).join(", ") || "Seluruh Pimpinan Panitia";

    const validTopics: MusyawarohTopic[] = topics
      .filter(t => t.topic_title.trim().length > 0)
      .map(t => ({
        id: t.id,
        topic_title: t.topic_title,
        discussion: t.discussion || "Dalam pembahasan musyawaroh",
        decision: t.decision || "Disetujui bersama",
      }));

    const newMusy: MusyawarohItem = {
      id: `musy-${Date.now()}`,
      event_id: "evt-fg2026",
      title,
      meeting_date: meetingDate,
      location,
      leader_name: leaderName,
      notulis_name: notulisName,
      attendees_count: selectedMembers.length || selectedAttendeeIds.length || 1,
      attendees_list: attendeesListFormatted,
      attendees_ids: selectedAttendeeIds,
      bahan_musyawaroh: validTopics.length > 0 ? validTopics : [
        { id: "t1", topic_title: "Persiapan Tempat & Perlengkapan", discussion: "Lokasi dipastikan siap H-1", decision: "Disetujui" }
      ],
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
    setSelectedAttendeeIds([]);
    setTopics([{ id: "top-1", topic_title: "", discussion: "", decision: "" }]);
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
      description: `${taskDesc}\n\n📌 Sumber Musyawaroh: ${selectedMusy?.title || "Musyawaroh Pimpinan"}`,
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

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-md text-[10px] font-black uppercase tracking-wider">
              Modul Notulensi Musyawaroh v2.0
            </span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-400" /> Notulensi Musyawaroh & Bahan Pembahasan
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Absensi presensi presisi checklist peserta, input Bahan Musyawaroh poin-per-poin, pembahasan interaktif, serta Ekspor Dokumen PDF Notulensi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedMusy && (
            <button
              onClick={() => setIsPdfPreviewOpen(true)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all border border-slate-700 shadow-md shrink-0"
            >
              <FileDown className="w-4 h-4 text-emerald-400" /> Cetak / Export PDF Notulensi
            </button>
          )}
          <button
            onClick={() => setIsAddMusyModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 shrink-0"
          >
            <Plus className="w-4 h-4" /> Catat Musyawaroh Baru
          </button>
        </div>
      </div>

      {/* Main Grid: Left List, Right Interactive Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Musyawaroh */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Daftar Musyawaroh ({musyawarohList.length})
          </h3>

          <div className="space-y-3">
            {musyawarohList.map((m) => {
              const isSelected = selectedMusy?.id === m.id;
              const topicCount = m.bahan_musyawaroh?.length || 0;
              return (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedMusy(m);
                    setExpandedTopicId(m.bahan_musyawaroh?.[0]?.id || null);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? "bg-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-950/20"
                      : "bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-white text-sm leading-snug">{m.title}</h4>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-mono shrink-0">
                      {topicCount} Bahan
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>{new Date(m.meeting_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <UserCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate">{m.attendees_count} Hadir</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Bahan Musyawaroh Details */}
        <div className="lg:col-span-7">
          {selectedMusy ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              {/* Detail Header & Print Option */}
              <div className="border-b border-slate-800 pb-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold">
                    Dokumen Notulensi Official
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPdfPreviewOpen(true)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-400" /> Export PDF
                    </button>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> {new Date(selectedMusy.meeting_date).toLocaleString("id-ID")}
                    </span>
                  </div>
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

                {/* Checked Attendees List */}
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Presensi Hadir Terverifikasi:
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px]">
                      {selectedMusy.attendees_count} Orang Hadir
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {selectedMusy.attendees_list || "Seluruh Pengurus Panitia Utama"}
                  </p>
                </div>
              </div>

              {/* Point-by-Point BAHAN MUSYAWAROH Interactive Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <ListOrdered className="w-4 h-4 text-emerald-400" /> BAHAN MUSYAWAROH ({selectedMusy.bahan_musyawaroh?.length || 0} Poin)
                  </h4>
                  <span className="text-[11px] text-slate-500">Klik poin untuk membuka detail Pembahasan</span>
                </div>

                <div className="space-y-3">
                  {selectedMusy.bahan_musyawaroh && selectedMusy.bahan_musyawaroh.length > 0 ? (
                    selectedMusy.bahan_musyawaroh.map((topic, index) => {
                      const isExpanded = expandedTopicId === topic.id || expandedTopicId === null;
                      return (
                        <div
                          key={topic.id || index}
                          className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden transition-all"
                        >
                          {/* Topic Header (Clickable) */}
                          <button
                            onClick={() => setExpandedTopicId(isExpanded && expandedTopicId === topic.id ? null : topic.id)}
                            className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-slate-900/60 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                                {index + 1}
                              </span>
                              <span className="font-bold text-white text-sm">{topic.topic_title}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] text-slate-500 uppercase font-semibold">
                                {isExpanded ? "Sembunyikan" : "Buka Pembahasan"}
                              </span>
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-slate-500" />
                              )}
                            </div>
                          </button>

                          {/* Topic Discussion Body */}
                          {isExpanded && (
                            <div className="p-4 bg-slate-900/50 border-t border-slate-800/80 space-y-3 animate-fade-in text-xs">
                              <div>
                                <span className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider block mb-1">
                                  💬 Pembahasan Bahan Musyawaroh:
                                </span>
                                <p className="text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed">
                                  {topic.discussion || "Telah dibahas dan disepakati oleh seluruh peserta musyawaroh yang hadir."}
                                </p>
                              </div>

                              {topic.decision && (
                                <div>
                                  <span className="font-bold text-teal-400 text-[11px] uppercase tracking-wider block mb-1">
                                    ✅ Keputusan Hasil Musyawaroh:
                                  </span>
                                  <p className="text-teal-200 bg-teal-950/20 p-3 rounded-lg border border-teal-500/30 font-medium leading-relaxed">
                                    {topic.decision}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl text-center text-xs text-slate-500">
                      Belum ada poin bahan musyawaroh yang diinput.
                    </div>
                  )}
                </div>
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
              Pilih salah satu musyawaroh dari daftar di sebelah kiri untuk melihat notulensi & bahan pembahasan.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Tambah Musyawaroh (Checklist Absensi & Poin Bahan Musyawaroh) */}
      <Modal
        isOpen={isAddMusyModalOpen}
        onClose={() => setIsAddMusyModalOpen(false)}
        title="Catat Notulensi Musyawaroh Baru (Presensi Checklist & Bahan Poin)"
      >
        <form onSubmit={handleCreateMusyawaroh} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Judul Musyawaroh / Rapat</label>
            <input
              type="text"
              required
              placeholder="misal: Musyawaroh Pleno Kesiapan Panggung & Genset H-7"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Tanggal & Waktu</label>
              <input
                type="datetime-local"
                required
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Lokasi / Ruang Rapat</label>
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
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Pimpinan Musyawaroh</label>
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
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Notulis Rapat</label>
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

          {/* CHECKLIST PESERTA HADIR (ABSENSI) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" /> Checklist Presensi Peserta Hadir ({selectedAttendeeIds.length} Dipilih)
              </label>
              <button
                type="button"
                onClick={() => setSelectedAttendeeIds(availableCommittee.map(c => c.id))}
                className="text-[11px] text-emerald-400 hover:underline font-semibold"
              >
                Pilih Semua
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 max-h-40 overflow-y-auto">
              {availableCommittee.map((c) => {
                const isChecked = selectedAttendeeIds.includes(c.id);
                return (
                  <label
                    key={c.id}
                    onClick={() => toggleAttendee(c.id)}
                    className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer text-xs transition-colors ${
                      isChecked
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold"
                        : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-900"
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                    <div className="truncate">
                      <div className="truncate">{c.name}</div>
                      <div className="text-[10px] text-slate-500 font-normal truncate">{c.position_title || "Panitia"}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* FORM BAHAN MUSYAWAROH (POIN PER POIN) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <ListOrdered className="w-4 h-4" /> BAHAN MUSYAWAROH (Input Poin per Poin)
              </label>
              <button
                type="button"
                onClick={handleAddTopicRow}
                className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Poin Bahan
              </button>
            </div>

            <div className="space-y-4">
              {topics.map((t, idx) => (
                <div key={t.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 relative">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-mono text-[11px]">
                        {idx + 1}
                      </span>
                      Poin Bahan Musyawaroh:
                    </span>
                    {topics.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTopicRow(t.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Hapus Poin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Judul / Poin Bahan Musyawaroh (misal: Evaluasi Sewa Genset Cadangan 10KVA)"
                      value={t.topic_title}
                      onChange={(e) => handleTopicChange(t.id, "topic_title", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Pembahasan Bahan Musyawaroh:</label>
                    <textarea
                      rows={2}
                      placeholder="Uraian detail pembahasan rapat mengenai poin bahan ini..."
                      value={t.discussion}
                      onChange={(e) => handleTopicChange(t.id, "discussion", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Hasil Keputusan Bahan Musyawaroh:</label>
                    <input
                      type="text"
                      placeholder="Keputusan akhir yang disepakati bersama..."
                      value={t.decision}
                      onChange={(e) => handleTopicChange(t.id, "decision", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-teal-300 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>
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

      {/* Modal / PDF Preview Window */}
      {isPdfPreviewOpen && selectedMusy && (
        <Modal
          isOpen={isPdfPreviewOpen}
          onClose={() => setIsPdfPreviewOpen(false)}
          title="Export / Cetak Dokumen PDF Notulensi Musyawaroh"
        >
          <div className="space-y-6 max-h-[75vh] overflow-y-auto p-2">
            {/* Printable PDF Container */}
            <div id="pdf-notulensi-document" className="bg-white text-slate-900 p-8 rounded-xl shadow-2xl space-y-6 font-serif">
              {/* Kop Header */}
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                <h1 className="text-xl font-black tracking-wider uppercase text-slate-900">
                  PANITIA PELAKSANA FESTIVAL GENERUS 2026
                </h1>
                <h2 className="text-base font-bold text-slate-800">
                  BERITA ACARA & NOTULENSI MUSYAWAROH PIMPINAN
                </h2>
                <p className="text-xs text-slate-600 italic">
                  Gedung Serbaguna Utama & Kompleks Masjid Generus Daerah
                </p>
              </div>

              {/* Event Metadata Table */}
              <div className="grid grid-cols-2 gap-4 text-xs border border-slate-300 p-4 rounded bg-slate-50">
                <div>
                  <span className="font-bold block text-slate-700">Judul Musyawaroh:</span>
                  <span className="font-semibold">{selectedMusy.title}</span>
                </div>
                <div>
                  <span className="font-bold block text-slate-700">Waktu & Tanggal:</span>
                  <span>{new Date(selectedMusy.meeting_date).toLocaleString("id-ID")}</span>
                </div>
                <div>
                  <span className="font-bold block text-slate-700">Tempat Pelaksanaan:</span>
                  <span>{selectedMusy.location}</span>
                </div>
                <div>
                  <span className="font-bold block text-slate-700">Pimpinan & Notulis:</span>
                  <span>{selectedMusy.leader_name} (Notulis: {selectedMusy.notulis_name})</span>
                </div>
              </div>

              {/* Attendance List */}
              <div className="space-y-2 text-xs">
                <h3 className="font-bold text-slate-900 uppercase border-b border-slate-300 pb-1">
                  I. DAFTAR PRESENSI PESERTA HADIR ({selectedMusy.attendees_count} ORANG)
                </h3>
                <p className="text-slate-700 leading-relaxed pl-2">
                  {selectedMusy.attendees_list || "Seluruh Pengurus Panitia Utama"}
                </p>
              </div>

              {/* Point-by-point Bahan Musyawaroh */}
              <div className="space-y-4 text-xs">
                <h3 className="font-bold text-slate-900 uppercase border-b border-slate-300 pb-1">
                  II. BAHAN MUSYAWAROH & PEMBAHASAN HASIL KEPUTUSAN
                </h3>
                <div className="space-y-3">
                  {selectedMusy.bahan_musyawaroh && selectedMusy.bahan_musyawaroh.length > 0 ? (
                    selectedMusy.bahan_musyawaroh.map((topic, idx) => (
                      <div key={topic.id || idx} className="border border-slate-300 p-3 rounded space-y-2 bg-slate-50/50">
                        <div className="font-bold text-slate-900 text-sm">
                          {idx + 1}. {topic.topic_title}
                        </div>
                        <div className="pl-4 space-y-1">
                          <div>
                            <span className="font-bold text-slate-700 block">Pembahasan:</span>
                            <p className="text-slate-800">{topic.discussion || "-"}</p>
                          </div>
                          {topic.decision && (
                            <div>
                              <span className="font-bold text-emerald-800 block">Keputusan:</span>
                              <p className="text-emerald-900 font-semibold">{topic.decision}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 italic">Tidak ada bahan musyawaroh tambahan.</p>
                  )}
                </div>
              </div>

              {/* Signatures Footer */}
              <div className="pt-8 grid grid-cols-2 text-center text-xs space-y-0">
                <div>
                  <p>Notulis Musyawaroh,</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">{selectedMusy.notulis_name}</p>
                </div>
                <div>
                  <p>Pimpinan Musyawaroh,</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">{selectedMusy.leader_name}</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsPdfPreviewOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-700"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handlePrintPdf}
                className="px-5 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-2 hover:bg-emerald-400 shadow-md shadow-emerald-500/20"
              >
                <Printer className="w-4 h-4" /> Cetak / Download PDF
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
