export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  name: string;
  parent_id?: string;
  type: "subject" | "grade" | "topic" | "subtopic";
  created_at: string;
  updated_at: string;
}

export interface LearningSession {
  id: string;
  user_id: string;
  topic_id: string;
  started_at: string;
  ended_at?: string;
  duration_seconds?: number;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface Resource {
  id: string;
  topic_id: string;
  title: string;
  description?: string;
  type: "video" | "document" | "exam";
  url?: string;
  file_path?: string;
  created_at: string;
  updated_at: string;
}

export interface Test {
  id: string;
  topic_id: string;
  title: string;
  description?: string;
  created_at: string;
}

export interface Question {
  id: string;
  test_id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  created_at: string;
}

export interface TestAttempt {
  id: string;
  user_id: string;
  test_id: string;
  score: number;
  max_score: number;
  started_at: string;
  completed_at?: string;
}
