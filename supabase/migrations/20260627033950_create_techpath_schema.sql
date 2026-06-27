/*
# TechPath — Full Platform Schema

## Summary
Creates the complete database schema for TechPath, an AI-first technology learning platform.
All tables use RLS with authenticated user ownership.

## Tables Created

### profiles
- Linked to auth.users via id
- Stores full_name, avatar_url, role (admin/manager/learner), bio
- Auto-created on user signup via trigger

### courses
- Top-level learning containers
- Fields: title, description, slug, thumbnail_url, difficulty, order

### phases
- Sub-divisions of courses (like chapters)
- Fields: course_id, title, description, order

### lessons
- Individual learning units within a phase
- Fields: phase_id, slug, title, reading_time, content (jsonb)

### lesson_progress
- Tracks which lessons each user has completed
- Fields: user_id, lesson_id, completed_at, xp_earned

### quizzes
- Quiz linked to a lesson
- Fields: lesson_id, title

### quiz_questions
- Individual questions per quiz
- Fields: quiz_id, question, options (jsonb), correct_answer, explanation

### quiz_results
- Stores each quiz attempt per user
- Fields: user_id, quiz_id, score, total, xp_earned

### badges
- Badge definitions (global catalog)
- Fields: slug, name, description, icon

### user_badges
- Which badges each user has earned
- Fields: user_id, badge_id, earned_at

### friend_requests
- Pending friend connections between users
- Fields: from_user_id, to_user_id, status

### friends
- Confirmed friendships (bi-directional)
- Fields: user_id, friend_id

### notifications
- Per-user notification inbox
- Fields: user_id, type, title, message, read, data (jsonb)

### leaderboard_snapshots
- Daily/weekly XP snapshots for ranking
- Fields: user_id, xp, period (daily/weekly/all-time), snapshot_date

## Security
- RLS enabled on ALL tables
- Policies scoped to authenticated users
- Profiles are readable by any authenticated user (for social features)
- Sensitive write operations restricted to owner (auth.uid() = user_id)

## Notes
- Profiles auto-populated by trigger on auth.users insert
- All tables idempotent (CREATE TABLE IF NOT EXISTS)
- Policies dropped and re-created for idempotency
*/

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  email text,
  role text NOT NULL DEFAULT 'learner' CHECK (role IN ('admin', 'manager', 'learner')),
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_authenticated" ON profiles;
CREATE POLICY "profiles_select_authenticated" ON profiles FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_delete_own" ON profiles;
CREATE POLICY "profiles_delete_own" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- COURSES
-- ============================================================
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  thumbnail_url text,
  difficulty text DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  is_published boolean DEFAULT false,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "courses_select_authenticated" ON courses;
CREATE POLICY "courses_select_authenticated" ON courses FOR SELECT
  TO authenticated USING (true);

-- ============================================================
-- PHASES
-- ============================================================
CREATE TABLE IF NOT EXISTS phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  description text,
  "order" integer DEFAULT 0,
  is_locked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE phases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "phases_select_authenticated" ON phases;
CREATE POLICY "phases_select_authenticated" ON phases FOR SELECT
  TO authenticated USING (true);

-- ============================================================
-- LESSONS
-- ============================================================
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id uuid REFERENCES phases(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  reading_time integer DEFAULT 5,
  content jsonb DEFAULT '{}',
  "order" integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lessons_select_authenticated" ON lessons;
CREATE POLICY "lessons_select_authenticated" ON lessons FOR SELECT
  TO authenticated USING (true);

-- ============================================================
-- LESSON PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_slug text NOT NULL,
  completed_at timestamptz DEFAULT now(),
  xp_earned integer DEFAULT 25,
  UNIQUE (user_id, lesson_slug)
);

ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lp_select_own" ON lesson_progress;
CREATE POLICY "lp_select_own" ON lesson_progress FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "lp_insert_own" ON lesson_progress;
CREATE POLICY "lp_insert_own" ON lesson_progress FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "lp_update_own" ON lesson_progress;
CREATE POLICY "lp_update_own" ON lesson_progress FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "lp_delete_own" ON lesson_progress;
CREATE POLICY "lp_delete_own" ON lesson_progress FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- QUIZZES
-- ============================================================
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_slug text NOT NULL,
  title text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quizzes_select_authenticated" ON quizzes;
CREATE POLICY "quizzes_select_authenticated" ON quizzes FOR SELECT
  TO authenticated USING (true);

-- ============================================================
-- QUIZ QUESTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]',
  correct_answer integer NOT NULL,
  explanation text,
  "order" integer DEFAULT 0
);

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quiz_questions_select_authenticated" ON quiz_questions;
CREATE POLICY "quiz_questions_select_authenticated" ON quiz_questions FOR SELECT
  TO authenticated USING (true);

-- ============================================================
-- QUIZ RESULTS
-- ============================================================
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_slug text NOT NULL,
  score integer NOT NULL,
  total integer NOT NULL,
  xp_earned integer DEFAULT 0,
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "qr_select_own" ON quiz_results;
CREATE POLICY "qr_select_own" ON quiz_results FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "qr_insert_own" ON quiz_results;
CREATE POLICY "qr_insert_own" ON quiz_results FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "qr_update_own" ON quiz_results;
CREATE POLICY "qr_update_own" ON quiz_results FOR UPDATE
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "qr_delete_own" ON quiz_results;
CREATE POLICY "qr_delete_own" ON quiz_results FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- BADGES
-- ============================================================
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  icon text DEFAULT 'star',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "badges_select_authenticated" ON badges;
CREATE POLICY "badges_select_authenticated" ON badges FOR SELECT
  TO authenticated USING (true);

-- Seed default badges
INSERT INTO badges (slug, name, description, icon) VALUES
  ('first-lesson', 'First Steps', 'Complete your first lesson', 'footprints'),
  ('phase-1-complete', 'Foundation Builder', 'Complete Phase 1', 'layers'),
  ('quiz-master', 'Quiz Master', 'Earn 5 perfect quiz scores', 'brain'),
  ('week-warrior', 'Week Warrior', 'Maintain a 7-day streak', 'flame'),
  ('century', 'Century', 'Earn 100 XP', 'zap'),
  ('scholar', 'Scholar', 'Earn 500 XP', 'graduation-cap')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- USER BADGES
-- ============================================================
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE (user_id, badge_id)
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ub_select_authenticated" ON user_badges;
CREATE POLICY "ub_select_authenticated" ON user_badges FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "ub_insert_own" ON user_badges;
CREATE POLICY "ub_insert_own" ON user_badges FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "ub_delete_own" ON user_badges;
CREATE POLICY "ub_delete_own" ON user_badges FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- FRIEND REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS friend_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  UNIQUE (from_user_id, to_user_id)
);

ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "fr_select_involved" ON friend_requests;
CREATE POLICY "fr_select_involved" ON friend_requests FOR SELECT
  TO authenticated USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

DROP POLICY IF EXISTS "fr_insert_own" ON friend_requests;
CREATE POLICY "fr_insert_own" ON friend_requests FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = from_user_id);

DROP POLICY IF EXISTS "fr_update_recipient" ON friend_requests;
CREATE POLICY "fr_update_recipient" ON friend_requests FOR UPDATE
  TO authenticated USING (auth.uid() = to_user_id);

DROP POLICY IF EXISTS "fr_delete_own" ON friend_requests;
CREATE POLICY "fr_delete_own" ON friend_requests FOR DELETE
  TO authenticated USING (auth.uid() = from_user_id);

-- ============================================================
-- FRIENDS
-- ============================================================
CREATE TABLE IF NOT EXISTS friends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, friend_id)
);

ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "friends_select_own" ON friends;
CREATE POLICY "friends_select_own" ON friends FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "friends_insert_own" ON friends;
CREATE POLICY "friends_insert_own" ON friends FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "friends_delete_own" ON friends;
CREATE POLICY "friends_delete_own" ON friends FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'info',
  title text NOT NULL,
  message text,
  read boolean DEFAULT false,
  data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notif_select_own" ON notifications;
CREATE POLICY "notif_select_own" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notif_update_own" ON notifications;
CREATE POLICY "notif_update_own" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notif_delete_own" ON notifications;
CREATE POLICY "notif_delete_own" ON notifications FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- LEADERBOARD SNAPSHOTS
-- ============================================================
CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  xp integer DEFAULT 0,
  lessons_completed integer DEFAULT 0,
  period text NOT NULL DEFAULT 'all-time' CHECK (period IN ('daily', 'weekly', 'all-time')),
  snapshot_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leaderboard_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lb_select_authenticated" ON leaderboard_snapshots;
CREATE POLICY "lb_select_authenticated" ON leaderboard_snapshots FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "lb_insert_own" ON leaderboard_snapshots;
CREATE POLICY "lb_insert_own" ON leaderboard_snapshots FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "lb_update_own" ON leaderboard_snapshots;
CREATE POLICY "lb_update_own" ON leaderboard_snapshots FOR UPDATE
  TO authenticated USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_leaderboard_period ON leaderboard_snapshots(period, xp DESC);
