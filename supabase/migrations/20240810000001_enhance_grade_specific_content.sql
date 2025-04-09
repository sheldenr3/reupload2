-- Ensure profiles table has grade field and proper constraints
ALTER TABLE IF EXISTS profiles
ADD COLUMN IF NOT EXISTS grade VARCHAR(2) NOT NULL DEFAULT '10';

-- Create syllabus_content table to store grade-specific content
CREATE TABLE IF NOT EXISTS syllabus_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id VARCHAR(255) NOT NULL,
  topic_id VARCHAR(255) NOT NULL,
  grade VARCHAR(2) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster filtering by grade
CREATE INDEX IF NOT EXISTS idx_syllabus_content_grade ON syllabus_content(grade);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id VARCHAR(255) PRIMARY KEY,
  subject_id VARCHAR(255) NOT NULL REFERENCES subjects(id),
  name VARCHAR(255) NOT NULL,
  term VARCHAR(255) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create grade_subject_availability table to track which subjects are available for which grades
CREATE TABLE IF NOT EXISTS grade_subject_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grade VARCHAR(2) NOT NULL,
  subject_id VARCHAR(255) NOT NULL REFERENCES subjects(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(grade, subject_id)
);

-- Create user_learning_progress table to track user progress on topics
CREATE TABLE IF NOT EXISTS user_learning_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  topic_id VARCHAR(255) NOT NULL REFERENCES topics(id),
  progress_percentage INT NOT NULL DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- Create user_notes table to store user notes for topics
CREATE TABLE IF NOT EXISTS user_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  topic_id VARCHAR(255) NOT NULL REFERENCES topics(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_tests table to store user test results
CREATE TABLE IF NOT EXISTS user_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  topic_id VARCHAR(255) NOT NULL REFERENCES topics(id),
  score INT NOT NULL,
  max_score INT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE syllabus_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_subject_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tests ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles: Users can read their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Profiles: Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Syllabus content: Anyone can read
DROP POLICY IF EXISTS "Anyone can read syllabus content" ON syllabus_content;
CREATE POLICY "Anyone can read syllabus content"
  ON syllabus_content FOR SELECT
  USING (true);

-- Subjects: Anyone can read
DROP POLICY IF EXISTS "Anyone can read subjects" ON subjects;
CREATE POLICY "Anyone can read subjects"
  ON subjects FOR SELECT
  USING (true);

-- Topics: Anyone can read
DROP POLICY IF EXISTS "Anyone can read topics" ON topics;
CREATE POLICY "Anyone can read topics"
  ON topics FOR SELECT
  USING (true);

-- Grade subject availability: Anyone can read
DROP POLICY IF EXISTS "Anyone can read grade subject availability" ON grade_subject_availability;
CREATE POLICY "Anyone can read grade subject availability"
  ON grade_subject_availability FOR SELECT
  USING (true);

-- User learning progress: Users can read their own progress
DROP POLICY IF EXISTS "Users can read own learning progress" ON user_learning_progress;
CREATE POLICY "Users can read own learning progress"
  ON user_learning_progress FOR SELECT
  USING (auth.uid() = user_id);

-- User learning progress: Users can update their own progress
DROP POLICY IF EXISTS "Users can update own learning progress" ON user_learning_progress;
CREATE POLICY "Users can update own learning progress"
  ON user_learning_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- User learning progress: Users can insert their own progress
DROP POLICY IF EXISTS "Users can insert own learning progress" ON user_learning_progress;
CREATE POLICY "Users can insert own learning progress"
  ON user_learning_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User notes: Users can read their own notes
DROP POLICY IF EXISTS "Users can read own notes" ON user_notes;
CREATE POLICY "Users can read own notes"
  ON user_notes FOR SELECT
  USING (auth.uid() = user_id);

-- User notes: Users can update their own notes
DROP POLICY IF EXISTS "Users can update own notes" ON user_notes;
CREATE POLICY "Users can update own notes"
  ON user_notes FOR UPDATE
  USING (auth.uid() = user_id);

-- User notes: Users can insert their own notes
DROP POLICY IF EXISTS "Users can insert own notes" ON user_notes;
CREATE POLICY "Users can insert own notes"
  ON user_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User notes: Users can delete their own notes
DROP POLICY IF EXISTS "Users can delete own notes" ON user_notes;
CREATE POLICY "Users can delete own notes"
  ON user_notes FOR DELETE
  USING (auth.uid() = user_id);

-- User tests: Users can read their own test results
DROP POLICY IF EXISTS "Users can read own test results" ON user_tests;
CREATE POLICY "Users can read own test results"
  ON user_tests FOR SELECT
  USING (auth.uid() = user_id);

-- User tests: Users can insert their own test results
DROP POLICY IF EXISTS "Users can insert own test results" ON user_tests;
CREATE POLICY "Users can insert own test results"
  ON user_tests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to get content for user's grade
CREATE OR REPLACE FUNCTION get_content_for_grade(p_user_id UUID, p_topic_id VARCHAR)
RETURNS TABLE (
  content TEXT
) AS $$
DECLARE
  v_grade VARCHAR;
BEGIN
  -- Get user's grade from profile
  SELECT grade INTO v_grade FROM profiles WHERE id = p_user_id;
  
  -- Return content for user's grade or default if not found
  RETURN QUERY 
  SELECT sc.content 
  FROM syllabus_content sc
  WHERE sc.topic_id = p_topic_id AND sc.grade = v_grade
  UNION ALL
  SELECT sc.content
  FROM syllabus_content sc
  WHERE sc.topic_id = p_topic_id AND sc.grade = '10'
  AND NOT EXISTS (
    SELECT 1 FROM syllabus_content 
    WHERE topic_id = p_topic_id AND grade = v_grade
  )
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Create function to get subjects for user's grade
CREATE OR REPLACE FUNCTION get_subjects_for_grade(p_grade VARCHAR)
RETURNS TABLE (
  id VARCHAR,
  name VARCHAR,
  display_order INT
) AS $$
BEGIN
  RETURN QUERY 
  SELECT s.id, s.name, s.display_order
  FROM subjects s
  JOIN grade_subject_availability gsa ON s.id = gsa.subject_id
  WHERE gsa.grade = p_grade
  ORDER BY s.display_order;
END;
$$ LANGUAGE plpgsql;

-- Add realtime support
alter publication supabase_realtime add table profiles;
alter publication supabase_realtime add table user_learning_progress;
alter publication supabase_realtime add table user_notes;
alter publication supabase_realtime add table user_tests;

-- Insert sample data for subjects
INSERT INTO subjects (id, name, display_order)
VALUES 
  ('mathematics', 'Mathematics', 1),
  ('english-home', 'English Home Language', 2),
  ('afrikaans-home', 'Afrikaans Home Language', 3),
  ('isizulu-home', 'isiZulu Home Language', 4),
  ('physical-sciences', 'Physical Sciences', 5),
  ('life-sciences', 'Life Sciences', 6),
  ('accounting', 'Accounting', 7),
  ('business-studies', 'Business Studies', 8),
  ('economics', 'Economics', 9),
  ('geography', 'Geography', 10),
  ('history', 'History', 11),
  ('life-orientation', 'Life Orientation', 12),
  ('agricultural-management', 'Agricultural Management Practices', 13),
  ('computer-applications', 'Computer Applications Technology', 14)
ON CONFLICT (id) DO NOTHING;

-- Insert sample data for grade subject availability
INSERT INTO grade_subject_availability (grade, subject_id)
VALUES
  -- Primary school grades (1-7)
  ('1', 'mathematics'),
  ('1', 'english-home'),
  ('1', 'afrikaans-home'),
  ('1', 'isizulu-home'),
  ('1', 'life-orientation'),
  
  ('2', 'mathematics'),
  ('2', 'english-home'),
  ('2', 'afrikaans-home'),
  ('2', 'isizulu-home'),
  ('2', 'life-orientation'),
  
  ('3', 'mathematics'),
  ('3', 'english-home'),
  ('3', 'afrikaans-home'),
  ('3', 'isizulu-home'),
  ('3', 'life-orientation'),
  
  ('4', 'mathematics'),
  ('4', 'english-home'),
  ('4', 'afrikaans-home'),
  ('4', 'isizulu-home'),
  ('4', 'life-orientation'),
  
  ('5', 'mathematics'),
  ('5', 'english-home'),
  ('5', 'afrikaans-home'),
  ('5', 'isizulu-home'),
  ('5', 'life-orientation'),
  
  ('6', 'mathematics'),
  ('6', 'english-home'),
  ('6', 'afrikaans-home'),
  ('6', 'isizulu-home'),
  ('6', 'life-orientation'),
  
  ('7', 'mathematics'),
  ('7', 'english-home'),
  ('7', 'afrikaans-home'),
  ('7', 'isizulu-home'),
  ('7', 'life-orientation'),
  
  -- GET Phase (8-9)
  ('8', 'mathematics'),
  ('8', 'english-home'),
  ('8', 'afrikaans-home'),
  ('8', 'isizulu-home'),
  ('8', 'life-sciences'),
  ('8', 'geography'),
  ('8', 'history'),
  ('8', 'life-orientation'),
  
  ('9', 'mathematics'),
  ('9', 'english-home'),
  ('9', 'afrikaans-home'),
  ('9', 'isizulu-home'),
  ('9', 'life-sciences'),
  ('9', 'geography'),
  ('9', 'history'),
  ('9', 'life-orientation'),
  
  -- FET Phase (10-12)
  ('10', 'mathematics'),
  ('10', 'english-home'),
  ('10', 'afrikaans-home'),
  ('10', 'isizulu-home'),
  ('10', 'physical-sciences'),
  ('10', 'life-sciences'),
  ('10', 'accounting'),
  ('10', 'business-studies'),
  ('10', 'economics'),
  ('10', 'geography'),
  ('10', 'history'),
  ('10', 'life-orientation'),
  ('10', 'agricultural-management'),
  ('10', 'computer-applications'),
  
  ('11', 'mathematics'),
  ('11', 'english-home'),
  ('11', 'afrikaans-home'),
  ('11', 'isizulu-home'),
  ('11', 'physical-sciences'),
  ('11', 'life-sciences'),
  ('11', 'accounting'),
  ('11', 'business-studies'),
  ('11', 'economics'),
  ('11', 'geography'),
  ('11', 'history'),
  ('11', 'life-orientation'),
  ('11', 'agricultural-management'),
  ('11', 'computer-applications'),
  
  ('12', 'mathematics'),
  ('12', 'english-home'),
  ('12', 'afrikaans-home'),
  ('12', 'isizulu-home'),
  ('12', 'physical-sciences'),
  ('12', 'life-sciences'),
  ('12', 'accounting'),
  ('12', 'business-studies'),
  ('12', 'economics'),
  ('12', 'geography'),
  ('12', 'history'),
  ('12', 'life-orientation'),
  ('12', 'agricultural-management'),
  ('12', 'computer-applications')
ON CONFLICT (grade, subject_id) DO NOTHING;
