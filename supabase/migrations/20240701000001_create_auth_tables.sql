-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  country TEXT,
  grade TEXT,
  subscription_plan TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy for users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create country_curricula table
CREATE TABLE IF NOT EXISTS country_curricula (
  id SERIAL PRIMARY KEY,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  country_curriculum_id INTEGER REFERENCES country_curricula(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create grades table
CREATE TABLE IF NOT EXISTS grades (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  number INTEGER NOT NULL,
  country_curriculum_id INTEGER REFERENCES country_curricula(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  content TEXT,
  subject_id INTEGER REFERENCES subjects(id),
  grade_id INTEGER REFERENCES grades(id),
  term INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data for South Africa
INSERT INTO country_curricula (country_code, country_name, description)
VALUES ('za', 'South Africa', 'South African National Curriculum')
ON CONFLICT DO NOTHING;

-- Insert sample data for UAE
INSERT INTO country_curricula (country_code, country_name, description)
VALUES ('ae', 'United Arab Emirates', 'UAE National Curriculum')
ON CONFLICT DO NOTHING;

-- Enable realtime for profiles
alter publication supabase_realtime add table profiles;
