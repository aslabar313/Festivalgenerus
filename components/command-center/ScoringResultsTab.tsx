"use client";

import { useState } from "react";
import { Competition, Participant, Criterion, ScoreItem, CompetitionResult } from "@/lib/types";
import { calculateWeightedTotalScore } from "@/lib/store";
import { Trophy, Award, Medal, Info, ShieldCheck, FileSpreadsheet } from "lucide-react";

interface ScoringResultsTabProps {
  competitions: Competition[];
  participants: Participant[];
  criteria: Criterion[];
  scores: ScoreItem[];
}

export function ScoringResultsTab({
  competitions,
  participants,
  criteria,
  scores,
}: ScoringResultsTabProps) {
  const [selectedCompId, setSelectedCompId] = useState<string>(competitions[0]?.id || "cmp-1");

  const currentComp = competitions.find(c => c.id === selectedCompId);
  const currentCriteria = criteria.filter(c => c.competition_id === selectedCompId);

  // Highest weight criterion for secondary tie-breaker
  const highestWeightCriterion = [...currentCriteria].sort((a, b) => b.weight - a.weight)[0];

  // Calculate results for each participant registered in this competition
  const participantResults = participants.map((p) => {
    const pScores = scores.filter(s => s.competition_id === selectedCompId && s.participant_id === p.id);
    const totalWeightedScore = calculateWeightedTotalScore(pScores, currentCriteria);

    // Get score in highest weight criterion for secondary tie-breaker
    const highestCrtScore = pScores.find(s => s.criterion_id === highestWeightCriterion?.id)?.score || 0;
    const earliestSubmission = pScores[0]?.submitted_at || "9999-12-31";

    return {
      participant: p,
      scores: pScores,
      total_score: totalWeightedScore,
      highest_crt_score: highestCrtScore,
      earliest_submission: earliestSubmission,
    };
  });

  // SORT BY RANKING RULES (TIE HANDLING IMPLEMENTED):
  // Rule 1: Highest Total Weighted Score
  // Rule 2: Highest Score in Criterion with Highest Weight
  // Rule 3: Earlier Submission Time
  participantResults.sort((a, b) => {
    if (b.total_score !== a.total_score) return b.total_score - a.total_score;
    if (b.highest_crt_score !== a.highest_crt_score) return b.highest_crt_score - a.highest_crt_score;
    return a.earliest_submission.localeCompare(b.earliest_submission);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" /> Hasil Akhir & Perankingan Juara (Automatic Ranking Engine)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Kalkulasi otomatis weighted total score & penanganan tie (Aturan Tie-Breaker: Skor Bobot Tertinggi &rarr; Skor Kriteria Bobot Terbesar).
          </p>
        </div>

        <select
          value={selectedCompId}
          onChange={(e) => setSelectedCompId(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
        >
          {competitions.map((c) => (
            <option key={c.id} value={c.id}>
              🏆 {c.name} ({c.category})
            </option>
          ))}
        </select>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* JUARA 1 */}
        {participantResults[0] && (
          <div className="bg-gradient-to-b from-amber-500/20 via-slate-900 to-slate-900 border-2 border-amber-500 p-6 rounded-2xl shadow-xl shadow-amber-500/10 text-center space-y-3 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center mx-auto shadow-md shadow-amber-400/30">
              🥇
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">JUARA 1</span>
              <h3 className="text-xl font-black text-white">{participantResults[0].participant.name}</h3>
              <p className="text-xs text-slate-300">{participantResults[0].participant.group_name}</p>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-3xl font-black text-amber-400 font-mono">{participantResults[0].total_score}</span>
              <span className="text-xs text-slate-400 block font-mono">Weighted Total Score</span>
            </div>
          </div>
        )}

        {/* JUARA 2 */}
        {participantResults[1] && (
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-300 text-slate-950 font-black text-xl flex items-center justify-center mx-auto">
              🥈
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">JUARA 2</span>
              <h3 className="text-lg font-bold text-white">{participantResults[1].participant.name}</h3>
              <p className="text-xs text-slate-300">{participantResults[1].participant.group_name}</p>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-2xl font-bold text-slate-200 font-mono">{participantResults[1].total_score}</span>
              <span className="text-xs text-slate-400 block font-mono">Weighted Total Score</span>
            </div>
          </div>
        )}

        {/* JUARA 3 */}
        {participantResults[2] && (
          <div className="bg-slate-900 border border-amber-900/60 p-6 rounded-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-700 text-white font-black text-xl flex items-center justify-center mx-auto">
              🥉
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">JUARA 3</span>
              <h3 className="text-lg font-bold text-white">{participantResults[2].participant.name}</h3>
              <p className="text-xs text-slate-300">{participantResults[2].participant.group_name}</p>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-2xl font-bold text-amber-500 font-mono">{participantResults[2].total_score}</span>
              <span className="text-xs text-slate-400 block font-mono">Weighted Total Score</span>
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-white text-base">Tabel Rekapitulasi Nilai & Perankingan</h3>
            <p className="text-xs text-slate-400">Rincian skor per indikator dewan juri</p>
          </div>

          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-mono">
            Aturan Tie-Breaker: <span className="text-emerald-400 font-bold">1. Total Skor &rarr; 2. Skor {highestWeightCriterion?.name} ({highestWeightCriterion?.weight}%)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Peringkat</th>
                <th className="py-3.5 px-4">Nama Peserta</th>
                <th className="py-3.5 px-4">Utusan Desa</th>
                {currentCriteria.map(crt => (
                  <th key={crt.id} className="py-3.5 px-4 font-mono">{crt.name} ({crt.weight}%)</th>
                ))}
                <th className="py-3.5 px-4 font-mono font-bold text-emerald-400">Total Weighted Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {participantResults.map((res, idx) => (
                <tr key={res.participant.id} className="hover:bg-slate-950/50">
                  <td className="py-3.5 px-4 font-bold font-mono text-white">
                    <span className={`px-2.5 py-1 rounded-md text-xs ${
                      idx === 0 ? "bg-amber-400 text-slate-950 font-black" : idx === 1 ? "bg-slate-300 text-slate-950 font-bold" : idx === 2 ? "bg-amber-700 text-white font-bold" : "bg-slate-800 text-slate-400"
                    }`}>
                      #{idx + 1}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-white">{res.participant.name}</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-semibold">{res.participant.group_name}</td>

                  {currentCriteria.map(crt => {
                    const matchScore = res.scores.find(s => s.criterion_id === crt.id);
                    return (
                      <td key={crt.id} className="py-3.5 px-4 font-mono font-semibold text-slate-200">
                        {matchScore ? matchScore.score : "-"}
                      </td>
                    );
                  })}

                  <td className="py-3.5 px-4 font-mono font-extrabold text-base text-emerald-400">
                    {res.total_score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
