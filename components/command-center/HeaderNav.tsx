"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Trophy, 
  ChevronDown, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  Calendar,
  LayoutDashboard,
  Users,
  Building,
  CheckSquare,
  AlertTriangle,
  Award,
  UserCheck,
  Bell,
  FileText,
  Star,
  Flame,
  Package,
  DollarSign,
  FileSpreadsheet,
  MessageSquare,
  Clock,
  Grid,
  Sparkles,
  Search
} from "lucide-react";
import { FestivalEvent } from "@/lib/types";
import { getAllowedTabsForRole, EventPhaseMode } from "@/lib/rbac";
import { Modal } from "@/components/ui/modal";

interface HeaderNavProps {
  currentEvent: FestivalEvent;
  events: FestivalEvent[];
  onSelectEvent: (event: FestivalEvent) => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  userRole?: string;
  userName?: string;
  unreadCount?: number;
  conflictCount?: number;
  eventPhaseMode?: EventPhaseMode;
  onPhaseChange?: (phase: EventPhaseMode) => void;
}

export function HeaderNav({
  currentEvent,
  events,
  onSelectEvent,
  activeTab,
  setActiveTab,
  userRole = "Super Admin",
  userName = "Superadmin",
  unreadCount = 0,
  conflictCount = 0,
  eventPhaseMode = "REGISTRATION_OPEN",
  onPhaseChange,
}: HeaderNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [menuSearch, setMenuSearch] = useState("");

  const allNavItems = [
    { id: "dashboard", label: "Command Center", icon: LayoutDashboard, category: "Operasional", desc: "Dashboard utama & pemantauan kesehatan event" },
    { id: "countdown", label: "Countdown Event", icon: Clock, category: "Operasional", desc: "Hitung mundur persiapan event" },
    { id: "live_event", label: "LIVE EVENT (H)", icon: Flame, highlight: true, category: "Operasional", desc: "Monitoring panggung & check-in lokasi" },
    { id: "judge_panel", label: "Panel Juri Live", icon: Star, category: "Operasional", desc: "Penilaian live score dewan juri" },
    { id: "scoring_results", label: "Hasil & Juara", icon: Trophy, category: "Operasional", desc: "Klasemen & pengumuman pemenang" },

    { id: "musyawaroh", label: "Musyawaroh / Notulensi", icon: MessageSquare, category: "Manajemen", desc: "Notulensi rapat pimpinan & presensi" },
    { id: "competitions", label: "Cabang Lomba", icon: Award, category: "Manajemen", desc: "Juknis & skema kriteria lomba" },
    { id: "schedules", label: "Jadwal Engine", icon: Calendar, alert: conflictCount > 0, category: "Manajemen", desc: "Pencegah bentrok venue & juri" },
    { id: "incidents", label: "Incidents", icon: AlertTriangle, category: "Manajemen", desc: "Pelaporan & respon kendala lapangan" },

    { id: "participants", label: "Peserta Engine", icon: UserCheck, category: "Peserta & Tim", desc: "Pendaftaran & verifikasi utusan" },
    { id: "committee", label: "Kepanitiaan & Tupoksi", icon: Users, category: "Peserta & Tim", desc: "Struktur panitia & pembagian peran" },
    { id: "tasks", label: "Tasks Engine", icon: CheckSquare, category: "Peserta & Tim", desc: "Manajemen instruksi & deadline" },
    { id: "divisions", label: "Divisi Panitia", icon: Building, category: "Peserta & Tim", desc: "Daftar unit divisi pelaksana" },

    { id: "logistics", label: "Logistik & Barang", icon: Package, category: "Logistik & Kas", desc: "Inventarisasi alat, sound & gedung" },
    { id: "finance", label: "Finance (Kas)", icon: DollarSign, category: "Logistik & Kas", desc: "Pencatatan kas masuk & pengeluaran" },
    { id: "documents", label: "Dokumen Arsip", icon: FileText, category: "Logistik & Kas", desc: "Proposal, surat & perizinan" },
    { id: "reports", label: "Reports (LPJ)", icon: FileSpreadsheet, category: "Logistik & Kas", desc: "Laporan pertanggungjawaban" },
  ];

  const allowedTabs = getAllowedTabsForRole(userRole, eventPhaseMode);
  const navItems = allNavItems.filter(item => allowedTabs.includes(item.id));

  // Top header shortcuts (First 4 primary tabs)
  const headerShortcuts = navItems.slice(0, 4);

  const filteredMenuItems = navItems.filter(item => 
    item.label.toLowerCase().includes(menuSearch.toLowerCase()) ||
    item.desc.toLowerCase().includes(menuSearch.toLowerCase()) ||
    item.category.toLowerCase().includes(menuSearch.toLowerCase())
  );

  const categories = Array.from(new Set(navItems.map(i => i.category)));

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Event Selector */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 rounded-xl text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Trophy className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-base text-white tracking-tight block">
                FestivalGenerus OS
              </span>
              <span className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase block -mt-1">
                PRODUCTION v1.0
              </span>
            </div>
          </Link>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          {/* Event Selector */}
          <div className="relative">
            <button
              onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-semibold text-slate-200 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span className="max-w-[110px] sm:max-w-[140px] truncate">{currentEvent.title}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {eventDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-2 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1.5">
                  Select Event Context
                </div>
                {events.map((evt) => (
                  <button
                    key={evt.id}
                    onClick={() => {
                      onSelectEvent(evt);
                      setEventDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      evt.id === currentEvent.id
                        ? "bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <span>{evt.title}</span>
                    {evt.id === currentEvent.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Header Shortcuts & MEGA MENU BUTTON (No Scroll Needed!) */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Direct Top Shortcuts */}
          {headerShortcuts.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  item.highlight
                    ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/30"
                    : isActive
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* MEGA MENU ALL FEATURES BUTTON */}
          <button
            onClick={() => setIsMegaMenuOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold rounded-lg text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
          >
            <Grid className="w-4 h-4" />
            <span>Semua Fitur ({navItems.length})</span>
          </button>
        </div>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1 justify-end">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {userName}
            </span>
            <span className="text-[10px] text-slate-400">{userRole}</span>
          </div>

          <Link
            href="/login"
            className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
            title="Keluar / Ganti Akun"
          >
            <LogOut className="w-4 h-4" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMegaMenuOpen(true)}
            className="lg:hidden p-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30"
            title="Buka Menu Fitur"
          >
            <Grid className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* MEGA MENU MODAL / GRID MENU (ZERO SCROLL FITUR LAUNCHER) */}
      {isMegaMenuOpen && (
        <Modal
          isOpen={isMegaMenuOpen}
          onClose={() => setIsMegaMenuOpen(false)}
          title="⚡ NAVIGASI SEMUA FITUR APLIKASI (MENU GRID)"
        >
          <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Cari fitur aplikasi..."
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Categorized Features Grid */}
            {categories.map((cat) => {
              const catItems = filteredMenuItems.filter(i => i.category === cat);
              if (catItems.length === 0) return null;

              return (
                <div key={cat} className="space-y-2">
                  <div className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 border-b border-slate-800 pb-1">
                    <Sparkles className="w-3.5 h-3.5" /> Kategori: {cat}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {catItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setIsMegaMenuOpen(false);
                          }}
                          className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 group ${
                            isActive
                              ? "bg-emerald-500/15 border-emerald-500/50 text-white shadow-md shadow-emerald-950/30"
                              : "bg-slate-950/80 border-slate-800/90 text-slate-300 hover:bg-slate-900 hover:border-slate-700"
                          }`}
                        >
                          <div className={`p-2.5 rounded-lg shrink-0 transition-transform group-hover:scale-110 ${
                            item.highlight
                              ? "bg-emerald-500 text-slate-950 font-bold"
                              : isActive
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-slate-900 text-slate-400 group-hover:text-emerald-400"
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                              <span>{item.label}</span>
                              {isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                              {item.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Modal>
      )}
    </header>
  );
}
