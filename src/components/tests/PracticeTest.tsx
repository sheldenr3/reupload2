import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, XCircle, Clock, Award } from "lucide-react";
import { usePoints } from "@/contexts/PointsContext";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface PracticeTestProps {
  topic: {
    id: string;
    name: string;
  } | null;
}

export default function PracticeTest({ topic }: PracticeTestProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  const { toast } = useToast();
  const { addPoints } = usePoints();

  // Generate questions based on the topic
  useEffect(() => {
    if (topic) {
      setLoading(true);
      generateQuestionsForTopic(topic.id, topic.name)
        .then((generatedQuestions) => {
          setQuestions(generatedQuestions);
          setAnswers(new Array(generatedQuestions.length).fill(null));
          setCurrentQuestionIndex(0);
          setSelectedOption(null);
          setShowResults(false);
          setTimeLeft(300);
          setTimerActive(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [topic]);

  // Timer countdown
  useEffect(() => {
    let interval: number | undefined;

    if (timerActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showResults) {
      // Time's up, show results
      handleFinishTest();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft, showResults]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) {
      toast({
        title: "Please select an answer",
        description: "You need to select an option before proceeding",
        variant: "destructive",
      });
      return;
    }

    // Save the answer
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setAnswers(newAnswers);

    // Move to next question or finish
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      handleFinishTest();
    }
  };

  const handleFinishTest = () => {
    setTimerActive(false);

    // Save the last answer if not already saved
    if (selectedOption !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = selectedOption;
      setAnswers(newAnswers);
    }

    setShowResults(true);

    // Calculate score and award points
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    const earnedPoints = Math.round((score / questions.length) * 20);
    addPoints(earnedPoints);

    // Determine performance level
    let performanceMessage = "";
    if (percentage >= 90) {
      performanceMessage = "Excellent! You've mastered this topic.";
    } else if (percentage >= 70) {
      performanceMessage =
        "Good job! You have a solid understanding of this topic.";
    } else if (percentage >= 50) {
      performanceMessage =
        "You're on the right track. Keep practicing to improve.";
    } else {
      performanceMessage = "This topic needs more review. Don't give up!";
    }

    toast({
      title: "Test completed!",
      description: `You scored ${percentage}% and earned ${earnedPoints} points! ${performanceMessage}`,
    });
  };

  const calculateScore = () => {
    let correctCount = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].correctAnswer) {
        correctCount++;
      }
    }
    return correctCount;
  };

  const handleRetakeTest = () => {
    // Reset the test
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers(new Array(questions.length).fill(null));
    setShowResults(false);
    setTimeLeft(300);
    setTimerActive(true);
  };

  // Generate questions based on topic using AI
  const generateQuestionsForTopic = async (
    topicId: string,
    topicName: string,
  ): Promise<Question[]> => {
    setLoading(true);
    try {
      // Use the OpenAI integration to generate questions
      const prompt = `Generate 5 multiple-choice questions about ${topicName} specifically aligned with the South African CAPS curriculum. 
      Each question should have 4 options with one correct answer. 
      The questions should be grade-appropriate, contextually relevant to South African students, and cover key concepts from the official curriculum.
      Include questions that test understanding, application, and critical thinking skills related to ${topicName}.
      Format the response as a JSON array with objects containing: 
      id, text, options (array of 4 strings), and correctAnswer (index 0-3).
      Make sure the questions are factually accurate and aligned with South African educational standards.`;

      // Use the existing OpenAI integration
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, topic: topicName }),
      }).catch(() => null);

      // If API call fails, use fallback questions
      if (!response || !response.ok) {
        return generateFallbackQuestions(topicId, topicName);
      }

      const data = await response.json();
      if (
        data.questions &&
        Array.isArray(data.questions) &&
        data.questions.length > 0
      ) {
        return data.questions;
      }

      // Fallback if response format is incorrect
      return generateFallbackQuestions(topicId, topicName);
    } catch (error) {
      console.error("Error generating questions:", error);
      return generateFallbackQuestions(topicId, topicName);
    }
  };

  // Fallback questions if AI generation fails
  const generateFallbackQuestions = async (
    topicId: string,
    topicName: string,
  ): Promise<Question[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate 5 questions based on topic
    return [
      {
        id: `${topicId}-q1`,
        text: `What is the main concept of ${topicName}?`,
        options: [
          `The fundamental principles of ${topicName}`,
          `The historical development of ${topicName}`,
          `The practical applications of ${topicName}`,
          `The theoretical framework of ${topicName}`,
        ],
        correctAnswer: 0,
      },
      {
        id: `${topicId}-q2`,
        text: `Which of the following is NOT related to ${topicName}?`,
        options: [
          `Core concepts of ${topicName}`,
          `Advanced applications of ${topicName}`,
          `Unrelated subject matter`,
          `Historical context of ${topicName}`,
        ],
        correctAnswer: 2,
      },
      {
        id: `${topicId}-q3`,
        text: `In what year was the modern understanding of ${topicName} established?`,
        options: ["1905", "1923", "1947", "1962"],
        correctAnswer: 1,
      },
      {
        id: `${topicId}-q4`,
        text: `Which scientist/mathematician made the most significant contribution to ${topicName}?`,
        options: [
          "Albert Einstein",
          "Isaac Newton",
          "Niels Bohr",
          "Marie Curie",
        ],
        correctAnswer: 3,
      },
      {
        id: `${topicId}-q5`,
        text: `What is the practical application of ${topicName} in modern technology?`,
        options: [
          "Smartphone development",
          "Renewable energy",
          "Medical diagnostics",
          "All of the above",
        ],
        correctAnswer: 3,
      },
    ];
  };

  if (!topic) {
    return (
      <Card className="w-full border-[#e6f7fc] dark:border-gray-700 shadow-md">
        <CardHeader className="bg-[#f5fcff] dark:bg-gray-900 border-b">
          <CardTitle className="text-[#0197cf] dark:text-[#01d2ff]">
            Practice Test
          </CardTitle>
          <CardDescription>
            Select a topic from the syllabus to take a practice test
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-10">
          <p className="text-muted-foreground text-center">
            No topic selected. Please select a topic from the syllabus to start
            a practice test.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="w-full border-[#e6f7fc] dark:border-gray-700 shadow-md">
        <CardHeader className="bg-[#f5fcff] dark:bg-gray-900 border-b">
          <CardTitle className="text-[#0197cf] dark:text-[#01d2ff]">
            Generating Test for {topic.name}
          </CardTitle>
          <CardDescription>
            Please wait while we prepare your test
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-10 space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0197cf]"></div>
          <p className="text-muted-foreground">Generating questions...</p>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    // Determine performance level and feedback
    let performanceLevel = "";
    let feedbackMessage = "";

    if (percentage >= 90) {
      performanceLevel = "Excellent";
      feedbackMessage =
        "You've mastered this topic! Consider exploring more advanced concepts.";
    } else if (percentage >= 70) {
      performanceLevel = "Good";
      feedbackMessage =
        "You have a solid understanding of this topic. Review the questions you missed to strengthen your knowledge.";
    } else if (percentage >= 50) {
      performanceLevel = "Satisfactory";
      feedbackMessage =
        "You're on the right track. Focus on the areas where you made mistakes to improve your understanding.";
    } else {
      performanceLevel = "Needs Improvement";
      feedbackMessage =
        "This topic requires more study. Don't worry - review the material and try again!";
    }

    return (
      <Card className="w-full border-[#e6f7fc] dark:border-gray-700 shadow-md">
        <CardHeader className="bg-[#f5fcff] dark:bg-gray-900 border-b">
          <CardTitle className="text-[#0197cf] dark:text-[#01d2ff]">
            Test Results: {topic.name}
          </CardTitle>
          <CardDescription>
            <div className="space-y-1">
              <div>
                Performance:{" "}
                <span className="font-medium">{performanceLevel}</span>
              </div>
              <div>
                Score: {score} out of {questions.length} ({percentage}%)
              </div>
              <div className="text-sm italic">{feedbackMessage}</div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <Progress value={percentage} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="border rounded-md p-4">
                <div className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    {answers[index] === question.correctAnswer ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium mb-2">
                      {index + 1}. {question.text}
                    </p>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-2 rounded-md ${
                            optionIndex === question.correctAnswer
                              ? "bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                              : answers[index] === optionIndex
                                ? "bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                                : "bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="mr-2">
                              {String.fromCharCode(65 + optionIndex)}.
                            </div>
                            <div>{option}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4 bg-[#f5fcff] dark:bg-gray-900">
          <div className="flex items-center">
            <Award className="h-5 w-5 text-[#ffcc00] mr-2" />
            <span>
              You earned {Math.round((score / questions.length) * 20)} points!
            </span>
          </div>
          <Button
            onClick={handleRetakeTest}
            className="bg-[#0197cf] hover:bg-[#01729b]"
          >
            Retake Test
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full border-[#e6f7fc] dark:border-gray-700 shadow-md">
      <CardHeader className="bg-[#f5fcff] dark:bg-gray-900 border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-[#0197cf] dark:text-[#01d2ff]">
              {topic.name} - Practice Test
            </CardTitle>
            <CardDescription>
              Question {currentQuestionIndex + 1} of {questions.length}
            </CardDescription>
          </div>
          <div className="flex items-center bg-white dark:bg-gray-800 px-3 py-1 rounded-full border">
            <Clock className="h-4 w-4 mr-2 text-[#0197cf]" />
            <span
              className={`font-mono ${timeLeft < 60 ? "text-red-500" : "text-[#0197cf]"}`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4">
          <Progress
            value={((currentQuestionIndex + 1) / questions.length) * 100}
            className="h-2"
          />
        </div>

        {questions.length > 0 && (
          <div className="space-y-6">
            <div className="text-lg font-medium">
              {questions[currentQuestionIndex].text}
            </div>

            <RadioGroup
              value={selectedOption?.toString()}
              onValueChange={(value) => handleOptionSelect(parseInt(value))}
              className="space-y-3"
            >
              {questions[currentQuestionIndex].options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => handleOptionSelect(index)}
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer"
                  >
                    <span className="font-medium mr-2">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4 bg-[#f5fcff] dark:bg-gray-900">
        <Button
          variant="outline"
          onClick={handleFinishTest}
          className="border-[#0197cf] text-[#0197cf] hover:bg-[#0197cf] hover:text-white"
        >
          Finish Test
        </Button>
        <Button
          onClick={handleNextQuestion}
          className="bg-[#0197cf] hover:bg-[#01729b]"
        >
          {currentQuestionIndex < questions.length - 1
            ? "Next Question"
            : "Submit Test"}
        </Button>
      </CardFooter>
    </Card>
  );
}
