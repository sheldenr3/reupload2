import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Lightbulb, Brain, Sparkles, Info, BarChart } from "lucide-react";
import { generateGeminiResponse } from "@/lib/gemini";
import { usePoints } from "@/contexts/PointsContext";
import MermaidDiagram from "@/components/diagrams/MermaidDiagram";

interface Message {
  role: "user" | "assistant";
  content: string;
  isDiagram?: boolean;
}

interface AILearningInterfaceProps {
  topic: {
    id: string;
    name: string;
  } | null;
  grade?: string;
}

export default function AILearningInterface({
  topic,
  grade,
}: AILearningInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addPoints } = usePoints();
  const [apiError, setApiError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (topic && messages.length === 0) {
      const gradeSpecificMessage = grade
        ? `Welcome to the ${topic.name} learning module for Grade ${grade}! I'm your BrainSA learning assistant. What would you like to know about this topic?`
        : `Welcome to the ${topic.name} learning module! I'm your BrainSA learning assistant. What would you like to know about this topic?`;

      setMessages([
        {
          role: "assistant",
          content: gradeSpecificMessage,
        },
      ]);
    }
  }, [topic, grade, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !topic) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setApiError(null);

    try {
      // Check if the user is requesting a diagram
      const isDiagramRequest =
        /create\s+(?:a\s+)?diagram|generate\s+(?:a\s+)?diagram|draw\s+(?:a\s+)?diagram|show\s+(?:a\s+)?diagram|make\s+(?:a\s+)?diagram|visualize|visualization|flowchart|mermaid/i.test(
          input,
        );

      // Check if the user is requesting more information
      const isMoreInfoRequest =
        /generate\s+more|tell\s+me\s+more|more\s+information|elaborate|explain\s+further/i.test(
          input,
        );

      let prompt = input;
      if (isDiagramRequest) {
        prompt = `Create a Mermaid.js diagram (version 11.5.0) for the following request: "${input}". The diagram should be related to ${topic.name}. Return ONLY valid Mermaid code wrapped in triple backticks with the 'mermaid' language specifier. For example: \`\`\`mermaid\ngraph TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Action]\n    B -->|No| D[Alternative]\n\`\`\`\n\nIMPORTANT RULES TO FOLLOW:\n1. ALWAYS use 'graph TD' syntax (not 'flowchart TD')\n2. NEVER use semicolons after graph declarations\n3. ALWAYS include spaces around arrows: 'A --> B' (not 'A-->B')\n4. ALWAYS define all nodes before referencing them\n5. Keep diagrams simple with no more than 8 nodes\n6. Use proper spacing and indentation\n7. For node labels, use square brackets: A[Label]\n8. For decision nodes, use curly braces: B{Decision}\n9. For edge labels, use the syntax: A -->|Label| B\n10. DO NOT use subgraphs or other advanced features`;
      } else if (isMoreInfoRequest && messages.length > 0) {
        // Get the last AI message to build context
        const lastAIMessage = [...messages]
          .reverse()
          .find((m) => m.role === "assistant");
        if (lastAIMessage) {
          prompt = `Based on your previous explanation about ${topic.name}, please provide more detailed information. Focus on advanced concepts, practical applications, and examples that would be appropriate for a student in Grade ${grade || "high school"}. Previous context: ${lastAIMessage.content.substring(0, 500)}... Now please elaborate further with new information.`;
        }
      }

      // Include grade information in the prompt if available
      const contextWithGrade = grade
        ? `${topic.name} for Grade ${grade} students`
        : topic.name;

      const aiResponseContent = await generateGeminiResponse(
        prompt,
        contextWithGrade,
        grade,
      );

      // Check if the response contains a Mermaid diagram
      const mermaidMatch = aiResponseContent.match(
        /```mermaid\n([\s\S]*?)\n```/,
      );
      const hasMermaidCode =
        mermaidMatch ||
        aiResponseContent.trim().startsWith("graph ") ||
        aiResponseContent.trim().startsWith("flowchart ") ||
        aiResponseContent.trim().startsWith("sequenceDiagram") ||
        aiResponseContent.trim().startsWith("classDiagram") ||
        aiResponseContent.trim().startsWith("pie ");

      const aiResponse: Message = {
        role: "assistant",
        content: aiResponseContent,
        isDiagram: isDiagramRequest && hasMermaidCode,
      };

      setMessages((prev) => [...prev, aiResponse]);
      await addPoints(isDiagramRequest ? 10 : isMoreInfoRequest ? 8 : 5); // More points for diagram generation and additional info
    } catch (error) {
      console.error("Error generating AI response:", error);
      setApiError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  // Tailor suggested questions based on grade level
  const getSuggestedQuestions = () => {
    const baseQuestions = [
      `What is ${topic?.name}?`,
      `Why is ${topic?.name} important?`,
      `Create a diagram for ${topic?.name}`,
    ];

    // Add grade-specific questions if grade is available
    if (grade) {
      const gradeNum = parseInt(grade || "0");

      // Foundation phase (Grades 1-3)
      if (gradeNum >= 1 && gradeNum <= 3) {
        return [
          ...baseQuestions,
          `Explain ${topic?.name} in simple words`,
          `Show me a fun activity about ${topic?.name}`,
        ];
      }
      // Intermediate phase (Grades 4-7)
      else if (gradeNum >= 4 && gradeNum <= 7) {
        return [
          ...baseQuestions,
          `How do I solve ${topic?.name} problems?`,
          `Give me an example of ${topic?.name}`,
        ];
      }
      // Senior phase (Grades 8-9)
      else if (gradeNum >= 8 && gradeNum <= 9) {
        return [
          ...baseQuestions,
          `How do I solve ${topic?.name} problems?`,
          `What are the key concepts in ${topic?.name}?`,
        ];
      }
      // FET phase (Grades 10-12)
      else if (gradeNum >= 10 && gradeNum <= 12) {
        return [
          ...baseQuestions,
          `Explain the advanced concepts in ${topic?.name}`,
          `How does ${topic?.name} relate to other subjects?`,
          `What exam questions might come from ${topic?.name}?`,
        ];
      }
    }

    // Default questions if no grade or invalid grade
    return [
      `What is ${topic?.name}?`,
      `How do I solve ${topic?.name} problems?`,
      `Give me an example of ${topic?.name}`,
      `Why is ${topic?.name} important?`,
      `Create a diagram for ${topic?.name}`,
    ];
  };

  const suggestedQuestions = getSuggestedQuestions();

  return (
    <div className="flex flex-col h-[500px] sm:h-[550px] md:h-[600px] w-full border rounded-md bg-white dark:bg-gray-800 shadow-md overflow-hidden">
      <div className="p-2 sm:p-3 md:p-4 border-b bg-[#0197cf] dark:bg-[#01729b] text-white">
        <h2 className="text-base sm:text-lg md:text-xl font-bold flex items-center">
          <Brain className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          {topic
            ? `Learning: ${topic.name}`
            : "Select a topic to start learning"}
        </h2>
        {apiError && (
          <div className="mt-2 text-xs sm:text-sm text-red-200 bg-red-500/20 p-2 rounded">
            Error: {apiError}
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 p-2 sm:p-3 md:p-4 bg-[#f5fcff] dark:bg-gray-900">
        <div className="space-y-2 sm:space-y-3 md:space-y-4">
          {messages.length === 0 && topic && (
            <div className="text-center text-muted-foreground p-2 sm:p-4">
              Ask any question about {topic.name} to start learning
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[85%] md:max-w-[80%] rounded-lg p-2 sm:p-3 ${message.role === "user" ? "bg-[#0197cf] text-white" : "bg-white dark:bg-gray-800 border border-[#e6f7fc] dark:border-gray-700 shadow-sm"}`}
              >
                {message.role === "assistant" ? (
                  message.isDiagram ? (
                    <div className="w-full">
                      <div className="flex items-center mb-2 text-[#0197cf] text-xs font-medium">
                        <BarChart className="h-3 w-3 mr-1" /> Diagram Generated
                      </div>
                      <MermaidDiagram
                        code={message.content}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-xs sm:text-sm md:text-base">
                      {message.content.split("\n\n").map((paragraph, i) => (
                        <p key={i} className={i > 0 ? "mt-2 sm:mt-3" : ""}>
                          {paragraph.split("\n").map((line, j) => (
                            <span key={j}>
                              {line
                                .replace(
                                  /\*\*(.*?)\*\*/g,
                                  "<strong>$1</strong>",
                                )
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
                      {message.role === "assistant" && !message.isDiagram && (
                        <div className="mt-3 flex justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-[#0197cf] text-[#0197cf] hover:bg-[#0197cf] hover:text-white"
                            onClick={() => {
                              setInput(
                                "Generate more information about this topic",
                              );
                              handleSendMessage();
                            }}
                          >
                            <Sparkles className="h-3 w-3 mr-1" /> Generate More
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[90%] sm:max-w-[85%] md:max-w-[80%] rounded-lg p-2 sm:p-3 bg-white dark:bg-gray-800 border border-[#e6f7fc] dark:border-gray-700 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-[#0197cf] animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-[#0197cf] animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-[#0197cf] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {topic && messages.length === 1 && (
        <div className="px-2 sm:px-3 md:px-4 py-2 sm:py-3 bg-[#e6f7fc] dark:bg-gray-800 border-t border-[#0197cf]/20">
          <p className="text-xs sm:text-sm font-medium text-[#0197cf] flex items-center mb-1 sm:mb-2">
            <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Suggested
            Questions:
          </p>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                className="text-xs sm:text-sm bg-white dark:bg-gray-700 text-[#0197cf] dark:text-[#01d2ff] px-2 sm:px-3 py-1 rounded-full border border-[#0197cf]/20 hover:bg-[#0197cf] hover:text-white transition-colors"
                onClick={() => {
                  setInput(question);
                }}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-2 sm:p-3 md:p-4 border-t border-[#0197cf]/20 bg-white dark:bg-gray-800">
        <div className="flex space-x-2">
          <Textarea
            placeholder={
              topic ? `Ask about ${topic.name}...` : "Select a topic first"
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!topic || isLoading}
            className="flex-1 border-[#0197cf]/30 focus-visible:ring-[#0197cf] resize-none text-xs sm:text-sm md:text-base"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!topic || !input.trim() || isLoading}
            size="icon"
            className="bg-[#0197cf] hover:bg-[#01729b] text-white min-w-8 sm:min-w-10 h-8 sm:h-10"
          >
            <Send className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
