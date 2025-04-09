import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUploader from "@/components/admin/FileUploader";

export default function AdminPage() {
  const handleSyllabusUpload = async (file: File) => {
    // In a real implementation, this would upload to a server
    console.log("Uploading syllabus file:", file.name);
    // Simulate API call
    return new Promise<void>((resolve) => setTimeout(resolve, 2000));
  };

  const handleVideoUpload = async (file: File) => {
    // In a real implementation, this would upload to a server
    console.log("Uploading video file:", file.name);
    // Simulate API call
    return new Promise<void>((resolve) => setTimeout(resolve, 2000));
  };

  const handleExamResourceUpload = async (file: File) => {
    // In a real implementation, this would upload to a server
    console.log("Uploading exam resource file:", file.name);
    // Simulate API call
    return new Promise<void>((resolve) => setTimeout(resolve, 2000));
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Welcome to the Admin Dashboard</CardTitle>
          <CardDescription>
            Manage syllabus content, video resources, and exam preparation
            materials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Use the tabs below to upload and manage different types of content
            for the learning platform.
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="syllabus">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          <TabsTrigger value="videos">Video Resources</TabsTrigger>
          <TabsTrigger value="exams">Exam Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="syllabus" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUploader
              title="Upload Syllabus File"
              description="Upload a JSON or XML file containing the South African curriculum structure"
              acceptedFileTypes=".json,.xml"
              onUpload={handleSyllabusUpload}
            />

            <Card>
              <CardHeader>
                <CardTitle>Syllabus Management</CardTitle>
                <CardDescription>
                  Instructions for syllabus file format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  The syllabus file should be structured as follows:
                </p>
                <pre className="bg-muted p-4 rounded-md text-xs overflow-auto">
                  {`{
  "subjects": [
    {
      "name": "Subject Name",
      "grades": [
        {
          "name": "Grade X",
          "topics": [
            {
              "name": "Topic Name",
              "subtopics": [...]
            }
          ]
        }
      ]
    }
  ]
}`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUploader
              title="Upload Video Resource"
              description="Upload video files or provide YouTube links for topics"
              acceptedFileTypes=".mp4,.mov,.avi"
              onUpload={handleVideoUpload}
            />

            <Card>
              <CardHeader>
                <CardTitle>Video Resource Management</CardTitle>
                <CardDescription>
                  Guidelines for video resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                  <li>
                    Videos should be clear and focused on a specific topic
                  </li>
                  <li>Recommended length: 5-15 minutes per concept</li>
                  <li>Include title, description, and topic association</li>
                  <li>Supported formats: MP4, MOV, AVI</li>
                  <li>Maximum file size: 500MB</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="exams" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUploader
              title="Upload Exam Resources"
              description="Upload past papers, study guides, and practice questions"
              acceptedFileTypes=".pdf,.doc,.docx"
              onUpload={handleExamResourceUpload}
            />

            <Card>
              <CardHeader>
                <CardTitle>Exam Resource Management</CardTitle>
                <CardDescription>
                  Guidelines for exam preparation materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                  <li>Include clear topic and grade level in the filename</li>
                  <li>Provide answer keys for past papers when available</li>
                  <li>Organize materials by year and examination period</li>
                  <li>Supported formats: PDF, DOC, DOCX</li>
                  <li>Maximum file size: 50MB</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
