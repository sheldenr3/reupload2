import { useState } from "react";
import GradeSyllabus from "@/components/syllabus/GradeSyllabus";
import AILearningInterface from "@/components/learning/AILearningInterface";
import CueCards from "@/components/learning/CueCards";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, BookOpen, Layers } from "lucide-react";
import SubjectsDropdown from "@/components/layout/SubjectsDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";

export default function LearnPage() {
  const [selectedTopic, setSelectedTopic] = useState<{
    id: string;
    name: string;
    content?: string;
    grade?: string;
  } | null>(null);
  const [userGrade, setUserGrade] = useState<string>("10");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ai-chat");
  const [searchParams] = useSearchParams();

  // Get the user's grade from the auth context
  const { profile, loading: profileLoading } = useAuth();

  useEffect(() => {
    const fetchUserGrade = async () => {
      setLoading(true);
      try {
        // Get grade from user profile
        if (profile?.grade) {
          setUserGrade(profile.grade);
          console.log(
            `LearnPage - User grade set to: ${profile.grade}`,
            profile,
          );
        } else {
          // Fallback to default grade if not available
          setUserGrade("10");
          console.log("LearnPage - Using default grade: 10", profile);
        }
      } catch (error) {
        console.error("Error fetching user grade:", error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if profile loading is complete
    if (!profileLoading) {
      fetchUserGrade();
    }
  }, [profile, profileLoading]);

  // Force refresh when profile changes to ensure grade is updated
  useEffect(() => {
    if (profile?.grade) {
      setUserGrade(profile.grade);
      console.log(`LearnPage - User grade updated to: ${profile.grade}`);
    } else {
      console.log("LearnPage - No grade in profile, using default grade");
    }
  }, [profile?.grade]);

  // Check URL for tab parameter and topic parameter
  useEffect(() => {
    // Get tab from URL
    const tab = searchParams.get("tab");
    if (tab && ["ai-chat", "cue-cards"].includes(tab)) {
      setActiveTab(tab);
    }

    // Get topic from URL if provided
    const topicId = searchParams.get("topic");
    const topicName = searchParams.get("name");

    if (topicId && topicName) {
      setSelectedTopic({
        id: topicId,
        name: topicName,
        grade: profile?.grade || userGrade,
      });
    }
  }, [searchParams, profile, userGrade]);

  const handleSelectTopic = (topic: {
    id: string;
    name: string;
    content?: string;
    grade?: string;
  }) => {
    setSelectedTopic(topic);
  };

  return (
    <div className="container py-4 sm:py-6 md:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
          Learning Center
        </h1>
        <div className="self-start sm:self-auto">
          <SubjectsDropdown />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-1">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-[#0197cf]"></div>
            </div>
          ) : (
            <GradeSyllabus
              grade={userGrade}
              onSelectTopic={handleSelectTopic}
              userGrade={userGrade} // Pass user grade to ensure content filtering
            />
          )}
        </div>

        <div className="lg:col-span-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-4 sm:mb-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="ai-chat"
                className="flex items-center text-xs sm:text-sm py-1 sm:py-2"
              >
                <Brain className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> AI Chat
              </TabsTrigger>
              <TabsTrigger
                value="cue-cards"
                className="flex items-center text-xs sm:text-sm py-1 sm:py-2"
              >
                <Layers className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Cue
                Cards
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai-chat" className="mt-3 sm:mt-4">
              <AILearningInterface
                topic={selectedTopic}
                grade={userGrade} // Pass user grade to ensure content filtering
              />
            </TabsContent>

            <TabsContent value="cue-cards" className="mt-3 sm:mt-4">
              <CueCards
                topic={selectedTopic}
                grade={userGrade} // Pass user grade to ensure content filtering
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
