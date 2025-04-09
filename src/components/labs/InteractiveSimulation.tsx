import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";

interface InteractiveSimulationProps {
  topic: {
    id: string;
    name: string;
  };
  simulationType: "basic" | "advanced";
  onBack: () => void;
}

export default function InteractiveSimulation({
  topic,
  simulationType = "basic",
  onBack,
}: InteractiveSimulationProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [time, setTime] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Simulation parameters based on topic
  const [parameters, setParameters] = useState({
    gravity: 9.8,
    friction: 0.1,
    elasticity: 0.8,
    mass: 1.0,
  });

  // Get simulation config based on topic
  const getSimulationConfig = () => {
    // Default config for physics
    let config = {
      title: `${topic.name} Simulation`,
      description: `This simulation demonstrates key concepts in ${topic.name}.`,
      instructions:
        "Use the controls below to adjust parameters and observe the effects.",
      parameters: parameters,
      color: "#0197cf",
      backgroundColor: "#f5fcff",
    };

    // Customize based on topic ID
    if (topic.id.includes("physics") || topic.id.includes("mechanics")) {
      config.title = "Physics Mechanics Simulation";
      config.description =
        "Observe how objects move under different forces and conditions.";
    } else if (topic.id.includes("waves") || topic.id.includes("sound")) {
      config.title = "Wave Propagation Simulation";
      config.description =
        "Visualize how waves travel through different mediums.";
      config.color = "#9c27b0";
    } else if (topic.id.includes("chemical") || topic.id.includes("matter")) {
      config.title = "Chemical Reaction Simulation";
      config.description =
        "Watch how molecules interact in chemical reactions.";
      config.color = "#4caf50";
    } else if (topic.id.includes("algebra") || topic.id.includes("function")) {
      config.title = "Mathematical Function Visualization";
      config.description =
        "See how mathematical functions behave with different inputs.";
      config.color = "#ff9800";
    } else if (topic.id.includes("geometry") || topic.id.includes("triangle")) {
      config.title = "Geometric Principles Demonstration";
      config.description =
        "Explore geometric relationships and transformations.";
      config.color = "#e91e63";
    }

    // Advanced simulations have more detailed descriptions
    if (simulationType === "advanced") {
      config.title = `Advanced ${config.title}`;
      config.description = `Detailed ${config.description} Explore complex interactions and edge cases.`;
    }

    return config;
  };

  const config = getSimulationConfig();

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initial render
    renderSimulation(0);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Animation loop
  useEffect(() => {
    let lastTime = 0;
    const animate = (currentTime: number) => {
      if (!isPlaying) return;

      const deltaTime = (currentTime - lastTime) / 1000; // seconds
      lastTime = currentTime;

      setTime((prevTime) => prevTime + deltaTime * speed);
      renderSimulation(time + deltaTime * speed);

      animationRef.current = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      lastTime = performance.now();
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed, time]);

  // Update simulation when parameters change
  useEffect(() => {
    renderSimulation(time);
  }, [parameters, time]);

  // Render the simulation
  const renderSimulation = (currentTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Choose which simulation to render based on topic
    if (topic.id.includes("physics") || topic.id.includes("mechanics")) {
      renderPhysicsSimulation(ctx, canvas, currentTime);
    } else if (topic.id.includes("waves") || topic.id.includes("sound")) {
      renderWaveSimulation(ctx, canvas, currentTime);
    } else if (topic.id.includes("chemical") || topic.id.includes("matter")) {
      renderChemicalSimulation(ctx, canvas, currentTime);
    } else if (topic.id.includes("algebra") || topic.id.includes("function")) {
      renderMathSimulation(ctx, canvas, currentTime);
    } else if (topic.id.includes("geometry") || topic.id.includes("triangle")) {
      renderGeometrySimulation(ctx, canvas, currentTime);
    } else {
      // Default simulation
      renderDefaultSimulation(ctx, canvas, currentTime);
    }
  };

  // Physics simulation (pendulum or projectile)
  const renderPhysicsSimulation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    time: number,
  ) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 3;
    const length = 150;

    // Draw pendulum
    const angle =
      (Math.sin(time * Math.sqrt(parameters.gravity / length) * 2) * Math.PI) /
      3;
    const bobX = centerX + Math.sin(angle) * length;
    const bobY = centerY + Math.cos(angle) * length;

    // Draw string
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(bobX, bobY);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw bob
    ctx.beginPath();
    ctx.arc(bobX, bobY, 20 * parameters.mass, 0, Math.PI * 2);
    ctx.fillStyle = config.color;
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw ground
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 50);
    ctx.lineTo(canvas.width, canvas.height - 50);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Add labels
    ctx.font = "14px Arial";
    ctx.fillStyle = "#333";
    ctx.fillText(`Time: ${time.toFixed(1)}s`, 10, 20);
    ctx.fillText(`Gravity: ${parameters.gravity.toFixed(1)} m/s²`, 10, 40);
    ctx.fillText(`Mass: ${parameters.mass.toFixed(1)} kg`, 10, 60);
  };

  // Wave simulation
  const renderWaveSimulation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    time: number,
  ) => {
    const centerY = canvas.height / 2;
    const amplitude = 50 * parameters.elasticity;
    const frequency = 0.05 * parameters.mass;
    const wavelength = 0.02 * (1 - parameters.friction);

    // Draw wave
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x += 1) {
      const y =
        centerY + amplitude * Math.sin(x * wavelength + time * 5 * frequency);
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.strokeStyle = config.color;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.strokeStyle = "#aaa";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Add labels
    ctx.font = "14px Arial";
    ctx.fillStyle = "#333";
    ctx.fillText(`Time: ${time.toFixed(1)}s`, 10, 20);
    ctx.fillText(`Amplitude: ${amplitude.toFixed(1)}`, 10, 40);
    ctx.fillText(`Frequency: ${(frequency * 10).toFixed(1)} Hz`, 10, 60);
    ctx.fillText(`Wavelength: ${(1 / wavelength).toFixed(1)} units`, 10, 80);
  };

  // Chemical simulation
  const renderChemicalSimulation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    time: number,
  ) => {
    const particleCount = 50;
    const particles = [];

    // Generate particles based on time
    for (let i = 0; i < particleCount; i++) {
      const seed = i * 1000 + Math.floor(time * 10);
      const random = (n: number) => {
        return (((Math.sin(n) * 10000) % 1) + 1) % 1;
      };

      const x = random(seed) * canvas.width;
      const y = random(seed + 1) * canvas.height;
      const size = 5 + random(seed + 2) * 10 * parameters.mass;
      const type = Math.floor(random(seed + 3) * 3); // 0, 1, or 2 for different particle types

      particles.push({ x, y, size, type });
    }

    // Draw particles
    particles.forEach((particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

      // Different colors for different particle types
      if (particle.type === 0) {
        ctx.fillStyle = config.color;
      } else if (particle.type === 1) {
        ctx.fillStyle = "#ff5722";
      } else {
        ctx.fillStyle = "#4caf50";
      }

      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw connections between nearby particles
    const connectionDistance = 100 * parameters.elasticity;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(100, 100, 100, ${1 - distance / connectionDistance})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Add labels
    ctx.font = "14px Arial";
    ctx.fillStyle = "#333";
    ctx.fillText(`Time: ${time.toFixed(1)}s`, 10, 20);
    ctx.fillText(`Particles: ${particleCount}`, 10, 40);
    ctx.fillText(`Reaction Rate: ${parameters.elasticity.toFixed(1)}`, 10, 60);
    ctx.fillText(`Particle Size: ${parameters.mass.toFixed(1)}`, 10, 80);
  };

  // Math function simulation
  const renderMathSimulation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    time: number,
  ) => {
    const padding = 50;
    const graphWidth = canvas.width - padding * 2;
    const graphHeight = canvas.height - padding * 2;
    const originX = padding;
    const originY = canvas.height / 2;

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.moveTo(padding, canvas.height / 2);
    ctx.lineTo(canvas.width - padding, canvas.height / 2);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw grid
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 0.5;
    for (let x = padding; x <= canvas.width - padding; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvas.height - padding);
      ctx.stroke();
    }
    for (let y = padding; y <= canvas.height - padding; y += 50) {
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    // Draw function graphs
    const drawFunction = (fn: (x: number) => number, color: string) => {
      ctx.beginPath();
      for (let px = 0; px <= graphWidth; px++) {
        const x = (px / graphWidth) * 10 - 5; // Map to range -5 to 5
        const y = fn(x);
        const py = originY - y * 30; // Scale and flip

        if (px === 0) {
          ctx.moveTo(originX + px, py);
        } else {
          ctx.lineTo(originX + px, py);
        }
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    // Draw multiple functions
    const t = time % 10; // Cycle every 10 seconds

    // Function 1: Quadratic
    const a = parameters.gravity;
    drawFunction((x) => a * x * x, config.color);

    // Function 2: Sine wave
    const amplitude = parameters.elasticity * 2;
    const frequency = parameters.mass;
    drawFunction((x) => amplitude * Math.sin(frequency * x + t), "#e91e63");

    // Function 3: Linear
    const slope = parameters.friction * 5;
    drawFunction((x) => slope * x, "#4caf50");

    // Add labels
    ctx.font = "14px Arial";
    ctx.fillStyle = "#333";
    ctx.fillText(`Time: ${time.toFixed(1)}s`, 10, 20);
    ctx.fillText(`f₁(x) = ${a.toFixed(1)}x²`, 10, 40);
    ctx.fillText(
      `f₂(x) = ${amplitude.toFixed(1)}sin(${frequency.toFixed(1)}x + t)`,
      10,
      60,
    );
    ctx.fillText(`f₃(x) = ${slope.toFixed(1)}x`, 10, 80);
  };

  // Geometry simulation
  const renderGeometrySimulation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    time: number,
  ) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100 * parameters.mass;

    // Draw rotating triangle
    const angle = time * parameters.gravity * 0.2;
    const points = [];

    for (let i = 0; i < 3; i++) {
      const pointAngle = angle + (i * Math.PI * 2) / 3;
      const x = centerX + Math.cos(pointAngle) * radius;
      const y = centerY + Math.sin(pointAngle) * radius;
      points.push({ x, y });
    }

    // Draw triangle
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.closePath();
    ctx.fillStyle = `${config.color}80`; // Add transparency
    ctx.fill();
    ctx.strokeStyle = config.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw lines from center to vertices
    for (const point of points) {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(point.x, point.y);
      ctx.strokeStyle = "#33333380";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Calculate and display angles
    const calculateAngle = (
      p1: { x: number; y: number },
      p2: { x: number; y: number },
      p3: { x: number; y: number },
    ) => {
      const a = Math.sqrt(Math.pow(p2.x - p3.x, 2) + Math.pow(p2.y - p3.y, 2));
      const b = Math.sqrt(Math.pow(p1.x - p3.x, 2) + Math.pow(p1.y - p3.y, 2));
      const c = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
      return (Math.acos((a * a + c * c - b * b) / (2 * a * c)) * 180) / Math.PI;
    };

    const angles = [
      calculateAngle(points[0], points[1], points[2]),
      calculateAngle(points[1], points[2], points[0]),
      calculateAngle(points[2], points[0], points[1]),
    ];

    // Add labels
    ctx.font = "14px Arial";
    ctx.fillStyle = "#333";
    ctx.fillText(`Time: ${time.toFixed(1)}s`, 10, 20);
    ctx.fillText(`Rotation: ${((angle * 180) / Math.PI).toFixed(0)}°`, 10, 40);
    ctx.fillText(
      `Angles: ${angles[0].toFixed(0)}°, ${angles[1].toFixed(0)}°, ${angles[2].toFixed(0)}°`,
      10,
      60,
    );
    ctx.fillText(
      `Sum of angles: ${(angles[0] + angles[1] + angles[2]).toFixed(0)}°`,
      10,
      80,
    );
  };

  // Default simulation
  const renderDefaultSimulation = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    time: number,
  ) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;

    // Draw orbiting circles
    for (let i = 0; i < 5; i++) {
      const orbitRadius = (i + 1) * 30 * parameters.elasticity;
      const speed = (5 - i) * 0.2 * parameters.gravity;
      const x = centerX + Math.cos(time * speed) * orbitRadius;
      const y = centerY + Math.sin(time * speed) * orbitRadius;

      // Draw orbit path
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "#ddd";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw planet
      ctx.beginPath();
      ctx.arc(x, y, 10 * parameters.mass, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? config.color : `hsl(${i * 60}, 70%, 60%)`;
      ctx.fill();
    }

    // Draw sun at center
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fillStyle = "#ff9800";
    ctx.fill();

    // Add labels
    ctx.font = "14px Arial";
    ctx.fillStyle = "#333";
    ctx.fillText(`Time: ${time.toFixed(1)}s`, 10, 20);
    ctx.fillText(`Orbit Size: ${parameters.elasticity.toFixed(1)}`, 10, 40);
    ctx.fillText(`Orbit Speed: ${parameters.gravity.toFixed(1)}`, 10, 60);
    ctx.fillText(`Planet Size: ${parameters.mass.toFixed(1)}`, 10, 80);
  };

  // Reset simulation
  const resetSimulation = () => {
    setTime(0);
    setIsPlaying(false);
    renderSimulation(0);
  };

  // Update parameter
  const updateParameter = (name: string, value: number) => {
    setParameters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col h-full border rounded-md bg-white dark:bg-gray-800 shadow-md overflow-hidden">
      <div className="p-3 border-b bg-[#0197cf] dark:bg-[#01729b] text-white flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mr-2 text-white hover:bg-[#01729b] hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h3 className="text-lg font-bold">{config.title}</h3>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowInfo(!showInfo)}
                className="text-white hover:bg-[#01729b] hover:text-white"
              >
                <Info className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle information panel</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main simulation canvas */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full bg-[#f5fcff] dark:bg-gray-900"
          />

          {/* Simulation controls */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-white/80 dark:bg-gray-800/80 border-t flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="h-8 w-8"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={resetSimulation}
                className="h-8 w-8"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm">Speed:</span>
              <Slider
                value={[speed]}
                min={0.1}
                max={3}
                step={0.1}
                onValueChange={(value) => setSpeed(value[0])}
                className="w-32"
              />
              <span className="text-sm">{speed.toFixed(1)}x</span>
            </div>
          </div>
        </div>

        {/* Information panel */}
        {showInfo && (
          <div className="w-64 border-l bg-white dark:bg-gray-800 overflow-y-auto">
            <div className="p-4">
              <h4 className="font-medium mb-2">About this Simulation</h4>
              <p className="text-sm text-muted-foreground mb-4">
                {config.description}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {config.instructions}
              </p>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="parameters">
                  <AccordionTrigger className="text-sm font-medium">
                    Simulation Parameters
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-xs">Gravity/Force</label>
                          <span className="text-xs">
                            {parameters.gravity.toFixed(1)}
                          </span>
                        </div>
                        <Slider
                          value={[parameters.gravity]}
                          min={0.1}
                          max={20}
                          step={0.1}
                          onValueChange={(value) =>
                            updateParameter("gravity", value[0])
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-xs">Friction/Resistance</label>
                          <span className="text-xs">
                            {parameters.friction.toFixed(1)}
                          </span>
                        </div>
                        <Slider
                          value={[parameters.friction]}
                          min={0}
                          max={1}
                          step={0.05}
                          onValueChange={(value) =>
                            updateParameter("friction", value[0])
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-xs">Elasticity/Energy</label>
                          <span className="text-xs">
                            {parameters.elasticity.toFixed(1)}
                          </span>
                        </div>
                        <Slider
                          value={[parameters.elasticity]}
                          min={0.1}
                          max={2}
                          step={0.1}
                          onValueChange={(value) =>
                            updateParameter("elasticity", value[0])
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-xs">Mass/Size</label>
                          <span className="text-xs">
                            {parameters.mass.toFixed(1)}
                          </span>
                        </div>
                        <Slider
                          value={[parameters.mass]}
                          min={0.5}
                          max={2}
                          step={0.1}
                          onValueChange={(value) =>
                            updateParameter("mass", value[0])
                          }
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="learning">
                  <AccordionTrigger className="text-sm font-medium">
                    Learning Objectives
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="text-xs space-y-2 list-disc pl-4">
                      <li>
                        Understand how changing parameters affects the
                        simulation
                      </li>
                      <li>
                        Observe the relationship between different variables
                      </li>
                      <li>
                        Connect theoretical concepts to visual representations
                      </li>
                      <li>Develop intuition for {topic.name} principles</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
