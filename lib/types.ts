export type UserRole = 'admin' | 'panitia' | 'juri' | 'peserta';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  organization?: string; // Kelompok / Desa / Daerah
  created_at: string;
}

export interface FestivalEvent {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  status: 'draft' | 'open' | 'ongoing' | 'completed';
  created_at: string;
}

export interface CompetitionCategory {
  id: string;
  event_id: string;
  name: string; // e.g., Tahfidz Al-Qur'an, Adzan, Ceramah, Mewarnai
  target_age: string; // e.g., Cabe Rawit, Pra-Remaja, Remaja
  max_participants: number;
  description?: string;
}

export interface Participant {
  id: string;
  category_id: string;
  user_id?: string;
  name: string;
  age: number;
  gender: 'L' | 'P';
  group_name: string; // Utusan Kelompok / Desa
  registration_status: 'pending' | 'verified' | 'rejected';
  score_total?: number;
  rank?: number;
}
