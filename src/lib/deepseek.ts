import axios from "axios";

// DeepSeek API configuration
const API_KEY = "sk-2499f9a50bd54589a388541faf2497de";
const API_URL = "https://api.deepseek.com/v1/chat/completions";

export async function generateDeepSeekResponse(message: string, topic: string) {
  try {
    console.log("Calling DeepSeek API...");

    // Create a prompt that includes the topic and user's question
    const prompt = `You are an educational assistant specialized in South African curriculum. You are helping a student learn about ${topic}. The student asks: ${message}\n\nProvide a helpful, educational response that's appropriate for a student.`;

    const response = await axios.post(
      API_URL,
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You are an educational assistant specialized in South African curriculum.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 800,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      },
    );

    console.log("DeepSeek API response received");
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    throw new Error("Failed to generate AI response. Please try again later.");
  }
}
