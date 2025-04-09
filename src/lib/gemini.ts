const API_KEY = "AIzaSyC1SSFt5umLcMsJhRQ8x63VIs2t42vVIgI";
const MODEL = "gemini-1.5-flash";

export async function generateGeminiResponse(
  message: string,
  topic: string,
  grade?: string,
) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`;

    const gradeSpecificPrompt = grade
      ? `You are an educational assistant specialized in the South African CAPS curriculum for Grade ${grade}. You are helping a Grade ${grade} student learn about ${topic}. Only provide information that is appropriate and part of the official South African Department of Education CAPS syllabus for Grade ${grade}. The student asks: ${message}\n\nProvide a helpful, educational response that's appropriate for a Grade ${grade} student. If the topic is not part of the Grade ${grade} curriculum, politely inform the student and suggest topics that are part of their curriculum. Be thorough and comprehensive in your explanation, providing examples and practical applications where appropriate.`
      : `You are an educational assistant specialized in the South African CAPS curriculum. You are helping a student learn about ${topic}. The student asks: ${message}\n\nProvide a helpful, educational response that's appropriate for a student and aligns with the South African Department of Education CAPS syllabus. Be thorough and comprehensive in your explanation, providing examples and practical applications where appropriate.`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: gradeSpecificPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024, // Increased token limit for more comprehensive responses
        },
      }),
    });

    const data = await response.json();
    if (!data.candidates?.[0]?.content) {
      throw new Error("No response from AI");
    }
    return data.candidates[0].content.parts[0].text;
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    throw new Error(
      error.message ||
        "Failed to generate AI response. Please try again later.",
    );
  }
}

export async function generateCueCardsResponse(
  topic: string,
  count: number = 5,
  grade?: string,
) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`;

    const prompt = grade
      ? `Create ${count} study cue cards for the topic "${topic}" based on the South African CAPS curriculum for Grade ${grade}. Each cue card should have a question on one side and a comprehensive answer on the other. Format your response as a JSON array with objects containing 'question' and 'answer' properties. Make the questions challenging but appropriate for a Grade ${grade} student studying this topic. Keep answers concise but thorough. Only include content that is part of the official Grade ${grade} CAPS curriculum.`
      : `Create ${count} study cue cards for the topic "${topic}" based on the South African curriculum. Each cue card should have a question on one side and a comprehensive answer on the other. Format your response as a JSON array with objects containing 'question' and 'answer' properties. Make the questions challenging but appropriate for a student studying this topic. Keep answers concise but thorough.`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    const data = await response.json();
    if (!data.candidates?.[0]?.content) {
      throw new Error("No response from AI");
    }
    return data.candidates[0].content.parts[0].text;
  } catch (error: any) {
    console.error("Error calling Gemini API for cue cards:", error);
    throw new Error(
      error.message || "Failed to generate cue cards. Please try again later.",
    );
  }
}

export async function generateExplanation(term: string) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`;

    const prompt = `Explain the concept or term "${term}" in simple terms. Include:
    1. A clear definition
    2. A simple analogy or example that a student would understand
    3. How this concept relates to other important concepts
    4. Why it's important to understand
    
    Keep your explanation concise, engaging, and appropriate for a South African student.`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
    });

    const data = await response.json();
    if (!data.candidates?.[0]?.content) {
      throw new Error("No response from AI");
    }
    return data.candidates[0].content.parts[0].text;
  } catch (error: any) {
    console.error("Error calling Gemini API for explanation:", error);
    throw new Error(
      error.message ||
        "Failed to generate explanation. Please try again later.",
    );
  }
}
