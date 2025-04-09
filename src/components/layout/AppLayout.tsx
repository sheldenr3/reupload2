import { useStudyBuddy } from "@/contexts/StudyBuddyContext";
import FloatingStudyBuddy from "@/components/study-buddy/FloatingStudyBuddy";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { showFloatingBuddy } = useStudyBuddy();

  return (
    <>
      {children}
      {showFloatingBuddy && <FloatingStudyBuddy />}
    </>
  );
}
