export type AppRole = 
  | 'superadmin' 
  | 'wakilketua' 
  | 'pembina' 
  | 'panitia' 
  | 'panitia_acara'
  | 'panitia_sekretaris'
  | 'bendahara'
  | 'admin_kelompok' 
  | 'admin_desa'
  | 'juri'
  | 'peserta';

export type EventPhaseMode = 'REGISTRATION_OPEN' | 'COUNTDOWN_ONLY' | 'EVENT_DAY_LIVE';

export interface NavItemDef {
  id: string;
  label: string;
  iconName: string;
  highlight?: boolean;
}

export function normalizeRole(role: string): string {
  const r = (role || "").toLowerCase().trim();
  if (r.includes("superadmin") || r === "admin") return "superadmin";
  if (r.includes("wakil")) return "wakilketua";
  if (r.includes("pembina")) return "pembina";
  if (r.includes("kelompok")) return "admin_kelompok";
  if (r.includes("desa")) return "admin_desa";
  if (r.includes("bendahara") || r.includes("keuangan")) return "bendahara";
  if (r.includes("acara")) return "panitia_acara";
  if (r.includes("sekretaris")) return "panitia_sekretaris";
  if (r.includes("panitia") || r.includes("koordinator")) return "panitia";
  if (r.includes("juri")) return "juri";
  return r;
}

export function isFullAccessRole(role: string): boolean {
  const norm = normalizeRole(role);
  return norm === "superadmin" || norm === "wakilketua" || norm === "pembina";
}

export function isDelegationAdmin(role: string): boolean {
  const norm = normalizeRole(role);
  return norm === "admin_kelompok" || norm === "admin_desa";
}

export function getAllowedTabsForRole(
  role: string,
  eventPhase: EventPhaseMode = 'REGISTRATION_OPEN'
): string[] {
  const norm = normalizeRole(role);

  // 1. Superadmin, Wakilketua, Pembina: FULL ACCESS to ALL TABS
  if (isFullAccessRole(role)) {
    return [
      "dashboard",
      "live_event",
      "musyawaroh",
      "committee",
      "incidents",
      "judge_panel",
      "scoring_results",
      "schedules",
      "competitions",
      "participants",
      "logistics",
      "finance",
      "documents",
      "reports",
      "notifications",
      "audit",
      "tasks",
      "risks",
      "divisions"
    ];
  }

  // 2. Admin Kelompok & Admin Desa
  if (isDelegationAdmin(role)) {
    if (eventPhase === 'REGISTRATION_OPEN') {
      // Pendaftaran Buka: Hanya bisa akses input/view data peserta festival
      return ["participants"];
    } else if (eventPhase === 'COUNTDOWN_ONLY') {
      // Pendaftaran Ditutup: Hanya bisa memantau countdown event
      return ["countdown"];
    } else if (eventPhase === 'EVENT_DAY_LIVE') {
      // Hari H: Memantau score live & hasil juara realtime
      return ["live_event", "scoring_results"];
    }
  }

  // 3. Panitia: Akses sesuai Tupoksi
  if (norm === "bendahara") {
    return ["dashboard", "finance", "reports", "tasks", "incidents"];
  }

  if (norm === "panitia_acara") {
    return ["dashboard", "live_event", "competitions", "schedules", "judge_panel", "scoring_results", "tasks"];
  }

  if (norm === "panitia_sekretaris") {
    return ["dashboard", "participants", "documents", "musyawaroh", "committee", "notifications", "audit", "tasks"];
  }

  // Generic Panitia: Dashboard + Tupoksi Kerja (Tasks, Committee, Divisions, Incidents)
  if (norm === "panitia" || norm.startsWith("panitia")) {
    return ["dashboard", "committee", "tasks", "risks", "divisions", "incidents", "logistics", "musyawaroh"];
  }

  if (norm === "juri") {
    return ["judge_panel", "scoring_results", "schedules"];
  }

  if (norm === "peserta") {
    return ["my_portal", "schedules", "scoring_results"];
  }

  // Fallback
  return ["dashboard", "participants", "scoring_results"];
}
