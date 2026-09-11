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
  FileSpreadsheet
} from "lucide-react";
import { FestivalEvent } from "@/lib/types";

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
}

export function HeaderNav({
  currentEvent,
  events,
  onSelectEvent,
  activeTab,
  setActiveTab,
  userRole = "Ketua Panitia",
  userName = "H. Zaki",
  unreadCount = 1,
  conflictCount = 0,
}: HeaderNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [eventDropdownOpen, setEventDropdownOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Command Center", icon: LayoutDashboard },
    { id: "live_event", label: "LIVE EVENT (H)", icon: Flame, highlight: true },
    { id: "incidents", label: "Incidents", icon: AlertTriangle },
    { id: "judge_panel", label: "Panel Juri Live", icon: Star },
    { id: "scoring_results", label: "Hasil & Juara", icon: Trophy },
    { id: "schedules", label: "Jadwal Engine", icon: Calendar, alert: conflictCount > 0 },
    { id: "competitions", label: "Cabang Lomba", icon: Award },
    { id: "participants", label: "Peserta Engine", icon: UserCheck },
    { id: "logistics", label: "Logistik", icon: Package },
    { id: "finance", label: "Finance (Kas)", icon: DollarSign },
    { id: "documents", label: "Dokumen", icon: FileText },
    { id: "reports", label: "Reports (LPJ)", icon: FileSpreadsheet },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Event Selector */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
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

          {/* Divider */}
          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          {/* Event Selector */}
          <div className="relative">
            <button
              onClick={() => setEventDropdownOpen(!eventDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-semibold text-slate-200 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span className="max-w-[120px] sm:max-w-[150px] truncate">{currentEvent.title}</span>
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

        {/* Desktop Navigation Items */}
        <nav className="hidden 2xl:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                  item.highlight
                    ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/30"
                    : isActive
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.alert ? (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                ) : null}
              </button>
            );
          })}
        </nav>

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
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="2xl:hidden p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="2xl:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  item.highlight
                    ? "bg-emerald-500 text-slate-950 font-black"
                    : isActive
                    ? "bg-emerald-500/20 text-emerald-400 font-bold"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
