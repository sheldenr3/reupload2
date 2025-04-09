import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: any;
  profile: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        console.log("AuthContext - Starting to fetch user data");

        // Set a shorter timeout to prevent long loading times
        const timeoutId = setTimeout(() => {
          if (isMounted && loading) {
            console.log(
              "AuthContext - Timeout reached, forcing loading to false",
            );
            setLoading(false);
          }
        }, 3000); // 3 second timeout (reduced from 5 seconds)

        // First check for an existing session
        const { data: sessionData } = await supabase.auth.getSession();
        console.log("Auth context - getSession result:", sessionData);

        // Clear timeout since we got a response
        clearTimeout(timeoutId);

        // If component unmounted during async operation, stop processing
        if (!isMounted) return;

        // Then get the user data - use Promise.race to add a timeout
        const userPromise = supabase.auth.getUser();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("User fetch timeout")), 2000),
        );

        const { data, error } = await Promise.race([
          userPromise,
          timeoutPromise,
        ])
          .then((result) => result as Awaited<typeof userPromise>)
          .catch((err) => {
            console.error("User fetch timed out:", err);
            return {
              data: { user: null },
              error: new Error("Fetch timed out"),
            };
          });

        console.log("Auth context - getUser result:", data, error);

        if (error) {
          console.error("Error getting user:", error);
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        // If component unmounted during async operation, stop processing
        if (!isMounted) return;

        setUser(data.user);

        if (data.user) {
          console.log("AuthContext - User found, fetching profile");
          // Fetch user profile with timeout
          const profilePromise = supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

          const profileTimeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Profile fetch timeout")), 2000),
          );

          const profileResult = await Promise.race([
            profilePromise,
            profileTimeoutPromise,
          ])
            .then((result) => result as Awaited<typeof profilePromise>)
            .catch((err) => {
              console.error("Profile fetch timed out:", err);
              return {
                data: null,
                error: new Error("Profile fetch timed out"),
              };
            });

          const { data: profileData, error: profileError } = profileResult;

          // If component unmounted during async operation, stop processing
          if (!isMounted) return;

          if (!profileError && profileData) {
            console.log("AuthContext - Profile found:", profileData);
            setProfile(profileData);
          } else if (profileError) {
            console.error("Error fetching profile:", profileError);
            // Create a profile if it doesn't exist
            if (
              profileError.code === "PGRST116" ||
              profileError.message === "Profile fetch timed out"
            ) {
              console.log(
                "AuthContext - Profile not found or timed out, creating one",
              );
              try {
                const { error: insertError } = await supabase
                  .from("profiles")
                  .insert([
                    {
                      id: data.user.id,
                      email: data.user.email,
                      name: data.user.user_metadata?.name || "",
                      country: "za", // Default to South Africa
                      grade: data.user.user_metadata?.grade || "10",
                    },
                  ]);

                // If component unmounted during async operation, stop processing
                if (!isMounted) return;

                if (!insertError) {
                  // Fetch the newly created profile
                  const { data: newProfileData } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", data.user.id)
                    .single();

                  // If component unmounted during async operation, stop processing
                  if (!isMounted) return;

                  if (newProfileData) {
                    console.log(
                      "AuthContext - New profile created:",
                      newProfileData,
                    );
                    setProfile(newProfileData);
                  }
                } else {
                  console.error("Error inserting profile:", insertError);
                }
              } catch (insertError) {
                console.error("Error creating profile:", insertError);
              }
            }
          }
        } else {
          console.log("AuthContext - No user found");
        }

        // Set loading to false after all operations are complete
        console.log("AuthContext - Setting loading to false");
        if (isMounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        if (isMounted) {
          setLoading(false);
          setUser(null);
        }
      }
    };

    // Start fetching user data immediately
    fetchUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`AuthContext - Auth state changed: ${event}`, session);
        if (!isMounted) return;

        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
          // Fetch user profile with a timeout
          try {
            const profilePromise = supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error("Profile fetch timeout")),
                2000,
              ),
            );

            const { data: profileData } = await Promise.race([
              profilePromise,
              timeoutPromise,
            ])
              .then((result) => result as Awaited<typeof profilePromise>)
              .catch(() => ({ data: null }));

            if (isMounted && profileData) {
              setProfile(profileData);
            }
          } catch (error) {
            console.error("Error fetching profile on auth change:", error);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
        }
      },
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Login successful",
        description: "Welcome back to Lumerous!",
      });

      // Navigate to home page after successful login
      window.location.href = "/home";
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      console.log("SignUp - User data:", userData);

      // Create the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) throw error;

      // Create a profile in the public.profiles table
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: data.user?.id,
          ...userData,
          email,
          grade: userData.grade || "10", // Ensure grade is set
        },
      ]);

      if (profileError) throw profileError;

      toast({
        title: "Signup successful",
        description:
          "Welcome to Lumerous! Please check your email to verify your account.",
      });
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out user...");
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // Clear user state immediately
      setUser(null);
      setProfile(null);

      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });

      // Redirect to auth page after sign out
      setTimeout(() => {
        window.location.href = "/auth";
      }, 500); // Short delay to ensure toast is visible
    } catch (error: any) {
      console.error("Error during sign out:", error);
      toast({
        title: "Error signing out",
        description: error.message || "An error occurred while signing out",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProfile = async (data: any) => {
    try {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", user.id);

      if (error) throw error;

      // Update local profile state
      setProfile({ ...profile, ...data });

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description:
          error.message || "An error occurred while updating your profile",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Create a bucket for avatars if it doesn't exist
  const createAvatarBucket = async () => {
    try {
      // Check if the bucket exists
      const { data, error } = await supabase.storage.getBucket("avatars");

      // If the bucket doesn't exist, create it
      if (error && error.message.includes("does not exist")) {
        const { error: createError } = await supabase.storage.createBucket(
          "avatars",
          {
            public: true,
          },
        );

        if (createError) {
          console.error("Error creating avatars bucket:", createError);
        } else {
          console.log("Avatars bucket created successfully");
        }
      }
    } catch (error) {
      console.error("Error checking/creating avatars bucket:", error);
    }
  };

  // Call createAvatarBucket when the auth provider is initialized
  useEffect(() => {
    if (user) {
      createAvatarBucket();
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
