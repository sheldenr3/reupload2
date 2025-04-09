-- Create a function to get subjects for a specific grade
CREATE OR REPLACE FUNCTION get_subjects_for_grade(p_grade TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  code TEXT,
  description TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.code,
    s.description
  FROM subjects s
  JOIN grade_subjects gs ON s.id = gs.subject_id
  JOIN grades g ON gs.grade_id = g.id
  WHERE g.number = p_grade;
END;
$$ LANGUAGE plpgsql;

-- Enable realtime for the subjects table
ALTER PUBLICATION supabase_realtime ADD TABLE subjects;
