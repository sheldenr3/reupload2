import { createClient } from "@supabase/supabase-js";
// import { Database } from "@/types/supabase";

// Simple direct approach for Supabase URL and service key
const supabaseUrl = "https://ctmidujcwedhgtwoiafs.supabase.co";
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0bWlkdWpjd2VkaGd0d29pYWZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTc4Mjg3NCwiZXhwIjoyMDU3MzU4ODc0fQ.g-4hGX3wkCJwrWzSKbfGAxOEX2IuaKlFbOzLNnoOwT4";

// Create the Supabase admin client with error handling
let supabaseAdmin;
try {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  console.log("Supabase admin client initialized successfully");
} catch (error) {
  console.error("Failed to initialize Supabase admin client:", error);
  // Provide a fallback client that won't crash the app
  supabaseAdmin = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    }),
  };
}

export { supabaseAdmin };

// Helper functions for admin operations

// Save a chat message to the database
export async function saveChatMessage(
  sessionId: string,
  role: "user" | "assistant",
  content: string,
) {
  return await supabaseAdmin.from("chat_messages").insert({
    session_id: sessionId,
    role,
    content,
  });
}

// Create or get a learning session
export async function createLearningSession(userId: string, topicId: string) {
  const { data, error } = await supabaseAdmin
    .from("learning_sessions")
    .insert({
      user_id: userId,
      topic_id: topicId,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating learning session:", error);
    throw error;
  }

  return data;
}

// End a learning session
export async function endLearningSession(sessionId: string) {
  const now = new Date();

  // Get the start time
  const { data: session } = await supabaseAdmin
    .from("learning_sessions")
    .select("started_at")
    .eq("id", sessionId)
    .single();

  if (!session) return;

  const startedAt = new Date(session.started_at);
  const durationSeconds = Math.floor(
    (now.getTime() - startedAt.getTime()) / 1000,
  );

  return await supabaseAdmin
    .from("learning_sessions")
    .update({
      ended_at: now.toISOString(),
      duration_seconds: durationSeconds,
    })
    .eq("id", sessionId);
}

// Create a test for a topic
export async function createTest(
  topicId: string,
  title: string,
  description: string,
  questions: any[],
) {
  // First create the test
  const { data: test, error } = await supabaseAdmin
    .from("tests")
    .insert({
      topic_id: topicId,
      title,
      description,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating test:", error);
    throw error;
  }

  // Then add the questions
  const questionsToInsert = questions.map((q) => ({
    test_id: test.id,
    question_text: q.text,
    options: q.options,
    correct_answer: q.correctAnswer,
  }));

  const { error: questionsError } = await supabaseAdmin
    .from("questions")
    .insert(questionsToInsert);

  if (questionsError) {
    console.error("Error adding questions:", questionsError);
    throw questionsError;
  }

  return test;
}

// Add a resource
export async function addResource(
  topicId: string,
  title: string,
  description: string,
  type: "video" | "document" | "exam",
  url?: string,
  filePath?: string,
) {
  return await supabaseAdmin
    .from("resources")
    .insert({
      topic_id: topicId,
      title,
      description,
      type,
      url,
      file_path: filePath,
    })
    .select()
    .single();
}
