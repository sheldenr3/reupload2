import { useState } from "react";
import SyllabusTree from "@/components/syllabus/SyllabusTree";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoResources from "@/components/resources/VideoResources";
import ExamResources from "@/components/resources/ExamResources";
import { Search } from "lucide-react";

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

import { useAuth } from "@/contexts/AuthContext";

export default function ResourcesPage() {
  const { profile } = useAuth();
  const userGrade = profile?.grade || "10";
  const [selectedTopic, setSelectedTopic] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleSelectTopic = (topic: any) => {
    if (topic.type === "file") {
      setSelectedTopic({
        id: topic.id,
        name: topic.name,
      });
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Learning Resources</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search resources..."
                className="pl-10 pr-4 py-2 rounded-md text-sm bg-white dark:bg-gray-800 w-full border focus:outline-none focus:ring-2 focus:ring-[#0197cf]"
              />
            </div>
          </div>
          <SyllabusTree
            data={sampleSyllabusData.map((subject) => ({
              ...subject,
              children: subject.children.filter((grade) => {
                // Only show content for the user's grade
                const gradeNumber = grade.name.replace("Grade ", "");
                return gradeNumber === userGrade;
              }),
            }))}
            onSelectTopic={handleSelectTopic}
          />
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="videos">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="videos">Video Lessons</TabsTrigger>
              <TabsTrigger value="exams">Exam Preparation</TabsTrigger>
            </TabsList>
            <TabsContent value="videos" className="mt-4">
              <VideoResources topic={selectedTopic} />
            </TabsContent>
            <TabsContent value="exams" className="mt-4">
              <ExamResources topic={selectedTopic} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
