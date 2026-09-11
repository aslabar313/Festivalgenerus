"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Trophy, 
  Users, 
  Award, 
  Calendar, 
  Plus, 
  Search, 
  LogOut, 
  UserCheck, 
  FileText, 
  CheckCircle,
  Clock,
  Sparkles
} from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"events" | "participants" | "scoring">("events");

  // Sample data for initial preview
  const events = [
    { id: "1", title: "Festival Generus Daerah 2026", date: "15-17 Oktober 2026", participants: 142, status: "Aktif", location: "Gedung Serbaguna Daerah" },
    { id: "2", title: "Musabaqah Tahfidz Cabe Rawit", date: "20 November 2026", participants: 58, status: "Mendatang", location: "Masjid Al-Fattah" },
  ];

  const participants = [
    { id: "P001", name: "Muhammad Faiz", category: "Tahfidz Juz 30", group: "Desa Kebon Jeruk", age: "Cabe Rawit", status: "Terverifikasi" },
    { id: "P002", name: "Aisyah Humaira", category: "Mewarnai & Kaligrafi", group: "Desa Sukamaju", age: "Cabe Rawit", status: "Terverifikasi" },
    { id: "P003", name: "Rizky Ramadhan", category: "Adzan & Iqamah", group: "Desa Mekar Sari", age: "Pra-Remaja", status: "Pending" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-emerald-500 p-2 rounded-xl text-slate-950">
              <Trophy className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="font-bold text-lg text-white">FestivalGenerus SaaS</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-slate-200">Panitia Festival</div>
            <div className="text-xs text-emerald-400">Role: Panitia Event / Admin</div>
          </div>
          <Link
            href="/login"
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Nav */}
        <aside className="space-y-2">
          <button
            onClick={() => setActiveTab("events")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
              activeTab === "events"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700"
            }`}
          >
            <Calendar className="w-4 h-4" /> Manajemen Event
          </button>

          <button
            onClick={() => setActiveTab("participants")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
              activeTab === "participants"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700"
            }`}
          >
            <Users className="w-4 h-4" /> Data Peserta & Kontingen
          </button>

          <button
            onClick={() => setActiveTab("scoring")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
              activeTab === "scoring"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700"
            }`}
          >
            <Award className="w-4 h-4" /> Panel Penilaian Juri
          </button>

          <div className="pt-6 border-t border-slate-800/80 mt-6">
            <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl text-xs space-y-2">
              <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Database Connected
              </div>
              <p className="text-slate-400">
                Terhubung dengan Supabase Cloud. Siap untuk sinkronisasi data real-time.
              </p>
            </div>
          </div>
        </aside>

        {/* Dashboard View */}
        <main className="md:col-span-3 space-y-6">
          {/* Top Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 mb-1">Total Event Active</div>
              <div className="text-2xl font-extrabold text-white flex items-center justify-between">
                <span>2 Event</span>
                <Calendar className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 mb-1">Total Peserta Terdaftar</div>
              <div className="text-2xl font-extrabold text-white flex items-center justify-between">
                <span>200 Orang</span>
                <Users className="w-6 h-6 text-teal-400" />
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 mb-1">Status Penilaian</div>
              <div className="text-2xl font-extrabold text-white flex items-center justify-between">
                <span>Real-time</span>
                <Award className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </div>

          {/* Dynamic Tab Content */}
          {activeTab === "events" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Daftar Festival & Event Perlombaan</h2>
                  <p className="text-xs text-slate-400">Kelola cabang perlombaan dan kategori umur</p>
                </div>
                <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-2 transition-all">
                  <Plus className="w-4 h-4" /> Buat Event Baru
                </button>
              </div>

              <div className="space-y-4">
                {events.map((evt) => (
                  <div key={evt.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base">{evt.title}</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {evt.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {evt.date}</span>
                        <span>•</span>
                        <span>{evt.location}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-medium">{evt.participants} Peserta</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg">
                        Detail & Kategori
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "participants" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Data Registrasi Peserta</h2>
                  <p className="text-xs text-slate-400">Verifikasi status pendaftaran per utusan desa/kelompok</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Cari peserta/desa..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">ID / Nama</th>
                      <th className="py-3 px-4">Kategori Lomba</th>
                      <th className="py-3 px-4">Utusan / Kelompok</th>
                      <th className="py-3 px-4">Tingkat</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {participants.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-950/50">
                        <td className="py-3 px-4 font-semibold text-white">
                          <div>{p.name}</div>
                          <div className="text-[10px] text-slate-500">{p.id}</div>
                        </td>
                        <td className="py-3 px-4">{p.category}</td>
                        <td className="py-3 px-4">{p.group}</td>
                        <td className="py-3 px-4">{p.age}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            p.status === "Terverifikasi"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "scoring" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white">Panel Penilaian Dewan Juri</h2>
                <p className="text-xs text-slate-400">Input skor penilaian live untuk peserta tampil</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-slate-800 gap-2">
                  <div>
                    <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Sedang Tampil</span>
                    <h3 className="text-xl font-bold text-white">Muhammad Faiz (P001)</h3>
                    <p className="text-xs text-slate-400">Cabang: Tahfidz Juz 30 • Utusan: Desa Kebon Jeruk</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-lg self-start sm:self-auto">
                    Juri: Tahfidz Al-Qur'an
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Tajwid & Makhorijul Huruf (Max 40)</label>
                    <input type="number" max={40} defaultValue={38} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm font-bold text-emerald-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Fashohah & Kelancaran (Max 30)</label>
                    <input type="number" max={30} defaultValue={29} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm font-bold text-emerald-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Adab & Lagu (Max 30)</label>
                    <input type="number" max={30} defaultValue={27} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm font-bold text-emerald-400" />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm flex items-center gap-2 shadow-md shadow-emerald-500/20">
                    <CheckCircle className="w-4 h-4" /> Simpan Nilai Peserta
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
