-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure profiles table has grade field and proper constraints
ALTER TABLE IF EXISTS profiles
ADD COLUMN IF NOT EXISTS grade VARCHAR(2) NOT NULL DEFAULT '10';
ALTER TABLE IF EXISTS profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Drop existing tables if they exist to avoid conflicts
DROP TABLE IF EXISTS user_tests CASCADE;
DROP TABLE IF EXISTS user_notes CASCADE;
DROP TABLE IF EXISTS user_learning_progress CASCADE;
DROP TABLE IF EXISTS syllabus_content CASCADE;
DROP TABLE IF EXISTS grade_subject_availability CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;

-- Drop existing functions to avoid conflicts
DROP FUNCTION IF EXISTS get_subjects_for_grade(character varying);
DROP FUNCTION IF EXISTS get_content_for_grade(uuid, uuid);

-- Create subjects table with UUID primary key
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create topics table with UUID primary key and UUID foreign key
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID NOT NULL REFERENCES subjects(id),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  term VARCHAR(255) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create grade_subject_availability table with UUID foreign key
CREATE TABLE IF NOT EXISTS grade_subject_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grade VARCHAR(2) NOT NULL,
  subject_id UUID NOT NULL REFERENCES subjects(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(grade, subject_id)
);

-- Create syllabus_content table with UUID foreign keys
CREATE TABLE IF NOT EXISTS syllabus_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID NOT NULL REFERENCES subjects(id),
  topic_id UUID NOT NULL REFERENCES topics(id),
  grade VARCHAR(2) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster filtering by grade
CREATE INDEX IF NOT EXISTS idx_syllabus_content_grade ON syllabus_content(grade);

-- Create user_learning_progress table
CREATE TABLE IF NOT EXISTS user_learning_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  topic_id UUID NOT NULL REFERENCES topics(id),
  progress_percentage INT NOT NULL DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, topic_id)
);

-- Create user_notes table
CREATE TABLE IF NOT EXISTS user_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  topic_id UUID NOT NULL REFERENCES topics(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_tests table
CREATE TABLE IF NOT EXISTS user_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  topic_id UUID NOT NULL REFERENCES topics(id),
  score INT NOT NULL,
  max_score INT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to get subjects for user's grade
CREATE FUNCTION get_subjects_for_grade(p_grade VARCHAR)
RETURNS TABLE (
  id UUID,
  code VARCHAR,
  name VARCHAR,
  display_order INT
) AS $$
BEGIN
  RETURN QUERY 
  SELECT s.id, s.code, s.name, s.display_order
  FROM subjects s
  JOIN grade_subject_availability gsa ON s.id = gsa.subject_id
  WHERE gsa.grade = p_grade
  ORDER BY s.display_order;
END;
$$ LANGUAGE plpgsql;

-- Create function to get content for user's grade
CREATE FUNCTION get_content_for_grade(p_user_id UUID, p_topic_id UUID)
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

-- Add realtime support
-- Check if tables are already in the publication before adding them
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'subjects'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE subjects;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'topics'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE topics;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'grade_subject_availability'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE grade_subject_availability;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'syllabus_content'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE syllabus_content;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'user_learning_progress'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE user_learning_progress;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'user_notes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE user_notes;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'user_tests'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE user_tests;
  END IF;
END
$$;

-- Insert sample data for subjects
INSERT INTO subjects (id, code, name, display_order)
VALUES 
  (uuid_generate_v4(), 'mathematics', 'Mathematics', 1),
  (uuid_generate_v4(), 'english-home', 'English Home Language', 2),
  (uuid_generate_v4(), 'afrikaans-home', 'Afrikaans Home Language', 3),
  (uuid_generate_v4(), 'isizulu-home', 'isiZulu Home Language', 4),
  (uuid_generate_v4(), 'physical-sciences', 'Physical Sciences', 5),
  (uuid_generate_v4(), 'life-sciences', 'Life Sciences', 6),
  (uuid_generate_v4(), 'accounting', 'Accounting', 7),
  (uuid_generate_v4(), 'business-studies', 'Business Studies', 8),
  (uuid_generate_v4(), 'economics', 'Economics', 9),
  (uuid_generate_v4(), 'geography', 'Geography', 10),
  (uuid_generate_v4(), 'history', 'History', 11),
  (uuid_generate_v4(), 'life-orientation', 'Life Orientation', 12),
  (uuid_generate_v4(), 'agricultural-management', 'Agricultural Management Practices', 13),
  (uuid_generate_v4(), 'computer-applications', 'Computer Applications Technology', 14);