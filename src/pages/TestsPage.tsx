import { useState } from "react";
import SyllabusTree from "@/components/syllabus/SyllabusTree";
import TestGenerator from "@/components/tests/TestGenerator";
import { Search, ListChecks } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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

export default function TestsPage() {
  const { profile } = useAuth();
  const userGrade = profile?.grade || "10";
  const [testType, setTestType] = useState<string>("mcq");

  console.log("TestsPage - User profile:", {
    profileGrade: profile?.grade,
    userGrade,
  });
  const [selectedTopic, setSelectedTopic] = useState<{
    id: string;
    name: string;
    grade?: string;
  } | null>(null);

  const handleSelectTopic = (topic: any) => {
    if (topic.type === "file") {
      setSelectedTopic({
        id: topic.id,
        name: topic.name,
        grade: userGrade,
      });
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Test Generator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tests..."
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
            userGrade={userGrade}
          />
        </div>

        <div className="lg:col-span-2">
          {selectedTopic && (
            <div className="flex flex-wrap items-center gap-3 p-4 bg-[#f5fcff] dark:bg-gray-800 rounded-md border border-[#e6f7fc] dark:border-gray-700 mb-4">
              <div className="flex items-center">
                <ListChecks className="mr-2 h-5 w-5 text-[#0197cf]" />
                <span className="font-medium">Test Type:</span>
              </div>
              <RadioGroup
                value={testType}
                onValueChange={setTestType}
                className="flex flex-wrap gap-2"
              >
                <div className="flex items-center space-x-2 border p-2 rounded-md hover:bg-white dark:hover:bg-gray-700 cursor-pointer bg-white dark:bg-gray-700">
                  <RadioGroupItem value="mcq" id="page-test-mcq" />
                  <Label
                    htmlFor="page-test-mcq"
                    className="cursor-pointer whitespace-nowrap"
                  >
                    Multiple Choice
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-2 rounded-md hover:bg-white dark:hover:bg-gray-700 cursor-pointer bg-white dark:bg-gray-700">
                  <RadioGroupItem value="question" id="page-test-question" />
                  <Label
                    htmlFor="page-test-question"
                    className="cursor-pointer whitespace-nowrap"
                  >
                    Short Answer
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-2 rounded-md hover:bg-white dark:hover:bg-gray-700 cursor-pointer bg-white dark:bg-gray-700">
                  <RadioGroupItem value="matching" id="page-test-matching" />
                  <Label
                    htmlFor="page-test-matching"
                    className="cursor-pointer whitespace-nowrap"
                  >
                    Matching
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-2 rounded-md hover:bg-white dark:hover:bg-gray-700 cursor-pointer bg-white dark:bg-gray-700">
                  <RadioGroupItem value="truefalse" id="page-test-truefalse" />
                  <Label
                    htmlFor="page-test-truefalse"
                    className="cursor-pointer whitespace-nowrap"
                  >
                    True/False
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}
          <TestGenerator topic={selectedTopic} initialTestType={testType} />
        </div>
      </div>
    </div>
  );
}
