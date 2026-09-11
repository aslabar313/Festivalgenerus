"use client";

import { useState } from "react";
import { Task, TaskPriority, TaskStatus, Division, CommitteeMember, TaskComment } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { 
  CheckSquare, 
  Plus, 
  Clock, 
  AlertTriangle, 
  User, 
  Building, 
  MessageSquare, 
  Edit, 
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Modal } from "@/components/ui/modal";

interface TasksTabProps {
  tasks: Task[];
  divisions: Division[];
  committee: CommitteeMember[];
  onAddTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export function TasksTab({
  tasks,
  divisions,
  committee,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: TasksTabProps) {
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Comments state
  const [commentTask, setCommentTask] = useState<Task | null>(null);
  const [commentsList, setCommentsList] = useState<Record<string, TaskComment[]>>({
    "tsk-1": [
      { id: "c1", task_id: "tsk-1", user_id: "com-5", user_name: "Budi Santoso", comment: "Sudah dihubungi vendor genset 10KVA. DP Rp 2 juta diperlukan esok hari.", created_at: "2026-09-07T10:00:00Z" }
    ],
    "tsk-4": [
      { id: "c2", task_id: "tsk-4", user_id: "com-1", user_name: "H. Zaki", comment: "Surat perizinan terhambat di Polsek, butuh pengawalan Sekjen.", created_at: "2026-09-08T14:30:00Z" }
    ]
  });
  const [newCommentText, setNewCommentText] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [picName, setPicName] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [startDate, setStartDate] = useState("2026-09-01");
  const [deadline, setDeadline] = useState("2026-10-01");

  const handleOpenAdd = () => {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setDivisionId(divisions[0]?.id || "");
    setPicName("");
    setPriority("MEDIUM");
    setStatus("TODO");
    setStartDate("2026-09-01");
    setDeadline("2026-10-01");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Task) => {
    setEditingTask(t);
    setTitle(t.title);
    setDescription(t.description || "");
    setDivisionId(t.division_id || "");
    setPicName(t.pic_name || "");
    setPriority(t.priority);
    setStatus(t.status);
    setStartDate(t.start_date || "2026-09-01");
    setDeadline(t.deadline.split("T")[0]);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selDiv = divisions.find(d => d.id === divisionId);
    const deadlineIso = new Date(deadline).toISOString();
    const isOverdue = new Date(deadline).getTime() < new Date().getTime() && status !== "DONE";

    if (editingTask) {
      onUpdateTask({
        ...editingTask,
        title,
        description,
        division_id: divisionId,
        division_name: selDiv?.name,
        pic_name: picName,
        priority,
        status,
        start_date: startDate,
        deadline: deadlineIso,
        is_overdue: isOverdue,
      });
    } else {
      onAddTask({
        id: `tsk-${Date.now()}`,
        event_id: "evt-fg2026",
        title,
        description,
        division_id: divisionId,
        division_name: selDiv?.name,
        pic_name: picName,
        priority,
        status,
        start_date: startDate,
        deadline: deadlineIso,
        is_overdue: isOverdue,
      });
    }
    setIsModalOpen(false);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentTask || !newCommentText.trim()) return;

    const newC: TaskComment = {
      id: `c-${Date.now()}`,
      task_id: commentTask.id,
      user_id: "user-1",
      user_name: "Ketua Panitia",
      comment: newCommentText,
      created_at: new Date().toISOString(),
    };

    setCommentsList(prev => ({
      ...prev,
      [commentTask.id]: [...(prev[commentTask.id] || []), newC],
    }));
    setNewCommentText("");
  };

  const filteredTasks = filterStatus === "ALL" 
    ? tasks 
    : tasks.filter(t => t.status === filterStatus);

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case "CRITICAL":
        return "bg-rose-500 text-slate-950 font-black shadow-sm shadow-rose-500/30";
      case "HIGH":
        return "bg-amber-400 text-slate-950 font-bold";
      case "MEDIUM":
        return "bg-teal-500/20 text-teal-300 border border-teal-500/40";
      default:
        return "bg-slate-800 text-slate-300";
    }
  };

  const getStatusBadge = (s: TaskStatus) => {
    switch (s) {
      case "DONE":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "IN_PROGRESS":
        return "bg-teal-500/20 text-teal-300 border border-teal-500/30";
      case "BLOCKED":
        return "bg-rose-500/20 text-rose-400 border border-rose-500/30";
      case "CANCELLED":
        return "bg-slate-800 text-slate-400";
      default:
        return "bg-slate-800 text-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white">Task Engine & Execution</h2>
          <p className="text-xs text-slate-400 mt-1">
            Penugasan panitia, pembagian divisi, prioritas, serta deteksi otomatis deadline & overdue.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Semua Status Task</option>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="BLOCKED">BLOCKED (Terhambat)</option>
            <option value="DONE">DONE (Selesai)</option>
          </select>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" /> Buat Task Baru
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.map((t) => {
          const comments = commentsList[t.id] || [];
          const isOverdue = t.is_overdue || (t.status !== "DONE" && new Date(t.deadline).getTime() < new Date().getTime());

          return (
            <div
              key={t.id}
              className={`bg-slate-900 border p-5 rounded-2xl space-y-3 transition-all ${
                isOverdue
                  ? "border-rose-800/80 bg-rose-950/20"
                  : t.status === "BLOCKED"
                  ? "border-amber-800/80 bg-amber-950/20"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${getPriorityBadge(t.priority)}`}>
                    {t.priority}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${getStatusBadge(t.status)}`}>
                    {t.status}
                  </span>
                  {isOverdue && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-500 text-slate-950 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> OVERDUE
                    </span>
                  )}
                  {t.is_due_soon && !isOverdue && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> DUE SOON
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCommentTask(t)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded-lg text-xs text-slate-300 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
                    <span>Comments ({comments.length})</span>
                  </button>
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit Task"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteTask(t.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Hapus Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-white text-base">{t.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{t.description || "Tidak ada deskripsi rinci"}</p>
              </div>

              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400 gap-3">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1 text-slate-200 font-semibold">
                    <User className="w-3.5 h-3.5 text-emerald-400" /> PIC: {t.pic_name || "Belum Ditunjuk"}
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Building className="w-3.5 h-3.5 text-teal-400" /> Divisi {t.division_name || "-"}
                  </span>
                </div>

                <div className="flex items-center gap-1 font-mono font-medium text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Deadline: {formatDate(t.deadline)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add/Edit Task */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? "Edit Engine Task" : "Buat Task Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Judul Tugas</label>
            <input
              type="text"
              required
              placeholder="Sewa Sound System & Genset 10KVA"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Divisi Pelaksana</label>
              <select
                value={divisionId}
                onChange={(e) => setDivisionId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {divisions.map((d) => (
                  <option key={d.id} value={d.id}>
                    Divisi {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">PIC (Penanggung Jawab)</label>
              <select
                value={picName}
                onChange={(e) => setPicName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- Pilih PIC --</option>
                {committee.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Prioritas</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Status Eksekusi</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="BLOCKED">BLOCKED</option>
                <option value="DONE">DONE</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Tanggal Mulai</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Deadline Target</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Deskripsi Tugas</label>
            <textarea
              rows={3}
              placeholder="Rincian instruksi pelaksanaan tugas..."
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
              Simpan Task Engine
            </button>
          </div>
        </form>
      </Modal>

      {/* Task Comments Modal */}
      {commentTask && (
        <Modal
          isOpen={!!commentTask}
          onClose={() => setCommentTask(null)}
          title={`Diskusi Task: ${commentTask.title}`}
        >
          <div className="space-y-4">
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {(commentsList[commentTask.id] || []).length === 0 ? (
                <div className="text-xs text-slate-500 italic text-center py-4">
                  Belum ada komentar diskusi pada task ini.
                </div>
              ) : (
                (commentsList[commentTask.id] || []).map((c) => (
                  <div key={c.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-400 font-medium">
                      <span className="font-bold text-emerald-400">{c.user_name}</span>
                      <span className="text-[10px]">{new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-200">{c.comment}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="pt-2 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                required
                placeholder="Tulis update / diskusi panitia..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shrink-0"
              >
                Kirim
              </button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
