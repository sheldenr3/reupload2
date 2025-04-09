-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create topics table to store curriculum topics
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  parent_id UUID REFERENCES topics(id),
  type TEXT NOT NULL CHECK (type IN ('subject', 'grade', 'topic', 'subtopic')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create learning_sessions table to track user interactions
CREATE TABLE IF NOT EXISTS learning_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER
);

-- Create chat_messages table to store conversation history
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES learning_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resources table for educational materials
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('video', 'document', 'exam')),
  url TEXT,
  file_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tests table for generated tests
CREATE TABLE IF NOT EXISTS tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table for test questions
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create test_attempts table to track user test attempts
CREATE TABLE IF NOT EXISTS test_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable row level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can read all topics
DROP POLICY IF EXISTS "Topics are viewable by everyone" ON topics;
CREATE POLICY "Topics are viewable by everyone" ON topics FOR SELECT USING (true);

-- Users can only see their own learning sessions
DROP POLICY IF EXISTS "Users can only see their own learning sessions" ON learning_sessions;
CREATE POLICY "Users can only see their own learning sessions" ON learning_sessions FOR SELECT USING (auth.uid() = user_id);

-- Users can only see chat messages from their own sessions
DROP POLICY IF EXISTS "Users can only see their own chat messages" ON chat_messages;
CREATE POLICY "Users can only see their own chat messages" ON chat_messages FOR SELECT USING (
  session_id IN (SELECT id FROM learning_sessions WHERE user_id = auth.uid())
);

-- Resources are viewable by everyone
DROP POLICY IF EXISTS "Resources are viewable by everyone" ON resources;
CREATE POLICY "Resources are viewable by everyone" ON resources FOR SELECT USING (true);

-- Tests are viewable by everyone
DROP POLICY IF EXISTS "Tests are viewable by everyone" ON tests;
CREATE POLICY "Tests are viewable by everyone" ON tests FOR SELECT USING (true);

-- Questions are viewable by everyone
DROP POLICY IF EXISTS "Questions are viewable by everyone" ON questions;
CREATE POLICY "Questions are viewable by everyone" ON questions FOR SELECT USING (true);

-- Users can only see their own test attempts
DROP POLICY IF EXISTS "Users can only see their own test attempts" ON test_attempts;
CREATE POLICY "Users can only see their own test attempts" ON test_attempts FOR SELECT USING (auth.uid() = user_id);

-- Enable realtime subscriptions
alter publication supabase_realtime add table topics;
alter publication supabase_realtime add table learning_sessions;
alter publication supabase_realtime add table chat_messages;
alter publication supabase_realtime add table resources;
alter publication supabase_realtime add table tests;
alter publication supabase_realtime add table questions;
alter publication supabase_realtime add table test_attempts;
