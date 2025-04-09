import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useStudyBuddy } from "@/contexts/StudyBuddyContext";
import { usePoints } from "@/contexts/PointsContext";
import StudyBuddyPet from "@/components/study-buddy/StudyBuddyPet";
import StudyTimer from "@/components/study-buddy/StudyTimer";
import StudyMethodSelector from "@/components/study-buddy/StudyMethodSelector";
import StudyBuddyStore from "@/components/study-buddy/StudyBuddyStore";
import StudyBuddyChat from "@/components/study-buddy/StudyBuddyChat";
import {
  Clock,
  ShoppingBag,
  Lightbulb,
  MessageCircle,
  Award,
  Save,
} from "lucide-react";

export default function StudyBuddyPage() {
  const {
    buddyName,
    setBuddyName,
    level,
    coins,
    addCoins,
    inventory,
    addToInventory,
    studyMethod,
    setStudyMethod,
    incrementStudySessions,
    saveProgress,
    characterId,
    setCharacterId,
    showFloatingBuddy,
    setShowFloatingBuddy,
  } = useStudyBuddy();
  const { addPoints } = usePoints();
  const { toast } = useToast();
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  // Get the current topic from URL or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const topic = params.get("topic");
    if (topic) {
      setSelectedTopic(topic);
    } else {
      const savedTopic = localStorage.getItem("currentTopic");
      if (savedTopic) setSelectedTopic(savedTopic);
    }
  }, []);

  const handleStudyComplete = () => {
    incrementStudySessions();
    addCoins(10);
  };

  const handlePurchase = (item: any, newCoins: number) => {
    addToInventory(item);
    addCoins(newCoins - coins); // This will be negative, reducing coins

    toast({
      title: "Item purchased!",
      description: `You bought ${item.name} for your Study Buddy.`,
      variant: "default",
    });
  };

  const handleSaveProgress = async () => {
    setIsSaving(true);
    try {
      await saveProgress();
      toast({
        title: "Progress saved!",
        description: "Your Study Buddy progress has been saved.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error saving progress",
        description: "There was a problem saving your progress.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Study Buddy</h1>
        <Button
          onClick={handleSaveProgress}
          disabled={isSaving}
          className="bg-[#0197cf] hover:bg-[#01729b]"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Progress"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <StudyBuddyPet
            name={buddyName}
            level={level}
            coins={coins}
            characterId={characterId}
            onRename={setBuddyName}
            onChangeCharacter={setCharacterId}
          />
          <div className="mt-4 flex items-center justify-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFloatingBuddy}
                onChange={(e) => setShowFloatingBuddy(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#0197cf] focus:ring-[#0197cf]"
              />
              <span className="text-sm">Show floating buddy on all pages</span>
            </label>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="timer">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="timer">
                <Clock className="h-4 w-4 mr-2" /> Timer
              </TabsTrigger>
              <TabsTrigger value="method">
                <Lightbulb className="h-4 w-4 mr-2" /> Study Method
              </TabsTrigger>
              <TabsTrigger value="store">
                <ShoppingBag className="h-4 w-4 mr-2" /> Store
              </TabsTrigger>
              <TabsTrigger value="chat">
                <MessageCircle className="h-4 w-4 mr-2" /> Chat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timer" className="mt-6">
              <StudyTimer
                onComplete={handleStudyComplete}
                onEarnPoints={(points) => {
                  addPoints(points);
                  toast({
                    title: "Points earned!",
                    description: `You earned ${points} points for completing a study session.`,
                    variant: "default",
                  });
                }}
              />
            </TabsContent>

            <TabsContent value="method" className="mt-6">
              <StudyMethodSelector
                onSelectMethod={setStudyMethod}
                selectedMethod={studyMethod}
              />
            </TabsContent>

            <TabsContent value="store" className="mt-6">
              <StudyBuddyStore coins={coins} onPurchase={handlePurchase} />
            </TabsContent>

            <TabsContent value="chat" className="mt-6">
              <StudyBuddyChat buddyName={buddyName} topic={selectedTopic} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5 text-[#0197cf]" />
              Study Buddy Benefits
            </CardTitle>
            <CardDescription>
              How your Study Buddy helps you learn better
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#f5fcff] dark:bg-gray-900 rounded-lg">
                <h3 className="font-medium mb-2 text-[#0197cf]">
                  Consistency Tracking
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your Study Buddy grows as you maintain your study streak,
                  encouraging regular practice.
                </p>
              </div>

              <div className="p-4 bg-[#f5fcff] dark:bg-gray-900 rounded-lg">
                <h3 className="font-medium mb-2 text-[#0197cf]">
                  Structured Learning
                </h3>
                <p className="text-sm text-muted-foreground">
                  The timer helps you follow proven study techniques like
                  Pomodoro for better focus and retention.
                </p>
              </div>

              <div className="p-4 bg-[#f5fcff] dark:bg-gray-900 rounded-lg">
                <h3 className="font-medium mb-2 text-[#0197cf]">
                  Interactive Support
                </h3>
                <p className="text-sm text-muted-foreground">
                  Chat with your Study Buddy to get help, stay motivated, or
                  test your understanding of concepts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
