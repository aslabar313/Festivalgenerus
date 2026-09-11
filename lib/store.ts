import { 
  FestivalEvent, 
  Division, 
  CommitteeMember, 
  Task, 
  Risk, 
  Competition,
  Participant,
  Registration,
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

// PART 2: COMPETITIONS INITIAL DATA
export const INITIAL_COMPETITIONS: Competition[] = [
  {
    id: "cmp-1",
    event_id: "evt-fg2026",
    name: "Musabaqah Tahfidz Al-Qur'an Juz 30",
    category: "Cabe Rawit",
    description: "Lomba hafalan Surat An-Naba s/d An-Naas beserta Tajwid & Makhorijul Huruf",
    juknis: "1. Peserta wajib hadir 15 menit sebelum tampil. 2. Durasi tampil max 10 menit per peserta. 3. Penilaian: Tajwid (40%), Kelancaran (30%), Adab (30%).",
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
    juknis: "1. Menggunakan pakaian muslim rapi dan peci. 2. Adzan yang dikumandangkan adalah Adzan Subuh. 3. Penilaian: Lagu & Intonasi (40%), Tajwid (30%), Adab (30%).",
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
    juknis: "1. Kertas disiapkan panitia. 2. Meja & alat mewarnai (crayons/pensil warna) dibawa peserta. 3. Durasi waktu 90 menit.",
    quota: 60,
    registered_count: 58,
    duration_minutes: 90,
    venue: "Aula Hall Lt. 2",
    status: "READY",
  },
  {
    id: "cmp-4",
    event_id: "evt-fg2026",
    name: "Musabaqah Tilawatil Qur'an (MTQ)",
    category: "Pra-Remaja",
    description: "Lomba membaca Al-Qur'an dengan lagu Mujawwad standar nasional",
    juknis: "1. Maqra ditentukan saat pengundian nomor urut. 2. Durasi baca 7-8 menit. 3. Penilaian: Tajwid, Lagu, Suara, dan Fashohah.",
    quota: 30,
    registered_count: 28,
    duration_minutes: 15,
    venue: "Panggung Utama Gedung A",
    status: "OPEN",
  },
  {
    id: "cmp-5",
    event_id: "evt-fg2026",
    name: "Lomba Pidato / Ceramah Agama",
    category: "Remaja",
    description: "Lomba dakwah & pidato Bahasa Indonesia tema Pembinaan Generus",
    juknis: "1. Tema pidato: Pentingnya 6 Thobiat Luhur & Tri Sukses Generus. 2. Durasi 8-10 menit tanpa teks.",
    quota: 25,
    registered_count: 22,
    duration_minutes: 12,
    venue: "Aula VIP Gedung B",
    status: "OPEN",
  },
  {
    id: "cmp-6",
    event_id: "evt-fg2026",
    name: "Cerdas Cermat Kemuhammadiyahan & Keagamaan",
    category: "Remaja",
    description: "Lomba cerdas cermat tim 3 orang materi Al-Qur'an, Hadits, & Fiqih",
    juknis: "1. Tiap kelompok mengirimkan 1 tim yang terdiri dari 3 peserta. 2. Babak penyisihan tertulis & babak final rebutan.",
    quota: 16,
    registered_count: 16,
    duration_minutes: 60,
    venue: "Ruang Rapat Utama",
    status: "DRAFT",
  },
];

// PART 2: PARTICIPANTS INITIAL DATA (Single Source of Truth)
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
  {
    id: "part-103",
    name: "Rizky Ramadhan",
    participant_type: "INDIVIDUAL",
    category: "Pra-Remaja",
    school: "SMP Negeri 1",
    group_name: "Desa Mekar Sari",
    phone: "081544332211",
    email: "rizky@gmail.com",
    status: "VERIFICATION",
    created_at: "2026-09-01T14:15:00Z",
  },
  {
    id: "part-104",
    name: "Fatimah Azzahra",
    participant_type: "INDIVIDUAL",
    category: "Remaja",
    school: "SMA Mutiara",
    group_name: "Desa Cempaka",
    phone: "081788776655",
    email: "fatimah@gmail.com",
    status: "REGISTERED",
    created_at: "2026-09-05T11:20:00Z",
  },
  {
    id: "part-105",
    name: "Tim Cerdas Cermat Desa Kebon Jeruk",
    participant_type: "GROUP",
    category: "Remaja",
    school: "Utusan Kelompok Kebon Jeruk",
    group_name: "Desa Kebon Jeruk",
    phone: "081234567890",
    email: "kontingen.kebonjeruk@generus.id",
    status: "APPROVED",
    created_at: "2026-09-02T16:00:00Z",
  },
];

// PART 2: REGISTRATIONS INITIAL DATA
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
    verified_at: "2026-08-26T10:00:00Z",
    approved_at: "2026-08-27T09:00:00Z",
  },
  {
    id: "reg-102",
    participant_id: "part-101",
    participant_name: "Muhammad Faiz",
    competition_id: "cmp-2",
    competition_name: "Lomba Adzan & Iqamah",
    registration_number: "REG-2026-002",
    status: "APPROVED",
    payment_status: "FREE",
    registered_at: "2026-08-25T08:10:00Z",
    verified_at: "2026-08-26T10:00:00Z",
    approved_at: "2026-08-27T09:00:00Z",
  },
  {
    id: "reg-103",
    participant_id: "part-102",
    participant_name: "Aisyah Humaira",
    competition_id: "cmp-3",
    competition_name: "Lomba Mewarnai Kaligrafi Islamic",
    registration_number: "REG-2026-003",
    status: "APPROVED",
    payment_status: "FREE",
    registered_at: "2026-08-26T09:30:00Z",
    verified_at: "2026-08-27T11:00:00Z",
    approved_at: "2026-08-28T14:00:00Z",
  },
  {
    id: "reg-104",
    participant_id: "part-103",
    participant_name: "Rizky Ramadhan",
    competition_id: "cmp-4",
    competition_name: "Musabaqah Tilawatil Qur'an (MTQ)",
    registration_number: "REG-2026-004",
    status: "VERIFICATION",
    payment_status: "FREE",
    registered_at: "2026-09-01T14:15:00Z",
  },
  {
    id: "reg-105",
    participant_id: "part-104",
    participant_name: "Fatimah Azzahra",
    competition_id: "cmp-5",
    competition_name: "Lomba Pidato / Ceramah Agama",
    registration_number: "REG-2026-005",
    status: "REGISTERED",
    payment_status: "FREE",
    registered_at: "2026-09-05T11:20:00Z",
  },
];

// PART 2: NOTIFICATIONS INITIAL DATA
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Pendaftaran Berhasil Diverifikasi",
    message: "Berkas peserta Muhammad Faiz untuk Musabaqah Tahfidz Juz 30 telah diverifikasi dan disetujui panitia.",
    type: "REGISTRATION_APPROVED",
    is_read: false,
    created_at: "2026-08-27T09:00:00Z",
  },
  {
    id: "notif-2",
    title: "Petunjuk Teknis Lomba (Juknis) Rilis",
    message: "Juknis Lomba Mewarnai Kaligrafi Islamic telah dipublikasikan oleh Divisi Acara.",
    type: "COMPETITION_APPROACHING",
    is_read: true,
    created_at: "2026-09-01T10:00:00Z",
  },
];

// PART 2: AUDIT TRAIL INITIAL DATA (WHO, DID WHAT, WHEN, ON WHAT)
export const INITIAL_AUDIT_TRAIL: AuditTrailItem[] = [
  {
    id: "aud-101",
    who: "Siti Rahma (Registrasi)",
    did_what: "VERIFIED_PARTICIPANT",
    when: "2026-08-26 10:00:00",
    on_what: "Muhammad Faiz (REG-2026-001)",
    details: "Verifikasi surat utusan desa & tanggal lahir sesuai kriteria Cabe Rawit",
  },
  {
    id: "aud-102",
    who: "H. Zaki (Ketua)",
    did_what: "APPROVED_REGISTRATION",
    when: "2026-08-27 09:00:00",
    on_what: "Muhammad Faiz (Tahfidz Juz 30)",
    details: "Persetujuan akhir pendaftaran kontingen",
  },
  {
    id: "aud-103",
    who: "Ustadz H. Ahmad (Acara)",
    did_what: "PUBLISHED_JUKNIS",
    when: "2026-09-01 10:00:00",
    on_what: "Lomba Mewarnai Kaligrafi Islamic",
    details: "Unggah tata tertib & kriteria penilaian juri",
  },
  {
    id: "aud-104",
    who: "Official Desa Kebon Jeruk",
    did_what: "CREATED_PARTICIPANT",
    when: "2026-09-02 16:00:00",
    on_what: "Tim Cerdas Cermat Desa Kebon Jeruk",
    details: "Input formulir pendaftaran grup cerdas cermat",
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
