-- Create user_points table
CREATE TABLE IF NOT EXISTS user_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    points INTEGER DEFAULT 0,
    icon_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Create learning_streaks table
CREATE TABLE IF NOT EXISTS learning_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_streaks ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own points" ON user_points;
CREATE POLICY "Users can view their own points"
ON user_points FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view achievements" ON achievements;
CREATE POLICY "Users can view achievements"
ON achievements FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can view their own earned achievements" ON user_achievements;
CREATE POLICY "Users can view their own earned achievements"
ON user_achievements FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own streaks" ON learning_streaks;
CREATE POLICY "Users can view their own streaks"
ON learning_streaks FOR SELECT
USING (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table user_points;
alter publication supabase_realtime add table achievements;
alter publication supabase_realtime add table user_achievements;
alter publication supabase_realtime add table learning_streaks;

-- Insert some initial achievements
INSERT INTO achievements (name, description, points, icon_name) VALUES
('First Question', 'Asked your first question to the AI tutor', 10, 'MessageSquare'),
('Quick Learner', 'Completed 5 learning sessions', 50, 'GraduationCap'),
('Math Master', 'Answered 10 math questions correctly', 100, 'Calculator'),
('Science Explorer', 'Studied 5 different science topics', 75, 'Flask'),
('Perfect Score', 'Got 100% on a test', 150, 'Award'),
('Study Streak', 'Logged in for 5 consecutive days', 200, 'Flame')
ON CONFLICT DO NOTHING;