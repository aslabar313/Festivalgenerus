export type UserRole = 'admin' | 'panitia' | 'juri' | 'peserta' | 'bendahara';
export type CommitteeRole = 'ketua' | 'sekretaris' | 'bendahara' | 'koordinator' | 'panitia';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RiskSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type EventHealthStatus = 'HEALTHY' | 'ATTENTION REQUIRED' | 'CRITICAL';

export type CompetitionStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'READY' | 'RUNNING' | 'FINISHED' | 'PUBLISHED';
export type RegistrationStatus = 'REGISTERED' | 'VERIFICATION' | 'APPROVED' | 'REJECTED';
export type ParticipantLifecycleStatus = 'REGISTERED' | 'VERIFICATION' | 'APPROVED' | 'CHECK_IN' | 'COMPETITION' | 'RESULT' | 'CERTIFICATE';

export type EventPhase = 'H-30' | 'H-14' | 'H-7' | 'H-3' | 'H-1' | 'H' | 'H+1' | 'H+7';

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
  position_title?: string;
  tupoksi?: string;
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

export interface Competition {
  id: string;
  event_id: string;
  name: string;
  category: string;
  description?: string;
  juknis?: string;
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
  category: string;
  school?: string;
  group_name: string;
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
  registration_number: string;
  status: RegistrationStatus;
  payment_status: 'FREE' | 'PAID' | 'PENDING';
  notes?: string;
  registered_at: string;
  verified_at?: string;
  approved_at?: string;
}

export interface Criterion {
  id: string;
  competition_id: string;
  name: string;
  weight: number;
  max_score: number;
}

export interface CompetitionJudge {
  id: string;
  competition_id: string;
  competition_name?: string;
  judge_id: string;
  judge_name: string;
  status: 'ASSIGNED' | 'CONFIRMED' | 'MISSING';
}

export interface ScoreItem {
  id: string;
  competition_id: string;
  participant_id: string;
  judge_id: string;
  judge_name?: string;
  criterion_id: string;
  criterion_name?: string;
  score: number;
  notes?: string;
  is_locked: boolean;
  submitted_at: string;
  locked_at?: string;
}

export interface CompetitionResult {
  id: string;
  competition_id: string;
  participant_id: string;
  participant_name: string;
  group_name: string;
  total_score: number;
  rank: number;
  status: 'DRAFT' | 'FINAL' | 'PUBLISHED';
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
}

export interface ScheduleItem {
  id: string;
  competition_id: string;
  competition_name?: string;
  venue_id: string;
  venue_name?: string;
  start_time: string;
  end_time: string;
  status: 'SCHEDULED' | 'RUNNING' | 'FINISHED' | 'CANCELLED';
}

export interface ScheduleConflict {
  id: string;
  type: 'VENUE' | 'JUDGE' | 'PARTICIPANT';
  title: string;
  details: string;
  start_time: string;
  end_time: string;
  severity: 'CRITICAL';
}

// PART 4: INCIDENTS, LOGISTICS, FINANCE, DOCUMENTS
export interface IncidentItem {
  id: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location: string;
  reported_by: string;
  assigned_to?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  resolved_at?: string;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  available_quantity: number;
  condition: 'GOOD' | 'FAIR' | 'DAMAGED';
  location: string;
  pic?: string;
  status: 'READY' | 'BORROWED' | 'DAMAGED' | 'MISSING' | 'RETURNED';
}

export interface TransactionItem {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: 'Registration' | 'Sponsor' | 'Donation' | 'Consumption' | 'Equipment' | 'Venue' | 'Documentation' | 'Transportation' | 'Other';
  amount: number;
  description: string;
  transaction_date: string;
  proof_url?: string;
  created_by?: string;
  created_by_name?: string;
  approved_by?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface DocumentItem {
  id: string;
  name: string;
  category: 'Proposal' | 'Surat' | 'Juknis' | 'Rundown' | 'Participant List' | 'Judge List' | 'LPJ' | 'Certificate';
  file_url: string;
  version: string;
  uploaded_by?: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id?: string;
  title: string;
  message: string;
  type: 'REGISTRATION_RECEIVED' | 'REGISTRATION_APPROVED' | 'REGISTRATION_REJECTED' | 'COMPETITION_APPROACHING' | 'SCHEDULE_AVAILABLE' | 'INCIDENT_REPORTED' | 'FINANCE_AWAITING_APPROVAL';
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
  type: 'overdue_task' | 'critical_risk' | 'due_soon_task' | 'blocked_task' | 'division_lagging' | 'schedule_conflict' | 'open_incident' | 'finance_approval';
  title: string;
  subtitle: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  target_tab: 'tasks' | 'risks' | 'divisions' | 'committee' | 'participants' | 'competitions' | 'scoring' | 'schedules' | 'live_event' | 'incidents' | 'finance';
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

export interface MusyawarohItem {
  id: string;
  event_id: string;
  title: string;
  meeting_date: string;
  location: string;
  leader_name: string;
  notulis_name: string;
  attendees_count: number;
  attendees_list?: string;
  agenda: string;
  results_summary: string;
  decisions: string[];
  assigned_tasks_count?: number;
  created_by?: string;
  created_at: string;
}
