import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { usePoints } from "@/contexts/PointsContext";
import { Sparkles, Heart, Star, Clock } from "lucide-react";
import { useStudyBuddy } from "@/contexts/StudyBuddyContext";
import { Minimize2, MessageCircle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StudyBuddyChat from "./StudyBuddyChat";

// Define character options with animated parts
const CHARACTER_CONFIGS = {
  beginner: {
    id: "beginner",
    name: "Beginner Bot",
    description: "A friendly bot for beginners",
    colors: {
      primary: "#ff9999",
      secondary: "#ffcccb",
      accent: "#ff6666",
    },
    animations: {
      idle: "buddy-bounce",
      happy: "buddy-pulse",
      sleepy: "buddy-sway",
      thinking: "buddy-wiggle",
    },
    parts: {
      body: {
        shape: "circle",
        color: "#ff9999",
      },
      eyes: {
        type: "round",
        color: "#333333",
      },
      mouth: {
        type: "smile",
      },
    },
  },
  intermediate: {
    id: "intermediate",
    name: "Intermediate Bot",
    description: "A more advanced bot for intermediate learners",
    colors: {
      primary: "#a1e5b1",
      secondary: "#d1f4d9",
      accent: "#7dcc8c",
    },
    animations: {
      idle: "buddy-wiggle",
      happy: "buddy-spin",
      sleepy: "buddy-sway-slow",
      thinking: "buddy-float",
    },
    parts: {
      body: {
        shape: "roundedSquare",
        color: "#a1e5b1",
      },
      eyes: {
        type: "oval",
        color: "#333333",
      },
      mouth: {
        type: "grin",
      },
    },
  },
  advanced: {
    id: "advanced",
    name: "Advanced Bot",
    description: "A sophisticated bot for advanced learners",
    colors: {
      primary: "#86d3f4",
      secondary: "#b6e3f4",
      accent: "#5cb3dd",
    },
    animations: {
      idle: "buddy-float",
      happy: "buddy-tada",
      sleepy: "buddy-sway-slow",
      thinking: "buddy-pulse",
    },
    parts: {
      body: {
        shape: "hexagon",
        color: "#86d3f4",
      },
      eyes: {
        type: "tech",
        color: "#0055ff",
      },
      mouth: {
        type: "tech",
      },
    },
  },
  cat: {
    id: "cat",
    name: "Study Cat",
    description: "A cute cat to keep you company",
    colors: {
      primary: "#ffb6c1",
      secondary: "#ffd5dc",
      accent: "#ff8b9a",
    },
    animations: {
      idle: "buddy-tail-wag",
      happy: "buddy-jump",
      sleepy: "buddy-sway-slow",
      thinking: "buddy-wiggle",
    },
    parts: {
      body: {
        shape: "cat",
        color: "#ffb6c1",
      },
      eyes: {
        type: "catEyes",
        color: "#ffea00",
      },
      ears: {
        type: "pointed",
        color: "#ffb6c1",
      },
      tail: {
        type: "curvy",
        color: "#ffb6c1",
      },
    },
  },
  fox: {
    id: "fox",
    name: "Clever Fox",
    description: "A clever fox to help you study",
    colors: {
      primary: "#ffd699",
      secondary: "#ffeacc",
      accent: "#ffba57",
    },
    animations: {
      idle: "buddy-sway",
      happy: "buddy-spin-jump",
      sleepy: "buddy-sway-slow",
      thinking: "buddy-tail-wag",
    },
    parts: {
      body: {
        shape: "fox",
        color: "#ffd699",
      },
      eyes: {
        type: "foxEyes",
        color: "#663300",
      },
      ears: {
        type: "foxEars",
        color: "#ffba57",
      },
      tail: {
        type: "bushy",
        color: "#ffd699",
      },
    },
  },
  owl: {
    id: "owl",
    name: "Wise Owl",
    description: "A wise owl for deep learning",
    colors: {
      primary: "#b3d9ff",
      secondary: "#e0f2ff",
      accent: "#80bdff",
    },
    animations: {
      idle: "buddy-blink",
      happy: "buddy-flap",
      sleepy: "buddy-sway-slow",
      thinking: "buddy-float",
    },
    parts: {
      body: {
        shape: "oval",
        color: "#b3d9ff",
      },
      eyes: {
        type: "owlEyes",
        color: "#ffcc00",
      },
      wings: {
        type: "rounded",
        color: "#80bdff",
      },
      beak: {
        type: "triangle",
        color: "#ffcc00",
      },
    },
  },
};

// Convert to array format for compatibility with existing code
const CHARACTER_OPTIONS = Object.values(CHARACTER_CONFIGS);

// Random messages the buddy can say
const BUDDY_MESSAGES = [
  "Time to study!",
  "You're doing great!",
  "Need any help?",
  "Keep it up!",
  "Let's learn something new!",
  "You've got this!",
  "Remember to take breaks!",
  "Studying is fun with me!",
];

// Emotions with corresponding animations and expressions
const EMOTIONS = {
  happy: {
    messages: ["Yay!", "Awesome!", "Great job!"],
    emojis: ["😄", "🎉", "👍"],
  },
  thinking: {
    messages: ["Hmm...", "Let me think...", "Interesting..."],
    emojis: ["🤔", "💭", "🧠"],
  },
  encouraging: {
    messages: ["You can do it!", "Keep going!", "Almost there!"],
    emojis: ["💪", "🌟", "🚀"],
  },
};

export default function FloatingStudyBuddy() {
  const {
    buddyName,
    setBuddyName,
    level,
    characterId,
    setCharacterId,
    showFloatingBuddy,
  } = useStudyBuddy();
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({
    x: 20,
    y: window.innerHeight - 200,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showDialog, setShowDialog] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentEmoji, setCurrentEmoji] = useState("");
  const [currentEmotion, setCurrentEmotion] = useState<
    "idle" | "happy" | "thinking" | "sleepy"
  >("idle");
  const [blinking, setBlinking] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Fix: Use proper TypeScript typing for the refs
  const animationTimeoutRef = useRef<number | null>(null);
  const messageTimeoutRef = useRef<number | null>(null);
  const blinkIntervalRef = useRef<number | null>(null);

  // Get character based on ID or default to first one
  const currentCharacter =
    CHARACTER_CONFIGS[characterId as keyof typeof CHARACTER_CONFIGS] ||
    CHARACTER_CONFIGS.beginner;

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    // Show a dragging animation
    setCurrentEmotion("happy");

    // Show a random happy message
    const happyMessages = EMOTIONS.happy.messages;
    const happyEmojis = EMOTIONS.happy.emojis;
    setCurrentMessage(
      happyMessages[Math.floor(Math.random() * happyMessages.length)],
    );
    setCurrentEmoji(
      happyEmojis[Math.floor(Math.random() * happyEmojis.length)],
    );
    setShowMessage(true);
  };

  // Handle clicking on the character
  const handleCharacterClick = () => {
    if (!isDragging) {
      // Show a thinking emotion when clicked
      setCurrentEmotion("thinking");
      const thinkingMessages = EMOTIONS.thinking.messages;
      const thinkingEmojis = EMOTIONS.thinking.emojis;
      setCurrentMessage(
        thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)],
      );
      setCurrentEmoji(
        thinkingEmojis[Math.floor(Math.random() * thinkingEmojis.length)],
      );
      setShowMessage(true);

      // Reset after a delay
      setTimeout(() => {
        setCurrentEmotion("idle");
        setShowMessage(false);
      }, 2000);
    }
  };

  // Eye blinking effect
  useEffect(() => {
    blinkIntervalRef.current = window.setInterval(
      () => {
        setBlinking(true);
        setTimeout(() => setBlinking(false), 200);
      },
      3000 + Math.random() * 2000,
    );

    return () => {
      if (blinkIntervalRef.current) clearInterval(blinkIntervalRef.current);
    };
  }, []);

  // Show random messages periodically
  useEffect(() => {
    const showRandomMessage = () => {
      if (!showMessage && Math.random() > 0.7) {
        // 30% chance to show a message
        const messageType = Math.random() > 0.5 ? "encouraging" : "happy";
        const messages = EMOTIONS[messageType].messages;
        const emojis = EMOTIONS[messageType].emojis;

        const randomMessage =
          BUDDY_MESSAGES[Math.floor(Math.random() * BUDDY_MESSAGES.length)];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        setCurrentMessage(randomMessage);
        setCurrentEmoji(randomEmoji);
        setShowMessage(true);
        setCurrentEmotion(messageType === "encouraging" ? "happy" : "happy");

        // Hide message after a few seconds
        if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
        messageTimeoutRef.current = window.setTimeout(() => {
          setShowMessage(false);
          setCurrentEmotion("idle");
        }, 4000);
      }
    };

    // Set up interval for random messages (every 15-30 seconds)
    const messageInterval = window.setInterval(
      () => {
        showRandomMessage();
      },
      15000 + Math.random() * 15000,
    );

    return () => {
      clearInterval(messageInterval);
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    };
  }, [showMessage]);

  // Handle animation reset
  useEffect(() => {
    if (currentEmotion === "happy") {
      if (animationTimeoutRef.current)
        clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = window.setTimeout(() => {
        setCurrentEmotion("idle");
      }, 2000);
    }

    return () => {
      if (animationTimeoutRef.current)
        clearTimeout(animationTimeoutRef.current);
    };
  }, [currentEmotion]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Return to idle animation after dragging
      setCurrentEmotion("idle");
      setShowMessage(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Keep buddy within viewport
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.min(prev.x, window.innerWidth - 100),
        y: Math.min(prev.y, window.innerHeight - 100),
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Don't render if showFloatingBuddy is false or if we're on auth pages
  const isAuthPage =
    window.location.pathname.includes("/auth") ||
    window.location.pathname.includes("/payment");
  if (!showFloatingBuddy || isAuthPage) return null;

  // Get animation class based on emotion
  const getAnimationClass = () => {
    switch (currentEmotion) {
      case "happy":
        return currentCharacter.animations.happy;
      case "thinking":
        return currentCharacter.animations.thinking;
      case "sleepy":
        return currentCharacter.animations.sleepy;
      case "idle":
      default:
        return currentCharacter.animations.idle;
    }
  };

  // Render eyes based on character and state
  const renderEyes = () => {
    const { eyes } = currentCharacter.parts;
    const eyeStyle = {
      fill: eyes.color,
      transition: "all 0.3s",
      transform: blinking ? "scaleY(0.1)" : "scaleY(1)",
    };

    switch (eyes.type) {
      case "oval":
        return (
          <g>
            <ellipse
              cx="35%"
              cy="40%"
              rx="6%"
              ry={blinking ? "1%" : "8%"}
              style={eyeStyle}
            />
            <ellipse
              cx="65%"
              cy="40%"
              rx="6%"
              ry={blinking ? "1%" : "8%"}
              style={eyeStyle}
            />
          </g>
        );
      case "tech":
        return (
          <g>
            <rect
              x="30%"
              y="35%"
              width="10%"
              height={blinking ? "1%" : "10%"}
              rx="2"
              style={eyeStyle}
            />
            <rect
              x="60%"
              y="35%"
              width="10%"
              height={blinking ? "1%" : "10%"}
              rx="2"
              style={eyeStyle}
            />
            {currentEmotion === "happy" && (
              <g>
                <circle cx="35%" cy="40%" r="2%" fill="#ffffff" />
                <circle cx="65%" cy="40%" r="2%" fill="#ffffff" />
              </g>
            )}
          </g>
        );
      case "catEyes":
      case "foxEyes":
        return (
          <g>
            <ellipse
              cx="35%"
              cy="40%"
              rx="6%"
              ry={blinking ? "1%" : "8%"}
              style={{
                ...eyeStyle,
                transform: `rotate(${currentEmotion === "happy" ? "0deg" : "45deg"})`,
              }}
            />
            <ellipse
              cx="65%"
              cy="40%"
              rx="6%"
              ry={blinking ? "1%" : "8%"}
              style={{
                ...eyeStyle,
                transform: `rotate(${currentEmotion === "happy" ? "0deg" : "45deg"})`,
              }}
            />
            {currentEmotion === "happy" && (
              <g>
                <circle cx="35%" cy="40%" r="2%" fill="#ffffff" />
                <circle cx="65%" cy="40%" r="2%" fill="#ffffff" />
              </g>
            )}
          </g>
        );
      case "owlEyes":
        return (
          <g>
            <circle
              cx="35%"
              cy="40%"
              r={blinking ? "2%" : "10%"}
              style={eyeStyle}
            />
            <circle
              cx="65%"
              cy="40%"
              r={blinking ? "2%" : "10%"}
              style={eyeStyle}
            />
            <circle
              cx="35%"
              cy="40%"
              r="5%"
              fill="#000000"
              opacity={blinking ? 0 : 1}
            />
            <circle
              cx="65%"
              cy="40%"
              r="5%"
              fill="#000000"
              opacity={blinking ? 0 : 1}
            />
            <circle
              cx="33%"
              cy="38%"
              r="2%"
              fill="#ffffff"
              opacity={blinking ? 0 : 1}
            />
            <circle
              cx="63%"
              cy="38%"
              r="2%"
              fill="#ffffff"
              opacity={blinking ? 0 : 1}
            />
          </g>
        );
      case "round":
      default:
        return (
          <g>
            <circle
              cx="35%"
              cy="40%"
              r="6%"
              style={{ ...eyeStyle, height: blinking ? "1px" : "auto" }}
            />
            <circle
              cx="65%"
              cy="40%"
              r="6%"
              style={{ ...eyeStyle, height: blinking ? "1px" : "auto" }}
            />
            {currentEmotion === "happy" && (
              <g>
                <circle cx="35%" cy="40%" r="2%" fill="#ffffff" />
                <circle cx="65%" cy="40%" r="2%" fill="#ffffff" />
              </g>
            )}
          </g>
        );
    }
  };

  // Render mouth based on character and state
  const renderMouth = () => {
    const { mouth } = currentCharacter.parts;

    if (currentEmotion === "sleepy") {
      // Sleepy mouth is the same for all characters
      return (
        <path
          d="M40,65 Q50,60 60,65"
          stroke="#333333"
          strokeWidth="2"
          fill="none"
        />
      );
    } else if (currentEmotion === "thinking") {
      return (
        <path
          d="M40,65 Q50,70 60,65"
          stroke="#333333"
          strokeWidth="2"
          fill="none"
          transform="scale(0.7)"
        />
      );
    }

    switch (mouth?.type) {
      case "grin":
        return currentEmotion === "happy" ? (
          <path
            d="M35,60 Q50,75 65,60"
            stroke="#333333"
            strokeWidth="2"
            fill="none"
          />
        ) : (
          <path
            d="M35,60 Q50,65 65,60"
            stroke="#333333"
            strokeWidth="2"
            fill="none"
          />
        );
      case "tech":
        return currentEmotion === "happy" ? (
          <rect x="40%" y="60%" width="20%" height="5%" rx="2" fill="#333333" />
        ) : (
          <rect x="40%" y="60%" width="20%" height="2%" rx="1" fill="#333333" />
        );
      case "smile":
      default:
        return currentEmotion === "happy" ? (
          <path
            d="M35,60 Q50,70 65,60"
            stroke="#333333"
            strokeWidth="2"
            fill="none"
          />
        ) : (
          <path
            d="M40,60 Q50,65 60,60"
            stroke="#333333"
            strokeWidth="2"
            fill="none"
          />
        );
    }
  };

  // Render character body
  const renderBody = () => {
    const { body } = currentCharacter.parts;

    switch (body.shape) {
      case "roundedSquare":
        return (
          <rect
            x="10%"
            y="10%"
            width="80%"
            height="80%"
            rx="20%"
            fill={body.color}
          />
        );
      case "hexagon":
        return (
          <polygon
            points="50,10 90,30 90,70 50,90 10,70 10,30"
            fill={body.color}
            transform="scale(0.9) translate(5, 5)"
          />
        );
      case "cat":
        return (
          <g>
            <circle cx="50%" cy="50%" r="40%" fill={body.color} />
            <polygon points="30,10 40,30 20,30" fill={body.color} />{" "}
            {/* Left ear */}
            <polygon points="70,10 80,30 60,30" fill={body.color} />{" "}
            {/* Right ear */}
            {currentCharacter.parts.tail && (
              <path
                d={
                  currentEmotion === "happy"
                    ? "M20,60 Q0,40 10,20"
                    : "M20,60 Q10,50 10,30"
                }
                strokeWidth="10"
                stroke={currentCharacter.parts.tail.color}
                fill="none"
                className={
                  currentEmotion === "happy"
                    ? "character-tail-wag-fast"
                    : "character-tail-wag-slow"
                }
              />
            )}
          </g>
        );
      case "fox":
        return (
          <g>
            <circle cx="50%" cy="50%" r="40%" fill={body.color} />
            <polygon
              points="25,5 40,30 10,20"
              fill={currentCharacter.parts.ears?.color || body.color}
            />{" "}
            {/* Left ear */}
            <polygon
              points="75,5 90,20 60,30"
              fill={currentCharacter.parts.ears?.color || body.color}
            />{" "}
            {/* Right ear */}
            {currentCharacter.parts.tail && (
              <path
                d={
                  currentEmotion === "happy"
                    ? "M20,60 Q-10,40 0,10"
                    : "M20,60 Q0,40 5,20"
                }
                strokeWidth="15"
                stroke={currentCharacter.parts.tail.color}
                fill="none"
                className={
                  currentEmotion === "happy"
                    ? "character-tail-wag-fast"
                    : "character-tail-wag-slow"
                }
              />
            )}
          </g>
        );
      case "oval":
        return (
          <g>
            <ellipse cx="50%" cy="50%" rx="40%" ry="45%" fill={body.color} />
            {currentCharacter.parts.wings && (
              <g
                className={
                  currentEmotion === "happy" ? "character-wings-flap" : ""
                }
              >
                <ellipse
                  cx="20%"
                  cy="50%"
                  rx="15%"
                  ry="30%"
                  fill={currentCharacter.parts.wings.color}
                />
                <ellipse
                  cx="80%"
                  cy="50%"
                  rx="15%"
                  ry="30%"
                  fill={currentCharacter.parts.wings.color}
                />
              </g>
            )}
            {currentCharacter.parts.beak && (
              <polygon
                points="50,50 40,60 60,60"
                fill={currentCharacter.parts.beak.color}
                transform="rotate(180, 50, 55)"
              />
            )}
          </g>
        );
      case "circle":
      default:
        return <circle cx="50%" cy="50%" r="40%" fill={body.color} />;
    }
  };

  // Render character
  const renderCharacter = () => {
    return (
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full ${getAnimationClass()}`}
        onClick={handleCharacterClick}
        style={{ cursor: "pointer" }}
      >
        {/* Body */}
        {renderBody()}

        {/* Eyes */}
        {renderEyes()}

        {/* Mouth */}
        {renderMouth()}

        {/* Additional animations/effects for happy state */}
        {currentEmotion === "happy" && (
          <g className="buddy-pop-in">
            <circle cx="20%" cy="20%" r="5%" fill="yellow" opacity="0.8">
              <animate
                attributeName="opacity"
                values="0.8;0;0.8"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="80%" cy="20%" r="3%" fill="yellow" opacity="0.6">
              <animate
                attributeName="opacity"
                values="0.6;0;0.6"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="70%" cy="15%" r="4%" fill="yellow" opacity="0.7">
              <animate
                attributeName="opacity"
                values="0.7;0;0.7"
                dur="0.8s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}

        {/* Thinking animation */}
        {currentEmotion === "thinking" && (
          <g className="buddy-pop-in">
            <circle cx="75%" cy="25%" r="8%" fill="#333" opacity="0.2" />
            <circle cx="85%" cy="15%" r="5%" fill="#333" opacity="0.2" />
            <circle cx="92%" cy="8%" r="3%" fill="#333" opacity="0.2" />
          </g>
        )}

        {/* Sleepy animation */}
        {currentEmotion === "sleepy" && (
          <g>
            <text x="60%" y="30%" fontSize="15" fill="#333">
              z
            </text>
            <text x="65%" y="25%" fontSize="12" fill="#333">
              z
            </text>
            <text x="70%" y="20%" fontSize="10" fill="#333">
              z
            </text>
          </g>
        )}
      </svg>
    );
  };

  if (isMinimized) {
    return (
      <div className="fixed z-50 flex flex-col items-center">
        <div
          className="flex items-center justify-center rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:scale-110"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: "50px",
            height: "50px",
            background: `radial-gradient(circle, ${currentCharacter.colors.primary} 0%, ${currentCharacter.colors.primary}99 100%)`,
            position: "absolute",
          }}
          onClick={() => setIsMinimized(false)}
          onDoubleClick={() => setShowDialog(true)}
        >
          <div className="mini-character">{renderCharacter()}</div>
        </div>

        {/* Chat button for minimized state - positioned above head */}
        <div
          className="absolute z-50 bg-white dark:bg-gray-800 rounded-full p-1 border border-[#0197cf] shadow-md cursor-pointer hover:bg-[#0197cf]/10"
          style={{
            left: `${position.x + 15}px`,
            top: `${position.y - 25}px`,
            transform: "translateX(-50%)",
          }}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setShowChat(true);
            setIsMinimized(false);
          }}
        >
          <MessageCircle size={14} className="text-[#0197cf]" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed z-50 transition-all duration-300"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: isDragging ? 0.7 : 1,
          filter: `drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))`,
        }}
      >
        {/* Speech bubble */}
        {showMessage && (
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-2 rounded-lg border-2 border-[#0197cf] min-w-[150px] text-center buddy-pop-in">
            <div className="text-xs flex items-center justify-center gap-1">
              {currentEmoji && <span className="text-lg">{currentEmoji}</span>}
              {currentMessage}
            </div>
            <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-white dark:bg-gray-800 border-r-2 border-b-2 border-[#0197cf]"></div>
          </div>
        )}

        {/* Character container with controls */}
        <div className="relative flex flex-col items-center">
          {/* Chat button - positioned above head */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-white dark:bg-gray-800 text-[#0197cf] hover:bg-[#0197cf]/10 rounded-full border border-[#0197cf] shadow-md"
              onClick={() => setShowChat(true)}
            >
              <MessageCircle size={16} />
            </Button>
          </div>

          {/* Settings dialog - moved to character click */}
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Choose Your Study Buddy</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {CHARACTER_OPTIONS.map((character) => (
                  <div
                    key={character.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${character.id === characterId ? "border-[#0197cf] bg-[#f5fcff]" : "border-gray-200 hover:border-[#0197cf]/50"}`}
                    onClick={(e: React.MouseEvent) => {
                      setCharacterId(character.id);
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 relative">
                        {/* Replace images with SVG renderings */}
                        <svg
                          viewBox="0 0 100 100"
                          className="w-full h-full"
                          style={{
                            background:
                              CHARACTER_CONFIGS[
                                character.id as keyof typeof CHARACTER_CONFIGS
                              ].colors.secondary,
                          }}
                        >
                          {(() => {
                            const config =
                              CHARACTER_CONFIGS[
                                character.id as keyof typeof CHARACTER_CONFIGS
                              ];
                            const { body } = config.parts;

                            switch (body.shape) {
                              case "roundedSquare":
                                return (
                                  <rect
                                    x="10%"
                                    y="10%"
                                    width="80%"
                                    height="80%"
                                    rx="20%"
                                    fill={body.color}
                                  />
                                );
                              case "hexagon":
                                return (
                                  <polygon
                                    points="50,10 90,30 90,70 50,90 10,70 10,30"
                                    fill={body.color}
                                    transform="scale(0.9) translate(5, 5)"
                                  />
                                );
                              case "cat":
                                return (
                                  <g>
                                    <circle
                                      cx="50%"
                                      cy="50%"
                                      r="40%"
                                      fill={body.color}
                                    />
                                    <polygon
                                      points="30,10 40,30 20,30"
                                      fill={body.color}
                                    />
                                    <polygon
                                      points="70,10 80,30 60,30"
                                      fill={body.color}
                                    />
                                  </g>
                                );
                              case "fox":
                                return (
                                  <g>
                                    <circle
                                      cx="50%"
                                      cy="50%"
                                      r="40%"
                                      fill={body.color}
                                    />
                                    <polygon
                                      points="25,5 40,30 10,20"
                                      fill={
                                        config.parts.ears?.color || body.color
                                      }
                                    />
                                    <polygon
                                      points="75,5 90,20 60,30"
                                      fill={
                                        config.parts.ears?.color || body.color
                                      }
                                    />
                                  </g>
                                );
                              case "oval":
                                return (
                                  <g>
                                    <ellipse
                                      cx="50%"
                                      cy="50%"
                                      rx="40%"
                                      ry="45%"
                                      fill={body.color}
                                    />
                                    {config.parts.beak && (
                                      <polygon
                                        points="50,50 40,60 60,60"
                                        fill={config.parts.beak.color}
                                        transform="rotate(180, 50, 55)"
                                      />
                                    )}
                                  </g>
                                );
                              case "circle":
                              default:
                                return (
                                  <circle
                                    cx="50%"
                                    cy="50%"
                                    r="40%"
                                    fill={body.color}
                                  />
                                );
                            }
                          })()}

                          {/* Simple eyes for preview */}
                          <g>
                            <circle
                              cx="35%"
                              cy="40%"
                              r="6%"
                              fill={
                                CHARACTER_CONFIGS[
                                  character.id as keyof typeof CHARACTER_CONFIGS
                                ].parts.eyes.color
                              }
                            />
                            <circle
                              cx="65%"
                              cy="40%"
                              r="6%"
                              fill={
                                CHARACTER_CONFIGS[
                                  character.id as keyof typeof CHARACTER_CONFIGS
                                ].parts.eyes.color
                              }
                            />
                          </g>

                          {/* Simple smile for preview */}
                          <path
                            d="M35,60 Q50,65 65,60"
                            stroke="#333333"
                            strokeWidth="2"
                            fill="none"
                          />
                        </svg>
                      </div>
                      <h4 className="text-sm font-medium mt-2">
                        {character.name}
                      </h4>
                      <p className="text-xs text-muted-foreground text-center">
                        {character.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium">Buddy Name</label>
                <div className="flex mt-1">
                  <input
                    type="text"
                    value={buddyName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setBuddyName(e.target.value)
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Character with animations */}
          <div
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onClick={handleCharacterClick}
            onDoubleClick={(e: React.MouseEvent) => setShowDialog(true)}
          >
            <div
              className="relative rounded-full p-2"
              style={{
                width: "80px",
                height: "80px",
                background: `radial-gradient(circle, ${currentCharacter.colors.primary}40 0%, transparent 70%)`,
              }}
            >
              {renderCharacter()}
              <div
                className="absolute -top-1 -right-1 bg-[#ffcc00] text-[#333] rounded-full px-1 text-xs font-bold flex items-center justify-center shadow-md"
                style={{ width: "22px", height: "22px" }}
              >
                {level}
              </div>
            </div>
          </div>

          {/* Name tag */}
          <div className="mt-1 bg-white dark:bg-gray-800 px-2 py-1 rounded-full border border-[#0197cf] shadow-sm">
            <div className="text-xs font-medium text-[#0197cf]">
              {buddyName}
            </div>
          </div>

          {/* Control buttons */}
          <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full border border-[#0197cf]/50 shadow-sm"
              onClick={(e: React.MouseEvent) => setIsMinimized(true)}
              title="Minimize"
            >
              <Minimize2 size={12} className="text-[#0197cf]" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat window */}
      {showChat && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-[#0197cf] overflow-hidden"
          style={{
            width: "320px",
            height: "400px",
            left:
              position.x > window.innerWidth - 350
                ? window.innerWidth - 340
                : position.x - 120,
            top:
              position.y > window.innerHeight - 450
                ? position.y - 420
                : position.y - 420, // Always position above the buddy
          }}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-3 border-b bg-[#0197cf] dark:bg-[#01729b] text-white sticky top-0 z-10 shadow-md">
            <h3 className="text-sm font-bold flex items-center">
              <div className="w-5 h-5 mr-2 rounded-full overflow-hidden bg-white">
                {renderCharacter()}
              </div>
              Chat with {buddyName}
            </h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 bg-white/20 text-white hover:bg-white/30 hover:text-white border-white/30 p-0"
                onClick={(e: React.MouseEvent) => setShowChat(false)}
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="h-[calc(100%-48px)]">
            <StudyBuddyChat buddyName={buddyName} topic="" />
          </div>
        </div>
      )}

      {/* Animation styles - These would normally go in a separate CSS file */}
      <style jsx>{`
        @keyframes buddy-bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes buddy-wiggle {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-5deg);
          }
          75% {
            transform: rotate(5deg);
          }
        }
        @keyframes buddy-float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          33% {
            transform: translateY(-5px) rotate(-2deg);
          }
          66% {
            transform: translateY(-8px) rotate(2deg);
          }
        }
        @keyframes buddy-tail-wag-slow {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-15deg);
          }
        }
        @keyframes buddy-tail-wag-fast {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(15deg);
          }
          75% {
            transform: rotate(-15deg);
          }
        }
        @keyframes buddy-sway {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(5px);
          }
        }
        @keyframes buddy-sway-slow {
          0%,
          100% {
            transform: translateX(0) rotate(0deg);
          }
          50% {
            transform: translateX(3px) rotate(2deg);
          }
        }
        @keyframes buddy-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes buddy-tada {
          0%,
          100% {
            transform: scale(1);
          }
          10%,
          20% {
            transform: scale(0.9) rotate(-3deg);
          }
          30%,
          50%,
          70%,
          90% {
            transform: scale(1.1) rotate(3deg);
          }
          40%,
          60%,
          80% {
            transform: scale(1.1) rotate(-3deg);
          }
        }
        @keyframes buddy-jump {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.1);
          }
        }
        @keyframes buddy-spin-jump {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(180deg);
          }
          100% {
            transform: translateY(0) rotate(360deg);
          }
        }
        @keyframes buddy-flap {
          0%,
          100% {
            transform: scale(1, 1);
          }
          50% {
            transform: scale(1.2, 0.8);
          }
        }
        @keyframes buddy-pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        @keyframes buddy-blink {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: scaleY(1);
          }
          40%,
          60% {
            transform: scaleY(0.1);
          }
        }
        @keyframes buddy-pop-in {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .character-wings-flap {
          animation: buddy-flap 0.5s infinite ease-in-out;
        }
        .character-tail-wag-slow {
          animation: buddy-tail-wag-slow 3s infinite ease-in-out;
        }
        .character-tail-wag-fast {
          animation: buddy-tail-wag-fast 0.5s infinite ease-in-out;
        }
        .character-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .dragging {
          filter: brightness(1.1);
        }
        .mini-character {
          transform: scale(0.8);
        }
        .buddy-bounce {
          animation: buddy-bounce 2s infinite ease-in-out;
        }
        .buddy-wiggle {
          animation: buddy-wiggle 2s infinite ease-in-out;
        }
        .buddy-float {
          animation: buddy-float 3s infinite ease-in-out;
        }
        .buddy-tail-wag {
          animation: buddy-tail-wag-slow 3s infinite ease-in-out;
        }
        .buddy-sway {
          animation: buddy-sway 2s infinite ease-in-out;
        }
        .buddy-spin {
          animation: buddy-spin 3s infinite linear;
        }
        .buddy-tada {
          animation: buddy-tada 1.5s infinite;
        }
        .buddy-jump {
          animation: buddy-jump 1s infinite ease-in-out;
        }
        .buddy-spin-jump {
          animation: buddy-spin-jump 1.5s infinite ease-in-out;
        }
        .buddy-flap {
          animation: buddy-flap 0.7s infinite ease-in-out;
        }
        .buddy-pulse {
          animation: buddy-pulse 2s infinite ease-in-out;
        }
        .buddy-pop-in {
          animation: buddy-pop-in 0.3s ease-out;
        }
        .buddy-sway-slow {
          animation: buddy-sway-slow 4s infinite ease-in-out;
        }
      `}</style>
    </>
  );
}
