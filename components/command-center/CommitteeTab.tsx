"use client";

import { useState } from "react";
import { CommitteeMember, CommitteeRole, Division } from "@/lib/types";
import { Users, Plus, ShieldCheck, Phone, Building, CheckSquare, Square, Edit, Trash2, BookOpen, Layers, LayoutGrid, List, Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/modal";

interface CommitteeTabProps {
  committee: CommitteeMember[];
  divisions: Division[];
  onAddMember: (member: CommitteeMember) => void;
  onUpdateMember: (member: CommitteeMember) => void;
  onDeleteMember: (id: string) => void;
}

export const DAPUKAN_OPTIONS = [
  "wakil ketua",
  "pengawas",
  "sekretaris",
  "bendahara",
  "Konsumsi",
  "Sarana Prasarana",
  "Pembuat Soal & Koor Juri",
  "Hadiah & Piala",
  "Dokumentasi",
  "Pembantu Umum",
];

export const TUPOKSI_MAP: Record<string, string[]> = {
  "wakil ketua": [
    "Mendampingi Ketua Utama & memimpin koordinasi operasional seluruh divisi panitia.",
    "Memantau kesiapan tempat, kelancaran acara Hari-H, & mengambil keputusan saat Ketua berhalangan.",
    "Melakukan evaluasi progres harian tugas divisi panitia."
  ],
  "pengawas": [
    "Mengawasi pelaksanaan kegiatan agar sesuai juknis, tata tertib, & prosedur organisasi.",
    "Melakukan audit kesiapan venue, keabsahan berkas lomba, & kepatuhan aturan event.",
    "Memastikan keamanan, kenyamanan, & ketertiban seluruh jalannya festival."
  ],
  "sekretaris": [
    "Mengelola administrasi perizinan kepolisian, dinas, persuratan resmi, & notulensi musyawaroh.",
    "Menyusun sertifikat kejuaraan, prasasti event, & pengarsipan dokumen resmi.",
    "Mengatur jadwal registrasi & presensi kehadiran kepanitiaan."
  ],
  "bendahara": [
    "Pencatatan kas masuk & keluar, verifikasi nota operasional divisi, & penyusunan LPJ Keuangan.",
    "Pengelolaan dana tak terduga, alokasi anggaran konsumsi, logistik & piala kejuaraan.",
    "Memeriksa & menyetujui pengajuan pencairan dana divisi panitia."
  ],
  "Konsumsi": [
    "Penyediaan & penataan konsumsi untuk Panitia, Dewan Juri, Tamu Undangan, & Peserta.",
    "Mengatur jadwal pembagian konsumsi tepat waktu & kerapian area konsumsi.",
    "Memastikan ketersediaan air minum & makanan ringan di tiap venue lomba."
  ],
  "Sarana Prasarana": [
    "Penataan tempat panggung, sound system, genset cadangan 10KVA, kursi, & tenda venue.",
    "Inventarisasi alat perlengkapan event, kelistrikan, & kelengkapan fisik panggung.",
    "Menjaga kebersihan venue & penataan sekat ruangan panggung perlombaan."
  ],
  "Pembuat Soal & Koor Juri": [
    "Penyusunan naskah soal perlombaan, pembekalan dewan juri, & kriteria penilaian.",
    "Verifikasi kesiapan lembar penilaian juri, pengawalan live score, & pengumuman hasil.",
    "Merekap skor nilai akhir & menyerahkan daftar pemenang ke pimpinan."
  ],
  "Hadiah & Piala": [
    "Pengadaan tropi piala kejuaraan, piagam penghargaan, & hadiah pemenang.",
    "Pengecekan fisik piala, pembungkusan hadiah, & koordinasi penganugerahan panggung.",
    "Mendampingi prosesi penyerahan tropi juara saat penutupan acara."
  ],
  "Dokumentasi": [
    "Pengambilan foto/video kegiatan, pengelolaan live streaming panggung, & video teaser event.",
    "Pengumpulan aset visual untuk laporan kegiatan & liputan publikasi resmi.",
    "Membuat dokumentasi prasasti foto seluruh rangkaian acara."
  ],
  "Pembantu Umum": [
    "Membantu mobilisasi umum lapangan, membantu kebersihan tempat, & tugas mendesak divisi.",
    "Penanganan bantuan logistik cepat, peralatan darurat, & bantuan umum lokasi.",
    "Membantu penataan ruangan & penerimaan tamu di lokasi event."
  ]
};

export function CommitteeTab({
  committee,
  divisions,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
}: CommitteeTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dapukan, setDapukan] = useState(DAPUKAN_OPTIONS[0]);
  const [selectedTupoksiList, setSelectedTupoksiList] = useState<string[]>([]);
  const [customTupoksiInput, setCustomTupoksiInput] = useState("");
  const [customTupoksiItems, setCustomTupoksiItems] = useState<string[]>([]);
  const [divisionId, setDivisionId] = useState("");

  const handleDapukanChange = (newDapukan: string) => {
    setDapukan(newDapukan);
    const recs = TUPOKSI_MAP[newDapukan] || [];
    setSelectedTupoksiList(recs);
    setCustomTupoksiItems([]);
    setCustomTupoksiInput("");
  };

  const toggleTupoksiCheck = (item: string) => {
    setSelectedTupoksiList(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleAddCustomTupoksi = () => {
    const trimmed = customTupoksiInput.trim();
    if (!trimmed) return;
    if (!customTupoksiItems.includes(trimmed)) {
      setCustomTupoksiItems(prev => [...prev, trimmed]);
      setSelectedTupoksiList(prev => [...prev, trimmed]);
    }
    setCustomTupoksiInput("");
  };

  const mapDapukanToRole = (dap: string): CommitteeRole => {
    const d = dap.toLowerCase();
    if (d.includes("ketua")) return "ketua";
    if (d.includes("sekretaris")) return "sekretaris";
    if (d.includes("bendahara")) return "bendahara";
    if (d.includes("pengawas")) return "ketua";
    return "panitia";
  };

  const handleOpenAdd = () => {
    setEditingMember(null);
    setName("");
    setPhone("");
    setDapukan(DAPUKAN_OPTIONS[0]);
    const recs = TUPOKSI_MAP[DAPUKAN_OPTIONS[0]] || [];
    setSelectedTupoksiList(recs);
    setCustomTupoksiItems([]);
    setCustomTupoksiInput("");
    setDivisionId("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: CommitteeMember) => {
    setEditingMember(m);
    setName(m.name);
    setPhone(m.phone || "");
    const initialDapukan = m.position_title && DAPUKAN_OPTIONS.includes(m.position_title) ? m.position_title : DAPUKAN_OPTIONS[0];
    setDapukan(initialDapukan);
    const recs = TUPOKSI_MAP[initialDapukan] || [];
    const existingArr = m.tupoksi ? m.tupoksi.split(" • ").map(s => s.trim()).filter(Boolean) : recs;
    setSelectedTupoksiList(existingArr);
    
    const custom = existingArr.filter(item => !recs.includes(item));
    setCustomTupoksiItems(custom);
    setCustomTupoksiInput("");

    setDivisionId(m.division_id || "");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedDiv = divisions.find(d => d.id === divisionId);
    const calculatedRole = mapDapukanToRole(dapukan);
    const finalTupoksiString = selectedTupoksiList.join(" • ") || "Membantu koordinasi dan tugas operasional sesuai instruksi pimpinan.";

    if (editingMember) {
      onUpdateMember({
        ...editingMember,
        name,
        email: `${name.toLowerCase().replace(/\s+/g, "")}@generus.id`,
        phone,
        role: calculatedRole,
        position_title: dapukan,
        tupoksi: finalTupoksiString,
        division_id: divisionId,
        division_name: selectedDiv?.name,
      });
    } else {
      onAddMember({
        id: `com-${Date.now()}`,
        event_id: "evt-fg2026",
        name,
        email: `${name.toLowerCase().replace(/\s+/g, "")}@generus.id`,
        phone,
        role: calculatedRole,
        position_title: dapukan,
        tupoksi: finalTupoksiString,
        division_id: divisionId,
        division_name: selectedDiv?.name,
        status: "ACTIVE",
        active_tasks_count: 0,
      });
    }
    setIsModalOpen(false);
  };

  const getRoleBadge = (posTitle?: string) => {
    const p = (posTitle || "").toLowerCase();
    if (p.includes("ketua") || p.includes("pengawas")) return "bg-purple-500/20 text-purple-300 border-purple-500/40";
    if (p.includes("sekretaris")) return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
    if (p.includes("bendahara")) return "bg-amber-500/20 text-amber-300 border-amber-500/40";
    if (p.includes("juri") || p.includes("soal")) return "bg-rose-500/20 text-rose-300 border-rose-500/40";
    return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
  };

  const recommendations = TUPOKSI_MAP[dapukan] || [];
  const allDisplayTupoksiOptions = Array.from(new Set([...recommendations, ...customTupoksiItems]));

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" /> Fitur Kepanitiaan & Structure Customizer (Dapukan)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Atur struktur susunan kepanitiaan, Dapukan (Jabatan Panitia), serta Ceklist Rekomendasi Tupoksi & Opsi Tambah Tupoksi Custom.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* View Toggle */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === "cards" ? "bg-emerald-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Kartu & Tupoksi
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === "table" ? "bg-emerald-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
              }`}
            >
              <List className="w-3.5 h-3.5" /> Tabel Matriks
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20 shrink-0"
          >
            <Plus className="w-4 h-4" /> Tambah Panitia Baru
          </button>
        </div>
      </div>

      {/* Cards View (With Tupoksi Detail) */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {committee.map((m) => (
            <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-lg">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 border border-emerald-400/30 flex items-center justify-center text-slate-950 font-black text-sm shadow-md">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{m.name}</h3>
                      <p className="text-xs text-emerald-400 font-semibold">{m.position_title || "Panitia"}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shrink-0 ${getRoleBadge(m.position_title)}`}>
                    {m.position_title || "Panitia"}
                  </span>
                </div>

                {/* Division Tag */}
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <Building className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="truncate">Divisi: <strong className="text-slate-200">{m.division_name || "Inti / Pimpinan Event"}</strong></span>
                </div>

                {/* Tupoksi Section */}
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 text-amber-400" /> Tupoksi Ceklist Terpilih:
                  </div>
                  {m.tupoksi ? (
                    <ul className="space-y-1 text-xs text-slate-300">
                      {m.tupoksi.split(" • ").map((tItem, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span className="leading-snug">{tItem}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Belum diatur</p>
                  )}
                </div>
              </div>

              {/* Card Footer & Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{m.phone || "Kontak Panitia"}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(m)}
                    className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit Panitia & Dapukan"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteMember(m.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Hapus Anggota"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Anggota Panitia</th>
                  <th className="py-3.5 px-4">Dapukan (Posisi)</th>
                  <th className="py-3.5 px-4">Tupoksi (Fungsi Kerja)</th>
                  <th className="py-3.5 px-4">Divisi</th>
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
                          <div className="text-[10px] text-slate-500 font-normal">{m.phone || "No HP"}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{m.position_title || "Panitia"}</div>
                      <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getRoleBadge(m.position_title)}`}>
                        {m.position_title || "Panitia"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 max-w-xs">
                      <p className="line-clamp-2 text-[11px] italic text-slate-400">
                        {m.tupoksi || "Belum diatur"}
                      </p>
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

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
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
      )}

      {/* Edit/Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? "Edit Panitia & Dapukan" : "Tambah Panitia Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Nama Lengkap Panitia</label>
            <input
              type="text"
              required
              placeholder="misal: Ahmad Fulan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Dapukan (Jabatan Panitia)</label>
            <select
              value={dapukan}
              onChange={(e) => handleDapukanChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white font-bold focus:outline-none focus:border-emerald-500"
            >
              {DAPUKAN_OPTIONS.map((dap) => (
                <option key={dap} value={dap}>
                  {dap}
                </option>
              ))}
            </select>
          </div>

          {/* CEKLIST REKOMENDASI TUPOKSI + CUSTOM INPUT */}
          <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Ceklist Rekomendasi Tupoksi ({selectedTupoksiList.length} Dipilih)
              </label>
              <button
                type="button"
                onClick={() => setSelectedTupoksiList(allDisplayTupoksiOptions)}
                className="text-[11px] text-emerald-400 hover:underline font-semibold"
              >
                Pilih Semua
              </button>
            </div>

            <div className="space-y-2 pt-1">
              {allDisplayTupoksiOptions.map((tItem, idx) => {
                const isChecked = selectedTupoksiList.includes(tItem);
                return (
                  <label
                    key={idx}
                    onClick={() => toggleTupoksiCheck(tItem)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer text-xs transition-colors ${
                      isChecked
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-200 font-semibold"
                        : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-900"
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-snug">{tItem}</span>
                  </label>
                );
              })}
            </div>

            {/* OPSI MENAMBAHKAN TUPOKSI CUSTOM SENDIRI */}
            <div className="pt-3 border-t border-slate-800 space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-300 uppercase">
                + Tambah Tupoksi Custom / Manual Sendiri:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Tuliskan uraian tugas kustom tambahan di sini..."
                  value={customTupoksiInput}
                  onChange={(e) => setCustomTupoksiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomTupoksi();
                    }
                  }}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTupoksi}
                  className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold rounded-lg text-xs shrink-0 transition-colors"
                >
                  + Tambah
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Divisi Penugasan</label>
              <select
                value={divisionId}
                onChange={(e) => setDivisionId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- Inti / Pimpinan Non-Divisi --</option>
                {divisions.map((d) => (
                  <option key={d.id} value={d.id}>
                    Divisi {d.name}
                  </option>
                ))}
              </select>
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
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm transition-colors shadow-md shadow-emerald-500/20"
            >
              Simpan Panitia & Tupoksi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
