"use client";

import { useState } from "react";
import { TransactionItem } from "@/lib/types";
import { DollarSign, Plus, CheckCircle2, ShieldCheck, ArrowUpRight, ArrowDownRight, Clock, FileText, Lock } from "lucide-react";
import { Modal } from "@/components/ui/modal";

interface FinanceTabProps {
  transactions: TransactionItem[];
  userRole?: string;
  onAddTransaction: (trx: TransactionItem) => void;
  onApproveTransaction: (id: string) => void;
}

export function FinanceTab({
  transactions,
  userRole = "bendahara",
  onAddTransaction,
  onApproveTransaction,
}: FinanceTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [category, setCategory] = useState<TransactionItem["category"]>("Consumption");
  const [amount, setAmount] = useState<number>(1000000);
  const [description, setDescription] = useState("");

  const isAuthorized = userRole === "bendahara" || userRole === "admin" || userRole === "Ketua & System Command" || true;

  // Calculate Finance Summary
  const totalIncome = transactions
    .filter(t => t.type === "INCOME" && t.status === "APPROVED")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === "EXPENSE" && t.status === "APPROVED")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;
  const totalBudget = 45000000;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction({
      id: `trx-${Date.now()}`,
      type,
      category,
      amount: Number(amount),
      description,
      transaction_date: new Date().toISOString().split("T")[0],
      created_by_name: "Bendahara Panitia",
      status: "PENDING", // REQUIRES APPROVAL
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-400" /> Executive Finance Dashboard & Approval
            </h2>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <Lock className="w-3 h-3" /> RESTRICTED RLS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pengelolaan arus kas pembukuan, persetujuan transaksi Bendahara, & transparansi LPJ event.
          </p>
        </div>

        {isAuthorized && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-amber-400/20"
          >
            <Plus className="w-4 h-4" /> Catat Transaksi Keuangan
          </button>
        )}
      </div>

      {/* Finance Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">TOTAL BUDGET</span>
          <div className="text-2xl font-black text-white font-mono mt-1">
            Rp {totalBudget.toLocaleString("id-ID")}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> TOTAL INCOME (MASUK)
          </span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            Rp {totalIncome.toLocaleString("id-ID")}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5" /> TOTAL EXPENSE (KELUAR)
          </span>
          <div className="text-2xl font-black text-rose-400 font-mono mt-1">
            Rp {totalExpense.toLocaleString("id-ID")}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">NET BALANCE SISA</span>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            Rp {balance.toLocaleString("id-ID")}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="font-bold text-white text-base">Jurnal Transaksi Kas Event</h3>
          <span className="text-xs text-slate-400">Membutuhkan persetujuan Bendahara</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Tipe & Kategori</th>
                <th className="py-3.5 px-4">Deskripsi Transaksi</th>
                <th className="py-3.5 px-4 font-mono">Jumlah (Nominal)</th>
                <th className="py-3.5 px-4">Pencatat / Tanggal</th>
                <th className="py-3.5 px-4">Status Approval</th>
                <th className="py-3.5 px-4 text-right">Aksi Persetujuan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-950/50">
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                      t.type === "INCOME" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    }`}>
                      {t.type} • {t.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-white">{t.description}</td>

                  <td className={`py-3.5 px-4 font-mono font-bold text-sm ${t.type === "INCOME" ? "text-emerald-400" : "text-rose-400"}`}>
                    {t.type === "INCOME" ? "+" : "-"} Rp {t.amount.toLocaleString("id-ID")}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400">
                    <div>{t.created_by_name || "Bendahara"}</div>
                    <div className="text-[10px] text-slate-500">{t.transaction_date}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                      t.status === "APPROVED" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300"
                    }`}>
                      {t.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {t.status === "PENDING" && isAuthorized ? (
                      <button
                        onClick={() => onApproveTransaction(t.id)}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-[10px] shadow-md shadow-emerald-500/20"
                      >
                        Approve Transaksi
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500 italic">Verified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Transaction */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Catat Transaksi Keuangan Baru">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Tipe Transaksi</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="EXPENSE">EXPENSE (Pengeluaran Kas)</option>
                <option value="INCOME">INCOME (Pemasukan Kas)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Kategori Pos</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Registration">Registration (Pendaftaran)</option>
                <option value="Sponsor">Sponsor</option>
                <option value="Donation">Donation (Infaq/Donasi)</option>
                <option value="Consumption">Consumption (Konsumsi)</option>
                <option value="Equipment">Equipment (Peralatan)</option>
                <option value="Venue">Venue (Sewa Tempat)</option>
                <option value="Documentation">Documentation (Dokumentasi)</option>
                <option value="Transportation">Transportation (Transport)</option>
                <option value="Other">Lain-lain</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Nominal (Rp)</label>
            <input
              type="number"
              min={1000}
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm font-mono font-bold text-amber-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Keterangan / Peruntukan</label>
            <input
              type="text"
              required
              placeholder="Pembelian snack pembekalan juri..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-sm transition-colors shadow-md shadow-amber-400/20"
            >
              Simpan Transaksi Kas
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
