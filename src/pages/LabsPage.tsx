import { useState } from "react";
import SyllabusTree from "@/components/syllabus/SyllabusTree";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Beaker,
  Microscope,
  FlaskConical,
  Search,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Import the simulation and experiment components
import InteractiveSimulation from "@/components/labs/InteractiveSimulation";
import VirtualExperiment from "@/components/labs/VirtualExperiment";
import AICalculator from "@/components/labs/AICalculator";

// Sample data - in a real app, this would come from an API
const sampleSyllabusData = [
  {
    id: "math",
    name: "Mathematics",
    type: "folder",
    children: [
      {
        id: "math-g10",
        name: "Grade 10",
        type: "folder",
        children: [
          {
            id: "math-g10-algebra",
            name: "Algebra",
            type: "folder",
            children: [
              {
                id: "math-g10-algebra-expressions",
                name: "Expressions",
                type: "file",
              },
              {
                id: "math-g10-algebra-equations",
                name: "Equations",
                type: "file",
              },
            ],
          },
          {
            id: "math-g10-geometry",
            name: "Geometry",
            type: "folder",
            children: [
              {
                id: "math-g10-geometry-triangles",
                name: "Triangles",
                type: "file",
              },
              {
                id: "math-g10-geometry-circles",
                name: "Circles",
                type: "file",
              },
            ],
          },
        ],
      },
      {
        id: "math-g11",
        name: "Grade 11",
        type: "folder",
        children: [
          { id: "math-g11-functions", name: "Functions", type: "file" },
          { id: "math-g11-trigonometry", name: "Trigonometry", type: "file" },
        ],
      },
    ],
  },
  {
    id: "science",
    name: "Physical Sciences",
    type: "folder",
    children: [
      {
        id: "science-g10",
        name: "Grade 10",
        type: "folder",
        children: [
          {
            id: "science-g10-matter",
            name: "Matter and Materials",
            type: "file",
          },
          {
            id: "science-g10-waves",
            name: "Waves, Sound and Light",
            type: "file",
          },
        ],
      },
      {
        id: "science-g11",
        name: "Grade 11",
        type: "folder",
        children: [
          { id: "science-g11-mechanics", name: "Mechanics", type: "file" },
          { id: "science-g11-chemical", name: "Chemical Change", type: "file" },
        ],
      },
    ],
  },
];

export default function LabsPage() {
  const [selectedTopic, setSelectedTopic] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for tools section
  const [showCalculator, setShowCalculator] = useState(false);

  // State for simulations section
  const [showSimulation, setShowSimulation] = useState(false);
  const [simulationType, setSimulationType] = useState<"basic" | "advanced">(
    "basic",
  );

  // State for experiments section
  const [showExperiment, setShowExperiment] = useState(false);
  const [experimentNumber, setExperimentNumber] = useState(1);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const handleSelectTopic = async (topic: any) => {
    if (topic.type === "file") {
      setLoading(true);
      setError(null);
      try {
        setSelectedTopic({ id: topic.id, name: topic.name });
        // Reset all views when selecting a new topic
        setShowCalculator(false);
        setShowSimulation(false);
        setShowExperiment(false);
      } catch (err) {
        console.error("Error fetching lab data:", err);
        setError("Failed to load lab data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Handler for launching simulations
  const handleLaunchSimulation = (type: "basic" | "advanced") => {
    setSimulationType(type);
    setShowSimulation(true);
  };

  // Handler for starting experiments
  const handleStartExperiment = (experimentNum: number) => {
    setExperimentNumber(experimentNum);
    setShowExperiment(true);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Virtual Labs</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search labs..."
                className="pl-10 pr-4 py-2 rounded-md text-sm bg-white dark:bg-gray-800 w-full border focus:outline-none focus:ring-2 focus:ring-[#0197cf]"
              />
            </div>
          </div>
          <SyllabusTree
            data={sampleSyllabusData}
            onSelectTopic={handleSelectTopic}
          />
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="simulations">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="simulations">Simulations</TabsTrigger>
              <TabsTrigger value="experiments">Virtual Experiments</TabsTrigger>
              <TabsTrigger value="tools">Interactive Tools</TabsTrigger>
            </TabsList>

            {/* Simulations Tab */}
            <TabsContent value="simulations" className="mt-4">
              {loading ? (
                <div className="h-64 flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0197cf]" />
                </div>
              ) : error ? (
                <div className="text-center text-red-500 p-6 border rounded-md">
                  {error}
                  <Button
                    onClick={() => setError(null)}
                    className="mt-4 bg-[#0197cf] hover:bg-[#01729b]"
                  >
                    Try Again
                  </Button>
                </div>
              ) : selectedTopic ? (
                showSimulation ? (
                  <InteractiveSimulation
                    topic={selectedTopic}
                    simulationType={simulationType}
                    onBack={() => setShowSimulation(false)}
                  />
                ) : (
                  <div className="border rounded-md p-6 shadow-md bg-white dark:bg-gray-800">
                    <h2 className="text-xl font-bold text-[#0197cf] mb-4">
                      Simulations for {selectedTopic.name}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <div className="aspect-video bg-slate-100 dark:bg-slate-800 flex justify-center items-center">
                          <Beaker className="h-12 w-12 text-[#0197cf] opacity-50" />
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">
                            {selectedTopic.name} Simulation
                          </CardTitle>
                          <CardDescription>
                            Interactive learning experience
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm mb-3">
                            Explore {selectedTopic.name} concepts through this
                            interactive simulation
                          </p>
                          <Button
                            className="w-full bg-[#0197cf] hover:bg-[#01729b]"
                            onClick={() => handleLaunchSimulation("basic")}
                          >
                            Launch Simulation{" "}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <div className="aspect-video bg-slate-100 dark:bg-slate-800 flex justify-center items-center">
                          <FlaskConical className="h-12 w-12 text-[#0197cf] opacity-50" />
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">
                            Advanced {selectedTopic.name} Simulation
                          </CardTitle>
                          <CardDescription>
                            For deeper understanding
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm mb-3">
                            Dive deeper into {selectedTopic.name} with this
                            advanced simulation
                          </p>
                          <Button
                            className="w-full bg-[#0197cf] hover:bg-[#01729b]"
                            onClick={() => handleLaunchSimulation("advanced")}
                          >
                            Launch Simulation{" "}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )
              ) : (
                <div className="border rounded-md bg-background p-12 text-center">
                  <h2 className="text-xl font-semibold mb-2">Select a Topic</h2>
                  <p className="text-muted-foreground">
                    Choose a topic to access related simulations.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Experiments Tab */}
            <TabsContent value="experiments" className="mt-4">
              {loading ? (
                <div className="h-64 flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0197cf]" />
                </div>
              ) : error ? (
                <div className="text-center text-red-500 p-6 border rounded-md">
                  {error}
                  <Button
                    onClick={() => setError(null)}
                    className="mt-4 bg-[#0197cf] hover:bg-[#01729b]"
                  >
                    Try Again
                  </Button>
                </div>
              ) : selectedTopic ? (
                showExperiment ? (
                  <VirtualExperiment
                    topic={selectedTopic}
                    experimentNumber={experimentNumber}
                    onBack={() => setShowExperiment(false)}
                  />
                ) : (
                  <div className="p-6 border rounded-md bg-white dark:bg-gray-800 shadow-md">
                    <h2 className="text-xl font-bold text-[#0197cf] mb-4">
                      Virtual Experiments for {selectedTopic.name}
                    </h2>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Microscope className="mr-2 h-5 w-5 text-[#0197cf]" />
                          Available Experiments
                        </CardTitle>
                        <CardDescription>
                          Hands-on virtual experiments for {selectedTopic.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 border rounded-md">
                          <p className="font-medium mb-2">
                            Experiment 1: Introduction to {selectedTopic.name}
                          </p>
                          <p className="text-sm text-muted-foreground mb-4">
                            A beginner-friendly experiment to understand the
                            basics
                          </p>
                          <Button
                            className="bg-[#0197cf] hover:bg-[#01729b] text-white"
                            onClick={() => handleStartExperiment(1)}
                          >
                            Start Experiment
                          </Button>
                        </div>
                        <div className="p-4 border rounded-md">
                          <p className="font-medium mb-2">
                            Experiment 2: Advanced {selectedTopic.name} Concepts
                          </p>
                          <p className="text-sm text-muted-foreground mb-4">
                            Explore complex concepts through this comprehensive
                            experiment
                          </p>
                          <Button
                            className="bg-[#0197cf] hover:bg-[#01729b] text-white"
                            onClick={() => handleStartExperiment(2)}
                          >
                            Start Experiment
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
              ) : (
                <div className="border rounded-md bg-background p-12 text-center">
                  <h2 className="text-xl font-semibold mb-2">Select a Topic</h2>
                  <p className="text-muted-foreground">
                    Choose a topic to access virtual experiments.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools" className="mt-4">
              {loading ? (
                <div className="h-64 flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0197cf]" />
                </div>
              ) : error ? (
                <div className="text-center text-red-500 p-6 border rounded-md">
                  {error}
                  <Button
                    onClick={() => setError(null)}
                    className="mt-4 bg-[#0197cf] hover:bg-[#01729b]"
                  >
                    Try Again
                  </Button>
                </div>
              ) : selectedTopic ? (
                showCalculator ? (
                  <AICalculator onBack={() => setShowCalculator(false)} />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">AI Calculator</CardTitle>
                        <CardDescription>
                          Solve problems instantly
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">
                          A smart AI-powered calculator for {selectedTopic.name}
                        </p>
                        <Button
                          className="w-full bg-[#0197cf] hover:bg-[#01729b]"
                          onClick={() => setShowCalculator(true)}
                        >
                          Open AI Calculator
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          {selectedTopic.name} Visualizer
                        </CardTitle>
                        <CardDescription>
                          See concepts in action
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">
                          Visualize {selectedTopic.name} concepts with this
                          interactive tool
                        </p>
                        <Button
                          className="w-full bg-[#0197cf] hover:bg-[#01729b]"
                          onClick={() => handleLaunchSimulation("basic")}
                        >
                          Open Visualizer
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )
              ) : (
                <div className="border rounded-md bg-background p-12 text-center">
                  <h2 className="text-xl font-semibold mb-2">Select a Topic</h2>
                  <p className="text-muted-foreground">
                    Choose a specific subject and topic to access interactive
                    tools.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
