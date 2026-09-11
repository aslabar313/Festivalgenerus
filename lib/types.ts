export type UserRole = 'admin' | 'panitia' | 'juri' | 'peserta';
export type CommitteeRole = 'ketua' | 'sekretaris' | 'bendahara' | 'koordinator' | 'panitia';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'DONE' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RiskSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type EventHealthStatus = 'HEALTHY' | 'ATTENTION REQUIRED' | 'CRITICAL';

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
  start_date: string; // e.g. 2026-12-11
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
  name: string; // Acara, Registrasi, Humas, Logistik, Konsumsi, Dokumentasi, Keamanan
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
  deadline: string; // ISO / Date string
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
  probability: number; // 1 - 5
  impact: number; // 1 - 5
  risk_score: number; // probability * impact (1 - 25)
  severity: RiskSeverity;
  owner_id?: string;
  owner_name?: string;
  mitigation?: string;
  status: 'IDENTIFIED' | 'MITIGATING' | 'RESOLVED' | 'CLOSED';
  created_at?: string;
  updated_at?: string;
}

export interface ActionNeededItem {
  id: string;
  type: 'overdue_task' | 'critical_risk' | 'due_soon_task' | 'blocked_task' | 'division_lagging';
  title: string;
  subtitle: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  target_tab: 'tasks' | 'risks' | 'divisions' | 'committee';
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
