import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileText,
  HelpCircle,
  RotateCcw,
} from "lucide-react";
import { usePoints } from "@/contexts/PointsContext";

interface VirtualExperimentProps {
  topic: {
    id: string;
    name: string;
  };
  experimentNumber: number;
  onBack: () => void;
}

export default function VirtualExperiment({
  topic,
  experimentNumber = 1,
  onBack,
}: VirtualExperimentProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [experimentData, setExperimentData] = useState<number[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [isComplete, setIsComplete] = useState(false);
  const [activeTab, setActiveTab] = useState("procedure");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addPoints } = usePoints();

  // Get experiment config based on topic and experiment number
  const getExperimentConfig = () => {
    // Default experiment
    let config = {
      title: `${topic.name} Experiment ${experimentNumber}`,
      description: `A virtual experiment to explore ${topic.name} concepts.`,
      objective: `To understand the fundamental principles of ${topic.name} through hands-on virtual experimentation.`,
      steps: [
        {
          title: "Setup the Experiment",
          instruction:
            "Prepare the virtual apparatus by selecting the correct parameters.",
          action: "Click 'Setup' to prepare the experiment.",
        },
        {
          title: "Run the Experiment",
          instruction:
            "Observe how the system behaves under the selected conditions.",
          action: "Click 'Run' to start the experiment and collect data.",
        },
        {
          title: "Analyze Results",
          instruction: "Review the collected data and draw conclusions.",
          action: "Examine the graph and answer the questions below.",
        },
        {
          title: "Complete the Experiment",
          instruction: "Submit your findings and complete the experiment.",
          action: "Click 'Complete' to finish the experiment and earn points.",
        },
      ],
      questions: [
        {
          id: "q1",
          text: "What trend do you observe in the experimental data?",
          options: [
            "The values increase linearly",
            "The values follow a quadratic pattern",
            "The values oscillate periodically",
            "The values decrease exponentially",
          ],
          correctAnswer: 2, // Index of correct answer
        },
        {
          id: "q2",
          text: "What conclusion can you draw from this experiment?",
          options: [
            "The system demonstrates conservation of energy",
            "The system shows how forces affect motion",
            "The system illustrates wave properties",
            "The system reveals chemical reaction rates",
          ],
          correctAnswer: 2, // Index of correct answer
        },
      ],
      color: "#0197cf",
      backgroundColor: "#f5fcff",
    };

    // Customize based on topic ID
    if (topic.id.includes("physics") || topic.id.includes("mechanics")) {
      config.title = "Physics Mechanics Experiment";
      config.description =
        "Investigate the relationship between force, mass, and acceleration.";
      config.objective =
        "To verify Newton's Second Law of Motion through virtual experimentation.";
      config.questions[0].text =
        "How does acceleration change when force is increased?";
      config.questions[0].options = [
        "Acceleration decreases",
        "Acceleration remains constant",
        "Acceleration increases proportionally",
        "Acceleration increases exponentially",
      ];
      config.questions[0].correctAnswer = 2;
      config.questions[1].text =
        "What is the relationship between mass and acceleration?";
      config.questions[1].options = [
        "They are directly proportional",
        "They are inversely proportional",
        "They are not related",
        "They are exponentially related",
      ];
      config.questions[1].correctAnswer = 1;
      config.color = "#2196f3";
    } else if (topic.id.includes("waves") || topic.id.includes("sound")) {
      config.title = "Wave Properties Experiment";
      config.description =
        "Explore how frequency and amplitude affect wave behavior.";
      config.objective =
        "To understand the relationship between frequency, wavelength, and wave speed.";
      config.questions[0].text =
        "What happens to wavelength when frequency increases?";
      config.questions[0].options = [
        "Wavelength increases",
        "Wavelength decreases",
        "Wavelength remains constant",
        "Wavelength becomes zero",
      ];
      config.questions[0].correctAnswer = 1;
      config.questions[1].text = "How does amplitude affect the wave's energy?";
      config.questions[1].options = [
        "Energy decreases with amplitude",
        "Energy is not related to amplitude",
        "Energy increases with the square of amplitude",
        "Energy is constant regardless of amplitude",
      ];
      config.questions[1].correctAnswer = 2;
      config.color = "#9c27b0";
    } else if (topic.id.includes("chemical") || topic.id.includes("matter")) {
      config.title = "Chemical Reaction Experiment";
      config.description =
        "Study how temperature and concentration affect reaction rates.";
      config.objective =
        "To determine the factors that influence the rate of chemical reactions.";
      config.questions[0].text =
        "How does increasing temperature affect reaction rate?";
      config.questions[0].options = [
        "Decreases the rate",
        "Has no effect on the rate",
        "Increases the rate",
        "Stops the reaction completely",
      ];
      config.questions[0].correctAnswer = 2;
      config.questions[1].text =
        "What effect does catalyst have on activation energy?";
      config.questions[1].options = [
        "Increases activation energy",
        "Decreases activation energy",
        "Has no effect on activation energy",
        "Removes the need for activation energy",
      ];
      config.questions[1].correctAnswer = 1;
      config.color = "#4caf50";
    } else if (topic.id.includes("algebra") || topic.id.includes("function")) {
      config.title = "Mathematical Functions Experiment";
      config.description =
        "Investigate how parameters affect function behavior.";
      config.objective =
        "To understand how changing coefficients affects the graph of a function.";
      config.questions[0].text =
        "What happens to a quadratic function when the coefficient of x² is negative?";
      config.questions[0].options = [
        "The parabola opens upward",
        "The parabola opens downward",
        "The parabola becomes a straight line",
        "The parabola disappears",
      ];
      config.questions[0].correctAnswer = 1;
      config.questions[1].text =
        "How does changing the constant term affect the graph of a function?";
      config.questions[1].options = [
        "It changes the slope",
        "It shifts the graph horizontally",
        "It shifts the graph vertically",
        "It has no effect on the graph",
      ];
      config.questions[1].correctAnswer = 2;
      config.color = "#ff9800";
    } else if (topic.id.includes("geometry") || topic.id.includes("triangle")) {
      config.title = "Geometric Principles Experiment";
      config.description = "Explore the properties of triangles and circles.";
      config.objective =
        "To verify the Pythagorean theorem and properties of similar triangles.";
      config.questions[0].text =
        "In a right triangle, what is the relationship between the sides?";
      config.questions[0].options = [
        "a + b = c",
        "a² + b² = c²",
        "a × b = c",
        "a/b = c",
      ];
      config.questions[0].correctAnswer = 1;
      config.questions[1].text =
        "What is true about the angles in any triangle?";
      config.questions[1].options = [
        "They always include a right angle",
        "They always include an obtuse angle",
        "They sum to 180 degrees",
        "They sum to 360 degrees",
      ];
      config.questions[1].correctAnswer = 2;
      config.color = "#e91e63";
    }

    // Adjust for experiment number
    if (experimentNumber === 2) {
      config.title = `Advanced ${config.title}`;
      config.description = `An advanced experiment to deeply explore ${topic.name} concepts.`;
    }

    return config;
  };

  const config = getExperimentConfig();

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
    renderExperiment();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Update canvas when step changes
  useEffect(() => {
    renderExperiment();
  }, [currentStep, experimentData]);

  // Render the experiment visualization
  const renderExperiment = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Choose which experiment to render based on topic
    if (topic.id.includes("physics") || topic.id.includes("mechanics")) {
      renderPhysicsExperiment(ctx, canvas);
    } else if (topic.id.includes("waves") || topic.id.includes("sound")) {
      renderWaveExperiment(ctx, canvas);
    } else if (topic.id.includes("chemical") || topic.id.includes("matter")) {
      renderChemicalExperiment(ctx, canvas);
    } else if (topic.id.includes("algebra") || topic.id.includes("function")) {
      renderMathExperiment(ctx, canvas);
    } else if (topic.id.includes("geometry") || topic.id.includes("triangle")) {
      renderGeometryExperiment(ctx, canvas);
    } else {
      // Default experiment
      renderDefaultExperiment(ctx, canvas);
    }
  };

  // Physics experiment visualization
  const renderPhysicsExperiment = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
  ) => {
    const width = canvas.width;
    const height = canvas.height;

    // Draw experiment setup
    if (currentStep === 0) {
      // Draw inclined plane
      ctx.beginPath();
      ctx.moveTo(width * 0.2, height * 0.7);
      ctx.lineTo(width * 0.8, height * 0.3);
      ctx.lineTo(width * 0.8, height * 0.7);
      ctx.closePath();
      ctx.fillStyle = "#e0e0e0";
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw object on plane
      ctx.beginPath();
      ctx.rect(width * 0.3, height * 0.6, 40, 40);
      ctx.fillStyle = config.color;
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw force arrows
      ctx.beginPath();
      ctx.moveTo(width * 0.3 + 20, height * 0.6);
      ctx.lineTo(width * 0.3 + 20, height * 0.5);
      ctx.lineTo(width * 0.3 + 15, height * 0.52);
      ctx.moveTo(width * 0.3 + 20, height * 0.5);
      ctx.lineTo(width * 0.3 + 25, height * 0.52);
      ctx.strokeStyle = "#f44336";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Labels
      ctx.font = "14px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(
        "Setup: Inclined Plane Experiment",
        width * 0.1,
        height * 0.1,
      );
      ctx.fillText(
        "Adjust angle and mass to prepare experiment",
        width * 0.1,
        height * 0.15,
      );
    }
    // Draw experiment running
    else if (currentStep === 1) {
      // Animation of object sliding down
      const progress = experimentData.length / 10; // 0 to 1 based on data collected
      const startX = width * 0.3;
      const startY = height * 0.6;
      const endX = width * 0.7;
      const endY = height * 0.5;

      const currentX = startX + (endX - startX) * progress;
      const currentY = startY + (endY - startY) * progress;

      // Draw inclined plane
      ctx.beginPath();
      ctx.moveTo(width * 0.2, height * 0.7);
      ctx.lineTo(width * 0.8, height * 0.3);
      ctx.lineTo(width * 0.8, height * 0.7);
      ctx.closePath();
      ctx.fillStyle = "#e0e0e0";
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw object on plane
      ctx.beginPath();
      ctx.rect(currentX, currentY, 40, 40);
      ctx.fillStyle = config.color;
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw motion trail
      ctx.beginPath();
      ctx.moveTo(startX + 20, startY + 20);
      ctx.lineTo(currentX + 20, currentY + 20);
      ctx.strokeStyle = "#33333350";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Labels
      ctx.font = "14px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(
        "Running: Object Motion on Inclined Plane",
        width * 0.1,
        height * 0.1,
      );
      ctx.fillText(
        `Data points collected: ${experimentData.length}/10`,
        width * 0.1,
        height * 0.15,
      );
    }
    // Draw results
    else if (currentStep >= 2) {
      // Draw graph of results
      const graphMargin = 50;
      const graphWidth = width - graphMargin * 2;
      const graphHeight = height - graphMargin * 2;

      // Draw axes
      ctx.beginPath();
      ctx.moveTo(graphMargin, height - graphMargin);
      ctx.lineTo(width - graphMargin, height - graphMargin); // x-axis
      ctx.moveTo(graphMargin, height - graphMargin);
      ctx.lineTo(graphMargin, graphMargin); // y-axis
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw axis labels
      ctx.font = "12px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText("Time (s)", width / 2, height - graphMargin / 2);
      ctx.save();
      ctx.translate(graphMargin / 2, height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("Velocity (m/s)", 0, 0);
      ctx.restore();

      // Draw data points and line
      if (experimentData.length > 0) {
        ctx.beginPath();
        const pointSpacing = graphWidth / 10;

        for (let i = 0; i < experimentData.length; i++) {
          const x = graphMargin + i * pointSpacing;
          const y =
            height - graphMargin - (experimentData[i] / 10) * graphHeight;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          // Draw point
          ctx.fillStyle = config.color;
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.strokeStyle = config.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Labels
      ctx.font = "14px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(
        "Results: Velocity vs. Time Graph",
        width * 0.1,
        height * 0.1,
      );
      ctx.fillText(
        "Analyze the relationship between velocity and time",
        width * 0.1,
        height * 0.15,
      );
    }
  };

  // Wave experiment visualization
  const renderWaveExperiment = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
  ) => {
    const width = canvas.width;
    const height = canvas.height;

    // Draw experiment setup
    if (currentStep === 0) {
      // Draw wave generator
      ctx.beginPath();
      ctx.rect(width * 0.1, height * 0.4, 40, 80);
      ctx.fillStyle = "#9c27b0";
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw medium (water tank)
      ctx.beginPath();
      ctx.rect(width * 0.1, height * 0.4, width * 0.8, 80);
      ctx.fillStyle = "#e3f2fd";
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw control panel
      ctx.beginPath();
      ctx.rect(width * 0.1, height * 0.6, 120, 80);
      ctx.fillStyle = "#f5f5f5";
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw knobs on control panel
      ctx.beginPath();
      ctx.arc(width * 0.15, height * 0.65, 10, 0, Math.PI * 2);
      ctx.arc(width * 0.15, height * 0.75, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#333";
      ctx.fill();

      // Labels
      ctx.font = "14px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(
        "Setup: Wave Generator Experiment",
        width * 0.1,
        height * 0.1,
      );
      ctx.fillText(
        "Adjust frequency and amplitude to prepare experiment",
        width * 0.1,
        height * 0.15,
      );
      ctx.fillText("Frequency", width * 0.18, height * 0.65);
      ctx.fillText("Amplitude", width * 0.18, height * 0.75);
    }
    // Draw experiment running
    else if (currentStep === 1) {
      // Draw medium (water tank)
      ctx.beginPath();
      ctx.rect(width * 0.1, height * 0.4, width * 0.8, 80);
      ctx.fillStyle = "#e3f2fd";
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw wave generator
      ctx.beginPath();
      ctx.rect(width * 0.1, height * 0.4, 40, 80);
      ctx.fillStyle = "#9c27b0";
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw animated waves
      ctx.beginPath();
      const centerY = height * 0.4 + 40;
      const amplitude = 30;
      const frequency = 0.05;
      const progress = experimentData.length / 10; // 0 to 1

      for (let x = width * 0.15; x <= width * 0.9; x += 1) {
        const distanceFromSource = x - width * 0.15;
        const wavePhase = distanceFromSource * frequency;
        const y =
          centerY +
          Math.sin(wavePhase - progress * 10) *
            amplitude *
            Math.min(1, progress * 3);

        if (x === width * 0.15) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.strokeStyle = "#2196f3";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Labels
      ctx.font = "14px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(
        "Running: Wave Propagation Experiment",
        width * 0.1,
        height * 0.1,
      );
      ctx.fillText(
        `Data points collected: ${experimentData.length}/10`,
        width * 0.1,
        height * 0.15,
      );
    }
    // Draw results
    else if (currentStep >= 2) {
      // Draw graph of results
      const graphMargin = 50;
      const graphWidth = width - graphMargin * 2;
      const graphHeight = height - graphMargin * 2;

      // Draw axes
      ctx.beginPath();
      ctx.moveTo(graphMargin, height - graphMargin);
      ctx.lineTo(width - graphMargin, height - graphMargin); // x-axis
      ctx.moveTo(graphMargin, height - graphMargin);
      ctx.lineTo(graphMargin, graphMargin); // y-axis
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw axis labels
      ctx.font = "12px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText("Frequency (Hz)", width / 2, height - graphMargin / 2);
      ctx.save();
      ctx.translate(graphMargin / 2, height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("Wavelength (cm)", 0, 0);
      ctx.restore();

      // Draw data points and line
      if (experimentData.length > 0) {
        ctx.beginPath();
        const pointSpacing = graphWidth / 10;

        for (let i = 0; i < experimentData.length; i++) {
          const x = graphMargin + i * pointSpacing;
          // Inverse relationship between frequency and wavelength
          const y =
            height -
            graphMargin -
            (10 / (experimentData[i] + 1)) * graphHeight * 0.8;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          // Draw point
          ctx.fillStyle = "#9c27b0";
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.strokeStyle = "#9c27b0";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Labels
      ctx.font = "14px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(
        "Results: Wavelength vs. Frequency Graph",
        width * 0.1,
        height * 0.1,
      );
      ctx.fillText(
        "Analyze the relationship between wavelength and frequency",
        width * 0.1,
        height * 0.15,
      );
    }
  };

  // Chemical experiment visualization
  const renderChemicalExperiment = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
  ) => {
    const width = canvas.width;
    const height = canvas.height;

    // Draw experiment setup
    if (currentStep === 0) {
      // Draw test tubes
      for (let i = 0; i < 3; i++) {
        const x = width * (0.3 + i * 0.2);

        // Test tube
        ctx.beginPath();
        ctx.moveTo(x - 15, height * 0.3);
        ctx.lineTo(x - 15, height * 0.6);
        ctx.arc(x, height * 0.6, 15, Math.PI, 0);
        ctx.lineTo(x + 15, height * 0.3);
        ctx.closePath();
        ctx.fillStyle = "#f5f5f5";
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Liquid in test tube
        ctx.beginPath();
        ctx.moveTo(x - 15, height * 0.5);
        ctx.lineTo(x - 15, height * 0.6);
        ctx.arc(x, height * 0.6, 15, Math.PI, 0);
        ctx.lineTo(x + 15, height * 0.5);
        ctx.closePath();
        ctx.fillStyle = i === 0 ? "#4caf50" : i === 1 ? "#2196f3" : "#ff9800";
        ctx.fill();
      }

      // Draw thermometer
      ctx.beginPath();
      ctx.rect(width * 0.8, height * 0.3, 5, height * 0.3);
      ctx.arc(width * 0.8 + 2.5, height * 0.6, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#f5f5f5";
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Mercury in thermometer
      ctx.beginPath();
      ctx.rect(width * 0.8 + 1, height * 0.5, 3, height * 0.1);
      ctx.arc(width * 0.8 + 2.5, height * 0.6, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#f44336";
      ctx.fill();

      // Labels
      ctx.font = "14px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(
        "Setup: Chemical Reaction Experiment",
        width * 0.1,
        height * 0.1,
      );
      ctx.fillText(
        "Prepare reagents and set temperature",
        width * 0.1,
        height * 0.15,
      );
      ctx.fillText("Reagent A", width * 0.3 - 25, height * 0.7);
      ctx.fillText("Reagent B", width * 0.5 - 25, height * 0.7);
      ctx.fillText("Catalyst", width * 0.7 - 25, height * 0.7);
      ctx.fillText("25°C", width * 0.8 + 15, height * 0.45);
    }
    // Draw experiment running
    else if (currentStep === 1) {
      // Draw reaction vessel
      ctx.beginPath();
      ctx.moveTo(width * 0.3, height * 0.3);
      ctx.lineTo(width * 0.3, height * 0.6);
      ctx.arc(width * 0.5, height * 0.6, width * 0.2, Math.PI, 0);
      ctx.lineTo(width * 0.7, height * 0.3);
      ctx.closePath();
      ctx.fillStyle = "#f5f5f5";
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Liquid in vessel
      ctx.beginPath();
      ctx.moveTo(width * 0.3, height * 0.5);
      ctx.lineTo(width * 0.3, height * 0.6);
      ctx.arc(width * 0.5, height * 0.6, width * 0.2, Math.PI, 0);
      ctx.lineTo(width * 0.7, height * 0.5);
      ctx.closePath();
      ctx.fillStyle = "#8bc34a";
      ctx.fill();

      // Draw bubbles/reaction
      const progress = experimentData.length / 10; // 0 to 1
      const bubbleCount = Math.floor(progress * 20);

      for (let i = 0; i < bubbleCount; i++) {
        const seed = i * 1000;
        const random = (n: number) => (((Math.sin(n) * 10000) % 1) + 1) % 1;

        const x = width * (0.35 + random(seed) * 0.3);
        const y = height * (0.4 + random(seed + 1) * 0.1);
        const size = 3 + random(seed + 2) * 5;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fill();
      }

      // Draw thermometer
      ctx.beginPath();
      ctx.rect(width * 0.8, height * 0.3, 5, height * 0.3);
      ctx.arc(width * 0.8 + 2.5, height * 0.6, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#f5f5f5";
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Mercury in thermometer (rising with progress)
      const mercuryHeight = height * (0.6 - 0.2 * progress);
      ctx.beginPath();
      ctx.rect(width * 0.8 + 1, mercuryHeight, 3, height * 0.6 - mercuryHeight);
      ctx.arc(width * 0.8 + 2.5, height * 0.6, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#f44336";
      ctx.fill();

      // Labels
      ctx.font = "14px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(
        "Running: Chemical Reaction in Progress",
        width * 0.1,
        height * 0.1,
      );
      ctx.fillText(
        `Data points collected: ${experimentData.length}/10`,
        width * 0.1,
        height * 0.15,
      );
      ctx.fillText(
        `${25 + Math.floor(progress * 30)}°C`,
        width * 0.8 + 15,
        height * 0.45,
      );
    }
    // Draw results
    else if (currentStep >= 2) {
      // Draw graph of results
      const graphMargin = 50;
      const graphWidth = width - graphMargin * 2;
      const graphHeight = height - graphMargin * 2;

      // Draw axes
      ctx.beginPath();
      ctx.moveTo(graphMargin, height - graphMargin);
      ctx.lineTo(width - graphMargin, height - graphMargin); // x-axis
      ctx.moveTo(graphMargin, height - graphMargin);
      ctx.lineTo(graphMargin, graphMargin); // y-axis
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw axis labels
      ctx.font = "12px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText("Temperature (°C)", width / 2, height - graphMargin / 2);
      ctx.save();
      ctx.translate(graphMargin / 2, height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("Reaction Rate", 0, 0);
      ctx.restore();

      // Draw data points and line
      if (experimentData.length > 0) {
        ctx.beginPath();
        const pointSpacing = graphWidth / 10;

        for (let i = 0; i < experimentData.length; i++) {
          const x = graphMargin + i * pointSpacing;
          // Exponential relationship between temperature and rate
          const y =
            height -
            graphMargin -
            Math.pow(experimentData[i] / 10, 1.5) * graphHeight * 0.8;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          // Draw point
          ctx.fillStyle = "#4caf50";
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.strokeStyle = "#4caf50";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Labels
      ctx.font = "14px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(
        "Results: Reaction Rate vs. Temperature Graph",
        width * 0.1,
        height * 0.1,
      );
      ctx.fillText(
        "Analyze how temperature affects reaction rate",
        width * 0.1,
        height * 0.15,
      );
    }
  };

  // Math experiment visualization
  const renderMathExperiment = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
  ) => {
    const width = canvas.width;
    const height = canvas.height;

    // Draw experiment setup
    if (currentStep === 0) {
      // Draw coordinate system
      const centerX = width / 2;
      const centerY = height / 2;
      const axisLength = Math.min(width, height) * 0.8;

      // Draw axes
      ctx.beginPath();
      ctx.moveTo(centerX - axisLength / 2, centerY);
      ctx.lineTo(centerX + axisLength / 2, centerY); // x-axis
      ctx.moveTo(centerX, centerY - axisLength / 2);
      ctx.lineTo(centerX, centerY + axisLength / 2); // y-axis
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw axis arrows
      ctx.beginPath();
      ctx.moveTo(centerX + axisLength / 2, centerY);
      ctx.lineTo(centerX + axisLength / 2 - 10, centerY - 5);
      ctx.lineTo(centerX + axisLength / 2 - 10, centerY + 5);
      ctx.closePath();
      ctx.moveTo(centerX, centerY - axisLength / 2);
      ctx.lineTo(centerX - 5, centerY - axisLength / 2 + 10);
      ctx.lineTo(centerX + 5, centerY - axisLength / 2 + 10);
      ctx.closePath();
      ctx.fillStyle = "#333";
      ctx.fill();

      // Draw axis labels
      ctx.font = "16px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText("x", centerX + axisLength / 2 - 5, centerY + 20);
      ctx.fillText("y", centerX + 10, centerY - axisLength / 2 + 15);

      // Draw function input box
      ctx.beginPath();
      ctx.rect(width * 0.3, height * 0.1, width * 0.4, 40);
      ctx.fillStyle = "#f5f5f5";
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw function text
      ctx.font = "16px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText("f(x) = ax² + bx + c", width * 0.35, height * 0.1 + 25);

      // Draw parameter sliders
      for (let i = 0; i < 3; i++) {
        const y = height * 0.2 + i * 30;

        // Slider track
        ctx.beginPath();
        ctx.rect(width * 0.3, y, width * 0.4, 10);
        ctx.fillStyle = "#e0e0e0";
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Slider thumb
        ctx.beginPath();
        ctx.arc(width * 0.5, y + 5, 8, 0, Math.PI * 2);
        ctx.fillStyle = "#ff9800";
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Slider label
        ctx.font = "14px Arial";
        ctx.fillStyle = "#333";
        ctx.fillText(["a", "b", "c"][i], width * 0.25, y + 10);
      }

      // Labels
      ctx.font = "14px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(
        "Setup: Mathematical Function Experiment",
        width * 0.1,
        height * 0.05,
      );
      ctx.fillText(
        "Adjust parameters to prepare experiment",
        width * 0.1,
        height * 0.08,
      );
    }
    // Draw experiment running
    else if (currentStep === 1) {
      // Draw coordinate system
      const centerX = width / 2;
      const centerY = height / 2;
      const axisLength = Math.min(width, height) * 0.8;

      // Draw axes
      ctx.beginPath();
      ctx.moveTo(centerX - axisLength / 2, centerY);
      ctx.lineTo(centerX + axisLength / 2, centerY); // x-axis
      ctx.moveTo(centerX, centerY - axisLength / 2);
      ctx.lineTo(centerX, centerY + axisLength / 2); // y-axis
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw grid
      ctx.strokeStyle = "#e0e0e0";
      ctx.lineWidth = 1;

      for (let i = -5; i <= 5; i++) {
        if (i === 0) continue;
        const x = centerX + (i * axisLength) / 10;
        const y = centerY + (i * axisLength) / 10;

        ctx.beginPath();
        ctx.moveTo(x, centerY - axisLength / 2);
        ctx.lineTo(x, centerY + axisLength / 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX - axisLength / 2, y);
        ctx.lineTo(centerX + axisLength / 2, y);
        ctx.stroke();

        // Grid labels
        ctx.font = "10px Arial";
        ctx.fillStyle = "#666";
        ctx.fillText(i.toString(), x - 3, centerY + 15);
        ctx.fillText((-i).toString(), centerX - 15, y + 3);
      }

      // Draw function graph
      const progress = experimentData.length / 10; // 0 to 1
      const a = 0.5 * progress;
      const b = 1 - progress * 0.5;
      const c = 0;

      ctx.beginPath();
      for (let px = 0; px <= axisLength; px++) {
        const x = (px / axisLength - 0.5) * 10; // Map to range -5 to 5
        const y = a * x * x + b * x + c;
        const py = centerY - (y * axisLength) / 10; // Scale and flip

        if (px === 0) {
          ctx.moveTo(centerX - axisLength / 2 + px, py);
        } else {
          ctx.lineTo(centerX - axisLength / 2 + px, py);
        }
      }

      ctx.strokeStyle = "#ff9800";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw data points
      for (let i = 0; i < experimentData.length; i++) {
        const x = -5 + i;
        const y = a * x * x + b * x + c;
        const px = centerX + (x * axisLength) / 10;
        const py = centerY - (y * axisLength) / 10;

        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#ff5722";
        ctx.fill();
      }

      // Labels
      ctx.font = "14px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(
        "Running: Function Behavior Experiment",
        width * 0.1,
        height * 0.1,
      );
      ctx.fillText(
        `f(x) = ${a.toFixed(1)}x² + ${b.toFixed(1)}x + ${c.toFixed(1)}`,
        width * 0.1,
        height * 0.15,
      );
      ctx.fillText(
        `Data points collected: ${experimentData.length}/10`,
        width * 0.1,
        height * 0.2,
      );
    }
    // Draw results
    else if (currentStep >= 2) {
      // Draw graph of results
      const graphMargin = 50;
      const graphWidth = width - graphMargin * 2;
      const graphHeight = height - graphMargin * 2;

      // Draw axes
      ctx.beginPath();
      ctx.moveTo(graphMargin, height - graphMargin);
      ctx.lineTo(width - graphMargin, height - graphMargin); // x-axis
      ctx.moveTo(graphMargin, height - graphMargin);
      ctx.lineTo(graphMargin, graphMargin); // y-axis
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw axis labels
      ctx.font = "12px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText("Parameter a", width / 2, height - graphMargin / 2);
      ctx.save();
      ctx.translate(graphMargin / 2, height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("Maximum y-value", 0, 0);
      ctx.restore();

      // Draw data points and line
      if (experimentData.length > 0) {
        ctx.beginPath();
        const pointSpacing = graphWidth / 10;

        for (let i = 0; i < experimentData.length; i++) {
          const x = graphMargin + i * pointSpacing;
          // Quadratic relationship
          const y =
            height -
            graphMargin -
            Math.pow(experimentData[i] / 10, 2) * graphHeight * 0.8;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          // Draw point
          ctx.fillStyle = "#ff9800";
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.strokeStyle = "#ff9800";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Labels
      ctx.font = "14px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(
        "Results: Maximum Value vs. Parameter a",
        width * 0.1,
        height * 0.1,
      );
      ctx.fillText(
        "Analyze how changing parameter a affects the function's maximum value",
        width * 0.1,
        height * 0.15,
      );
    }
  };

  // Geometry experiment visualization
  const renderGeometryExperiment = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
  ) => {
    const width = canvas.width;
    const height = canvas.height;

    // Draw experiment setup
    if (currentStep === 0) {
      // Draw triangle template
      const centerX = width / 2;
      const centerY = height / 2;
      const size = Math.min(width, height) * 0.3;

      // Draw triangle
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - size / 2);
      ctx.lineTo(centerX - size / 2, centerY + size / 2);
      ctx.lineTo(centerX + size / 2, centerY + size / 2);
      ctx.closePath();
      ctx.fillStyle = "#e91e6380";
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw angle markers
      const drawAngleArc = (
        x: number,
        y: number,
        startAngle: number,
        endAngle: number,
      ) => {
        ctx.beginPath();
        ctx.arc(x, y, 20, startAngle, endAngle);
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1;
        ctx.stroke();
      };

      // Top angle
      drawAngleArc(centerX, centerY - size / 2, Math.PI / 4, (Math.PI * 3) / 4);

      // Bottom left angle
      drawAngleArc(
        centerX - size / 2,
        centerY + size / 2,
        -Math.PI / 4,
        Math.PI / 2,
      );

      // Bottom right angle
      drawAngleArc(
        centerX + size / 2,
        centerY + size / 2,
        Math.PI / 2,
        (Math.PI * 5) / 4,
      );

      // Draw controls
      ctx.beginPath();
      ctx.rect(width * 0.3, height * 0.1, width * 0.4, 40);
      ctx.fillStyle = "#f5f5f5";
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw control text
      ctx.font = "16px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(
        "Triangle Properties Experiment",
        width * 0.35,
        height * 0.1 + 25,
      );

      // Labels
      ctx.font = "14px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(
        "Setup: Geometric Principles Experiment",
        width * 0.1,
        height * 0.05,
      );
      ctx.fillText(
        "Prepare to verify the Pythagorean theorem and angle properties",
        width * 0.1,
        height * 0.08,
      );

      // Label sides
      ctx.fillText("a", centerX - 10, centerY);
      ctx.fillText("b", centerX + size / 4, centerY + size / 4);
      ctx.fillText("c", centerX - size / 4, centerY + size / 4);
    }
    // Draw experiment running
    else if (currentStep === 1) {
      // Draw changing triangle
      const centerX = width / 2;
      const centerY = height / 2;
      const baseSize = Math.min(width, height) * 0.3;
      const progress = experimentData.length / 10; // 0 to 1

      // Calculate triangle points with changing angles
      const angle = Math.PI / 6 + (progress * Math.PI) / 3; // 30° to 90°
      const height = baseSize * Math.sin(angle);
      const halfWidth = baseSize * Math.cos(angle);

      const topX = centerX;
      const topY = centerY - height / 2;
      const leftX = centerX - halfWidth;
      const leftY = centerY + height / 2;
      const rightX = centerX + halfWidth;
      const rightY = centerY + height / 2;

      // Draw triangle
      ctx.beginPath();
      ctx.moveTo(topX, topY);
      ctx.lineTo(leftX, leftY);
      ctx.lineTo(rightX, rightY);
      ctx.closePath();
      ctx.fillStyle = "#e91e6380";
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw side lengths
      const a = baseSize; // Bottom side
      const b = Math.sqrt(
        Math.pow(rightX - topX, 2) + Math.pow(rightY - topY, 2),
      ); // Right side
      const c = Math.sqrt(
        Math.pow(leftX - topX, 2) + Math.pow(leftY - topY, 2),
      ); // Left side

      ctx.font = "14px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText(
        `a = ${a.toFixed(1)}`,
        centerX - 10,
        centerY + height / 2 + 20,
      );
      ctx.fillText(
        `b = ${b.toFixed(1)}`,
        (topX + rightX) / 2 + 10,
        (topY + rightY) / 2,
      );
      ctx.fillText(
        `c = ${c.toFixed(1)}`,
        (topX + leftX) / 2 - 30,
        (topY + leftY) / 2,
      );

      // Calculate and display angles
      const angleA =
        Math.atan2(rightY - leftY, rightX - leftX) -
        Math.atan2(topY - leftY, topX - leftX);
      const angleB =
        Math.atan2(leftY - topY, leftX - topX) -
        Math.atan2(rightY - topY, rightX - topX);
      const angleC = Math.PI - angleA - angleB;

      const toDegrees = (radians: number) =>
        ((radians * 180) / Math.PI + 360) % 360;

      ctx.fillText(
        `α = ${toDegrees(angleA).toFixed(0)}°`,
        leftX - 30,
        leftY + 20,
      );
      ctx.fillText(
        `β = ${toDegrees(angleB).toFixed(0)}°`,
        rightX + 10,
        rightY + 20,
      );
      ctx.fillText(`γ = ${toDegrees(angleC).toFixed(0)}°`, topX, topY - 10);

      // Display Pythagorean theorem
      ctx.fillText(
        `a² = ${Math.pow(a, 2).toFixed(1)}`,
        width * 0.1,
        height * 0.1,
      );
      ctx.fillText(
        `b² = ${Math.pow(b, 2).toFixed(1)}`,
        width * 0.1,
        height * 0.15,
      );
      ctx.fillText(
        `c² = ${Math.pow(c, 2).toFixed(1)}`,
        width * 0.1,
        height * 0.2,
      );
      ctx.fillText(
        `b² + c² = ${(Math.pow(b, 2) + Math.pow(c, 2)).toFixed(1)}`,
        width * 0.1,
        height * 0.25,
      );

      // Display angle sum
      ctx.fillText(
        `α + β + γ = ${(toDegrees(angleA) + toDegrees(angleB) + toDegrees(angleC)).toFixed(0)}°`,
        width * 0.7,
        height * 0.1,
      );

      // Labels
      ctx.fillText(
        `Data points collected: ${experimentData.length}/10`,
        width * 0.7,
        height * 0.15,
      );
    }
    // Draw results
    else if (currentStep >= 2) {
      // Draw graph of results
      const graphMargin = 50;
      const graphWidth = width - graphMargin * 2;
      const graphHeight = height - graphMargin * 2;

      // Draw axes
      ctx.beginPath();
      ctx.moveTo(graphMargin, height - graphMargin);
      ctx.lineTo(width - graphMargin, height - graphMargin); // x-axis
      ctx.moveTo(graphMargin, height - graphMargin);
      ctx.lineTo(graphMargin, graphMargin); // y-axis
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw axis labels
      ctx.font = "12px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText("Angle γ (degrees)", width / 2, height - graphMargin / 2);
      ctx.save();
      ctx.translate(graphMargin / 2, height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("Ratio a²/(b²+c²)", 0, 0);
      ctx.restore();

      // Draw data points and line
      if (experimentData.length > 0) {
        ctx.beginPath();
        const pointSpacing = graphWidth / 10;

        for (let i = 0; i < experimentData.length; i++) {
          const x = graphMargin + i * pointSpacing;
          // Relationship between angle and Pythagorean ratio
          const angle = 30 + i * 6; // 30° to 90°
          const ratio = Math.pow(Math.sin((angle * Math.PI) / 180), 2);
          const y = height - graphMargin - ratio * graphHeight * 0.8;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          // Draw point
          ctx.fillStyle = "#e91e63";
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.strokeStyle = "#e91e63";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Labels
      ctx.font = "14px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText("Results: Angle vs. Ratio Graph", width * 0.1, height * 0.1);
      ctx.fillText(
        "Analyze how the angle affects the Pythagorean relationship",
        width * 0.1,
        height * 0.15,
      );
    }
  };

  // Default experiment visualization
  const renderDefaultExperiment = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
  ) => {
    const width = canvas.width;
    const height = canvas.height;

    // Draw placeholder
    ctx.font = "20px Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.fillText(
      "Select a specific topic for a tailored experiment",
      width / 2,
      height / 2,
    );
    ctx.fillText(
      "or continue with the general experiment",
      width / 2,
      height / 2 + 30,
    );
  };

  // Handle running the experiment
  const runExperiment = () => {
    if (currentStep === 0) {
      // Start the experiment
      setCurrentStep(1);

      // Generate some sample data
      const generateData = () => {
        const newData = [...experimentData];
        const dataPoint = Math.random() * 10;
        newData.push(dataPoint);
        setExperimentData(newData);

        if (newData.length < 10) {
          setTimeout(generateData, 500);
        } else {
          // Move to analysis step when data collection is complete
          setTimeout(() => setCurrentStep(2), 500);
        }
      };

      generateData();
    }
  };

  // Handle completing the experiment
  const completeExperiment = () => {
    if (currentStep >= 2) {
      // Check if all questions are answered
      const allQuestionsAnswered = config.questions.every(
        (q) => userAnswers[q.id] !== undefined,
      );

      if (allQuestionsAnswered) {
        // Calculate score
        let score = 0;
        config.questions.forEach((q) => {
          if (parseInt(userAnswers[q.id]) === q.correctAnswer) {
            score += 1;
          }
        });

        // Award points based on score
        const pointsAwarded = score * 10;
        addPoints(pointsAwarded);

        // Mark as complete
        setIsComplete(true);
      } else {
        // Alert user to answer all questions
        alert("Please answer all questions before completing the experiment.");
      }
    }
  };

  // Handle selecting an answer
  const selectAnswer = (questionId: string, answerIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex.toString(),
    }));
  };

  // Reset the experiment
  const resetExperiment = () => {
    setCurrentStep(0);
    setExperimentData([]);
    setUserAnswers({});
    setIsComplete(false);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div
        className="p-4 flex justify-between items-center"
        style={{ backgroundColor: config.color + "20" }}
      >
        <div>
          <h2 className="text-xl font-bold">{config.title}</h2>
          <p className="text-sm text-gray-600">{config.description}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Experiment visualization */}
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex-1 relative border rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Controls */}
          <div className="mt-4 flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                onClick={runExperiment}
                disabled={currentStep !== 0 || isComplete}
                style={{ backgroundColor: config.color }}
              >
                Run Experiment
              </Button>
              <Button
                onClick={completeExperiment}
                disabled={currentStep < 2 || isComplete}
                style={{ backgroundColor: config.color }}
              >
                Complete
              </Button>
              <Button
                variant="outline"
                onClick={resetExperiment}
                disabled={currentStep === 0 && experimentData.length === 0}
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">
                Step {currentStep + 1} of {config.steps.length}
              </span>
              <Progress
                value={((currentStep + 1) / config.steps.length) * 100}
                className="w-24"
                style={
                  {
                    "--theme-primary": config.color,
                  } as React.CSSProperties
                }
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l p-4 flex flex-col overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="procedure">Procedure</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
            </TabsList>

            <TabsContent value="procedure" className="flex-1 overflow-auto">
              <div className="space-y-4">
                {config.steps.map((step, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${index === currentStep ? "border-2" : ""}`}
                    style={
                      index === currentStep ? { borderColor: config.color } : {}
                    }
                  >
                    <h3 className="font-medium flex items-center">
                      {index < currentStep ? (
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <span
                          className="h-5 w-5 rounded-full inline-flex items-center justify-center mr-2 text-xs"
                          style={{
                            backgroundColor:
                              index === currentStep ? config.color : "#e5e7eb",
                          }}
                        >
                          {index + 1}
                        </span>
                      )}
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {step.instruction}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 italic">
                      {step.action}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="questions" className="flex-1 overflow-auto">
              {currentStep >= 2 ? (
                <div className="space-y-6">
                  {config.questions.map((question, qIndex) => (
                    <div key={question.id} className="space-y-2">
                      <h3 className="font-medium">
                        {qIndex + 1}. {question.text}
                      </h3>
                      <div className="space-y-1">
                        {question.options.map((option, oIndex) => (
                          <div
                            key={oIndex}
                            className={`p-2 rounded-md cursor-pointer flex items-center ${userAnswers[question.id] === oIndex.toString() ? "bg-opacity-20" : "hover:bg-gray-100"}`}
                            style={
                              userAnswers[question.id] === oIndex.toString()
                                ? { backgroundColor: config.color + "30" }
                                : {}
                            }
                            onClick={() => selectAnswer(question.id, oIndex)}
                          >
                            <div
                              className={`h-4 w-4 rounded-full mr-2 ${userAnswers[question.id] === oIndex.toString() ? "bg-opacity-100" : "border"}`}
                              style={
                                userAnswers[question.id] === oIndex.toString()
                                  ? { backgroundColor: config.color }
                                  : {}
                              }
                            />
                            <span>{option}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {isComplete && (
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <h3 className="font-medium flex items-center text-green-800">
                        <ClipboardCheck className="h-5 w-5 mr-2" />
                        Experiment Completed
                      </h3>
                      <p className="text-sm text-green-700 mt-1">
                        You've successfully completed this experiment and earned
                        points!
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4 text-center">
                  <FileText className="h-12 w-12 mb-2 opacity-20" />
                  <p>Complete the experiment to access questions</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="info" className="flex-1 overflow-auto">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Objective</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {config.objective}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Instructions</h3>
                  <ul className="text-sm text-gray-600 mt-1 space-y-1 list-disc pl-5">
                    <li>Follow the procedure steps in order</li>
                    <li>Observe the experiment carefully</li>
                    <li>Answer the questions based on your observations</li>
                    <li>Complete the experiment to earn points</li>
                  </ul>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Download className="h-3 w-3 mr-1" /> Download Data
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <HelpCircle className="h-3 w-3 mr-1" /> Get Help
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
