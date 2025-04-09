export async function generateChatGPTResponse(message: string, topic: string) {
  try {
    console.log("Using fallback response system...");

    // Use the local implementation directly
    return getGenericResponse(topic, message);
  } catch (error) {
    console.error("Error generating response:", error);
    return getGenericResponse(topic, message);
  }
}

// Function to get a generic response based on the topic
function getGenericResponse(topic: string, query: string): string {
  // Convert query to lowercase for case-insensitive matching
  const lowercaseQuery = query.toLowerCase();

  // Generic responses for common topics
  const responses: Record<string, Record<string, string>> = {
    Equations: {
      "what are":
        "Equations are mathematical statements that assert the equality of two expressions. They consist of two expressions on either side of an equals sign (=). For example, in the equation 2x + 3 = 7, we have the expression '2x + 3' on the left side and '7' on the right side. Solving equations involves finding the value(s) of the variable(s) that make the equation true.",
      "how do i solve":
        "To solve a linear equation (an equation where the variable has a power of 1):\n\n1. Simplify both sides by combining like terms\n2. Use addition or subtraction to isolate the variable term on one side\n3. Use multiplication or division to solve for the variable\n\nFor example, to solve 2x + 3 = 7:\n1. Subtract 3 from both sides: 2x = 4\n2. Divide both sides by 2: x = 2\n\nThe solution is x = 2.",
      quadratic:
        "Quadratic equations are equations where the highest power of the variable is 2. They are typically written in the form ax² + bx + c = 0, where a, b, and c are constants and a ≠ 0. For example, x² - 5x + 6 = 0 is a quadratic equation.\n\nThere are several methods to solve quadratic equations:\n1. Factoring\n2. Completing the square\n3. Using the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a\n\nQuadratic equations may have two, one, or no real solutions.",
    },
    Expressions: {
      "what are":
        "In mathematics, an expression is a combination of numbers, variables, operators, and functions that represents a value. Unlike equations, expressions don't contain an equals sign and don't assert that two quantities are equal. Examples of expressions include 2x + 3, √(x² + y²), and 3a - 4b + 2c.",
      "how do i simplify":
        "To simplify algebraic expressions:\n\n1. Combine like terms (terms with the same variables raised to the same powers)\n2. Apply the distributive property to expand expressions\n3. Factor out common factors when possible\n4. Use the order of operations (PEMDAS/BODMAS)\n\nFor example, to simplify 3x + 2y + 5x - y:\n1. Group like terms: (3x + 5x) + (2y - y)\n2. Combine like terms: 8x + y\n\nThe simplified expression is 8x + y.",
    },
    Triangles: {
      properties:
        "Key properties of triangles include:\n\n1. A triangle has 3 sides and 3 angles\n2. The sum of all interior angles is always 180°\n3. The sum of the lengths of any two sides must be greater than the length of the third side\n4. The Pythagorean theorem (a² + b² = c²) applies to right triangles\n5. The area can be calculated using the formula A = ½ × base × height\n\nTriangles can be classified by sides (equilateral, isosceles, scalene) or by angles (acute, right, obtuse).",
    },
  };

  // Check if we have responses for this topic
  if (responses[topic]) {
    // Look for a matching query or partial match
    for (const [key, response] of Object.entries(responses[topic])) {
      if (lowercaseQuery.includes(key) || key.includes(lowercaseQuery)) {
        return response;
      }
    }
  }

  // Generic fallback response
  return `Based on the South African curriculum for ${topic}, this concept is important for students to understand. It involves mathematical principles that build on previous knowledge and will be useful in future studies. I recommend practicing with examples and consulting your textbook for more detailed explanations specific to your grade level.`;
}
