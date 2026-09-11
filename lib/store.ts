import { 
  FestivalEvent, 
  Division, 
  CommitteeMember, 
  Task, 
  Risk, 
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
  { id: "com-6", event_id: "evt-fg2026", name: "Farhan Hakim", email: "farhan@generus.id", phone: "081622334455", role: "panitia", division_id: "div-4", division_name: "Logistik", status: "ACTIVE", active_tasks_count: 2 },
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
    deadline: "2026-09-08T00:00:00.000Z", // Overdue task!
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
    deadline: "2026-09-12T00:00:00.000Z", // Due soon!
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
    deadline: "2026-09-10T00:00:00.000Z", // Overdue & Blocked
    is_overdue: true,
  },
  {
    id: "tsk-5",
    event_id: "evt-fg2026",
    division_id: "div-5",
    division_name: "Konsumsi",
    title: "Booking Catering Snack & Makan Juri 3 Hari",
    description: "Menu khusus juri dan snack peserta cabe rawit",
    pic_name: "Hj. Maryam",
    priority: "MEDIUM",
    status: "DONE",
    start_date: "2026-09-01",
    deadline: "2026-09-05T00:00:00.000Z",
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
    risk_score: 20, // 4 x 5 = 20 (CRITICAL)
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
    risk_score: 12, // 4 x 3 = 12 (HIGH)
    severity: "HIGH",
    owner_name: "Siti Rahma",
    mitigation: "Membuka 5 loket barcode scanner & pra-cetak ID card kontingen",
    status: "IDENTIFIED",
  },
  {
    id: "rsk-3",
    event_id: "evt-fg2026",
    title: "Keterlambatan Hadir Dewan Juri Utama",
    description: "Jadwal juri luar daerah bentrok dengan agenda lainnya",
    probability: 2,
    impact: 4,
    risk_score: 8,
    severity: "MEDIUM",
    owner_name: "Ustadz H. Ahmad",
    mitigation: "Menyiapkan 2 juri cadangan terverifikasi daerah",
    status: "MITIGATING",
  },
];

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

  // Calculate readiness score 0-100
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

  divisions.forEach(d => {
    if (d.total_tasks && d.completed_tasks !== undefined) {
      const pct = Math.round((d.completed_tasks / d.total_tasks) * 100);
      if (pct < 50) {
        items.push({
          id: `act-d-${d.id}`,
          type: 'division_lagging',
          title: `Divisi ${d.name} Lambat (${pct}% Selesai)`,
          subtitle: `Koordinator: ${d.coordinator_name || 'Belum ada'} • ${d.completed_tasks}/${d.total_tasks} Tugas`,
          severity: 'HIGH',
          target_tab: 'divisions',
          target_id: d.id,
        });
      }
    }
  });

  return items;
}
