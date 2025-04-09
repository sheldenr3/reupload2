import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, X, Lightbulb, Copy } from "lucide-react";
import { generateGeminiResponse } from "@/lib/gemini";
import { usePoints } from "@/contexts/PointsContext";

export default function ExplainThisButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addPoints } = usePoints();

  // Listen for text selection
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        setSelectedText(selection.toString().trim());
      }
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("keyup", handleSelection);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("keyup", handleSelection);
    };
  }, []);

  const handleExplain = async () => {
    if (!selectedText.trim()) return;

    setIsLoading(true);
    setError(null);
    setExplanation("");

    try {
      const prompt = `Explain the concept or term "${selectedText}" in simple terms. Include:
      1. A clear definition
      2. A simple analogy or example that a student would understand
      3. How this concept relates to other important concepts
      4. Why it's important to understand
      
      Keep your explanation concise, engaging, and appropriate for a South African student.`;

      const response = await generateGeminiResponse(prompt, "Education");
      setExplanation(response);
      await addPoints(2); // Award points for using the explain feature
    } catch (error) {
      console.error("Error generating explanation:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(explanation);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-[#0197cf] hover:bg-[#01729b] z-50 flex items-center justify-center"
        aria-label="Explain This"
      >
        <HelpCircle className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-[#0197cf]" />
              Explain This
            </DialogTitle>
            <DialogDescription>
              Get a simple explanation for any concept or term.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">What to explain:</label>
              <Textarea
                value={selectedText}
                onChange={(e) => setSelectedText(e.target.value)}
                placeholder="Type or paste a word or concept you want explained"
                className="mt-1 min-h-[80px]"
              />
            </div>

            <Button
              onClick={handleExplain}
              disabled={!selectedText.trim() || isLoading}
              className="w-full bg-[#0197cf] hover:bg-[#01729b]"
            >
              {isLoading ? "Generating explanation..." : "Explain This"}
            </Button>

            {error && (
              <div className="p-3 bg-red-50 text-red-500 rounded-md text-sm">
                {error}
              </div>
            )}

            {explanation && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Explanation:</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    className="h-8 px-2 text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" /> Copy
                  </Button>
                </div>
                <div className="p-4 bg-[#f5fcff] dark:bg-gray-800 rounded-md border border-[#e6f7fc] dark:border-gray-700 text-sm overflow-y-auto max-h-[300px]">
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    {explanation.split("\n\n").map((paragraph, i) => (
                      <p key={i} className={i > 0 ? "mt-2" : ""}>
                        {paragraph.split("\n").map((line, j) => (
                          <span key={j}>
                            {line
                              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                              .replace(/\*(.*?)\*/g, "<em>$1</em>")
                              .split(/(<strong>.*?<\/strong>|<em>.*?<\/em>)/)
                              .map((part, k) => {
                                if (part.startsWith("<strong>")) {
                                  return (
                                    <strong key={k}>
                                      {part.replace(
                                        /<strong>(.*?)<\/strong>/,
                                        "$1",
                                      )}
                                    </strong>
                                  );
                                } else if (part.startsWith("<em>")) {
                                  return (
                                    <em key={k}>
                                      {part.replace(/<em>(.*?)<\/em>/, "$1")}
                                    </em>
                                  );
                                } else {
                                  return <span key={k}>{part}</span>;
                                }
                              })}
                            {j < paragraph.split("\n").length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
