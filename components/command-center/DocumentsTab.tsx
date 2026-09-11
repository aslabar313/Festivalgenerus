"use client";

import { useState } from "react";
import { DocumentItem } from "@/lib/types";
import { FileText, Plus, Download, Clock, Tag } from "lucide-react";
import { Modal } from "@/components/ui/modal";

interface DocumentsTabProps {
  documents: DocumentItem[];
  onAddDocument: (doc: DocumentItem) => void;
}

export function DocumentsTab({ documents, onAddDocument }: DocumentsTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState<DocumentItem["category"]>("Proposal");
  const [fileUrl, setFileUrl] = useState("https://generus.id/docs/doc_sample.pdf");
  const [version, setVersion] = useState("v1.0");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDocument({
      id: `doc-${Date.now()}`,
      name,
      category,
      file_url: fileUrl,
      version,
      created_at: new Date().toISOString(),
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" /> Pusat Dokumen & Arsip Event
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Penyimpanan dokumen penting: Proposal, Surat Izin, Buku Juknis, Rundown, SK Juri, & LPJ Akhir.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" /> Unggah Dokumen Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {doc.category}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{doc.version}</span>
              </div>

              <div>
                <h3 className="font-bold text-white text-base truncate">{doc.name}</h3>
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" /> {new Date(doc.created_at).toLocaleDateString("id-ID")}
                </span>
              </div>
            </div>

            <a
              href={doc.file_url}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-emerald-400 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Unduh Dokumen
            </a>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Unggah Dokumen Arsip Baru">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Nama Dokumen</label>
            <input
              type="text"
              required
              placeholder="Rundown_Resmi_Festival_Generus_2026.pdf"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Kategori Dokumen</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Proposal">Proposal</option>
                <option value="Surat">Surat Perizinan</option>
                <option value="Juknis">Buku Juknis</option>
                <option value="Rundown">Rundown Acara</option>
                <option value="Participant List">Participant List</option>
                <option value="Judge List">Judge List (SK Juri)</option>
                <option value="LPJ">LPJ Laporan</option>
                <option value="Certificate">Certificate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Versi Dokumen</label>
              <input
                type="text"
                required
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">URL File (Supabase Storage / Link)</label>
            <input
              type="text"
              required
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm transition-colors shadow-md shadow-emerald-500/20"
            >
              Simpan Dokumen Arsip
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
