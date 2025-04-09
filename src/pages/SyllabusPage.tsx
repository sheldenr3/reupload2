import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import GradeSyllabus from "@/components/syllabus/GradeSyllabus";
import TopicContent from "@/components/learning/TopicContent";
import SubjectsDropdown from "@/components/layout/SubjectsDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Brain, MessageSquare } from "lucide-react";

export default function SyllabusPage() {
  // Get user grade from auth context
  const { profile } = useAuth();
  const userGrade = profile?.grade || "10";

  console.log("SyllabusPage - User profile:", {
    profileGrade: profile?.grade,
    userGrade,
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const subjectParam = searchParams.get("subject");

  const [selectedTopic, setSelectedTopic] = useState<{
    id: string;
    name: string;
    content?: string;
    grade?: string;
  } | null>(null);

  // Update the selected subject based on URL parameters
  useEffect(() => {
    if (subjectParam) {
      // You could set the selected subject in the GradeSyllabus component
      // For now, we'll just log it
      console.log(`Selected subject from URL: ${subjectParam}`);
    }
  }, [subjectParam]);

  // Always use the user's grade from their profile for content filtering
  const displayGrade = profile?.grade || "10";

  // Handle the "Ask a question" button click
  const handleAskQuestion = () => {
    if (selectedTopic) {
      // Navigate to the learn page with the selected topic as a parameter
      navigate(
        `/learn?topic=${encodeURIComponent(selectedTopic.id)}&name=${encodeURIComponent(selectedTopic.name)}&tab=ai-chat`,
      );
    } else {
      // If no topic is selected, just navigate to the learn page
      navigate("/learn?tab=ai-chat");
    }
  };

  return (
    <div className="container py-4 sm:py-6 md:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0197cf] dark:text-[#01d2ff]">
          Your Grade {displayGrade} Curriculum
        </h1>
        <div className="self-start sm:self-auto flex items-center gap-2">
          <Button
            onClick={handleAskQuestion}
            className="bg-[#0197cf] hover:bg-[#01729b] text-white flex items-center gap-2"
            disabled={!selectedTopic}
          >
            <Brain className="h-4 w-4" />
            <span>Ask a question</span>
          </Button>
          <SubjectsDropdown />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-1">
          <GradeSyllabus
            grade={displayGrade}
            subject={subjectParam || undefined}
            onSelectTopic={setSelectedTopic}
            userGrade={displayGrade}
          />
        </div>

        <div className="lg:col-span-2">
          <TopicContent
            topic={selectedTopic}
            onAskQuestion={handleAskQuestion}
          />
        </div>
      </div>
    </div>
  );
}
