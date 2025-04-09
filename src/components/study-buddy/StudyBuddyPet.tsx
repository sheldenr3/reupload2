import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { usePoints } from "@/contexts/PointsContext";
import { Sparkles, Heart, Star, Clock } from "lucide-react";

// Define character options with animated parts
const CHARACTER_CONFIGS = {
  beginner: {
    colors: {
      primary: "#ff9999",
      secondary: "#ffcccb",
      accent: "#ff6666",
    },
    animations: {
      idle: "buddy-bounce",
      happy: "buddy-pulse",
      sleepy: "buddy-sway",
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
    colors: {
      primary: "#a1e5b1",
      secondary: "#d1f4d9",
      accent: "#7dcc8c",
    },
    animations: {
      idle: "buddy-wiggle",
      happy: "buddy-spin",
      sleepy: "buddy-sway-slow",
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
    colors: {
      primary: "#86d3f4",
      secondary: "#b6e3f4",
      accent: "#5cb3dd",
    },
    animations: {
      idle: "buddy-float",
      happy: "buddy-tada",
      sleepy: "buddy-sway-slow",
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
    colors: {
      primary: "#ffb6c1",
      secondary: "#ffd5dc",
      accent: "#ff8b9a",
    },
    animations: {
      idle: "buddy-tail-wag",
      happy: "buddy-jump",
      sleepy: "buddy-sway-slow",
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
    colors: {
      primary: "#ffd699",
      secondary: "#ffeacc",
      accent: "#ffba57",
    },
    animations: {
      idle: "buddy-sway",
      happy: "buddy-spin-jump",
      sleepy: "buddy-sway-slow",
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
    colors: {
      primary: "#b3d9ff",
      secondary: "#e0f2ff",
      accent: "#80bdff",
    },
    animations: {
      idle: "buddy-blink",
      happy: "buddy-flap",
      sleepy: "buddy-sway-slow",
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

interface StudyBuddyPetProps {
  name: string;
  level: number;
  coins: number;
  characterId?: string;
  onRename?: (name: string) => void;
  onChangeCharacter?: (characterId: string) => void;
}

export default function StudyBuddyPet({
  name = "Buddy",
  level = 1,
  coins = 0,
  characterId = "beginner",
  onRename,
  onChangeCharacter,
}: StudyBuddyPetProps) {
  const { streak } = usePoints();
  const [happiness, setHappiness] = useState(80);
  const [energy, setEnergy] = useState(100);
  const [isAnimating, setIsAnimating] = useState(false);
  const [emotion, setEmotion] = useState<"idle" | "happy" | "sleepy">("idle");
  const [blinking, setBlinking] = useState(false);
  const blinkIntervalRef = useRef<number | null>(null);

  // Pet grows based on level
  const petSize = 100 + level * 10;

  // Get character config
  const characterConfig =
    CHARACTER_CONFIGS[characterId as keyof typeof CHARACTER_CONFIGS] ||
    CHARACTER_CONFIGS.beginner;

  // Simulate pet animation when interacting
  const animatePet = () => {
    setIsAnimating(true);
    setEmotion("happy");
    setHappiness((prev) => Math.min(prev + 5, 100));

    // Return to idle state after animation
    setTimeout(() => {
      setIsAnimating(false);
      setEmotion("idle");
    }, 2000);
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

  // Decrease energy and happiness over time
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prev) => Math.max(prev - 1, 0));
      if (energy < 20) {
        setHappiness((prev) => Math.max(prev - 1, 0));
        if (energy < 10 && emotion !== "happy") {
          setEmotion("sleepy");
        }
      } else if (emotion === "sleepy") {
        setEmotion("idle");
      }
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [energy, emotion]);

  // Get animation class based on emotion
  const getAnimationClass = () => {
    if (isAnimating) return characterConfig.animations.happy;
    if (emotion === "sleepy") return characterConfig.animations.sleepy;
    return characterConfig.animations.idle;
  };

  // Render eyes based on character and state
  const renderEyes = () => {
    const { eyes } = characterConfig.parts;
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
            {emotion === "happy" && (
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
                transform: `rotate(${emotion === "happy" ? "0deg" : "45deg"})`,
              }}
            />
            <ellipse
              cx="65%"
              cy="40%"
              rx="6%"
              ry={blinking ? "1%" : "8%"}
              style={{
                ...eyeStyle,
                transform: `rotate(${emotion === "happy" ? "0deg" : "45deg"})`,
              }}
            />
            {emotion === "happy" && (
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
            {emotion === "happy" && (
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
    const { mouth } = characterConfig.parts;

    if (emotion === "sleepy") {
      // Sleepy mouth is the same for all characters
      return (
        <path
          d="M40,65 Q50,60 60,65"
          stroke="#333333"
          strokeWidth="2"
          fill="none"
        />
      );
    }

    switch (mouth?.type) {
      case "grin":
        return emotion === "happy" ? (
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
        return emotion === "happy" ? (
          <rect x="40%" y="60%" width="20%" height="5%" rx="2" fill="#333333" />
        ) : (
          <rect x="40%" y="60%" width="20%" height="2%" rx="1" fill="#333333" />
        );
      case "smile":
      default:
        return emotion === "happy" ? (
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
    const { body } = characterConfig.parts;

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
            {characterConfig.parts.tail && (
              <path
                d={
                  emotion === "happy"
                    ? "M20,60 Q0,40 10,20"
                    : "M20,60 Q10,50 10,30"
                }
                strokeWidth="10"
                stroke={characterConfig.parts.tail.color}
                fill="none"
                className={
                  emotion === "happy"
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
              fill={characterConfig.parts.ears?.color || body.color}
            />{" "}
            {/* Left ear */}
            <polygon
              points="75,5 90,20 60,30"
              fill={characterConfig.parts.ears?.color || body.color}
            />{" "}
            {/* Right ear */}
            {characterConfig.parts.tail && (
              <path
                d={
                  emotion === "happy"
                    ? "M20,60 Q-10,40 0,10"
                    : "M20,60 Q0,40 5,20"
                }
                strokeWidth="15"
                stroke={characterConfig.parts.tail.color}
                fill="none"
                className={
                  emotion === "happy"
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
            {characterConfig.parts.wings && (
              <g className={emotion === "happy" ? "character-wings-flap" : ""}>
                <ellipse
                  cx="20%"
                  cy="50%"
                  rx="15%"
                  ry="30%"
                  fill={characterConfig.parts.wings.color}
                />
                <ellipse
                  cx="80%"
                  cy="50%"
                  rx="15%"
                  ry="30%"
                  fill={characterConfig.parts.wings.color}
                />
              </g>
            )}
            {characterConfig.parts.beak && (
              <polygon
                points="50,50 40,60 60,60"
                fill={characterConfig.parts.beak.color}
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
        onClick={animatePet}
        style={{ cursor: "pointer" }}
      >
        {/* Body */}
        {renderBody()}

        {/* Eyes */}
        {renderEyes()}

        {/* Mouth */}
        {renderMouth()}

        {/* Additional animations/effects for happy state */}
        {emotion === "happy" && (
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

        {/* Sleepy animation */}
        {emotion === "sleepy" && (
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

  return (
    <div className="flex flex-col items-center p-6 bg-[#f5fcff] dark:bg-gray-800 rounded-xl border-2 border-[#0197cf] shadow-md">
      <div className="relative mb-4">
        <div
          className={`transition-all duration-300 ${isAnimating ? "scale-110" : "scale-100"}`}
          style={{ width: `${petSize}px`, height: `${petSize}px` }}
        >
          {renderCharacter()}
        </div>
        <div className="absolute -top-2 -right-2 bg-[#ffcc00] text-[#333] rounded-full px-2 py-1 text-xs font-bold flex items-center">
          <Star className="w-3 h-3 mr-1 fill-[#333]" /> Lv.{level}
        </div>
      </div>

      <h3 className="text-xl font-bold text-[#0197cf] mb-1">{name}</h3>
      <div className="text-sm text-muted-foreground mb-4">
        Your study companion
      </div>

      <div className="w-full space-y-3 mb-4">
        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center">
            <Heart className="w-4 h-4 mr-1 text-red-500" /> Happiness
          </span>
          <span>{happiness}%</span>
        </div>
        <Progress value={happiness} className="h-2" />

        <div className="flex justify-between items-center text-sm">
          <span className="flex items-center">
            <Sparkles className="w-4 h-4 mr-1 text-yellow-500" /> Energy
          </span>
          <span>{energy}%</span>
        </div>
        <Progress value={energy} className="h-2" />
      </div>

      <div className="flex justify-between w-full mb-4">
        <div className="bg-[#ffcc00]/20 rounded-lg p-2 text-center">
          <div className="text-xs text-muted-foreground">Streak</div>
          <div className="font-bold">{streak.current} days</div>
        </div>
        <div className="bg-[#ffcc00]/20 rounded-lg p-2 text-center">
          <div className="text-xs text-muted-foreground">Coins</div>
          <div className="font-bold">{coins}</div>
        </div>
        <div className="bg-[#ffcc00]/20 rounded-lg p-2 text-center">
          <div className="text-xs text-muted-foreground">Best</div>
          <div className="font-bold">{streak.longest} days</div>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button
          size="sm"
          variant="outline"
          className="border-[#0197cf] text-[#0197cf] hover:bg-[#0197cf] hover:text-white"
          onClick={() => {
            setEnergy(100);
            setEmotion("happy");
            setTimeout(() => setEmotion("idle"), 2000);
          }}
        >
          <Clock className="w-4 h-4 mr-1" /> Rest
        </Button>
        {onRename && (
          <Button
            size="sm"
            variant="outline"
            className="border-[#0197cf] text-[#0197cf] hover:bg-[#0197cf] hover:text-white"
            onClick={() => {
              const newName = prompt(
                "Enter a new name for your Study Buddy:",
                name,
              );
              if (newName && newName.trim() !== "") {
                onRename(newName.trim());
              }
            }}
          >
            Rename
          </Button>
        )}
        {onChangeCharacter && (
          <Button
            size="sm"
            variant="outline"
            className="border-[#0197cf] text-[#0197cf] hover:bg-[#0197cf] hover:text-white"
            onClick={() => {
              const characters = [
                "beginner",
                "intermediate",
                "advanced",
                "cat",
                "fox",
                "owl",
              ];
              const currentIndex = characters.indexOf(characterId);
              const nextIndex = (currentIndex + 1) % characters.length;
              onChangeCharacter(characters[nextIndex]);
            }}
          >
            Change
          </Button>
        )}
      </div>

      {/* Animation styles */}
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
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
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
            transform: scaleX(1);
          }
          50% {
            transform: scaleX(1.2);
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
    </div>
  );
}
