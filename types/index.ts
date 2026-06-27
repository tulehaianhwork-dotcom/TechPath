export type UserRole = 'admin' | 'manager' | 'learner';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  role: UserRole;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string | null;
  profile: Profile | null;
}

export interface LessonProgressRecord {
  id: string;
  user_id: string;
  lesson_slug: string;
  completed_at: string;
  xp_earned: number;
}

export interface QuizResultRecord {
  id: string;
  user_id: string;
  lesson_slug: string;
  score: number;
  total: number;
  xp_earned: number;
  completed_at: string;
}

export interface BadgeRecord {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string;
}

export interface UserBadgeRecord {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badges: BadgeRecord;
}

export interface NotificationRecord {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string | null;
  read: boolean;
  data: Record<string, unknown>;
  created_at: string;
}
