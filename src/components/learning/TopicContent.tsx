import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Video,
  FileCheck,
  BookText,
  Lightbulb,
  ArrowRight,
  Plus,
  Trash2,
  Download,
  Edit,
  Save,
  X,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import PracticeTest from "@/components/tests/PracticeTest";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface TopicContentProps {
  topic: {
    id: string;
    name: string;
    content?: string;
    grade?: string;
  } | null;
  onAskQuestion?: () => void;
}

interface Note {
  id: string;
  content: string;
  timestamp: number;
}

interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export default function TopicContent({
  topic,
  onAskQuestion,
}: TopicContentProps) {
  const [contentParts, setContentParts] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [quickNotes, setQuickNotes] = useState<string[]>([]);
  const { user } = useAuth();

  // User notes state
  const [userNotes, setUserNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteContent, setEditNoteContent] = useState("");

  // Practice exercises state
  const [practiceQuestions, setPracticeQuestions] = useState<
    PracticeQuestion[]
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [practiceStarted, setPracticeStarted] = useState(false);

  // Initialize content parts when topic changes
  useEffect(() => {
    if (topic?.content) {
      // Split initial content
      const contentLines = topic.content.split("\n") || [];
      const initialContent = contentLines
        .slice(0, Math.min(6, contentLines.length))
        .join("\n");

      setContentParts([initialContent]);
      setCurrentContentIndex(0);

      // Generate quick notes for the topic
      generateQuickNotes(topic.name);

      // Load saved user notes from localStorage
      loadUserNotes();

      // Generate practice questions
      generatePracticeQuestions();

      // Log the topic and grade for debugging
      console.log(
        `TopicContent - Displaying content for topic: ${topic.name}, Grade: ${topic.grade || "default"}`,
      );

      // If we have a user and topic ID, try to fetch grade-specific content from the database
      if (user && topic.id.includes("-")) {
        fetchGradeSpecificContent(topic.id);
      }
    }
  }, [topic, user]);

  // Fetch grade-specific content from the database
  const fetchGradeSpecificContent = async (topicId: string) => {
    try {
      // Extract the actual topic ID from the combined ID (format: subject-term-topicId)
      const parts = topicId.split("-");
      const actualTopicId = parts[parts.length - 1];

      console.log(
        `Fetching grade-specific content for topic ID: ${actualTopicId}`,
      );

      // Use the database function to get content for the user's grade
      if (user?.id) {
        const { data, error } = await supabase.rpc("get_content_for_grade", {
          p_user_id: user.id,
          p_topic_id: actualTopicId,
        });

        if (error) {
          console.error("Error fetching grade-specific content:", error);
          return;
        }

        if (data && data.length > 0) {
          console.log("Found grade-specific content:", data[0]);
          // Replace the first content part with the grade-specific content
          setContentParts([data[0].content]);
        }
      }
    } catch (error) {
      console.error("Error in fetchGradeSpecificContent:", error);
    }
  };

  // Scroll to the bottom of content when more content is generated
  useEffect(() => {
    if (contentParts.length > 1 && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [contentParts]);

  // Generate quick notes for the topic
  const generateQuickNotes = (topicName: string) => {
    // In a real implementation, this would fetch from an API
    // For now, we'll generate some placeholder notes
    const notes = [
      `Key concept: Understanding the fundamental principles of ${topicName}`,
      `${topicName} is essential for developing critical thinking skills`,
      `Applications of ${topicName} can be found in everyday situations`,
      `The South African curriculum emphasizes mastery of ${topicName}`,
      `Practice problems are crucial for mastering ${topicName}`,
    ];

    setQuickNotes(notes);
  };

  // Load user notes from localStorage
  const loadUserNotes = () => {
    if (!topic) return;

    try {
      const savedNotes = localStorage.getItem(`userNotes-${topic.id}`);
      if (savedNotes) {
        setUserNotes(JSON.parse(savedNotes));
      } else {
        setUserNotes([]);
      }
    } catch (error) {
      console.error("Error loading notes from localStorage:", error);
      setUserNotes([]);
    }
  };

  // Save user notes to localStorage
  const saveUserNotes = (notes: Note[]) => {
    if (!topic) return;

    try {
      localStorage.setItem(`userNotes-${topic.id}`, JSON.stringify(notes));
    } catch (error) {
      console.error("Error saving notes to localStorage:", error);
    }
  };

  // Add a new note
  const addNote = () => {
    if (!newNote.trim() || !topic) return;

    const newNoteObj: Note = {
      id: Date.now().toString(),
      content: newNote,
      timestamp: Date.now(),
    };

    const updatedNotes = [...userNotes, newNoteObj];
    setUserNotes(updatedNotes);
    saveUserNotes(updatedNotes);
    setNewNote("");
  };

  // Delete a note
  const deleteNote = (id: string) => {
    const updatedNotes = userNotes.filter((note) => note.id !== id);
    setUserNotes(updatedNotes);
    saveUserNotes(updatedNotes);
  };

  // Start editing a note
  const startEditNote = (note: Note) => {
    setEditingNoteId(note.id);
    setEditNoteContent(note.content);
  };

  // Save edited note
  const saveEditedNote = () => {
    if (!editingNoteId) return;

    const updatedNotes = userNotes.map((note) =>
      note.id === editingNoteId
        ? { ...note, content: editNoteContent, timestamp: Date.now() }
        : note,
    );

    setUserNotes(updatedNotes);
    saveUserNotes(updatedNotes);
    setEditingNoteId(null);
    setEditNoteContent("");
  };

  // Cancel editing a note
  const cancelEditNote = () => {
    setEditingNoteId(null);
    setEditNoteContent("");
  };

  // Generate PDF of notes
  const generatePDF = () => {
    // In a real implementation, this would use a PDF library
    // For now, we'll just create a text file for download
    if (!topic) return;

    const notesText = userNotes
      .map(
        (note) =>
          `[${new Date(note.timestamp).toLocaleString()}]\n${note.content}\n\n`,
      )
      .join("");

    const quickNotesText = quickNotes.map((note) => `- ${note}\n`).join("");

    const fullText = `# Notes for ${topic.name}\n\n## Quick Notes\n${quickNotesText}\n\n## My Notes\n${notesText}`;

    const blob = new Blob([fullText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topic.name.replace(/\s+/g, "_")}_Notes.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate practice questions appropriate for the user's grade level
  const generatePracticeQuestions = () => {
    if (!topic) return;

    // In a real implementation, this would fetch from an API or database
    // based on the user's grade level (topic.grade)
    const gradeSpecificQuestions: PracticeQuestion[] = [
      {
        id: "1",
        question: `What is the main focus of ${topic.name} in the Grade ${topic.grade || "10"} South African curriculum?`,
        options: [
          "Theoretical understanding only",
          "Practical application and critical thinking",
          "Memorization of facts",
          "Historical context only",
        ],
        correctAnswer: "Practical application and critical thinking",
        explanation: `The South African curriculum for Grade ${topic.grade || "10"} emphasizes both theoretical understanding and practical application of ${topic.name}, with a focus on developing critical thinking skills.`,
      },
      {
        id: "2",
        question: `Which of the following is NOT a key principle of ${topic.name} at the Grade ${topic.grade || "10"} level?`,
        options: [
          "Problem-solving approach",
          "Contextual understanding",
          "Rote learning without application",
          "Real-world connections",
        ],
        correctAnswer: "Rote learning without application",
        explanation: `${topic.name} in the Grade ${topic.grade || "10"} South African curriculum focuses on understanding concepts in context and applying them to real-world situations, rather than rote learning.`,
      },
      {
        id: "3",
        question: `How does ${topic.name} contribute to a Grade ${topic.grade || "10"} learner's overall development?`,
        options: [
          "It only improves subject-specific knowledge",
          "It develops critical thinking and problem-solving skills",
          "It has no impact on other subjects",
          "It only helps with exam preparation",
        ],
        correctAnswer:
          "It develops critical thinking and problem-solving skills",
        explanation: `${topic.name} helps develop transferable skills such as critical thinking, problem-solving, and analytical reasoning that benefit Grade ${topic.grade || "10"} learners across all subjects.`,
      },
    ];

    setPracticeQuestions(gradeSpecificQuestions);

    // In a production app, we would save this interaction to the database
    // to track user learning progress
    const saveProgress = async () => {
      try {
        // This would be implemented to save to user_learning_progress table
        console.log("Saving learning progress for topic:", topic.id);
      } catch (error) {
        console.error("Error saving learning progress:", error);
      }
    };

    saveProgress();
  };

  if (!topic) {
    return (
      <div className="border rounded-md bg-background p-12 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold mb-2">Select a Topic</h2>
        <p className="text-muted-foreground">
          Choose a specific subject and topic from the syllabus to view its
          content.
        </p>
      </div>
    );
  }

  const generateMoreContent = () => {
    setIsGenerating(true);

    // In a real implementation, this would call an API to generate content
    // For now, we'll simulate content generation with a delay
    setTimeout(() => {
      const newIndex = currentContentIndex + 1;
      setCurrentContentIndex(newIndex);

      // Generate new content based on the topic
      const newContent = `
\n\nSection ${newIndex + 1}: Advanced Concepts in ${topic?.name}

As we delve deeper into ${topic?.name}, it's important to understand how these concepts build upon each other. The South African curriculum emphasizes a progressive approach to learning, where foundational knowledge serves as a stepping stone to more complex ideas.

In this section, we'll explore:
• Advanced applications of ${topic?.name} in real-world scenarios
• Problem-solving techniques specific to ${topic?.name}
• Connections between ${topic?.name} and other areas of study
• Historical context and development of ${topic?.name} concepts

Let's begin by examining how ${topic?.name} is applied in various contexts relevant to South African students...
`;

      // Add the new content to our content parts array
      setContentParts((prev) => [...prev, newContent]);
      setIsGenerating(false);
    }, 1500);
  };

  // Combine all content parts to display
  const displayContent = contentParts.join("");

  return (
    <div className="border rounded-md bg-white dark:bg-gray-800 shadow-md overflow-hidden">
      <Tabs defaultValue="lesson">
        <div className="bg-[#f5fcff] dark:bg-gray-900 border-b">
          <div className="container py-3 sm:py-4">
            <h2 className="text-lg sm:text-xl font-bold text-[#0197cf] dark:text-[#01d2ff] mb-2">
              {topic.name}
              {topic.grade && (
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  (Grade {topic.grade})
                </span>
              )}
            </h2>
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="lesson" className="text-xs sm:text-sm">
                Lesson
              </TabsTrigger>
              <TabsTrigger value="videos" className="text-xs sm:text-sm">
                Videos
              </TabsTrigger>
              <TabsTrigger value="practice" className="text-xs sm:text-sm">
                Practice
              </TabsTrigger>
              <TabsTrigger value="tests" className="text-xs sm:text-sm">
                Tests
              </TabsTrigger>
              <TabsTrigger value="exams" className="text-xs sm:text-sm">
                Past Papers
              </TabsTrigger>
              <TabsTrigger value="notes" className="text-xs sm:text-sm">
                Quick Notes
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="lesson" className="p-6">
          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            <div
              className="prose dark:prose-invert max-w-none"
              ref={contentRef}
            >
              <div className="whitespace-pre-line">{displayContent}</div>
              <div className="mt-4 flex space-x-3 sticky bottom-0 bg-white dark:bg-gray-800 py-3">
                <Button
                  onClick={generateMoreContent}
                  disabled={isGenerating}
                  className="bg-[#0197cf] hover:bg-[#01729b] text-white"
                >
                  {isGenerating ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate More <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                <Button
                  className="bg-[#0197cf] hover:bg-[#01729b] text-white"
                  onClick={() => {
                    // Log the topic and grade for debugging
                    console.log(
                      `Asking question about topic: ${topic.name}, Grade: ${topic.grade}`,
                    );
                    if (onAskQuestion) onAskQuestion();
                  }}
                >
                  Ask a Question <Lightbulb className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="videos" className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-t-md relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="h-12 w-12 text-[#0197cf] opacity-50" />
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {topic.name} - Introduction
                </CardTitle>
                <CardDescription>Basic concepts and examples</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Watch Video
                </Button>
              </CardContent>
            </Card>

            <Card>
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-t-md relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="h-12 w-12 text-[#0197cf] opacity-50" />
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {topic.name} - Advanced
                </CardTitle>
                <CardDescription>
                  Detailed explanations and applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Watch Video
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="practice" className="p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileCheck className="mr-2 h-5 w-5 text-[#0197cf]" />
                Practice Exercises
              </CardTitle>
              <CardDescription>
                Test your understanding of {topic.name} with these practice
                questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!practiceStarted ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <p className="font-medium mb-2">Quick Practice Questions</p>
                    <p className="text-muted-foreground mb-4">
                      Test your knowledge with {practiceQuestions.length}{" "}
                      questions about {topic.name}
                    </p>
                    <Button
                      className="bg-[#0197cf] hover:bg-[#01729b] text-white"
                      onClick={() => {
                        setPracticeStarted(true);
                        setCurrentQuestionIndex(0);
                        setSelectedAnswer(null);
                        setShowFeedback(false);
                      }}
                    >
                      Start Practice
                    </Button>
                  </div>

                  <div className="p-4 border rounded-md">
                    <p className="font-medium mb-2">Interactive Exercises</p>
                    <p className="text-muted-foreground mb-4">
                      Hands-on activities to reinforce your learning
                    </p>
                    <Button className="bg-[#0197cf] hover:bg-[#01729b] text-white">
                      Try Interactive Exercises
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Question progress */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Question {currentQuestionIndex + 1} of{" "}
                      {practiceQuestions.length}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPracticeStarted(false)}
                    >
                      Exit Practice
                    </Button>
                  </div>

                  {/* Current question */}
                  {practiceQuestions.length > 0 && (
                    <div className="space-y-4">
                      <div className="p-4 bg-[#f5fcff] dark:bg-gray-900 rounded-md">
                        <p className="font-medium mb-4">
                          {practiceQuestions[currentQuestionIndex].question}
                        </p>

                        <div className="space-y-2">
                          {practiceQuestions[currentQuestionIndex].options.map(
                            (option, index) => (
                              <div
                                key={index}
                                className={`p-3 border rounded-md cursor-pointer transition-colors ${selectedAnswer === option ? "border-[#0197cf] bg-[#f0f9ff] dark:bg-gray-800" : "hover:border-[#0197cf]"}`}
                                onClick={() => {
                                  if (!showFeedback) {
                                    setSelectedAnswer(option);
                                  }
                                }}
                              >
                                <div className="flex items-start">
                                  <div
                                    className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 ${selectedAnswer === option ? "border-[#0197cf] bg-[#0197cf] text-white" : ""}`}
                                  >
                                    {selectedAnswer === option && (
                                      <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                  </div>
                                  <span>{option}</span>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      {/* Check answer button */}
                      {!showFeedback ? (
                        <Button
                          className="w-full bg-[#0197cf] hover:bg-[#01729b] text-white"
                          disabled={!selectedAnswer}
                          onClick={() => {
                            setShowFeedback(true);
                            setIsCorrect(
                              selectedAnswer ===
                                practiceQuestions[currentQuestionIndex]
                                  .correctAnswer,
                            );
                          }}
                        >
                          Check Answer
                        </Button>
                      ) : (
                        <div className="space-y-4">
                          {/* Feedback */}
                          <div
                            className={`p-4 rounded-md ${isCorrect ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900" : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900"}`}
                          >
                            <div className="flex items-start">
                              {isCorrect ? (
                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0" />
                              )}
                              <div>
                                <p className="font-medium">
                                  {isCorrect ? "Correct!" : "Incorrect"}
                                </p>
                                <p className="text-sm mt-1">
                                  {
                                    practiceQuestions[currentQuestionIndex]
                                      .explanation
                                  }
                                </p>
                                {!isCorrect && (
                                  <p className="text-sm mt-2 font-medium">
                                    Correct answer:{" "}
                                    {
                                      practiceQuestions[currentQuestionIndex]
                                        .correctAnswer
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Next question button */}
                          <Button
                            className="w-full bg-[#0197cf] hover:bg-[#01729b] text-white"
                            onClick={() => {
                              if (
                                currentQuestionIndex <
                                practiceQuestions.length - 1
                              ) {
                                setCurrentQuestionIndex((prev) => prev + 1);
                                setSelectedAnswer(null);
                                setShowFeedback(false);
                              } else {
                                // End of practice
                                setPracticeStarted(false);
                              }
                            }}
                          >
                            {currentQuestionIndex < practiceQuestions.length - 1
                              ? "Next Question"
                              : "Finish Practice"}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="p-6">
          <PracticeTest topic={topic} />
        </TabsContent>

        <TabsContent value="exams" className="p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookText className="mr-2 h-5 w-5 text-[#0197cf]" />
                Past Exam Papers
              </CardTitle>
              <CardDescription>
                Practice with previous exam questions on {topic.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-medium">2023 Exam Paper</p>
                    <p className="text-sm text-muted-foreground">
                      Questions related to {topic.name}
                    </p>
                  </div>
                  <Button variant="outline">Download</Button>
                </div>

                <div className="p-4 border rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-medium">2022 Exam Paper</p>
                    <p className="text-sm text-muted-foreground">
                      Questions related to {topic.name}
                    </p>
                  </div>
                  <Button variant="outline">Download</Button>
                </div>

                <div className="p-4 border rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-medium">Sample Answers</p>
                    <p className="text-sm text-muted-foreground">
                      Model answers for common questions
                    </p>
                  </div>
                  <Button variant="outline">Download</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quick Notes Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5 text-[#0197cf]" />
                  Quick Notes
                </CardTitle>
                <CardDescription>
                  Key points to remember about {topic.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-[#f5fcff] dark:bg-gray-900 rounded-md">
                  <ul className="list-disc pl-5 space-y-2">
                    {quickNotes.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* My Notes Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Edit className="mr-2 h-5 w-5 text-[#0197cf]" />
                  My Notes
                </CardTitle>
                <CardDescription>
                  Add your own notes about {topic.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add new note */}
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add your notes here..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <Button
                      onClick={addNote}
                      className="w-full bg-[#0197cf] hover:bg-[#01729b] text-white"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Note
                    </Button>
                  </div>

                  {/* List of user notes */}
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    <div className="space-y-4">
                      {userNotes.length === 0 ? (
                        <p className="text-center text-muted-foreground">
                          No notes yet. Add your first note above!
                        </p>
                      ) : (
                        userNotes.map((note) => (
                          <div key={note.id} className="p-3 border rounded-md">
                            {editingNoteId === note.id ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={editNoteContent}
                                  onChange={(e) =>
                                    setEditNoteContent(e.target.value)
                                  }
                                  className="min-h-[80px]"
                                />
                                <div className="flex space-x-2">
                                  <Button
                                    onClick={saveEditedNote}
                                    size="sm"
                                    className="bg-[#0197cf] hover:bg-[#01729b] text-white"
                                  >
                                    <Save className="mr-1 h-3 w-3" /> Save
                                  </Button>
                                  <Button
                                    onClick={cancelEditNote}
                                    size="sm"
                                    variant="outline"
                                  >
                                    <X className="mr-1 h-3 w-3" /> Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(note.timestamp).toLocaleString()}
                                  </span>
                                  <div className="flex space-x-1">
                                    <Button
                                      onClick={() => startEditNote(note)}
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      onClick={() => deleteNote(note.id)}
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0 text-destructive"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                <p className="whitespace-pre-line text-sm">
                                  {note.content}
                                </p>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={generatePDF}
                  disabled={userNotes.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" /> Download Notes
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
