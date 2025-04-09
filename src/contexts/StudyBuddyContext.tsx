import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { usePoints } from "./PointsContext";

type StudyBuddyContextType = {
  buddyName: string;
  setBuddyName: (name: string) => void;
  level: number;
  coins: number;
  addCoins: (amount: number) => void;
  inventory: InventoryItem[];
  addToInventory: (item: StoreItem) => void;
  useItem: (itemId: string) => void;
  studyMethod: string;
  setStudyMethod: (method: string, customNotes?: string) => void;
  customStudyMethod: string;
  studySessionsCompleted: number;
  incrementStudySessions: () => void;
  saveProgress: () => Promise<void>;
  characterId: string;
  setCharacterId: (id: string) => void;
  showFloatingBuddy: boolean;
  setShowFloatingBuddy: (show: boolean) => void;
};

type InventoryItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  effect: {
    type: string;
    value: number;
  };
  quantity: number;
};

type StoreItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  effect: {
    type: string;
    value: number;
  };
};

const StudyBuddyContext = createContext<StudyBuddyContextType | undefined>(
  undefined,
);

// Using named export instead of function declaration for Fast Refresh compatibility
export const StudyBuddyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [buddyName, setBuddyName] = useState("Buddy");
  const [level, setLevel] = useState(1);
  const [coins, setCoins] = useState(50); // Start with some coins
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [studyMethod, setStudyMethodState] = useState("pomodoro");
  const [customStudyMethod, setCustomStudyMethod] = useState("");
  const [studySessionsCompleted, setStudySessionsCompleted] = useState(0);
  const [characterId, setCharacterId] = useState("beginner");
  const [showFloatingBuddy, setShowFloatingBuddy] = useState(true);
  const { streak } = usePoints();

  // Load data from local storage on initial render
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to load from Supabase if user is logged in
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data } = await supabase
            .from("study_buddy")
            .select("*")
            .eq("user_id", user.id)
            .single();

          if (data) {
            setBuddyName(data.buddy_name || "Buddy");
            setLevel(data.level || 1);
            setCoins(data.coins || 50);
            setInventory(data.inventory || []);
            setStudyMethodState(data.study_method || "pomodoro");
            setCustomStudyMethod(data.custom_study_method || "");
            setStudySessionsCompleted(data.study_sessions_completed || 0);
            setCharacterId(data.character_id || "beginner");
            setShowFloatingBuddy(data.show_floating_buddy !== false);
            return;
          }
        }

        // Fallback to local storage if not found in Supabase
        const storedData = localStorage.getItem("studyBuddy");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setBuddyName(parsedData.buddyName || "Buddy");
          setLevel(parsedData.level || 1);
          setCoins(parsedData.coins || 50);
          setInventory(parsedData.inventory || []);
          setStudyMethodState(parsedData.studyMethod || "pomodoro");
          setCustomStudyMethod(parsedData.customStudyMethod || "");
          setStudySessionsCompleted(parsedData.studySessionsCompleted || 0);
          setCharacterId(parsedData.characterId || "beginner");
          setShowFloatingBuddy(parsedData.showFloatingBuddy !== false);
        }
      } catch (error) {
        console.error("Error loading study buddy data:", error);
      }
    };

    loadData();
  }, []);

  // Update level based on study sessions and streak
  useEffect(() => {
    // Level formula: base level from sessions + bonus from streak
    const sessionsLevel = Math.floor(studySessionsCompleted / 5) + 1;
    const streakBonus = Math.floor(streak.current / 7);
    const newLevel = sessionsLevel + streakBonus;

    if (newLevel !== level) {
      setLevel(newLevel);
      // Bonus coins for leveling up
      if (newLevel > level) {
        setCoins((prev) => prev + (newLevel - level) * 25);
      }
    }
  }, [studySessionsCompleted, streak, level]);

  // Save data to local storage whenever it changes
  useEffect(() => {
    const data = {
      buddyName,
      level,
      coins,
      inventory,
      studyMethod,
      customStudyMethod,
      studySessionsCompleted,
      characterId,
      showFloatingBuddy,
    };

    localStorage.setItem("studyBuddy", JSON.stringify(data));
  }, [
    buddyName,
    level,
    coins,
    inventory,
    studyMethod,
    customStudyMethod,
    studySessionsCompleted,
    characterId,
    showFloatingBuddy,
  ]);

  const addCoins = (amount: number) => {
    setCoins((prev) => prev + amount);
  };

  const addToInventory = (item: StoreItem) => {
    setInventory((prev) => {
      // Check if item already exists in inventory
      const existingItemIndex = prev.findIndex((i) => i.id === item.id);

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedInventory = [...prev];
        updatedInventory[existingItemIndex].quantity += 1;
        return updatedInventory;
      } else {
        // Add new item with quantity 1
        return [
          ...prev,
          {
            ...item,
            quantity: 1,
          },
        ];
      }
    });
  };

  const useItem = (itemId: string) => {
    setInventory((prev) => {
      const itemIndex = prev.findIndex((item) => item.id === itemId);

      if (itemIndex === -1 || prev[itemIndex].quantity <= 0) {
        return prev;
      }

      const updatedInventory = [...prev];
      updatedInventory[itemIndex].quantity -= 1;

      // Remove item if quantity is 0
      if (updatedInventory[itemIndex].quantity === 0) {
        return updatedInventory.filter((item) => item.id !== itemId);
      }

      return updatedInventory;
    });
  };

  const setStudyMethod = (method: string, customNotes?: string) => {
    setStudyMethodState(method);
    if (method === "custom" && customNotes) {
      setCustomStudyMethod(customNotes);
    }
  };

  const incrementStudySessions = () => {
    setStudySessionsCompleted((prev) => prev + 1);
  };

  const saveProgress = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const data = {
          user_id: user.id,
          buddy_name: buddyName,
          level,
          coins,
          inventory,
          study_method: studyMethod,
          custom_study_method: customStudyMethod,
          study_sessions_completed: studySessionsCompleted,
          character_id: characterId,
          show_floating_buddy: showFloatingBuddy,
          last_updated: new Date().toISOString(),
        };

        const { error } = await supabase
          .from("study_buddy")
          .upsert(data, { onConflict: "user_id" });

        if (error) throw error;
        return;
      }

      // If no user, just save to localStorage (already handled by useEffect)
    } catch (error) {
      console.error("Error saving study buddy data:", error);
      throw error;
    }
  };

  return (
    <StudyBuddyContext.Provider
      value={{
        buddyName,
        setBuddyName,
        level,
        coins,
        addCoins,
        inventory,
        addToInventory,
        useItem,
        studyMethod,
        setStudyMethod,
        customStudyMethod,
        studySessionsCompleted,
        incrementStudySessions,
        saveProgress,
        characterId,
        setCharacterId,
        showFloatingBuddy,
        setShowFloatingBuddy,
      }}
    >
      {children}
    </StudyBuddyContext.Provider>
  );
};

// Using named export instead of function declaration for Fast Refresh compatibility
export const useStudyBuddy = () => {
  const context = useContext(StudyBuddyContext);
  if (context === undefined) {
    throw new Error("useStudyBuddy must be used within a StudyBuddyProvider");
  }
  return context;
};
