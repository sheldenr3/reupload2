-- Create practice_exercises table if it doesn't exist

DO $$
BEGIN
  -- Check if practice_exercises table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'practice_exercises'
  ) THEN
    -- Create the practice_exercises table
    CREATE TABLE public.practice_exercises (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
      content JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );

    -- Add RLS policies
    ALTER TABLE public.practice_exercises ENABLE ROW LEVEL SECURITY;

    -- Add to realtime publication if not already added
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND tablename = 'practice_exercises'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE practice_exercises;
    END IF;
  END IF;
END
$$;