import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateGeminiResponse } from "@/lib/gemini";
import { usePoints } from "@/contexts/PointsContext";
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Download,
  Layers,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";

interface CueCard {
  question: string;
  answer: string;
}

interface CueCardsProps {
  topic: {
    id: string;
    name: string;
    content?: string;
  } | null;
}

export default function CueCards({ topic }: CueCardsProps) {
  const [cueCards, setCueCards] = useState<CueCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addPoints } = usePoints();

  useEffect(() => {
    if (topic) {
      generateCueCards();
    }
  }, [topic]);

  const generateCueCards = async () => {
    if (!topic) return;

    setIsLoading(true);
    setError(null);
    setCurrentCardIndex(0);
    setIsFlipped(false);

    try {
      const prompt = `Create 5 study cue cards for the topic "${topic.name}". Each cue card should have a question on one side and a comprehensive answer on the other. Format your response as a JSON array with objects containing 'question' and 'answer' properties. Make the questions challenging but appropriate for a South African curriculum student studying this topic. Keep answers concise but thorough.`;

      const response = await generateGeminiResponse(prompt, topic.name);

      // Parse the JSON response
      let parsedCards: CueCard[] = [];

      try {
        // Find JSON in the response (in case the AI includes other text)
        const jsonMatch = response.match(/\[\s*\{.*\}\s*\]/s);
        if (jsonMatch) {
          parsedCards = JSON.parse(jsonMatch[0]);
        } else {
          // Try to parse the entire response as JSON
          parsedCards = JSON.parse(response);
        }

        if (!Array.isArray(parsedCards)) {
          throw new Error("Response is not an array");
        }

        setCueCards(parsedCards);
        await addPoints(10); // Award points for generating cue cards
      } catch (parseError) {
        console.error("Error parsing cue cards JSON:", parseError);
        setError("Failed to parse AI response. Please try again.");
      }
    } catch (error) {
      console.error("Error generating cue cards:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentCardIndex < cueCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const downloadCueCards = () => {
    if (cueCards.length === 0) return;

    let content = `# Cue Cards for ${topic?.name}\n\n`;

    cueCards.forEach((card, index) => {
      content += `## Card ${index + 1}\n\n`;
      content += `**Question:** ${card.question}\n\n`;
      content += `**Answer:** ${card.answer}\n\n`;
    });

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cue_cards_${topic?.name.replace(/\s+/g, "_").toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] border rounded-md bg-gradient-to-b from-white to-[#f0f9ff] dark:from-gray-800 dark:to-gray-900 shadow-md p-6 text-center">
        <div className="mb-6 text-[#0197cf] bg-[#e6f7fc] p-5 rounded-full shadow-inner">
          <Layers className="h-16 w-16" />
        </div>
        <h3 className="text-2xl font-bold mb-3 text-[#0197cf]">
          Select a Topic
        </h3>
        <p className="text-gray-600 dark:text-gray-300 max-w-md">
          Choose a topic from the syllabus to generate interactive cue cards for
          studying.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-md bg-white dark:bg-gray-800 shadow-md overflow-hidden">
      <div className="p-4 border-b bg-gradient-to-r from-[#0197cf] to-[#01729b] text-white">
        <h2 className="text-xl font-bold flex items-center">
          <Layers className="mr-2 h-5 w-5" />
          Cue Cards: {topic.name}
        </h2>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center bg-[#f8fcff] dark:bg-gray-900">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#e6f7fc] border-t-[#0197cf]"></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <Layers className="h-6 w-6 text-[#0197cf] opacity-50" />
              </div>
            </div>
            <p className="text-[#0197cf] mt-4 font-medium">
              Generating cue cards...
            </p>
          </div>
        ) : error ? (
          <div className="text-center bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-100 dark:border-red-800">
            <p className="text-red-500 dark:text-red-400 mb-4 font-medium">
              {error}
            </p>
            <Button
              onClick={generateCueCards}
              className="bg-[#0197cf] hover:bg-[#01729b] shadow-md"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </div>
        ) : cueCards.length > 0 ? (
          <div className="w-full max-w-md">
            <div className="perspective-1000">
              <div
                className={`relative w-full h-80 cursor-pointer transition-all duration-700 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}
                onClick={handleFlip}
              >
                {/* Front side - Question */}
                <div
                  className={`absolute w-full h-full backface-hidden rounded-xl shadow-lg border-2 border-[#0197cf]/20 bg-white dark:bg-gray-800 ${isFlipped ? "hidden" : "block"}`}
                >
                  <div className="absolute top-3 right-3 bg-[#0197cf] text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                    {currentCardIndex + 1}/{cueCards.length}
                  </div>
                  <div className="absolute top-3 left-3">
                    <HelpCircle className="h-6 w-6 text-[#0197cf]" />
                  </div>
                  <div className="h-full flex flex-col justify-between p-6">
                    <div className="flex-1 flex items-center justify-center">
                      <div className="bg-[#f0f9ff] dark:bg-gray-700/50 p-5 rounded-lg border border-[#e6f7fc] dark:border-gray-600 w-full max-h-[200px] overflow-y-auto">
                        <p className="text-lg font-medium text-center text-gray-800 dark:text-gray-100">
                          {cueCards[currentCardIndex]?.question}
                        </p>
                      </div>
                    </div>
                    <div className="text-center text-sm text-[#0197cf] mt-4 font-medium">
                      Click to reveal answer
                    </div>
                  </div>
                </div>

                {/* Back side - Answer */}
                <div
                  className={`absolute w-full h-full backface-hidden rounded-xl shadow-lg border-2 border-[#01729b]/20 bg-[#f0f9ff] dark:bg-gray-900 rotate-y-180 ${isFlipped ? "block" : "hidden"}`}
                >
                  <div className="absolute top-3 right-3 bg-[#01729b] text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                    {currentCardIndex + 1}/{cueCards.length}
                  </div>
                  <div className="absolute top-3 left-3">
                    <CheckCircle2 className="h-6 w-6 text-[#01729b]" />
                  </div>
                  <div className="h-full flex flex-col justify-between p-6">
                    <div className="flex-1 flex items-center justify-center">
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-[#01729b]/20 dark:border-gray-700 w-full max-h-[200px] overflow-y-auto">
                        <p className="text-md text-gray-700 dark:text-gray-200">
                          {cueCards[currentCardIndex]?.answer}
                        </p>
                      </div>
                    </div>
                    <div className="text-center text-sm text-[#01729b] mt-4 font-medium">
                      Click to see question
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button
                onClick={handlePrevious}
                disabled={currentCardIndex === 0}
                variant="outline"
                className="border-[#0197cf] text-[#0197cf] hover:bg-[#e6f7fc] hover:text-[#01729b] disabled:opacity-50 shadow-sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button
                onClick={downloadCueCards}
                variant="outline"
                className="border-[#0197cf] text-[#0197cf] hover:bg-[#e6f7fc] hover:text-[#01729b] shadow-sm"
              >
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentCardIndex === cueCards.length - 1}
                variant="outline"
                className="border-[#0197cf] text-[#0197cf] hover:bg-[#e6f7fc] hover:text-[#01729b] disabled:opacity-50 shadow-sm"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center bg-[#e6f7fc]/50 dark:bg-[#01729b]/10 p-8 rounded-lg border border-[#e6f7fc] dark:border-[#01729b]/20 max-w-md">
            <Layers className="h-12 w-12 text-[#0197cf] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#0197cf] mb-3">
              Create Study Cards
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Generate interactive cue cards for {topic.name} to enhance your
              learning experience.
            </p>
            <Button
              onClick={generateCueCards}
              className="bg-gradient-to-r from-[#0197cf] to-[#01729b] hover:from-[#01729b] hover:to-[#015f80] text-white shadow-md px-6 py-2 h-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Generate Cue Cards
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* Add these styles to your global CSS or as a style tag in your component */
/* 
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
*/
