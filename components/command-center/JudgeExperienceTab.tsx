"use client";

import { useState } from "react";
import { Competition, Participant, Criterion, ScoreItem, CompetitionJudge } from "@/lib/types";
import { calculateWeightedTotalScore } from "@/lib/store";
import { Star, CheckCircle, Lock, Unlock, ArrowRight, User, Award, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { Modal } from "@/components/ui/modal";

interface JudgeExperienceTabProps {
  competitions: Competition[];
  participants: Participant[];
  criteria: Criterion[];
  scores: ScoreItem[];
  judges: CompetitionJudge[];
  currentJudgeId?: string;
  currentJudgeName?: string;
  isAdmin?: boolean;
  onSaveScores: (newScores: ScoreItem[]) => void;
  onUnlockScores: (competitionId: string, participantId: string) => void;
}

export function JudgeExperienceTab({
  competitions,
  participants,
  criteria,
  scores,
  judges,
  currentJudgeId = "juri-1",
  currentJudgeName = "Ustadz Kyai Kholil",
  isAdmin = true,
  onSaveScores,
  onUnlockScores,
}: JudgeExperienceTabProps) {
  // Judge Assigned Competitions
  const myAssignedCompetitions = competitions.filter(c => 
    judges.some(j => j.competition_id === c.id && j.judge_id === currentJudgeId) || true // fallback show all for demo
  );

  const [selectedCompId, setSelectedCompId] = useState<string>(myAssignedCompetitions[0]?.id || "cmp-1");
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>(participants[0]?.id || "part-101");

  const currentComp = competitions.find(c => c.id === selectedCompId);
  const currentCompCriteria = criteria.filter(c => c.competition_id === selectedCompId);
  const currentParticipant = participants.find(p => p.id === selectedParticipantId);

  // Existing scores for this participant & judge
  const existingScores = scores.filter(s => 
    s.competition_id === selectedCompId && 
    s.participant_id === selectedParticipantId && 
    s.judge_id === currentJudgeId
  );

  const isLocked = existingScores.length > 0 && existingScores.every(s => s.is_locked);

  // Form State for scores per criterion
  const [scoreInputs, setScoreInputs] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    currentCompCriteria.forEach(crt => {
      const match = existingScores.find(s => s.criterion_id === crt.id);
      initial[crt.id] = match ? match.score : 85;
    });
    return initial;
  });

  const [notes, setNotes] = useState<string>(existingScores[0]?.notes || "");
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleScoreChange = (criterionId: string, value: number) => {
    if (isLocked && !isAdmin) return;
    setScoreInputs(prev => ({ ...prev, [criterionId]: Number(value) }));
  };

  const handleSubmitScores = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked && !isAdmin) return;

    const newScoreItems: ScoreItem[] = currentCompCriteria.map(crt => ({
      id: `sc-${selectedCompId}-${selectedParticipantId}-${crt.id}`,
      competition_id: selectedCompId,
      participant_id: selectedParticipantId,
      judge_id: currentJudgeId,
      judge_name: currentJudgeName,
      criterion_id: crt.id,
      criterion_name: crt.name,
      score: scoreInputs[crt.id] || 80,
      notes,
      is_locked: true, // SCORE LOCKING ENFORCEMENT
      submitted_at: new Date().toISOString(),
      locked_at: new Date().toISOString(),
    }));

    onSaveScores(newScoreItems);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Judge Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20">
            <Star className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">Panel Live Dewan Juri (Minimal Clicks)</h2>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Juri Logged In
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Juri: <span className="text-white font-bold">{currentJudgeName}</span> • Mode Penilaian Cepat Tablet/HP
            </p>
          </div>
        </div>

        {/* Competition Selector for Judge */}
        <select
          value={selectedCompId}
          onChange={(e) => setSelectedCompId(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
        >
          {myAssignedCompetitions.map((c) => (
            <option key={c.id} value={c.id}>
              🏆 {c.name} ({c.category})
            </option>
          ))}
        </select>
      </div>

      {showSuccessToast && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs font-bold flex items-center justify-between animate-fade-in shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Nilai berhasil disimpan & DILOCK! Data tersimpan di database.</span>
          </div>
        </div>
      )}

      {/* Main Scoring Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Participant Selector List */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <User className="w-4 h-4 text-teal-400" /> Daftar Peserta Tampil ({participants.length})
          </h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {participants.map((p) => {
              const isSelected = p.id === selectedParticipantId;
              const pScores = scores.filter(s => s.participant_id === p.id && s.competition_id === selectedCompId);
              const pLocked = pScores.length > 0 && pScores.every(s => s.is_locked);

              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedParticipantId(p.id);
                    // update form state for this participant
                    const pScoresExisting = scores.filter(s => s.participant_id === p.id && s.competition_id === selectedCompId);
                    const updatedInputs: Record<string, number> = {};
                    currentCompCriteria.forEach(crt => {
                      const m = pScoresExisting.find(s => s.criterion_id === crt.id);
                      updatedInputs[crt.id] = m ? m.score : 85;
                    });
                    setScoreInputs(updatedInputs);
                    setNotes(pScoresExisting[0]?.notes || "");
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold shadow-md"
                      : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <div>
                    <div className="font-bold text-white text-sm">{p.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{p.group_name} • {p.category}</div>
                  </div>

                  {pLocked ? (
                    <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> LOCKED
                    </span>
                  ) : pScores.length > 0 ? (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-400/20 text-amber-300">
                      SUBMITTED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[9px] font-medium bg-slate-800 text-slate-400">
                      BELUM
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Score Input Form */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">PESERTA SEDANG DINILAI</span>
              <h3 className="text-2xl font-black text-white">{currentParticipant?.name || "Pilih Peserta"}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Utusan: <span className="text-emerald-400 font-semibold">{currentParticipant?.group_name}</span> • Cabang: <span className="text-white font-semibold">{currentComp?.name}</span>
              </p>
            </div>

            {isLocked ? (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-extrabold rounded-lg flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> LOCKED (FINAL SUBMISSION)
                </span>
                {isAdmin && (
                  <button
                    onClick={() => onUnlockScores(selectedCompId, selectedParticipantId)}
                    className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1 shadow-md shadow-amber-400/20"
                    title="Unlock Score (Khusus Admin/Ketua)"
                  >
                    <Unlock className="w-3.5 h-3.5" /> Unlock Score
                  </button>
                )}
              </div>
            ) : (
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> SIAP INPUT SKOR
              </span>
            )}
          </div>

          <form onSubmit={handleSubmitScores} className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Indikator & Kriteria Penilaian (Weighted Scoring):</h4>

              {currentCompCriteria.map((crt) => (
                <div key={crt.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{crt.name}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold">
                      Bobot (Weight): {crt.weight}%
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={50}
                      max={100}
                      disabled={isLocked && !isAdmin}
                      value={scoreInputs[crt.id] || 85}
                      onChange={(e) => handleScoreChange(crt.id, Number(e.target.value))}
                      className="flex-1 accent-emerald-400 bg-slate-900 rounded-lg cursor-pointer disabled:opacity-50"
                    />
                    <input
                      type="number"
                      min={0}
                      max={100}
                      disabled={isLocked && !isAdmin}
                      value={scoreInputs[crt.id] || 85}
                      onChange={(e) => handleScoreChange(crt.id, Number(e.target.value))}
                      className="w-20 bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-base font-black font-mono text-emerald-400 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Catatan Evaluasi Juri</label>
              <textarea
                rows={2}
                disabled={isLocked && !isAdmin}
                placeholder="Catatan khusus tajwid / intonasi / fashohah peserta..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <div className="text-xs text-slate-400">
                Formula Weighted Score: <span className="font-mono text-emerald-400 font-bold">&sum; (Skor &times; Bobot%)</span>
              </div>

              <button
                type="submit"
                disabled={isLocked && !isAdmin}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-extrabold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
              >
                <Lock className="w-4 h-4" /> Submit & Lock Score <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
