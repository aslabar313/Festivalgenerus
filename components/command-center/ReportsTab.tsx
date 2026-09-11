"use client";

import { FestivalEvent, Participant, Competition, TransactionItem, Task, IncidentItem } from "@/lib/types";
import { FileSpreadsheet, Printer, Download, Trophy, DollarSign, Users, CheckCircle2 } from "lucide-react";

interface ReportsTabProps {
  event: FestivalEvent;
  participants: Participant[];
  competitions: Competition[];
  transactions: TransactionItem[];
  tasks: Task[];
  incidents: IncidentItem[];
}

export function ReportsTab({
  event,
  participants,
  competitions,
  transactions,
  tasks,
  incidents,
}: ReportsTabProps) {
  const handlePrintReport = () => {
    window.print();
  };

  const totalIncome = transactions.filter(t => t.type === "INCOME" && t.status === "APPROVED").reduce((a, b) => a + b.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "EXPENSE" && t.status === "APPROVED").reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" /> Pusat Laporan Akhir (LPJ & Export Report)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Laporan pertanggungjawaban panitia: Rekap Keuangan, Daftar Pemenang Lomba, Evaluasi Kinerja Divisi, & Log Insiden.
          </p>
        </div>

        <button
          onClick={handlePrintReport}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
        >
          <Printer className="w-4 h-4" /> Cetak / Export PDF LPJ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Executive Summary Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-base border-b border-slate-800 pb-2">1. Ringkasan Eksekutif Event</h3>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Judul Event:</span>
              <span className="font-bold text-white">{event.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tanggal Pelaksanaan:</span>
              <span className="font-bold text-white">{event.start_date} - {event.end_date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Peserta Terdaftar:</span>
              <span className="font-bold text-emerald-400">{participants.length} Peserta</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cabang Perlombaan:</span>
              <span className="font-bold text-cyan-400">{competitions.length} Lomba</span>
            </div>
          </div>
        </div>

        {/* Financial LPJ Summary Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-base border-b border-slate-800 pb-2">2. Rekap Pertanggungjawaban Keuangan (LPJ)</h3>
          <div className="space-y-2 text-xs text-slate-300 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Total Pemasukan Kas:</span>
              <span className="font-bold text-emerald-400">+ Rp {totalIncome.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Total Pengeluaran Kas:</span>
              <span className="font-bold text-rose-400">- Rp {totalExpense.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-800 text-sm">
              <span className="text-white font-bold font-sans">Sisa Saldo Kas (Balance):</span>
              <span className="font-bold text-amber-400">Rp {(totalIncome - totalExpense).toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
