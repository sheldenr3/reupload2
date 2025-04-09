import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type PointsContextType = {
  points: number;
  addPoints: (amount: number) => Promise<void>;
  achievements: Achievement[];
  earnedAchievements: string[];
  streak: {
    current: number;
    longest: number;
  };
};

type Achievement = {
  id: string;
  name: string;
  description: string;
  points: number;
  icon_name: string;
};

const PointsContext = createContext<PointsContextType | undefined>(undefined);

// Using named export instead of function declaration for Fast Refresh compatibility
export const PointsProvider = ({ children }: { children: React.ReactNode }) => {
  const [points, setPoints] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [earnedAchievements, setEarnedAchievements] = useState<string[]>([]);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });

  useEffect(() => {
    loadUserData();
    const channel = supabase
      .channel("points_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_points" },
        (payload: RealtimePostgresChangesPayload<any>) => {
          if (payload.new) {
            setPoints(payload.new.total_points);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Using async function inside component for Fast Refresh compatibility
  const loadUserData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Load points
    const { data: pointsData } = await supabase
      .from("user_points")
      .select("total_points")
      .eq("user_id", user.id)
      .single();

    if (pointsData) {
      setPoints(pointsData.total_points);
    }

    // Load achievements
    const { data: achievementsData } = await supabase
      .from("achievements")
      .select("*");

    if (achievementsData) {
      setAchievements(achievementsData);
    }

    // Load earned achievements
    const { data: earnedData } = await supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", user.id);

    if (earnedData) {
      setEarnedAchievements(earnedData.map((e) => e.achievement_id));
    }

    // Load streak
    const { data: streakData } = await supabase
      .from("learning_streaks")
      .select("current_streak, longest_streak")
      .eq("user_id", user.id)
      .single();

    if (streakData) {
      setStreak({
        current: streakData.current_streak,
        longest: streakData.longest_streak,
      });
    }
  };

  // Using async function inside component for Fast Refresh compatibility
  const addPoints = async (amount: number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const newTotal = points + amount;

    const { data, error } = await supabase
      .from("user_points")
      .upsert({
        user_id: user.id,
        total_points: newTotal,
      })
      .select()
      .single();

    if (!error && data) {
      setPoints(data.total_points);
    }
  };

  return (
    <PointsContext.Provider
      value={{
        points,
        addPoints,
        achievements,
        earnedAchievements,
        streak,
      }}
    >
      {children}
    </PointsContext.Provider>
  );
};

// Using named export instead of function declaration for Fast Refresh compatibility
export const usePoints = () => {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error("usePoints must be used within a PointsProvider");
  }
  return context;
};
