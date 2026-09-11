export type UserRole = 'admin' | 'panitia' | 'juri' | 'peserta';
export type CommitteeRole = 'ketua' | 'sekretaris' | 'bendahara' | 'koordinator' | 'panitia';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RiskSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type EventHealthStatus = 'HEALTHY' | 'ATTENTION REQUIRED' | 'CRITICAL';

export type CompetitionStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'READY' | 'RUNNING' | 'FINISHED' | 'PUBLISHED';
export type RegistrationStatus = 'REGISTERED' | 'VERIFICATION' | 'APPROVED' | 'REJECTED';
export type ParticipantLifecycleStatus = 'REGISTERED' | 'VERIFICATION' | 'APPROVED' | 'CHECK_IN' | 'COMPETITION' | 'RESULT' | 'CERTIFICATE';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  organization?: string;
  created_at?: string;
}

export interface FestivalEvent {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  start_time?: string;
  end_time?: string;
  venue: string;
  status: 'draft' | 'open' | 'ongoing' | 'completed' | 'archived';
  budget?: number;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Division {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  coordinator_id?: string;
  coordinator_name?: string;
  status: 'ACTIVE' | 'INACTIVE';
  total_tasks?: number;
  completed_tasks?: number;
  created_at?: string;
}

export interface CommitteeMember {
  id: string;
  event_id: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  role: CommitteeRole;
  division_id?: string;
  division_name?: string;
  status: 'ACTIVE' | 'INACTIVE';
  active_tasks_count?: number;
  created_at?: string;
}

export interface Task {
  id: string;
  event_id: string;
  division_id?: string;
  division_name?: string;
  title: string;
  description?: string;
  pic_id?: string;
  pic_name?: string;
  priority: TaskPriority;
  status: TaskStatus;
  start_date?: string;
  deadline: string;
  is_overdue?: boolean;
  is_due_soon?: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  user_name?: string;
  comment: string;
  created_at: string;
}

export interface Risk {
  id: string;
  event_id: string;
  title: string;
  description?: string;
  probability: number;
  impact: number;
  risk_score: number;
  severity: RiskSeverity;
  owner_id?: string;
  owner_name?: string;
  mitigation?: string;
  status: 'IDENTIFIED' | 'MITIGATING' | 'RESOLVED' | 'CLOSED';
  created_at?: string;
  updated_at?: string;
}

// PART 2: COMPETITIONS, PARTICIPANTS, REGISTRATIONS, NOTIFICATIONS
export interface Competition {
  id: string;
  event_id: string;
  name: string; // e.g. Tahfidz Juz 30, Adzan & Iqamah, Mewarnai, Kaligrafi
  category: string; // Cabe Rawit, Pra-Remaja, Remaja
  description?: string;
  juknis?: string; // Petunjuk Teknis & Rules
  quota: number;
  registered_count?: number;
  duration_minutes: number;
  venue: string;
  status: CompetitionStatus;
  created_at?: string;
  updated_at?: string;
}

export interface Participant {
  id: string;
  user_id?: string;
  name: string;
  participant_type: 'INDIVIDUAL' | 'GROUP' | 'DELEGATION';
  category: string; // Cabe Rawit, Pra-Remaja, Remaja
  school?: string; // TPQ / Madrasah / Sekolah
  group_name: string; // Utusan Kelompok / Desa
  phone?: string;
  email?: string;
  status: ParticipantLifecycleStatus;
  registrations?: Registration[];
  created_at?: string;
  updated_at?: string;
}

export interface Registration {
  id: string;
  participant_id: string;
  participant_name?: string;
  competition_id: string;
  competition_name?: string;
  registration_number: string; // e.g. REG-2026-001
  status: RegistrationStatus;
  payment_status: 'FREE' | 'PAID' | 'PENDING';
  notes?: string;
  registered_at: string;
  verified_at?: string;
  approved_at?: string;
}

export interface NotificationItem {
  id: string;
  user_id?: string;
  title: string;
  message: string;
  type: 'REGISTRATION_RECEIVED' | 'REGISTRATION_APPROVED' | 'REGISTRATION_REJECTED' | 'COMPETITION_APPROACHING' | 'SCHEDULE_AVAILABLE';
  is_read: boolean;
  created_at: string;
}

export interface AuditTrailItem {
  id: string;
  who: string;
  did_what: string;
  when: string;
  on_what: string;
  details?: string;
}

export interface ActionNeededItem {
  id: string;
  type: 'overdue_task' | 'critical_risk' | 'due_soon_task' | 'blocked_task' | 'division_lagging';
  title: string;
  subtitle: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  target_tab: 'tasks' | 'risks' | 'divisions' | 'committee' | 'participants' | 'competitions';
  target_id?: string;
}

export interface ReadinessFactor {
  label: string;
  status: 'ok' | 'warning' | 'critical';
  text: string;
}

export interface EventHealthDetails {
  status: EventHealthStatus;
  readiness_percentage: number;
  reasons: ReadinessFactor[];
}
