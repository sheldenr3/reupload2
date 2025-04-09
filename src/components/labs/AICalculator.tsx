import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { generateGeminiResponse } from "@/lib/gemini";
import { Sun, Moon, Brain, Mic, ArrowLeft } from "lucide-react";

declare global {
  interface Window {
    Chart: any;
    math: any;
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function AICalculator({ onBack }: { onBack: () => void }) {
  const [displayValue, setDisplayValue] = useState("0");
  const [history, setHistory] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [calculationHistory, setCalculationHistory] = useState<
    Array<{ expression: string; result: string }>
  >([]);
  const [aiMode, setAiMode] = useState(true);
  const [memorySlots, setMemorySlots] = useState<{
    [key: string]: string | null;
  }>({ "1": null, "2": null, "3": null });
  const [activeTab, setActiveTab] = useState("graph");
  const [chatMessages, setChatMessages] = useState<
    Array<{ content: string; sender: "user" | "ai" }>
  >([
    {
      content:
        "Hello! I'm your AI calculator assistant. Ask me about calculations, conversions, or math concepts.",
      sender: "ai",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [functionInput, setFunctionInput] = useState("");
  const [speechStatus, setSpeechStatus] = useState(
    "Click mic to speak your calculation",
  );
  const [isListening, setIsListening] = useState(false);

  // Unit converter state
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");
  const [conversionCategory, setConversionCategory] = useState("length");

  // Financial calculator state
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [loanResults, setLoanResults] = useState("Results will appear here...");

  // Refs
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Initialize chart and math.js
  useEffect(() => {
    // Load Chart.js and math.js from CDN if not already loaded
    const loadScripts = async () => {
      if (!window.Chart) {
        const chartScript = document.createElement("script");
        chartScript.src = "https://cdn.jsdelivr.net/npm/chart.js";
        chartScript.async = true;
        document.body.appendChild(chartScript);
        await new Promise((resolve) => (chartScript.onload = resolve));
      }

      if (!window.math) {
        const mathScript = document.createElement("script");
        mathScript.src =
          "https://cdn.jsdelivr.net/npm/mathjs/lib/browser/math.min.js";
        mathScript.async = true;
        document.body.appendChild(mathScript);
        await new Promise((resolve) => (mathScript.onload = resolve));
      }

      initializeChart();
    };

    loadScripts();

    return () => {
      // Cleanup chart instance
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  // Scroll chat to bottom when messages change
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Initialize chart
  const initializeChart = () => {
    if (!chartRef.current || !window.Chart) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new window.Chart(ctx, {
      type: "line",
      data: {
        labels: [
          -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
          10,
        ],
        datasets: [
          {
            label: "y = x",
            data: [
              -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7,
              8, 9, 10,
            ],
            borderColor: "#6C63FF",
            borderWidth: 3,
            tension: 0.1,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "x",
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: "y",
            },
          },
        },
      },
    });
  };

  // Basic calculator functions
  const addToDisplay = (value: string) => {
    if (displayValue === "0" && value !== ".") {
      setDisplayValue(value);
    } else if (displayValue === "Error") {
      setDisplayValue(value);
    } else {
      setDisplayValue((prev) => prev + value);
    }
  };

  const clearDisplay = () => {
    setDisplayValue("0");
    setHistory("");
  };

  const backspace = () => {
    if (displayValue === "Error") {
      setDisplayValue("0");
    } else if (displayValue.length === 1) {
      setDisplayValue("0");
    } else {
      setDisplayValue((prev) => prev.slice(0, -1));
    }
  };

  const percentage = () => {
    try {
      // eslint-disable-next-line no-eval
      setDisplayValue((eval(displayValue) / 100).toString());
    } catch (error) {
      setDisplayValue("Error");
    }
  };

  const calculate = () => {
    try {
      setHistory(displayValue + " =");

      // Replace ^ with ** for exponentiation
      let expression = displayValue.replace(/\^/g, "**");

      // Use math.js for advanced calculation if available
      let result;
      if (window.math) {
        result = window.math.evaluate(expression).toString();
      } else {
        // Fallback to eval if math.js is not available
        // eslint-disable-next-line no-eval
        result = eval(expression).toString();
      }

      // Format the result
      if (result.includes(".")) {
        // Limit decimal places to 8
        const parts = result.split(".");
        if (parts[1] && parts[1].length > 8) {
          result = parseFloat(result).toFixed(8);
        }
      }

      // Check for very large or small numbers
      const num = parseFloat(result);
      if (Math.abs(num) > 1e15 || (Math.abs(num) < 1e-10 && num !== 0)) {
        result = num.toExponential(5);
      }

      setDisplayValue(result);

      // Add to history
      addToHistory({
        expression: displayValue + " =",
        result: result,
      });

      // Update graph data
      updateGraph(displayValue, result);
    } catch (error) {
      setDisplayValue("Error");
      setHistory("Invalid expression");
    }
  };

  const calculateSquareRoot = () => {
    try {
      let value = parseFloat(displayValue);
      if (value < 0) {
        setDisplayValue("Error");
        setHistory("Cannot calculate square root of negative number");
      } else {
        setHistory(`√(${displayValue})`);
        setDisplayValue(Math.sqrt(value).toString());

        // Add to history
        addToHistory({
          expression: `√(${displayValue})`,
          result: Math.sqrt(value).toString(),
        });
      }
    } catch (error) {
      setDisplayValue("Error");
    }
  };

  const calculateFactorial = () => {
    try {
      let num = parseInt(displayValue);
      if (num < 0) {
        setDisplayValue("Error");
        setHistory("Cannot calculate factorial of negative number");
      } else if (num > 170) {
        setDisplayValue("Error");
        setHistory("Number too large for factorial");
      } else {
        setHistory(`${displayValue}!`);
        let result = 1;
        for (let i = 2; i <= num; i++) {
          result *= i;
        }
        setDisplayValue(result.toString());

        // Add to history
        addToHistory({
          expression: `${displayValue}!`,
          result: result.toString(),
        });
      }
    } catch (error) {
      setDisplayValue("Error");
    }
  };

  // Graph functions
  const updateGraph = (expression: string, result: string) => {
    if (!chartInstance.current) return;

    // Extract the last expression for graphing
    const cleanExpr = expression.replace(" =", "");

    // Check if it's a simple calculation without variables
    if (!cleanExpr.includes("x")) {
      // Just update the chart data point at x=0
      chartInstance.current.data.datasets[0].data[10] = parseFloat(result);
      chartInstance.current.update();
    }
  };

  const plotFunction = () => {
    if (!functionInput || !chartInstance.current || !window.math) return;

    try {
      // Generate x values from -10 to 10
      const xValues = Array.from({ length: 201 }, (_, i) => -10 + i * 0.1);

      // Calculate y values using math.js
      const yValues = xValues.map((x) => {
        try {
          return window.math.evaluate(functionInput, { x: x });
        } catch (e) {
          return null;
        }
      });

      // Update chart
      chartInstance.current.data.labels = xValues;
      chartInstance.current.data.datasets[0].label = `y = ${functionInput}`;
      chartInstance.current.data.datasets[0].data = yValues;
      chartInstance.current.update();

      // Add to history
      addToHistory({
        expression: `Plot: y = ${functionInput}`,
        result: "Graph",
      });
    } catch (error) {
      alert("Error plotting function: " + (error as Error).message);
    }
  };

  // History functions
  const addToHistory = (item: { expression: string; result: string }) => {
    setCalculationHistory((prev) => {
      const newHistory = [item, ...prev];
      if (newHistory.length > 50) {
        return newHistory.slice(0, 50);
      }
      return newHistory;
    });
  };

  // AI assistant functions
  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    // Add user message to chat
    setChatMessages((prev) => [
      ...prev,
      { content: chatInput, sender: "user" },
    ]);
    const userMessage = chatInput;
    setChatInput("");

    // Add thinking message
    setChatMessages((prev) => [
      ...prev,
      { content: "Thinking...", sender: "ai" },
    ]);

    try {
      // Process the message and get AI response
      const aiResponse = await generateGeminiResponse(
        userMessage,
        "mathematics",
      );

      // Remove the thinking message
      setChatMessages((prev) => {
        const newMessages = [...prev];
        if (newMessages[newMessages.length - 1].content === "Thinking...") {
          newMessages.pop();
        }
        return [...newMessages, { content: aiResponse, sender: "ai" }];
      });
    } catch (error) {
      // Remove the thinking message and add error message
      setChatMessages((prev) => {
        const newMessages = [...prev];
        if (newMessages[newMessages.length - 1].content === "Thinking...") {
          newMessages.pop();
        }
        return [
          ...newMessages,
          {
            content: "Sorry, I couldn't process your request right now.",
            sender: "ai",
          },
        ];
      });
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setChatInput(suggestion);
  };

  // Unit converter functions
  const convertUnits = () => {
    const fromValueNum = parseFloat(fromValue);
    if (isNaN(fromValueNum)) {
      setToValue("");
      return;
    }

    let result;

    // Handle different categories
    switch (conversionCategory) {
      case "length":
        result = convertLength(fromValueNum, fromUnit, toUnit);
        break;
      case "weight":
        result = convertWeight(fromValueNum, fromUnit, toUnit);
        break;
      case "temperature":
        result = convertTemperature(fromValueNum, fromUnit, toUnit);
        break;
      default:
        result = 0;
    }

    setToValue(result.toFixed(6));
  };

  const convertLength = (value: number, fromUnit: string, toUnit: string) => {
    // Convert to meters first (base unit)
    let inMeters;
    switch (fromUnit) {
      case "m":
        inMeters = value;
        break;
      case "km":
        inMeters = value * 1000;
        break;
      case "cm":
        inMeters = value / 100;
        break;
      case "mm":
        inMeters = value / 1000;
        break;
      case "mi":
        inMeters = value * 1609.34;
        break;
      case "ft":
        inMeters = value * 0.3048;
        break;
      case "in":
        inMeters = value * 0.0254;
        break;
      default:
        inMeters = 0;
    }

    // Convert from meters to target unit
    switch (toUnit) {
      case "m":
        return inMeters;
      case "km":
        return inMeters / 1000;
      case "cm":
        return inMeters * 100;
      case "mm":
        return inMeters * 1000;
      case "mi":
        return inMeters / 1609.34;
      case "ft":
        return inMeters / 0.3048;
      case "in":
        return inMeters / 0.0254;
      default:
        return 0;
    }
  };

  const convertWeight = (value: number, fromUnit: string, toUnit: string) => {
    // Convert to kg first (base unit)
    let inKg;
    switch (fromUnit) {
      case "kg":
        inKg = value;
        break;
      case "g":
        inKg = value / 1000;
        break;
      case "mg":
        inKg = value / 1000000;
        break;
      case "lb":
        inKg = value * 0.453592;
        break;
      case "oz":
        inKg = value * 0.0283495;
        break;
      default:
        inKg = 0;
    }

    // Convert from kg to target unit
    switch (toUnit) {
      case "kg":
        return inKg;
      case "g":
        return inKg * 1000;
      case "mg":
        return inKg * 1000000;
      case "lb":
        return inKg / 0.453592;
      case "oz":
        return inKg / 0.0283495;
      default:
        return 0;
    }
  };

  const convertTemperature = (
    value: number,
    fromUnit: string,
    toUnit: string,
  ) => {
    // Convert to Celsius first (base unit)
    let inCelsius;
    switch (fromUnit) {
      case "c":
        inCelsius = value;
        break;
      case "f":
        inCelsius = ((value - 32) * 5) / 9;
        break;
      case "k":
        inCelsius = value - 273.15;
        break;
      default:
        inCelsius = 0;
    }

    // Convert from Celsius to target unit
    switch (toUnit) {
      case "c":
        return inCelsius;
      case "f":
        return (inCelsius * 9) / 5 + 32;
      case "k":
        return inCelsius + 273.15;
      default:
        return 0;
    }
  };

  const changeConversionCategory = (category: string) => {
    setConversionCategory(category);
    setFromValue("");
    setToValue("");

    // Set default units based on category
    switch (category) {
      case "length":
        setFromUnit("m");
        setToUnit("km");
        break;
      case "weight":
        setFromUnit("kg");
        setToUnit("lb");
        break;
      case "temperature":
        setFromUnit("c");
        setToUnit("f");
        break;
      default:
        setFromUnit("m");
        setToUnit("km");
    }
  };

  // Financial calculator functions
  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12; // Monthly rate
    const termYears = parseFloat(loanTerm);
    const termMonths = termYears * 12;

    if (isNaN(principal) || isNaN(rate) || isNaN(termMonths)) {
      setLoanResults("Please enter valid numbers for all fields.");
      return;
    }

    // Calculate monthly payment
    const monthlyPayment =
      (principal * rate * Math.pow(1 + rate, termMonths)) /
      (Math.pow(1 + rate, termMonths) - 1);

    // Calculate total payment
    const totalPayment = monthlyPayment * termMonths;

    // Calculate total interest
    const totalInterest = totalPayment - principal;

    // Display results
    setLoanResults(`
      <p><strong>Monthly Payment:</strong> $${monthlyPayment.toFixed(2)}</p>
      <p><strong>Total Payment:</strong> $${totalPayment.toFixed(2)}</p>
      <p><strong>Total Interest:</strong> $${totalInterest.toFixed(2)}</p>
    `);

    // Add to history
    addToHistory({
      expression: `Loan: $${principal} at ${rate * 12 * 100}% for ${termYears} years`,
      result: `$${monthlyPayment.toFixed(2)}/month`,
    });
  };

  // Speech recognition
  const startSpeechRecognition = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setSpeechStatus("Speech recognition not supported in this browser");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechStatus("Listening...");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      setSpeechStatus(`"${transcript}"`);

      // Process voice command
      processVoiceCommand(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      setTimeout(() => {
        setSpeechStatus("Click mic to speak your calculation");
      }, 3000);
    };

    recognition.onerror = (event: any) => {
      setSpeechStatus(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.start();
  };

  const processVoiceCommand = (command: string) => {
    // Handle calculation commands
    if (
      command.toLowerCase().includes("calculate") ||
      command.toLowerCase().includes("compute") ||
      command.toLowerCase().includes("what is") ||
      command.toLowerCase().includes("what's")
    ) {
      // Extract mathematical expression
      let expression = command
        .replace(/calculate|compute|what is|what's|equal to|equals|equal/gi, "")
        .trim();

      // Replace spoken math terms with symbols
      expression = expression
        .replace(/plus/gi, "+")
        .replace(/minus/gi, "-")
        .replace(/times/gi, "*")
        .replace(/multiplied by/gi, "*")
        .replace(/divided by/gi, "/")
        .replace(/divided/gi, "/")
        .replace(/squared/gi, "^2")
        .replace(/cubed/gi, "^3")
        .replace(/square root of/gi, "sqrt(")
        .replace(/power of/gi, "^");

      // Add closing parenthesis if needed
      if (
        (expression.match(/\(/g) || []).length >
        (expression.match(/\)/g) || []).length
      ) {
        expression += ")";
      }

      // Set display value and calculate
      try {
        setDisplayValue(expression);
        calculate();
      } catch (error) {
        setDisplayValue("Error");
        setHistory("Could not process voice command");
      }
    }
    // Handle clear command
    else if (
      command.toLowerCase().includes("clear") ||
      command.toLowerCase().includes("reset")
    ) {
      clearDisplay();
    }
    // Handle switching to different tabs
    else if (
      command.toLowerCase().includes("show graph") ||
      command.toLowerCase().includes("graph")
    ) {
      setActiveTab("graph");
    } else if (
      command.toLowerCase().includes("show history") ||
      command.toLowerCase().includes("history")
    ) {
      setActiveTab("history");
    } else if (
      command.toLowerCase().includes("show assistant") ||
      command.toLowerCase().includes("assistant")
    ) {
      setActiveTab("ai-chat");
    } else if (
      command.toLowerCase().includes("show converter") ||
      command.toLowerCase().includes("converter")
    ) {
      setActiveTab("converter");
    } else if (
      command.toLowerCase().includes("show financial") ||
      command.toLowerCase().includes("financial")
    ) {
      setActiveTab("financial");
    }
    // Handle theme toggle
    else if (
      command.toLowerCase().includes("dark mode") ||
      command.toLowerCase().includes("light mode")
    ) {
      setDarkMode(!darkMode);
    } else {
      // If no specific command is recognized, try to interpret as a mathematical expression
      try {
        setDisplayValue(command);
      } catch (error) {
        setDisplayValue("Error");
        setHistory("Could not process voice command");
      }
    }
  };

  // Memory functions
  const memoryOperation = (operation: string, slotNumber: string = "1") => {
    switch (operation) {
      case "save":
        if (displayValue !== "Error") {
          setMemorySlots((prev) => ({
            ...prev,
            [slotNumber]: displayValue,
          }));
        }
        break;
    }
  };

  const truncateString = (str: string, length: number) => {
    if (str.length <= length) return str;
    return str.substring(0, length) + "...";
  };

  // Render length unit options
  const renderLengthUnitOptions = () => (
    <>
      <option value="m">Meters (m)</option>
      <option value="km">Kilometers (km)</option>
      <option value="cm">Centimeters (cm)</option>
      <option value="mm">Millimeters (mm)</option>
      <option value="mi">Miles (mi)</option>
      <option value="ft">Feet (ft)</option>
      <option value="in">Inches (in)</option>
    </>
  );

  // Render weight unit options
  const renderWeightUnitOptions = () => (
    <>
      <option value="kg">Kilograms (kg)</option>
      <option value="g">Grams (g)</option>
      <option value="mg">Milligrams (mg)</option>
      <option value="lb">Pounds (lb)</option>
      <option value="oz">Ounces (oz)</option>
    </>
  );

  // Render temperature unit options
  const renderTemperatureUnitOptions = () => (
    <>
      <option value="c">Celsius (°C)</option>
      <option value="f">Fahrenheit (°F)</option>
      <option value="k">Kelvin (K)</option>
    </>
  );

  // Get unit options based on category
  const getUnitOptions = () => {
    switch (conversionCategory) {
      case "length":
        return renderLengthUnitOptions();
      case "weight":
        return renderWeightUnitOptions();
      case "temperature":
        return renderTemperatureUnitOptions();
      default:
        return renderLengthUnitOptions();
    }
  };

  return (
    <div
      className={`p-6 border rounded-md ${darkMode ? "bg-gray-800 text-white" : "bg-white"} shadow-md transition-all`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-[#0197cf]">
          AI Smart Calculator
        </h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setAiMode(!aiMode)}
            title={aiMode ? "AI Assistant On" : "AI Assistant Off"}
            className="rounded-full"
          >
            <Brain
              className={aiMode ? "text-[#0197cf]" : "text-gray-400"}
              size={18}
            />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="rounded-full"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Back
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calculator */}
        <div
          className={`p-4 border rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} shadow-sm`}
        >
          <div className="mb-4">
            <div className="text-xs text-gray-500 h-5 text-right">
              {history}
            </div>
            <div
              className={`p-3 text-right text-xl font-medium rounded-md ${darkMode ? "bg-gray-800 text-white" : "bg-gray-50"} border overflow-x-auto`}
            >
              {displayValue}
            </div>
          </div>

          <div className="flex items-center mb-3 p-2 rounded-full bg-gray-100 dark:bg-gray-600">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${isListening ? "bg-red-500 text-white" : ""}`}
              onClick={startSpeechRecognition}
            >
              <Mic size={16} />
            </Button>
            <div className="ml-2 text-xs text-gray-500 dark:text-gray-300">
              {speechStatus}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1 mb-3">
            {Object.entries(memorySlots).map(([slot, value]) => (
              <div
                key={slot}
                className={`text-center p-1 text-xs rounded cursor-pointer ${darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-100 hover:bg-gray-200"}`}
                onClick={() =>
                  value ? setDisplayValue(value) : memoryOperation("save", slot)
                }
              >
                M{slot}: {value ? truncateString(value, 7) : "-"}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-2">
            <Button
              variant="destructive"
              onClick={clearDisplay}
              className="font-bold"
            >
              C
            </Button>
            <Button
              variant="secondary"
              onClick={backspace}
              className="font-bold"
            >
              ⌫
            </Button>
            <Button
              variant="secondary"
              onClick={() => addToDisplay("(")}
              className="font-bold"
            >
              (
            </Button>
            <Button
              variant="secondary"
              onClick={() => addToDisplay(")")}
              className="font-bold"
            >
              )
            </Button>
            <Button
              variant="secondary"
              onClick={() => memoryOperation("save")}
              className="font-bold"
            >
              MS
            </Button>

            <Button
              variant="outline"
              onClick={() => addToDisplay("7")}
              className="font-bold"
            >
              7
            </Button>
            <Button
              variant="outline"
              onClick={() => addToDisplay("8")}
              className="font-bold"
            >
              8
            </Button>
            <Button
              variant="outline"
              onClick={() => addToDisplay("9")}
              className="font-bold"
            >
              9
            </Button>
            <Button
              variant="secondary"
              onClick={() => addToDisplay("/")}
              className="font-bold"
            >
              ÷
            </Button>
            <Button
              variant="secondary"
              onClick={calculateSquareRoot}
              className="font-bold"
            >
              √
            </Button>

            <Button
              variant="outline"
              onClick={() => addToDisplay("4")}
              className="font-bold"
            >
              4
            </Button>
            <Button
              variant="outline"
              onClick={() => addToDisplay("5")}
              className="font-bold"
            >
              5
            </Button>
            <Button
              variant="outline"
              onClick={() => addToDisplay("6")}
              className="font-bold"
            >
              6
            </Button>
            <Button
              variant="secondary"
              onClick={() => addToDisplay("*")}
              className="font-bold"
            >
              ×
            </Button>
            <Button
              variant="secondary"
              onClick={() => addToDisplay("^")}
              className="font-bold"
            >
              x^y
            </Button>

            <Button
              variant="outline"
              onClick={() => addToDisplay("1")}
              className="font-bold"
            >
              1
            </Button>
            <Button
              variant="outline"
              onClick={() => addToDisplay("2")}
              className="font-bold"
            >
              2
            </Button>
            <Button
              variant="outline"
              onClick={() => addToDisplay("3")}
              className="font-bold"
            >
              3
            </Button>
            <Button
              variant="secondary"
              onClick={() => addToDisplay("-")}
              className="font-bold"
            >
              -
            </Button>
            <Button
              variant="secondary"
              onClick={calculateFactorial}
              className="font-bold"
            >
              n!
            </Button>

            <Button
              variant="outline"
              onClick={percentage}
              className="font-bold"
            >
              %
            </Button>
            <Button
              variant="outline"
              onClick={() => addToDisplay("0")}
              className="font-bold"
            >
              0
            </Button>
            <Button
              variant="outline"
              onClick={() => addToDisplay(".")}
              className="font-bold"
            >
              .
            </Button>
            <Button
              variant="secondary"
              onClick={() => addToDisplay("+")}
              className="font-bold"
            >
              +
            </Button>
            <Button
              variant="primary"
              onClick={calculate}
              className="bg-[#4CAF50] hover:bg-[#3d9c41] text-white font-bold"
            >
              =
            </Button>
          </div>

          <div className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
            Keyboard shortcuts enabled. Try voice input by clicking the
            microphone!
          </div>
        </div>

        {/* Dashboard */}
        <div
          className={`border rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} shadow-sm overflow-hidden`}
        >
          <div className="flex border-b">
            {["graph", "history", "ai-chat", "converter", "financial"].map(
              (tab) => (
                <button
                  key={tab}
                  className={`px-3 py-2 text-sm font-medium ${activeTab === tab ? "border-b-2 border-[#0197cf] text-[#0197cf]" : "text-gray-500 dark:text-gray-300"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </button>
              ),
            )}
          </div>

          <div className="p-4">
            {/* Graph Tab */}
            {activeTab === "graph" && (
              <div>
                <div className="h-48 md:h-64 relative mb-4">
                  <canvas ref={chartRef} />
                </div>
                <div className="mt-3">
                  <input
                    type="text"
                    value={functionInput}
                    onChange={(e) => setFunctionInput(e.target.value)}
                    placeholder="Enter a function like: x^2, sin(x), etc."
                    className={`w-full p-2 mb-2 rounded border ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white border-gray-300"}`}
                  />
                  <Button
                    onClick={plotFunction}
                    className="w-full bg-[#9575cd] hover:bg-[#8465be] text-white"
                  >
                    Plot Function
                  </Button>
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <div className="max-h-[300px] overflow-y-auto">
                {calculationHistory.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No calculation history yet
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {calculationHistory.map((item, index) => (
                      <li
                        key={index}
                        className={`p-2 flex justify-between items-center ${darkMode ? "border-b border-gray-600 hover:bg-gray-600" : "border-b border-gray-200 hover:bg-gray-50"}`}
                      >
                        <span className="text-sm">
                          {item.expression} {item.result}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDisplayValue(item.result)}
                          className="text-xs h-7 px-2"
                        >
                          Use
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* AI Chat Tab */}
            {activeTab === "ai-chat" && (
              <div>
                <div
                  ref={chatMessagesRef}
                  className={`h-48 md:h-64 overflow-y-auto p-2 mb-3 rounded ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
                >
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-2 max-w-[80%] p-2 rounded-lg ${msg.sender === "user" ? "ml-auto bg-[#0197cf] text-white" : "bg-white dark:bg-gray-700 border"}`}
                    >
                      {msg.content}
                    </div>
                  ))}
                </div>
                <div className="flex mb-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask something about math..."
                    className={`flex-1 p-2 rounded-l border-l border-t border-b ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white border-gray-300"}`}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <Button
                    onClick={sendMessage}
                    className="rounded-l-none bg-[#26c6da] hover:bg-[#22b0c2] text-white"
                  >
                    Send
                  </Button>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">
                    Suggested Questions:
                  </h4>
                  <div className="space-y-1">
                    {[
                      "What is the formula for compound interest?",
                      "How do I calculate standard deviation?",
                      "Explain the quadratic formula",
                    ].map((suggestion, index) => (
                      <div
                        key={index}
                        className={`p-2 text-sm rounded cursor-pointer ${darkMode ? "bg-gray-800 hover:bg-gray-600" : "bg-blue-50 hover:bg-blue-100"}`}
                        onClick={() => selectSuggestion(suggestion)}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Converter Tab */}
            {activeTab === "converter" && (
              <div>
                <h3 className="text-lg font-medium mb-3">Unit Converter</h3>
                <div className="space-y-3">
                  <div className="flex flex-col md:flex-row gap-2">
                    <input
                      type="number"
                      value={fromValue}
                      onChange={(e) => {
                        setFromValue(e.target.value);
                        convertUnits();
                      }}
                      placeholder="Value"
                      className={`flex-1 p-2 rounded border ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white border-gray-300"}`}
                    />
                    <select
                      value={fromUnit}
                      onChange={(e) => {
                        setFromUnit(e.target.value);
                        convertUnits();
                      }}
                      className={`flex-1 p-2 rounded border ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white border-gray-300"}`}
                    >
                      {getUnitOptions()}
                    </select>
                  </div>
                  <div className="flex flex-col md:flex-row gap-2">
                    <input
                      type="number"
                      value={toValue}
                      readOnly
                      placeholder="Result"
                      className={`flex-1 p-2 rounded border ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white border-gray-300"}`}
                    />
                    <select
                      value={toUnit}
                      onChange={(e) => {
                        setToUnit(e.target.value);
                        convertUnits();
                      }}
                      className={`flex-1 p-2 rounded border ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white border-gray-300"}`}
                    >
                      {getUnitOptions()}
                    </select>
                  </div>
                  <Button
                    onClick={convertUnits}
                    className="w-full bg-[#9575cd] hover:bg-[#8465be] text-white"
                  >
                    Convert
                  </Button>

                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Category</h3>
                    <select
                      value={conversionCategory}
                      onChange={(e) => changeConversionCategory(e.target.value)}
                      className={`w-full p-2 rounded border ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white border-gray-300"}`}
                    >
                      <option value="length">Length</option>
                      <option value="weight">Weight/Mass</option>
                      <option value="temperature">Temperature</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Financial Tab */}
            {activeTab === "financial" && (
              <div>
                <h3 className="text-lg font-medium mb-3">Loan Calculator</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Principal Amount
                    </label>
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      placeholder="Loan amount"
                      className={`w-full p-2 rounded border ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white border-gray-300"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Interest Rate (% per year)
                    </label>
                    <input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      placeholder="Annual interest rate"
                      className={`w-full p-2 rounded border ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white border-gray-300"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Loan Term (years)
                    </label>
                    <input
                      type="number"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                      placeholder="Loan term in years"
                      className={`w-full p-2 rounded border ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white border-gray-300"}`}
                    />
                  </div>
                  <Button
                    onClick={calculateLoan}
                    className="w-full bg-[#9575cd] hover:bg-[#8465be] text-white"
                  >
                    Calculate
                  </Button>

                  <div
                    className={`mt-3 p-3 rounded ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
                    dangerouslySetInnerHTML={{ __html: loanResults }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
