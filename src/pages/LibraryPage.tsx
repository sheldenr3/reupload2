import { useState, useEffect } from "react";
import SyllabusTree from "@/components/syllabus/SyllabusTree";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Globe,
  GraduationCap,
  Search,
  ArrowRight,
} from "lucide-react";

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

export default function LibraryPage() {
  const [selectedTopic, setSelectedTopic] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Supabase client
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const handleSelectTopic = async (topic: any) => {
    if (topic.type === "file") {
      setLoading(true);
      setError(null);
      try {
        // In a real app, you would fetch library resources for this topic from Supabase
        // For now, we'll just set the selected topic directly
        setSelectedTopic({
          id: topic.id,
          name: topic.name,
        });
      } catch (err) {
        console.error("Error fetching library resources:", err);
        setError("Failed to load library resources. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">World Library</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search global resources..."
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
          <Tabs defaultValue="global">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="global">Global Resources</TabsTrigger>
              <TabsTrigger value="interactive">
                Interactive Learning
              </TabsTrigger>
              <TabsTrigger value="research">Research Papers</TabsTrigger>
            </TabsList>

            <TabsContent value="global" className="mt-4">
              {loading ? (
                <div className="border rounded-md bg-white dark:bg-gray-800 shadow-md p-6 flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0197cf]"></div>
                </div>
              ) : error ? (
                <div className="border rounded-md bg-white dark:bg-gray-800 shadow-md p-6 text-center text-red-500">
                  {error}
                  <Button
                    onClick={() => setError(null)}
                    className="mt-4 bg-[#0197cf] hover:bg-[#01729b]"
                  >
                    Try Again
                  </Button>
                </div>
              ) : selectedTopic ? (
                <div className="border rounded-md bg-white dark:bg-gray-800 shadow-md p-6">
                  <h2 className="text-xl font-bold text-[#0197cf] dark:text-[#01d2ff] mb-4">
                    Global Resources for {selectedTopic.name}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-lg">
                          <Globe className="mr-2 h-5 w-5 text-[#0197cf]" />
                          Khan Academy
                        </CardTitle>
                        <CardDescription>
                          Free world-class education
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">
                          Comprehensive lessons on {selectedTopic.name} with
                          interactive exercises
                        </p>
                        <Button className="w-full bg-[#0197cf] hover:bg-[#01729b]">
                          Access Resources{" "}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-lg">
                          <BookOpen className="mr-2 h-5 w-5 text-[#0197cf]" />
                          MIT OpenCourseWare
                        </CardTitle>
                        <CardDescription>
                          University-level materials
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">
                          Advanced learning materials on {selectedTopic.name}{" "}
                          from MIT
                        </p>
                        <Button className="w-full bg-[#0197cf] hover:bg-[#01729b]">
                          Access Resources{" "}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-lg">
                          <GraduationCap className="mr-2 h-5 w-5 text-[#0197cf]" />
                          Global Curriculum Comparison
                        </CardTitle>
                        <CardDescription>
                          How {selectedTopic.name} is taught worldwide
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">
                          Compare how {selectedTopic.name} is taught in
                          different educational systems around the world,
                          including approaches from Finland, Singapore, and
                          other top-performing countries.
                        </p>
                        <Button className="w-full bg-[#0197cf] hover:bg-[#01729b]">
                          View Comparison{" "}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="border rounded-md bg-background p-12 flex flex-col items-center justify-center text-center">
                  <h2 className="text-xl font-semibold mb-2">Select a Topic</h2>
                  <p className="text-muted-foreground">
                    Choose a specific subject and topic from the syllabus to
                    view global resources.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="interactive" className="mt-4">
              {loading ? (
                <div className="border rounded-md bg-white dark:bg-gray-800 shadow-md p-6 flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0197cf]"></div>
                </div>
              ) : error ? (
                <div className="border rounded-md bg-white dark:bg-gray-800 shadow-md p-6 text-center text-red-500">
                  {error}
                  <Button
                    onClick={() => setError(null)}
                    className="mt-4 bg-[#0197cf] hover:bg-[#01729b]"
                  >
                    Try Again
                  </Button>
                </div>
              ) : selectedTopic ? (
                <div className="border rounded-md bg-white dark:bg-gray-800 shadow-md p-6">
                  <h2 className="text-xl font-bold text-[#0197cf] dark:text-[#01d2ff] mb-4">
                    Interactive Learning for {selectedTopic.name}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          Interactive Simulations
                        </CardTitle>
                        <CardDescription>Learn by doing</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">
                          Explore {selectedTopic.name} through interactive
                          simulations
                        </p>
                        <Button className="w-full bg-[#0197cf] hover:bg-[#01729b]">
                          Launch Simulation
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Virtual Labs</CardTitle>
                        <CardDescription>
                          Hands-on virtual experiments
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">
                          Conduct virtual experiments related to{" "}
                          {selectedTopic.name}
                        </p>
                        <Button className="w-full bg-[#0197cf] hover:bg-[#01729b]">
                          Enter Virtual Lab
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="border rounded-md bg-background p-12 flex flex-col items-center justify-center text-center">
                  <h2 className="text-xl font-semibold mb-2">Select a Topic</h2>
                  <p className="text-muted-foreground">
                    Choose a specific subject and topic to access interactive
                    learning materials.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="research" className="mt-4">
              {loading ? (
                <div className="border rounded-md bg-white dark:bg-gray-800 shadow-md p-6 flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0197cf]"></div>
                </div>
              ) : error ? (
                <div className="border rounded-md bg-white dark:bg-gray-800 shadow-md p-6 text-center text-red-500">
                  {error}
                  <Button
                    onClick={() => setError(null)}
                    className="mt-4 bg-[#0197cf] hover:bg-[#01729b]"
                  >
                    Try Again
                  </Button>
                </div>
              ) : selectedTopic ? (
                <div className="border rounded-md bg-white dark:bg-gray-800 shadow-md p-6">
                  <h2 className="text-xl font-bold text-[#0197cf] dark:text-[#01d2ff] mb-4">
                    Research Papers on {selectedTopic.name}
                  </h2>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          Recent Research
                        </CardTitle>
                        <CardDescription>
                          Latest academic papers
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          <li className="p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                            <p className="font-medium">
                              Advances in {selectedTopic.name} Education
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Journal of Education Research, 2023
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                            >
                              View Paper
                            </Button>
                          </li>
                          <li className="p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                            <p className="font-medium">
                              Teaching {selectedTopic.name} in the Digital Age
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Educational Technology Journal, 2022
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                            >
                              View Paper
                            </Button>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="border rounded-md bg-background p-12 flex flex-col items-center justify-center text-center">
                  <h2 className="text-xl font-semibold mb-2">Select a Topic</h2>
                  <p className="text-muted-foreground">
                    Choose a specific subject and topic to view related research
                    papers.
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
