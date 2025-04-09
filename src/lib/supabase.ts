import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// Use environment variables if available, otherwise fallback to hardcoded values
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://ctmidujcwedhgtwoiafs.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0bWlkdWpjd2VkaGd0d29pYWZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3ODI4NzQsImV4cCI6MjA1NzM1ODg3NH0.Dn7oVa2hLTN9YuKSQayweVXdIjSn26zdqv2QFHbo8OI";

// Create the Supabase client with error handling
let supabase;
try {
  console.log("Initializing Supabase with URL:", supabaseUrl);
  console.log("Anon key available:", !!supabaseAnonKey);

  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "lumerous_auth_token",
      storage: localStorage,
      flowType: "pkce",
    },
    global: {
      headers: {
        "x-application-name": "lumerous",
      },
    },
  });
  console.log(
    "Supabase client initialized successfully with URL:",
    supabaseUrl,
  );
} catch (error) {
  console.error("Failed to initialize Supabase client:", error);
  // Provide a fallback client that won't crash the app
  supabase = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    }),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () =>
        Promise.resolve({ data: { session: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: null, error: null }),
      signUp: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
        error: null,
      }),
    },
  };
}

export { supabase };
