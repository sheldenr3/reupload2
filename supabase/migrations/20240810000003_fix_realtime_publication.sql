-- Check if tables are already in the publication before adding them

DO $$
BEGIN
  -- Check if topics table is already in the publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'topics'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE topics;
  END IF;

  -- Check if subjects table is already in the publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'subjects'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE subjects;
  END IF;

  -- Check if grades table is already in the publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'grades'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE grades;
  END IF;

  -- Check if user_notes table is already in the publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'user_notes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE user_notes;
  END IF;

  -- Check if practice_exercises table is already in the publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'practice_exercises'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE practice_exercises;
  END IF;

  -- Check if past_exam_papers table is already in the publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'past_exam_papers'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE past_exam_papers;
  END IF;

  -- Check if profiles table is already in the publication
  -- This is the one causing the error, so we're being extra careful
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
  END IF;
END
$$;