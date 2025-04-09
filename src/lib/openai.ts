// Simple mock API implementation to avoid external API calls
// This ensures the app works without depending on external services

export async function generateAIResponse(message: string, topic: string) {
  try {
    console.log("Using local mock API response...");

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate a response based on the topic and message
    const response = generateMockResponse(message, topic);

    return response;
  } catch (error) {
    console.error("Error generating response:", error);
    throw new Error("Failed to generate AI response. Please try again later.");
  }
}

// Generate a mock response based on the topic and message
function generateMockResponse(message: string, topic: string): string {
  const lowercaseMessage = message.toLowerCase();

  // Basic responses for common questions
  if (
    lowercaseMessage.includes("what is") ||
    lowercaseMessage.includes("explain")
  ) {
    return `${topic} is an important concept in the South African curriculum. It involves understanding key principles and applying them to solve problems. Students typically learn this in grades 10-12.`;
  }

  if (
    lowercaseMessage.includes("how to") ||
    lowercaseMessage.includes("solve")
  ) {
    return `To solve problems related to ${topic}, follow these steps:\n\n1. Understand the problem statement\n2. Identify the key variables or components\n3. Apply the relevant formulas or principles\n4. Work through the solution step by step\n5. Verify your answer\n\nPractice with different examples to build confidence.`;
  }

  if (lowercaseMessage.includes("example")) {
    return `Here's an example related to ${topic}:\n\nProblem: [Sample problem relevant to ${topic}]\n\nSolution:\n1. First, we identify what we're looking for\n2. Then we apply the relevant formula\n3. We solve step by step\n4. The answer is [sample answer]\n\nTry working through similar examples in your textbook.`;
  }

  // Default response
  return `That's an interesting question about ${topic}. In the South African curriculum, students learn about this concept through practical examples and applications. I recommend reviewing your class notes and textbook for specific details relevant to your grade level.`;
}
