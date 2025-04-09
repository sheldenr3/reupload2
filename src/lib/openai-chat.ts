import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_OPENAI_API_KEY);

export async function generateAIResponse(message: string, topic: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = `You are a helpful tutor explaining ${topic} in the context of the South African curriculum. Keep responses clear and concise.`;

    const result = await model.generateContent([systemPrompt, message]);

    const response = await result.response;
    const text = response.text();

    return text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error generating response:", error);
    throw new Error("Failed to generate AI response. Please try again later.");
  }
}
