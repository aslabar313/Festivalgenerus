import { 
  FestivalEvent, 
  Division, 
  CommitteeMember, 
  Task, 
  Risk, 
  Competition,
  Participant,
  Registration,
  Criterion,
  CompetitionJudge,
  ScoreItem,
  Venue,
  ScheduleItem,
  ScheduleConflict,
  IncidentItem,
  InventoryItem,
  TransactionItem,
  DocumentItem,
  NotificationItem,
  AuditTrailItem,
  ActionNeededItem, 
  EventHealthDetails,
  MusyawarohItem 
} from "./types";

export const DEFAULT_EVENT: FestivalEvent = {
  id: "evt-fg2026",
  title: "Festival Generus 2026",
  description: "Ajang Perlombaan & Pembinaan Generasi Penerus Tingkat Daerah 2026",
  start_date: "2026-12-11",
  end_date: "2026-12-13",
  start_time: "08:00",
  end_time: "17:00",
  venue: "-",
  status: "open",
  budget: 0,
  created_at: new Date().toISOString(),
};

export const INITIAL_DIVISIONS: Division[] = [];
export const INITIAL_COMMITTEE: CommitteeMember[] = [];
export const INITIAL_MUSYAWAROH: MusyawarohItem[] = [];
export const INITIAL_TASKS: Task[] = [];
export const INITIAL_RISKS: Risk[] = [];
export const INITIAL_COMPETITIONS: Competition[] = [];
export const INITIAL_PARTICIPANTS: Participant[] = [];
export const INITIAL_REGISTRATIONS: Registration[] = [];
export const INITIAL_CRITERIA: Criterion[] = [];
export const INITIAL_COMPETITION_JUDGES: CompetitionJudge[] = [];
export const INITIAL_SCORES: ScoreItem[] = [];
export const INITIAL_VENUES: Venue[] = [];
export const INITIAL_SCHEDULES: ScheduleItem[] = [];
export const INITIAL_INCIDENTS: IncidentItem[] = [];
export const INITIAL_INVENTORY: InventoryItem[] = [];
export const INITIAL_TRANSACTIONS: TransactionItem[] = [];
export const INITIAL_DOCUMENTS: DocumentItem[] = [];
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
export const INITIAL_AUDIT_TRAIL: AuditTrailItem[] = [];

export function calculateWeightedTotalScore(scores: ScoreItem[], criteria: Criterion[]): number {
  if (!scores.length || !criteria.length) return 0;
  let totalWeightedScore = 0;

  criteria.forEach(crt => {
    const crtScores = scores.filter(s => s.criterion_id === crt.id);
    if (crtScores.length > 0) {
      const avgScore = crtScores.reduce((acc, curr) => acc + curr.score, 0) / crtScores.length;
      totalWeightedScore += (avgScore * (crt.weight / 100));
    }
  });

  return Math.round(totalWeightedScore * 100) / 100;
}

export function detectScheduleConflicts(
  schedules: ScheduleItem[],
  competitionJudges: CompetitionJudge[],
  registrations: Registration[]
): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = [];

  for (let i = 0; i < schedules.length; i++) {
    for (let j = i + 1; j < schedules.length; j++) {
      const s1 = schedules[i];
      const s2 = schedules[j];

      const s1Start = new Date(s1.start_time).getTime();
      const s1End = new Date(s1.end_time).getTime();
      const s2Start = new Date(s2.start_time).getTime();
      const s2End = new Date(s2.end_time).getTime();

      const timeOverlaps = s1Start < s2End && s1End > s2Start;

      if (timeOverlaps) {
        if (s1.venue_id === s2.venue_id) {
          conflicts.push({
            id: `c-vn-${s1.id}-${s2.id}`,
            type: "VENUE",
            title: `Bentrok Gedung / Venue: ${s1.venue_name}`,
            details: `Lomba "${s1.competition_name}" dan "${s2.competition_name}" dijadwalkan di tempat & jam yang sama!`,
            start_time: s1.start_time,
            end_time: s1.end_time,
            severity: "CRITICAL",
          });
        }

        const s1Judges = competitionJudges.filter(cj => cj.competition_id === s1.competition_id).map(cj => cj.judge_id);
        const s2Judges = competitionJudges.filter(cj => cj.competition_id === s2.competition_id).map(cj => cj.judge_id);
        const sharedJudges = s1Judges.filter(jId => s2Judges.includes(jId));

        if (sharedJudges.length > 0) {
          conflicts.push({
            id: `c-jd-${s1.id}-${s2.id}`,
            type: "JUDGE",
            title: `Bentrok Dewan Juri Terdaftar`,
            details: `Juri yang sama ditugaskan menilai "${s1.competition_name}" dan "${s2.competition_name}" pada jam yang bersamaan!`,
            start_time: s1.start_time,
            end_time: s1.end_time,
            severity: "CRITICAL",
          });
        }

        const s1Parts = registrations.filter(r => r.competition_id === s1.competition_id).map(r => r.participant_id);
        const s2Parts = registrations.filter(r => r.competition_id === s2.competition_id).map(r => r.participant_id);
        const sharedParts = s1Parts.filter(pId => s2Parts.includes(pId));

        if (sharedParts.length > 0) {
          conflicts.push({
            id: `c-pt-${s1.id}-${s2.id}`,
            type: "PARTICIPANT",
            title: `Bentrok Jadwal Tampil Peserta`,
            details: `Terdapat ${sharedParts.length} peserta yang terdaftar di dua cabang lomba sekaligus pada jam bersamaan!`,
            start_time: s1.start_time,
            end_time: s1.end_time,
            severity: "CRITICAL",
          });
        }
      }
    }
  }

  return conflicts;
}

export function calculateEventHealth(
  tasks: Task[], 
  risks: Risk[], 
  divisions: Division[],
  participants: Participant[] = [],
  judges: CompetitionJudge[] = [],
  venues: Venue[] = [],
  inventory: InventoryItem[] = []
): EventHealthDetails {
  const overdueCount = tasks.filter(t => t.is_overdue || (t.status !== 'DONE' && new Date(t.deadline).getTime() < new Date().getTime())).length;
  const criticalRisksCount = risks.filter(r => r.severity === 'CRITICAL' && r.status !== 'CLOSED' && r.status !== 'RESOLVED').length;
  const highRisksCount = risks.filter(r => r.severity === 'HIGH' && r.status !== 'CLOSED' && r.status !== 'RESOLVED').length;
  const blockedTasks = tasks.filter(t => t.status === 'BLOCKED').length;

  const completedTasks = tasks.filter(t => t.status === 'DONE').length;
  const totalTasks = tasks.length;
  const taskCompletionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  const activeDivisions = divisions.filter(d => d.status === 'ACTIVE').length;

  let status: EventHealthDetails['status'] = 'HEALTHY';
  const reasons = [];

  if (totalTasks === 0) {
    reasons.push({ label: "Task Progress", status: "ok" as const, text: "Belum ada tugas panitia (siap diinput)" });
  } else if (taskCompletionPercentage >= 60) {
    reasons.push({ label: "Task Progress", status: "ok" as const, text: `${taskCompletionPercentage}% tugas panitia selesai` });
  } else {
    reasons.push({ label: "Task Progress", status: "warning" as const, text: `Baru ${taskCompletionPercentage}% tugas selesai` });
  }

  if (divisions.length === 0) {
    reasons.push({ label: "Divisi", status: "ok" as const, text: "Belum ada divisi (siap diinput)" });
  } else if (activeDivisions === divisions.length) {
    reasons.push({ label: "Divisi", status: "ok" as const, text: `Semua ${activeDivisions} divisi aktif bekerja` });
  } else {
    reasons.push({ label: "Divisi", status: "warning" as const, text: `${activeDivisions}/${divisions.length} divisi aktif` });
  }

  const approvedParts = participants.filter(p => p.status === 'APPROVED' || p.status === 'CHECK_IN').length;
  reasons.push({ label: "Participants", status: "ok" as const, text: `${approvedParts}/${participants.length} Peserta terverifikasi` });

  const confirmedJudges = judges.filter(j => j.status === 'CONFIRMED').length;
  reasons.push({ label: "Judges", status: "ok" as const, text: `${confirmedJudges}/${judges.length} Dewan Juri dikonfirmasi` });

  const availVenues = venues.filter(v => v.status === 'AVAILABLE').length;
  reasons.push({ label: "Venues", status: "ok" as const, text: `${availVenues}/${venues.length} Gedung/Venue siap` });

  const readyInv = inventory.filter(i => i.status === 'READY').length;
  reasons.push({ label: "Logistics", status: "ok" as const, text: `${readyInv}/${inventory.length} Inventaris Logistik siap` });

  if (overdueCount > 0) {
    reasons.push({ label: "Overdue Tasks", status: overdueCount >= 2 ? "critical" as const : "warning" as const, text: `${overdueCount} tugas melewati deadline` });
  }

  if (criticalRisksCount > 0) {
    reasons.push({ label: "Critical Risk", status: "critical" as const, text: `${criticalRisksCount} risiko tingkat KRITIS terdeteksi` });
  }

  if (criticalRisksCount > 0 || overdueCount >= 3 || blockedTasks >= 2) {
    status = 'CRITICAL';
  } else if (overdueCount > 0 || highRisksCount > 0 || blockedTasks > 0) {
    status = 'ATTENTION REQUIRED';
  } else {
    status = 'HEALTHY';
  }

  let readiness = totalTasks > 0 ? taskCompletionPercentage * 0.4 + 60 : 100;
  if (overdueCount > 0) readiness -= overdueCount * 5;
  if (criticalRisksCount > 0) readiness -= criticalRisksCount * 8;

  readiness = Math.max(10, Math.min(100, Math.round(readiness)));

  return {
    status,
    readiness_percentage: readiness,
    reasons,
  };
}

export function generateActionItems(tasks: Task[], risks: Risk[], divisions: Division[]): ActionNeededItem[] {
  const items: ActionNeededItem[] = [];

  tasks.forEach(t => {
    if (t.is_overdue || (t.status !== 'DONE' && new Date(t.deadline).getTime() < new Date().getTime())) {
      items.push({
        id: `act-t-${t.id}`,
        type: 'overdue_task',
        title: `Tugas Overdue: ${t.title}`,
        subtitle: `PIC: ${t.pic_name || 'Belum ditunjuk'} • Divisi ${t.division_name || '-'}`,
        severity: t.priority === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
        target_tab: 'tasks',
        target_id: t.id,
      });
    } else if (t.status === 'BLOCKED') {
      items.push({
        id: `act-b-${t.id}`,
        type: 'blocked_task',
        title: `Tugas Terhambat (BLOCKED): ${t.title}`,
        subtitle: `Butuh keputusan Ketua / Koordinasi Divisi ${t.division_name}`,
        severity: 'CRITICAL',
        target_tab: 'tasks',
        target_id: t.id,
      });
    }
  });

  risks.forEach(r => {
    if (r.severity === 'CRITICAL' && r.status !== 'CLOSED' && r.status !== 'RESOLVED') {
      items.push({
        id: `act-r-${r.id}`,
        type: 'critical_risk',
        title: `Risiko Kritis (Score ${r.risk_score}): ${r.title}`,
        subtitle: `Mitigasi: ${r.mitigation || 'Belum ada mitigasi'}`,
        severity: 'CRITICAL',
        target_tab: 'risks',
        target_id: r.id,
      });
    }
  });

  return items;
}
