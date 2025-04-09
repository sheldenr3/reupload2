import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import FloatingStudyBuddy from "@/components/study-buddy/FloatingStudyBuddy";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Layout() {
  const { profile } = useAuth();

  // Log profile information for debugging
  useEffect(() => {
    if (profile) {
      console.log("Layout - User profile loaded:", {
        name: profile.name,
        grade: profile.grade,
        email: profile.email,
      });
    } else {
      console.log("Layout - No user profile available");
    }
  }, [profile]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingStudyBuddy />
    </div>
  );
}
