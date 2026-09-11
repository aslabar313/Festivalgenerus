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
  CompetitionResult,
  Venue,
  ScheduleItem,
  ScheduleConflict,
  NotificationItem,
  AuditTrailItem,
  ActionNeededItem, 
  EventHealthDetails 
} from "./types";

export const DEFAULT_EVENT: FestivalEvent = {
  id: "evt-fg2026",
  title: "Festival Generus 2026",
  description: "Ajang Perlombaan & Pembinaan Generasi Penerus Tingkat Daerah 2026",
  start_date: "2026-12-11",
  end_date: "2026-12-13",
  start_time: "08:00",
  end_time: "17:00",
  venue: "Gedung Serbaguna Utama & Masjid Agung Generus",
  status: "open",
  budget: 45000000,
  created_at: new Date().toISOString(),
};

export const INITIAL_DIVISIONS: Division[] = [
  { id: "div-1", event_id: "evt-fg2026", name: "Acara", description: "Perencanaan panggung, rundown, & juri", coordinator_name: "Ustadz H. Ahmad", status: "ACTIVE", total_tasks: 8, completed_tasks: 6 },
  { id: "div-2", event_id: "evt-fg2026", name: "Registrasi", description: "Pendaftaran kontingen & verifikasi berkas", coordinator_name: "Siti Rahma", status: "ACTIVE", total_tasks: 6, completed_tasks: 5 },
  { id: "div-3", event_id: "evt-fg2026", name: "Humas", description: "Publikasi, surat perizinan, & liputan", coordinator_name: "Faisal Abdullah", status: "ACTIVE", total_tasks: 5, completed_tasks: 3 },
  { id: "div-4", event_id: "evt-fg2026", name: "Logistik", description: "Peralatan sound system, perlengkapan, & tenda", coordinator_name: "Budi Santoso", status: "ACTIVE", total_tasks: 10, completed_tasks: 6 },
  { id: "div-5", event_id: "evt-fg2026", name: "Konsumsi", description: "Penyediaan konsumsi panitia, juri, & peserta", coordinator_name: "Hj. Maryam", status: "ACTIVE", total_tasks: 4, completed_tasks: 4 },
  { id: "div-6", event_id: "evt-fg2026", name: "Dokumentasi", description: "Video live streaming, foto, & prasasti event", coordinator_name: "Rizky Kamera", status: "ACTIVE", total_tasks: 5, completed_tasks: 2 },
  { id: "div-7", event_id: "evt-fg2026", name: "Keamanan", description: "Pengamanan lokasi, parkir, & protokol", coordinator_name: "Hasanuddin", status: "ACTIVE", total_tasks: 4, completed_tasks: 3 },
];

export const INITIAL_COMMITTEE: CommitteeMember[] = [
  { id: "com-1", event_id: "evt-fg2026", name: "H. Muhammad Zaki", email: "zaki@generus.id", phone: "081234567890", role: "ketua", status: "ACTIVE", active_tasks_count: 3 },
  { id: "com-2", event_id: "evt-fg2026", name: "Rahmat Hidayat", email: "rahmat@generus.id", phone: "081298765432", role: "sekretaris", status: "ACTIVE", active_tasks_count: 5 },
  { id: "com-3", event_id: "evt-fg2026", name: "Anisa Fitri", email: "anisa@generus.id", phone: "081311223344", role: "bendahara", status: "ACTIVE", active_tasks_count: 2 },
  { id: "com-4", event_id: "evt-fg2026", name: "Ustadz H. Ahmad", email: "ahmad@generus.id", phone: "081455667788", role: "koordinator", division_id: "div-1", division_name: "Acara", status: "ACTIVE", active_tasks_count: 4 },
  { id: "com-5", event_id: "evt-fg2026", name: "Budi Santoso", email: "budi@generus.id", phone: "081599887766", role: "koordinator", division_id: "div-4", division_name: "Logistik", status: "ACTIVE", active_tasks_count: 6 },
  { id: "com-6", event_id: "evt-fg2026", name: "Siti Rahma", email: "siti@generus.id", phone: "081622334455", role: "koordinator", division_id: "div-2", division_name: "Registrasi", status: "ACTIVE", active_tasks_count: 3 },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: "tsk-1",
    event_id: "evt-fg2026",
    division_id: "div-4",
    division_name: "Logistik",
    title: "Sewa Sound System & Genset 10KVA",
    description: "Vendor utama gedung membutuhkan DP & konfirmasi genset cadangan",
    pic_name: "Budi Santoso",
    priority: "CRITICAL",
    status: "IN_PROGRESS",
    start_date: "2026-09-01",
    deadline: "2026-09-08T00:00:00.000Z",
    is_overdue: true,
  },
  {
    id: "tsk-2",
    event_id: "evt-fg2026",
    division_id: "div-1",
    division_name: "Acara",
    title: "Finalisasi Teks Soal & Dewan Juri Tahfidz",
    description: "SK Penetapan 9 juri daerah belum ditandatangani Ketua",
    pic_name: "Ustadz H. Ahmad",
    priority: "HIGH",
    status: "TODO",
    start_date: "2026-09-05",
    deadline: "2026-09-12T00:00:00.000Z",
    is_due_soon: true,
  },
  {
    id: "tsk-3",
    event_id: "evt-fg2026",
    division_id: "div-2",
    division_name: "Registrasi",
    title: "Buka Portal Pendaftaran Online Utusan Desa",
    description: "Sistem registrasi & kuota peserta per cabang lomba",
    pic_name: "Siti Rahma",
    priority: "HIGH",
    status: "DONE",
    start_date: "2026-08-20",
    deadline: "2026-09-01T00:00:00.000Z",
  },
  {
    id: "tsk-4",
    event_id: "evt-fg2026",
    division_id: "div-3",
    division_name: "Humas",
    title: "Pengiriman Surat Undangan Perizinan Tempat",
    description: "Surat perizinan keramaian kepolisian & dinas terkait",
    pic_name: "Faisal Abdullah",
    priority: "CRITICAL",
    status: "BLOCKED",
    start_date: "2026-09-02",
    deadline: "2026-09-10T00:00:00.000Z",
    is_overdue: true,
  },
];

export const INITIAL_RISKS: Risk[] = [
  {
    id: "rsk-1",
    event_id: "evt-fg2026",
    title: "Pemadaman Listrik Gedung Saat Perlombaan Final",
    description: "Daya listrik utama gedung rentan anjlok saat beban puncak sound & AC",
    probability: 4,
    impact: 5,
    risk_score: 20,
    severity: "CRITICAL",
    owner_name: "Budi Santoso",
    mitigation: "Sewa genset cadangan 10KVA dengan automatic transfer switch (ATS)",
    status: "MITIGATING",
  },
  {
    id: "rsk-2",
    event_id: "evt-fg2026",
    title: "Penumpukan Antrean Registrasi Ulang Peserta",
    description: "Lebih dari 300 peserta hadir serentak di pagi hari pertama",
    probability: 4,
    impact: 3,
    risk_score: 12,
    severity: "HIGH",
    owner_name: "Siti Rahma",
    mitigation: "Membuka 5 loket barcode scanner & pra-cetak ID card kontingen",
    status: "IDENTIFIED",
  },
];

export const INITIAL_COMPETITIONS: Competition[] = [
  {
    id: "cmp-1",
    event_id: "evt-fg2026",
    name: "Musabaqah Tahfidz Al-Qur'an Juz 30",
    category: "Cabe Rawit",
    description: "Lomba hafalan Surat An-Naba s/d An-Naas beserta Tajwid & Makhorijul Huruf",
    juknis: "1. Peserta wajib hadir 15 menit sebelum tampil. 2. Durasi tampil max 10 menit. 3. Penilaian: Makharij (30%), Tajwid (30%), Kelancaran (40%).",
    quota: 50,
    registered_count: 42,
    duration_minutes: 15,
    venue: "Panggung Utama Gedung A",
    status: "OPEN",
  },
  {
    id: "cmp-2",
    event_id: "evt-fg2026",
    name: "Lomba Adzan & Iqamah",
    category: "Cabe Rawit",
    description: "Lomba mengumandangkan Adzan Subuh & Lafadz Iqamah",
    juknis: "1. Pakaian muslim rapi. 2. Adzan Subuh. 3. Penilaian: Intonasi (40%), Tajwid (30%), Adab (30%).",
    quota: 40,
    registered_count: 35,
    duration_minutes: 10,
    venue: "Masjid Agung Generus Area 1",
    status: "OPEN",
  },
  {
    id: "cmp-3",
    event_id: "evt-fg2026",
    name: "Lomba Mewarnai Kaligrafi Islamic",
    category: "Cabe Rawit",
    description: "Lomba mewarnai materi kaligrafi kreasi untuk tingkat SD / Cabe Rawit",
    juknis: "1. Kertas disiapkan panitia. 2. Alat warna dari peserta. 3. Durasi 90 menit.",
    quota: 60,
    registered_count: 58,
    duration_minutes: 90,
    venue: "Aula Hall Lt. 2",
    status: "READY",
  },
];

export const INITIAL_PARTICIPANTS: Participant[] = [
  {
    id: "part-101",
    name: "Muhammad Faiz",
    participant_type: "INDIVIDUAL",
    category: "Cabe Rawit",
    school: "TPQ Al-Fattah",
    group_name: "Desa Kebon Jeruk",
    phone: "081234111222",
    email: "faiz@gmail.com",
    status: "APPROVED",
    created_at: "2026-08-25T08:00:00Z",
  },
  {
    id: "part-102",
    name: "Aisyah Humaira",
    participant_type: "INDIVIDUAL",
    category: "Cabe Rawit",
    school: "SDIT Generus Rabbani",
    group_name: "Desa Sukamaju",
    phone: "081399887766",
    email: "aisyah@gmail.com",
    status: "APPROVED",
    created_at: "2026-08-26T09:30:00Z",
  },
];

export const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: "reg-101",
    participant_id: "part-101",
    participant_name: "Muhammad Faiz",
    competition_id: "cmp-1",
    competition_name: "Musabaqah Tahfidz Al-Qur'an Juz 30",
    registration_number: "REG-2026-001",
    status: "APPROVED",
    payment_status: "FREE",
    registered_at: "2026-08-25T08:00:00Z",
  },
];

// PART 3 INITIAL CRITERIA DATA
export const INITIAL_CRITERIA: Criterion[] = [
  { id: "crt-1", competition_id: "cmp-1", name: "Makharijul Huruf", weight: 30, max_score: 100 },
  { id: "crt-2", competition_id: "cmp-1", name: "Tajwid & Hukum Bacaan", weight: 30, max_score: 100 },
  { id: "crt-3", competition_id: "cmp-1", name: "Fashohah & Kelancaran", weight: 40, max_score: 100 },

  { id: "crt-4", competition_id: "cmp-2", name: "Lagu & Intonasi Adzan", weight: 40, max_score: 100 },
  { id: "crt-5", competition_id: "cmp-2", name: "Tajwid & Makhorij", weight: 30, max_score: 100 },
  { id: "crt-6", competition_id: "cmp-2", name: "Adab & Penampilan", weight: 30, max_score: 100 },
];

// PART 3 INITIAL COMPETITION JUDGES DATA
export const INITIAL_COMPETITION_JUDGES: CompetitionJudge[] = [
  { id: "cj-1", competition_id: "cmp-1", competition_name: "Musabaqah Tahfidz Al-Qur'an Juz 30", judge_id: "juri-1", judge_name: "Ustadz Kyai Kholil", status: "CONFIRMED" },
  { id: "cj-2", competition_id: "cmp-1", competition_name: "Musabaqah Tahfidz Al-Qur'an Juz 30", judge_id: "juri-2", judge_name: "Ustadz H. Mansyur", status: "CONFIRMED" },
  { id: "cj-3", competition_id: "cmp-2", competition_name: "Lomba Adzan & Iqamah", judge_id: "juri-3", judge_name: "Ustadz Bilal Ramadhan", status: "CONFIRMED" },
];

// PART 3 INITIAL SCORES DATA
export const INITIAL_SCORES: ScoreItem[] = [
  { id: "sc-1", competition_id: "cmp-1", participant_id: "part-101", judge_id: "juri-1", judge_name: "Ustadz Kyai Kholil", criterion_id: "crt-1", criterion_name: "Makharijul Huruf", score: 95, notes: "Makhraj sangat tajam", is_locked: true, submitted_at: "2026-09-11T09:00:00Z", locked_at: "2026-09-11T09:05:00Z" },
  { id: "sc-2", competition_id: "cmp-1", participant_id: "part-101", judge_id: "juri-1", judge_name: "Ustadz Kyai Kholil", criterion_id: "crt-2", criterion_name: "Tajwid & Hukum Bacaan", score: 90, notes: "Ghunnah sempurna", is_locked: true, submitted_at: "2026-09-11T09:00:00Z", locked_at: "2026-09-11T09:05:00Z" },
  { id: "sc-3", competition_id: "cmp-1", participant_id: "part-101", judge_id: "juri-1", judge_name: "Ustadz Kyai Kholil", criterion_id: "crt-3", criterion_name: "Fashohah & Kelancaran", score: 96, notes: "Tanpa terhenti", is_locked: true, submitted_at: "2026-09-11T09:00:00Z", locked_at: "2026-09-11T09:05:00Z" },

  { id: "sc-4", competition_id: "cmp-1", participant_id: "part-102", judge_id: "juri-1", judge_name: "Ustadz Kyai Kholil", criterion_id: "crt-1", criterion_name: "Makharijul Huruf", score: 90, notes: "Bagus", is_locked: false, submitted_at: "2026-09-11T09:30:00Z" },
  { id: "sc-5", competition_id: "cmp-1", participant_id: "part-102", judge_id: "juri-1", judge_name: "Ustadz Kyai Kholil", criterion_id: "crt-2", criterion_name: "Tajwid & Hukum Bacaan", score: 88, notes: "Cukup", is_locked: false, submitted_at: "2026-09-11T09:30:00Z" },
  { id: "sc-6", competition_id: "cmp-1", participant_id: "part-102", judge_id: "juri-1", judge_name: "Ustadz Kyai Kholil", criterion_id: "crt-3", criterion_name: "Fashohah & Kelancaran", score: 92, notes: "Lancar", is_locked: false, submitted_at: "2026-09-11T09:30:00Z" },
];

// PART 3 INITIAL VENUES DATA
export const INITIAL_VENUES: Venue[] = [
  { id: "vn-1", name: "Panggung Utama Gedung A", location: "Gedung Utama Lt. 1", capacity: 300, status: "AVAILABLE" },
  { id: "vn-2", name: "Masjid Agung Generus Area 1", location: "Kompleks Masjid", capacity: 200, status: "AVAILABLE" },
  { id: "vn-3", name: "Aula Hall Lt. 2", location: "Gedung B Lt. 2", capacity: 150, status: "AVAILABLE" },
];

// PART 3 INITIAL SCHEDULES DATA
export const INITIAL_SCHEDULES: ScheduleItem[] = [
  {
    id: "sch-1",
    competition_id: "cmp-1",
    competition_name: "Musabaqah Tahfidz Al-Qur'an Juz 30",
    venue_id: "vn-1",
    venue_name: "Panggung Utama Gedung A",
    start_time: "2026-12-11T08:00:00.000Z",
    end_time: "2026-12-11T11:00:00.000Z",
    status: "SCHEDULED",
  },
  {
    id: "sch-2",
    competition_id: "cmp-2",
    competition_name: "Lomba Adzan & Iqamah",
    venue_id: "vn-2",
    venue_name: "Masjid Agung Generus Area 1",
    start_time: "2026-12-11T08:30:00.000Z",
    end_time: "2026-12-11T10:30:00.000Z",
    status: "SCHEDULED",
  },
  {
    id: "sch-3",
    competition_id: "cmp-3",
    competition_name: "Lomba Mewarnai Kaligrafi Islamic",
    venue_id: "vn-3",
    venue_name: "Aula Hall Lt. 2",
    start_time: "2026-12-11T13:00:00.000Z",
    end_time: "2026-12-11T15:00:00.000Z",
    status: "SCHEDULED",
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Pendaftaran Berhasil Diverifikasi",
    message: "Berkas peserta Muhammad Faiz untuk Musabaqah Tahfidz Juz 30 telah diverifikasi dan disetujui panitia.",
    type: "REGISTRATION_APPROVED",
    is_read: false,
    created_at: "2026-08-27T09:00:00Z",
  },
];

export const INITIAL_AUDIT_TRAIL: AuditTrailItem[] = [
  {
    id: "aud-101",
    who: "Siti Rahma (Registrasi)",
    did_what: "VERIFIED_PARTICIPANT",
    when: "2026-08-26 10:00:00",
    on_what: "Muhammad Faiz (REG-2026-001)",
    details: "Verifikasi surat utusan desa & tanggal lahir",
  },
];

// CALCULATE WEIGHTED TOTAL SCORE FORMULA
export function calculateWeightedTotalScore(scores: ScoreItem[], criteria: Criterion[]): number {
  if (!scores.length || !criteria.length) return 0;
  let totalWeightedScore = 0;
  let totalWeight = 0;

  criteria.forEach(crt => {
    const crtScores = scores.filter(s => s.criterion_id === crt.id);
    if (crtScores.length > 0) {
      const avgScore = crtScores.reduce((acc, curr) => acc + curr.score, 0) / crtScores.length;
      totalWeightedScore += (avgScore * (crt.weight / 100));
      totalWeight += crt.weight;
    }
  });

  return Math.round(totalWeightedScore * 100) / 100;
}

// CONFLICT DETECTION ENGINE FOR SCHEDULING (VENUE, JUDGE, PARTICIPANT TIME OVERLAPS)
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

      // Check time overlap: s1Start < s2End && s1End > s2Start
      const timeOverlaps = s1Start < s2End && s1End > s2Start;

      if (timeOverlaps) {
        // 1. Venue Conflict
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

        // 2. Judge Conflict
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

        // 3. Participant Conflict
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

export function calculateEventHealth(tasks: Task[], risks: Risk[], divisions: Division[]): EventHealthDetails {
  const overdueCount = tasks.filter(t => t.is_overdue || (t.status !== 'DONE' && new Date(t.deadline).getTime() < new Date().getTime())).length;
  const criticalRisksCount = risks.filter(r => r.severity === 'CRITICAL' && r.status !== 'CLOSED' && r.status !== 'RESOLVED').length;
  const highRisksCount = risks.filter(r => r.severity === 'HIGH' && r.status !== 'CLOSED' && r.status !== 'RESOLVED').length;
  const blockedTasks = tasks.filter(t => t.status === 'BLOCKED').length;

  const completedTasks = tasks.filter(t => t.status === 'DONE').length;
  const totalTasks = tasks.length || 1;
  const taskCompletionPercentage = Math.round((completedTasks / totalTasks) * 100);

  const activeDivisions = divisions.filter(d => d.status === 'ACTIVE').length;

  let status: EventHealthDetails['status'] = 'HEALTHY';
  const reasons = [];

  if (taskCompletionPercentage >= 60) {
    reasons.push({ label: "Task Progress", status: "ok" as const, text: `${taskCompletionPercentage}% tugas panitia selesai` });
  } else {
    reasons.push({ label: "Task Progress", status: "warning" as const, text: `Baru ${taskCompletionPercentage}% tugas selesai` });
  }

  if (activeDivisions === divisions.length) {
    reasons.push({ label: "Divisi", status: "ok" as const, text: `Semua ${activeDivisions} divisi aktif bekerja` });
  } else {
    reasons.push({ label: "Divisi", status: "warning" as const, text: `${activeDivisions}/${divisions.length} divisi aktif` });
  }

  if (overdueCount > 0) {
    reasons.push({ label: "Overdue Tasks", status: overdueCount >= 2 ? "critical" as const : "warning" as const, text: `${overdueCount} tugas melewati deadline` });
  } else {
    reasons.push({ label: "Deadline Status", status: "ok" as const, text: `Tidak ada tugas yang overdue` });
  }

  if (criticalRisksCount > 0) {
    reasons.push({ label: "Critical Risk", status: "critical" as const, text: `${criticalRisksCount} risiko tingkat KRITIS terdeteksi` });
  } else if (highRisksCount > 0) {
    reasons.push({ label: "High Risk", status: "warning" as const, text: `${highRisksCount} risiko tingkat Tinggi aktif` });
  } else {
    reasons.push({ label: "Risiko Event", status: "ok" as const, text: `Risiko ter-mitigasi dengan baik` });
  }

  if (criticalRisksCount > 0 || overdueCount >= 3 || blockedTasks >= 2) {
    status = 'CRITICAL';
  } else if (overdueCount > 0 || highRisksCount > 0 || blockedTasks > 0) {
    status = 'ATTENTION REQUIRED';
  } else {
    status = 'HEALTHY';
  }

  let readiness = taskCompletionPercentage * 0.5 + 40;
  if (overdueCount > 0) readiness -= overdueCount * 8;
  if (criticalRisksCount > 0) readiness -= criticalRisksCount * 12;
  if (blockedTasks > 0) readiness -= blockedTasks * 6;

  readiness = Math.max(10, Math.min(98, Math.round(readiness)));

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
