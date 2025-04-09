import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, BarChart } from "lucide-react";
import { generateGeminiResponse } from "@/lib/gemini";
import MermaidDiagram from "@/components/diagrams/MermaidDiagram";

interface Message {
  role: "user" | "assistant";
  content: string;
  isDiagram?: boolean;
}

interface StudyBuddyProps {
  buddyName: string;
  topic?: string;
}

export default function StudyBuddyChat({
  buddyName = "Buddy",
  topic = "",
}: StudyBuddyProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting message
    setMessages([
      {
        role: "assistant",
        content: `Hi there! I'm ${buddyName}, your study buddy! ${topic ? `I see you're studying ${topic}. ` : ""}How can I help you today?`,
      },
    ]);
  }, [buddyName, topic]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Check if the user is requesting a diagram
      const isDiagramRequest =
        /create\s+(?:a\s+)?diagram|generate\s+(?:a\s+)?diagram|draw\s+(?:a\s+)?diagram|show\s+(?:a\s+)?diagram|make\s+(?:a\s+)?diagram|visualize|visualization|flowchart|mermaid/i.test(
          input,
        );

      let promptText;
      if (isDiagramRequest) {
        promptText = `You are ${buddyName}, a friendly study buddy AI assistant. The user has asked you to create a diagram about ${topic || "a topic"}. Create a Mermaid.js diagram (version 11.5.0) for the following request: "${input}". Return ONLY valid Mermaid code wrapped in triple backticks with the 'mermaid' language specifier. For example: \`\`\`mermaid\ngraph TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Action]\n    B -->|No| D[Alternative]\n\`\`\`\n\nIMPORTANT RULES TO FOLLOW:\n1. ALWAYS use 'graph TD' syntax (not 'flowchart TD')\n2. NEVER use semicolons after graph declarations\n3. ALWAYS include spaces around arrows: 'A --> B' (not 'A-->B')\n4. ALWAYS define all nodes before referencing them\n5. Keep diagrams simple with no more than 8 nodes\n6. Use proper spacing and indentation\n7. For node labels, use square brackets: A[Label]\n8. For decision nodes, use curly braces: B{Decision}\n9. For edge labels, use the syntax: A -->|Label| B\n10. DO NOT use subgraphs or other advanced features`;
      } else {
        promptText = `You are ${buddyName}, a friendly study buddy AI assistant. ${topic ? `The user is studying ${topic}.` : ""} Respond to the user's message in a helpful, encouraging, and somewhat playful way. Keep responses concise (under 3 sentences if possible).`;
      }

      const response = await generateGeminiResponse(input, promptText);

      // Check if the response contains a Mermaid diagram
      const mermaidMatch = response.match(/```mermaid\n([\s\S]*?)\n```/);
      const hasMermaidCode =
        mermaidMatch ||
        response.trim().startsWith("graph ") ||
        response.trim().startsWith("flowchart ") ||
        response.trim().startsWith("sequenceDiagram") ||
        response.trim().startsWith("classDiagram") ||
        response.trim().startsWith("pie ");

      const buddyMessage: Message = {
        role: "assistant",
        content: response,
        isDiagram: isDiagramRequest && hasMermaidCode,
      };

      setMessages((prev) => [...prev, buddyMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
      // Fallback response if API fails
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I'm having trouble thinking right now. Can you try asking me something else?`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[400px] border rounded-md bg-white dark:bg-gray-800 shadow-md overflow-hidden">
      <div className="p-3 border-b bg-[#0197cf] dark:bg-[#01729b] text-white">
        <h3 className="text-lg font-bold flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          Chat with {buddyName}
        </h3>
      </div>

      <ScrollArea className="flex-1 p-4 bg-[#f5fcff] dark:bg-gray-900">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${message.role === "user" ? "bg-[#0197cf] text-white" : "bg-white dark:bg-gray-800 border border-[#e6f7fc] dark:border-gray-700 shadow-sm"}`}
              >
                {message.role === "assistant" && message.isDiagram ? (
                  <div className="w-full">
                    <div className="flex items-center mb-2 text-[#0197cf] text-xs font-medium">
                      <BarChart className="h-3 w-3 mr-1" /> Diagram Generated
                    </div>
                    <MermaidDiagram code={message.content} className="w-full" />
                  </div>
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-white dark:bg-gray-800 border border-[#e6f7fc] dark:border-gray-700 shadow-sm">
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

      <div className="p-3 border-t border-[#0197cf]/20 bg-white dark:bg-gray-800">
        <div className="flex space-x-2">
          <Textarea
            placeholder={`Ask ${buddyName} something...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 border-[#0197cf]/30 focus-visible:ring-[#0197cf] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="bg-[#0197cf] hover:bg-[#01729b] text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
