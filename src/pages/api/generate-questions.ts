import { generateAIResponse } from "@/lib/openai-chat";

// This is a client-side API route simulation for Vite
export async function generateQuestions(topic: string) {
  try {
    // Use the existing AI integration
    const prompt = `Generate 5 multiple-choice questions about ${topic} for a South African curriculum. 
    Each question should have 4 options with one correct answer. 
    Format the response as a JSON array with objects containing: 
    id, text, options (array of 4 strings), and correctAnswer (index 0-3).
    Make the questions appropriate for high school students.`;

    const response = await generateAIResponse(prompt, topic);

    // Try to parse the response as JSON
    try {
      // Extract JSON from the response if it's wrapped in text
      const jsonMatch = response.match(/\[\s*\{.*\}\s*\]/s);
      const jsonStr = jsonMatch ? jsonMatch[0] : response;
      const questions = JSON.parse(jsonStr);

      // Validate the structure
      if (Array.isArray(questions) && questions.length > 0) {
        return {
          questions: questions.map((q, index) => ({
            id: q.id || `${topic.replace(/\s+/g, "-")}-q${index + 1}`,
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
          })),
        };
      }
    } catch (parseError) {
      console.error("Error parsing AI response as JSON:", parseError);
      // Return null to trigger fallback
      return null;
    }

    return null;
  } catch (error) {
    console.error("Error in generateQuestions:", error);
    return null;
  }
}

// Mock API endpoint handler for client-side use
export default async function handler(req: Request) {
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const { topic } = body;

      const result = await generateQuestions(topic);

      if (result) {
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        return new Response(
          JSON.stringify({ error: "Failed to generate questions" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } else {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }
}
