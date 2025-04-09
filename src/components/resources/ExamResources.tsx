import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, BookOpen } from "lucide-react";

interface ExamResource {
  id: string;
  title: string;
  description: string;
  fileSize: string;
  downloadUrl: string;
}

interface ExamResourcesProps {
  topic: {
    id: string;
    name: string;
  } | null;
}

export default function ExamResources({ topic }: ExamResourcesProps) {
  // This would typically come from an API based on the selected topic
  const resources: ExamResource[] = topic
    ? [
        {
          id: "e1",
          title: `${topic.name} Past Exam Papers`,
          description: `Collection of past exam papers for ${topic.name} from 2018-2022.`,
          fileSize: "2.4 MB",
          downloadUrl: "#",
        },
        {
          id: "e2",
          title: `${topic.name} Study Guide`,
          description: `Comprehensive study guide for ${topic.name}.`,
          fileSize: "1.8 MB",
          downloadUrl: "#",
        },
        {
          id: "e3",
          title: `${topic.name} Practice Questions`,
          description: `Practice questions with answers for ${topic.name}.`,
          fileSize: "3.2 MB",
          downloadUrl: "#",
        },
      ]
    : [];

  return (
    <div className="border rounded-md bg-white dark:bg-gray-800 p-4 shadow-md">
      <h2 className="text-xl font-bold mb-4 text-[#0197cf] dark:text-[#01d2ff] flex items-center">
        <BookOpen className="mr-2 h-5 w-5" />
        {topic
          ? `Exam Resources: ${topic.name}`
          : "Select a topic to view exam resources"}
      </h2>

      {resources.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {resources.map((resource) => (
            <Card
              key={resource.id}
              className="border-[#e6f7fc] dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2 bg-[#f5fcff] dark:bg-gray-900">
                <CardTitle className="text-lg flex items-center text-[#0197cf] dark:text-[#01d2ff]">
                  <FileText className="h-5 w-5 mr-2" />
                  {resource.title}
                </CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground bg-[#e6f7fc] dark:bg-gray-700 px-2 py-1 rounded-full">
                    {resource.fileSize}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-[#0197cf] text-[#0197cf] hover:bg-[#0197cf] hover:text-white"
                  >
                    <a href={resource.downloadUrl} download>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-[#0197cf] p-12 bg-[#f5fcff] dark:bg-gray-900 rounded-md">
          {topic
            ? "No exam resources available for this topic yet"
            : "Select a topic to view available exam resources"}
        </div>
      )}
    </div>
  );
}
