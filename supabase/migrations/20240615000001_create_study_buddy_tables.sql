-- Create study buddy table
CREATE TABLE IF NOT EXISTS study_buddy (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  buddy_name TEXT NOT NULL DEFAULT 'Buddy',
  level INTEGER NOT NULL DEFAULT 1,
  coins INTEGER NOT NULL DEFAULT 50,
  inventory JSONB DEFAULT '[]'::jsonb,
  study_method TEXT DEFAULT 'pomodoro',
  custom_study_method TEXT,
  study_sessions_completed INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create study sessions table to track individual study sessions
CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  study_method TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  topic TEXT,
  points_earned INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create study buddy items table for the store
CREATE TABLE IF NOT EXISTS study_buddy_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  effect_type TEXT NOT NULL,
  effect_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE study_buddy ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_buddy_items ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own study buddy" ON study_buddy;
CREATE POLICY "Users can view their own study buddy"
  ON study_buddy FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own study buddy" ON study_buddy;
CREATE POLICY "Users can update their own study buddy"
  ON study_buddy FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own study buddy" ON study_buddy;
CREATE POLICY "Users can insert their own study buddy"
  ON study_buddy FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own study sessions" ON study_sessions;
CREATE POLICY "Users can view their own study sessions"
  ON study_sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own study sessions" ON study_sessions;
CREATE POLICY "Users can insert their own study sessions"
  ON study_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Everyone can view study buddy items" ON study_buddy_items;
CREATE POLICY "Everyone can view study buddy items"
  ON study_buddy_items FOR SELECT
  USING (true);

-- Add to realtime publication
alter publication supabase_realtime add table study_buddy;
