import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "default" | "space" | "character" | "rainforest";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("default");

  useEffect(() => {
    const savedTheme = localStorage.getItem("appTheme") as Theme | null;
    if (
      savedTheme &&
      ["default", "space", "character", "rainforest"].includes(savedTheme)
    ) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("appTheme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);

    // Clean up any theme-specific elements when switching themes
    removeThemeElements();

    // Add theme-specific elements based on the new theme
    if (newTheme === "space") {
      addSpaceThemeElements();
    } else if (newTheme === "character") {
      addCharacterThemeElements();
    } else if (newTheme === "rainforest") {
      addRainforestThemeElements();
    }
  };

  // Function to remove all theme-specific elements
  const removeThemeElements = () => {
    document
      .querySelectorAll(
        ".space-star, .space-galaxy, .space-comet, .character-emoji, .character-bubble, .rainforest-leaf, .rainforest-bird, .rainforest-mist",
      )
      .forEach((el) => {
        el.remove();
      });
  };

  // Function to add space theme elements
  const addSpaceThemeElements = () => {
    const container = document.body;

    // Add galaxy background
    const galaxy = document.createElement("div");
    galaxy.className = "space-galaxy";
    container.appendChild(galaxy);

    // Add stars
    for (let i = 0; i < 70; i++) {
      const star = document.createElement("div");
      star.className = "space-star";
      star.style.width = `${Math.random() * 3 + 1}px`;
      star.style.height = star.style.width;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      container.appendChild(star);
    }

    // Add comets
    for (let i = 0; i < 5; i++) {
      const comet = document.createElement("div");
      comet.className = "space-comet";
      comet.style.left = `${Math.random() * 50}%`;
      comet.style.top = `${Math.random() * 50}%`;
      comet.style.animationDelay = `${Math.random() * 15}s`;
      container.appendChild(comet);
    }
  };

  // Function to add character theme elements
  const addCharacterThemeElements = () => {
    const container = document.body;
    const emojis = [
      "😀",
      "😁",
      "😂",
      "🤣",
      "😃",
      "😄",
      "😅",
      "😆",
      "😉",
      "😊",
      "😋",
      "😎",
      "😍",
      "🥰",
      "😘",
      "🤔",
      "🤩",
      "🥳",
      "😇",
      "🙂",
    ];

    // Add bubbles
    for (let i = 0; i < 15; i++) {
      const bubble = document.createElement("div");
      bubble.className = "character-bubble";
      bubble.style.width = `${Math.random() * 50 + 20}px`;
      bubble.style.height = bubble.style.width;
      bubble.style.left = `${Math.random() * 90 + 5}%`;
      bubble.style.bottom = `-50px`;
      bubble.style.animationDelay = `${Math.random() * 10}s`;
      container.appendChild(bubble);
    }

    // Add emojis
    for (let i = 0; i < 20; i++) {
      const emoji = document.createElement("div");
      emoji.className = "character-emoji";
      emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      emoji.style.left = `${Math.random() * 90 + 5}%`;
      emoji.style.top = `${Math.random() * 90 + 5}%`;
      emoji.style.fontSize = `${Math.random() * 16 + 24}px`;

      // Add click interaction
      emoji.addEventListener("click", () => {
        emoji.style.animation = "emoji-tada 1s ease-in-out";
        setTimeout(() => {
          emoji.style.animation = "emoji-float 6s ease-in-out infinite";
        }, 1000);
      });

      container.appendChild(emoji);
    }
  };

  // Function to add rainforest theme elements
  const addRainforestThemeElements = () => {
    const container = document.body;

    // Add mist overlay
    const mist = document.createElement("div");
    mist.className = "rainforest-mist";
    mist.style.position = "absolute";
    mist.style.top = "0";
    mist.style.left = "0";
    mist.style.width = "100%";
    mist.style.height = "100%";
    mist.style.opacity = "0.4";
    mist.style.pointerEvents = "none";
    mist.style.zIndex = "1";
    container.appendChild(mist);

    // Add falling leaves
    const leafShapes = ["🍃", "🍂", "🍁", "🌿", "☘️"];
    for (let i = 0; i < 30; i++) {
      const leaf = document.createElement("div");
      leaf.className = "rainforest-leaf";
      leaf.textContent =
        leafShapes[Math.floor(Math.random() * leafShapes.length)];
      leaf.style.left = `${Math.random() * 100}%`;
      leaf.style.top = `-50px`;
      leaf.style.fontSize = `${Math.random() * 16 + 16}px`;
      leaf.style.animationDuration = `${Math.random() * 10 + 10}s`;
      leaf.style.animationDelay = `${Math.random() * 10}s`;
      leaf.style.zIndex = "2";
      container.appendChild(leaf);
    }

    // Add birds
    for (let i = 0; i < 5; i++) {
      const bird = document.createElement("div");
      bird.className = "rainforest-bird";
      bird.textContent = "🦜";
      bird.style.position = "absolute";
      bird.style.left = `-50px`;
      bird.style.top = `${Math.random() * 30 + 10}%`;
      bird.style.fontSize = `${Math.random() * 16 + 24}px`;
      bird.style.animation = `bird-fly ${Math.random() * 10 + 15}s linear infinite`;
      bird.style.animationDelay = `${Math.random() * 5}s`;
      bird.style.zIndex = "2";
      container.appendChild(bird);
    }
  };

  // Apply theme elements on initial load
  useEffect(() => {
    if (theme === "space") {
      addSpaceThemeElements();
    } else if (theme === "character") {
      addCharacterThemeElements();
    } else if (theme === "rainforest") {
      addRainforestThemeElements();
    }

    return () => removeThemeElements();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
