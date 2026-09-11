"use client";

import { useState } from "react";
import { InventoryItem } from "@/lib/types";
import { Package, Plus, CheckCircle2, AlertTriangle, User, MapPin } from "lucide-react";
import { Modal } from "@/components/ui/modal";

interface LogisticsTabProps {
  inventory: InventoryItem[];
  onAddInventory: (item: InventoryItem) => void;
  onUpdateInventoryStatus: (id: string, status: InventoryItem["status"]) => void;
}

export function LogisticsTab({
  inventory,
  onAddInventory,
  onUpdateInventoryStatus,
}: LogisticsTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Audio & Sound");
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState("Gedung Utama");
  const [pic, setPic] = useState("Budi Santoso");

  const readyCount = inventory.filter(i => i.status === "READY" || i.status === "RETURNED").length;
  const borrowedCount = inventory.filter(i => i.status === "BORROWED").length;
  const damagedCount = inventory.filter(i => i.status === "DAMAGED").length;
  const missingCount = inventory.filter(i => i.status === "MISSING").length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddInventory({
      id: `inv-${Date.now()}`,
      name,
      category,
      quantity: Number(quantity),
      available_quantity: Number(quantity),
      condition: "GOOD",
      location,
      pic,
      status: "READY",
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" /> Inventaris & Logistik Peralatan
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manajemen sarana panggung, sound system, genset, & perlengkapan gedung event.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" /> Tambah Inventaris
        </button>
      </div>

      {/* Logistics Dashboard Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">EQUIPMENT READY</span>
          <div className="text-2xl font-black text-white font-mono mt-1">{readyCount} Unit</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">BORROWED</span>
          <div className="text-2xl font-black text-white font-mono mt-1">{borrowedCount} Unit</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">DAMAGED</span>
          <div className="text-2xl font-black text-white font-mono mt-1">{damagedCount} Unit</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">MISSING</span>
          <div className="text-2xl font-black text-white font-mono mt-1">{missingCount} Unit</div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Nama Barang</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Jumlah</th>
                <th className="py-3.5 px-4">Lokasi & PIC</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-950/50">
                  <td className="py-3.5 px-4 font-bold text-white">{item.name}</td>
                  <td className="py-3.5 px-4 text-slate-400">{item.category}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{item.quantity} Unit</td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <div>{item.location}</div>
                    <div className="text-[10px] text-slate-500">PIC: {item.pic}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold ${
                      item.status === "READY" || item.status === "RETURNED"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : item.status === "BORROWED"
                        ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={item.status}
                      onChange={(e) => onUpdateInventoryStatus(item.id, e.target.value as any)}
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="READY">READY</option>
                      <option value="BORROWED">BORROWED</option>
                      <option value="DAMAGED">DAMAGED</option>
                      <option value="MISSING">MISSING</option>
                      <option value="RETURNED">RETURNED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Inventaris Logistik">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Nama Barang / Peralatan</label>
            <input
              type="text"
              required
              placeholder="Sound System Line Array 5000W"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Audio & Sound">Audio & Sound</option>
                <option value="Kelistrikan">Kelistrikan</option>
                <option value="Mebel & Tenda">Mebel & Tenda</option>
                <option value="Kamera & Media">Kamera & Media</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Jumlah Unit</label>
              <input
                type="number"
                min={1}
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Lokasi Penyimpanan</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">PIC Penanggung Jawab</label>
              <input
                type="text"
                required
                value={pic}
                onChange={(e) => setPic(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm transition-colors shadow-md shadow-emerald-500/20"
            >
              Simpan Inventaris
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
