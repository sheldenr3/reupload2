-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  grade TEXT,
  school TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table first so it can be referenced
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable row level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for users
DROP POLICY IF EXISTS "Users can view and update their own data" ON users;
CREATE POLICY "Users can view and update their own data"
ON users
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users"
ON users
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Enable row level security
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policy for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
CREATE POLICY "Users can view their own roles"
ON user_roles
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;
CREATE POLICY "Admins can manage all roles"
ON user_roles
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Create policy for subjects
DROP POLICY IF EXISTS "Everyone can view subjects" ON subjects;
CREATE POLICY "Everyone can view subjects"
ON subjects
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can manage subjects" ON subjects;
CREATE POLICY "Admins can manage subjects"
ON subjects
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Create grades table
CREATE TABLE IF NOT EXISTS grades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  grade_number TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

-- Create policy for grades
DROP POLICY IF EXISTS "Everyone can view grades" ON grades;
CREATE POLICY "Everyone can view grades"
ON grades
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can manage grades" ON grades;
CREATE POLICY "Admins can manage grades"
ON grades
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Create terms table
CREATE TABLE IF NOT EXISTS terms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE terms ENABLE ROW LEVEL SECURITY;

-- Create policy for terms
DROP POLICY IF EXISTS "Everyone can view terms" ON terms;
CREATE POLICY "Everyone can view terms"
ON terms
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can manage terms" ON terms;
CREATE POLICY "Admins can manage terms"
ON terms
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  grade_id UUID REFERENCES grades(id) ON DELETE CASCADE,
  term_id UUID REFERENCES terms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  content TEXT,
  parent_topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  is_folder BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

-- Create policy for topics
DROP POLICY IF EXISTS "Everyone can view topics" ON topics;
CREATE POLICY "Everyone can view topics"
ON topics
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can manage topics" ON topics;
CREATE POLICY "Admins can manage topics"
ON topics
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('video', 'document', 'link', 'exam')),
  url TEXT,
  file_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Create policy for resources
DROP POLICY IF EXISTS "Everyone can view resources" ON resources;
CREATE POLICY "Everyone can view resources"
ON resources
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can manage resources" ON resources;
CREATE POLICY "Admins can manage resources"
ON resources
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Create labs table
CREATE TABLE IF NOT EXISTS labs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  lab_type TEXT NOT NULL CHECK (lab_type IN ('simulation', 'experiment', 'tool')),
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE labs ENABLE ROW LEVEL SECURITY;

-- Create policy for labs
DROP POLICY IF EXISTS "Everyone can view labs" ON labs;
CREATE POLICY "Everyone can view labs"
ON labs
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can manage labs" ON labs;
CREATE POLICY "Admins can manage labs"
ON labs
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Create library_resources table
CREATE TABLE IF NOT EXISTS library_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('global', 'interactive', 'research')),
  source TEXT,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE library_resources ENABLE ROW LEVEL SECURITY;

-- Create policy for library_resources
DROP POLICY IF EXISTS "Everyone can view library resources" ON library_resources;
CREATE POLICY "Everyone can view library resources"
ON library_resources
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can manage library resources" ON library_resources;
CREATE POLICY "Admins can manage library resources"
ON library_resources
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Create tests table
CREATE TABLE IF NOT EXISTS tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  time_limit INTEGER, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;

-- Create policy for tests
DROP POLICY IF EXISTS "Everyone can view tests" ON tests;
CREATE POLICY "Everyone can view tests"
ON tests
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can manage tests" ON tests;
CREATE POLICY "Admins can manage tests"
ON tests
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'essay')),
  points INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Create policy for questions
DROP POLICY IF EXISTS "Everyone can view questions" ON questions;
CREATE POLICY "Everyone can view questions"
ON questions
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can manage questions" ON questions;
CREATE POLICY "Admins can manage questions"
ON questions
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Create policy for answers
DROP POLICY IF EXISTS "Everyone can view answers" ON answers;
CREATE POLICY "Everyone can view answers"
ON answers
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can manage answers" ON answers;
CREATE POLICY "Admins can manage answers"
ON answers
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Create user_test_attempts table
CREATE TABLE IF NOT EXISTS user_test_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  score INTEGER,
  completed BOOLEAN DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, test_id, started_at)
);

-- Enable row level security
ALTER TABLE user_test_attempts ENABLE ROW LEVEL SECURITY;

-- Create policy for user_test_attempts
DROP POLICY IF EXISTS "Users can view their own test attempts" ON user_test_attempts;
CREATE POLICY "Users can view their own test attempts"
ON user_test_attempts
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all test attempts" ON user_test_attempts;
CREATE POLICY "Admins can view all test attempts"
ON user_test_attempts
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Create user_answers table
CREATE TABLE IF NOT EXISTS user_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_test_attempt_id UUID REFERENCES user_test_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  answer_id UUID REFERENCES answers(id) ON DELETE SET NULL,
  user_answer_text TEXT,
  is_correct BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_test_attempt_id, question_id)
);

-- Enable row level security
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;

-- Create policy for user_answers
DROP POLICY IF EXISTS "Users can view their own answers" ON user_answers;
CREATE POLICY "Users can view their own answers"
ON user_answers
USING (
  EXISTS (
    SELECT 1 FROM user_test_attempts
    WHERE user_test_attempts.id = user_answers.user_test_attempt_id
    AND user_test_attempts.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Admins can view all answers" ON user_answers;
CREATE POLICY "Admins can view all answers"
ON user_answers
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Create user_points table
CREATE TABLE IF NOT EXISTS user_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, created_at)
);

-- Enable row level security
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;

-- Create policy for user_points
DROP POLICY IF EXISTS "Users can view their own points" ON user_points;
CREATE POLICY "Users can view their own points"
ON user_points
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all points" ON user_points;
CREATE POLICY "Admins can manage all points"
ON user_points
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- Enable row level security
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policy for user_progress
DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
CREATE POLICY "Users can view their own progress"
ON user_progress
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all progress" ON user_progress;
CREATE POLICY "Admins can view all progress"
ON user_progress
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for chat_sessions
DROP POLICY IF EXISTS "Users can view their own chat sessions" ON chat_sessions;
CREATE POLICY "Users can view their own chat sessions"
ON chat_sessions
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all chat sessions" ON chat_sessions;
CREATE POLICY "Admins can view all chat sessions"
ON chat_sessions
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_user BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policy for chat_messages
DROP POLICY IF EXISTS "Users can view their own chat messages" ON chat_messages;
CREATE POLICY "Users can view their own chat messages"
ON chat_messages
USING (
  EXISTS (
    SELECT 1 FROM chat_sessions
    WHERE chat_sessions.id = chat_messages.session_id
    AND chat_sessions.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Admins can view all chat messages" ON chat_messages;
CREATE POLICY "Admins can view all chat messages"
ON chat_messages
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
  )
);

-- Add realtime support for tables that don't already have it
-- Check if table exists in publication before adding
DO $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'users'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE users;
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'user_roles'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE user_roles;
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'subjects'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE subjects;
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'grades'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE grades;
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'terms'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE terms;
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'topics'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE topics;
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'resources'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE resources;
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'labs'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE labs;
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'library_resources'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE library_resources;
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'tests'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE tests;
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'questions'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE questions;
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'answers'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE answers;
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'user_test_attempts'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE user_test_attempts;
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'user_answers'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE user_answers;
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'user_points'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE user_points;
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'user_progress'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE user_progress;
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'chat_sessions'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE chat_sessions;
  END IF;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'chat_messages'
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
  END IF;
END
$$;

-- Insert initial data for subjects
INSERT INTO subjects (id, name, description)
VALUES 
  (gen_random_uuid(), 'Mathematics', 'Mathematics curriculum for South African students'),
  (gen_random_uuid(), 'English Home Language', 'English Home Language curriculum for South African students'),
  (gen_random_uuid(), 'Natural Sciences', 'Natural Sciences curriculum for South African students'),
  (gen_random_uuid(), 'Physical Sciences', 'Physical Sciences curriculum for South African students')
ON CONFLICT DO NOTHING;

-- Insert initial data for grades
INSERT INTO grades (id, grade_number, description)
VALUES 
  (gen_random_uuid(), '7', 'Grade 7'),
  (gen_random_uuid(), '8', 'Grade 8'),
  (gen_random_uuid(), '9', 'Grade 9'),
  (gen_random_uuid(), '10', 'Grade 10'),
  (gen_random_uuid(), '11', 'Grade 11'),
  (gen_random_uuid(), '12', 'Grade 12')
ON CONFLICT DO NOTHING;

-- Insert initial data for terms
INSERT INTO terms (id, name, description)
VALUES 
  (gen_random_uuid(), 'Term 1', 'First term of the academic year'),
  (gen_random_uuid(), 'Term 2', 'Second term of the academic year'),
  (gen_random_uuid(), 'Term 3', 'Third term of the academic year'),
  (gen_random_uuid(), 'Term 4', 'Fourth term of the academic year')
ON CONFLICT DO NOTHING;