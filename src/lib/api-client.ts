// Client-side API utilities

/**
 * Fetch wrapper with error handling
 */
export async function fetchWithErrorHandling(
  url: string,
  options: RequestInit = {},
) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

/**
 * Generate questions for a topic using AI
 */
export async function generateQuestionsForTopic(topic: string) {
  try {
    const response = await fetch("/api/generate-questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate questions: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating questions:", error);
    return null;
  }
}
