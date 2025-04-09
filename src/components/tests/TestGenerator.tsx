import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain,
  CheckCircle,
  XCircle,
  Award,
  ListChecks,
  ArrowRight,
} from "lucide-react";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  type?: string;
}

interface TestGeneratorProps {
  topic: {
    id: string;
    name: string;
    grade?: string;
  } | null;
  initialTestType?: string;
}

export default function TestGenerator({
  topic,
  initialTestType = "mcq",
}: TestGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [testType, setTestType] = useState<string>(initialTestType);

  const generateTest = () => {
    if (!topic) return;

    setIsGenerating(true);
    setShowResults(false);
    setAnswers({});

    // Simulate test generation
    setTimeout(() => {
      let generatedQuestions: Question[] = [];

      switch (testType) {
        case "mcq":
          generatedQuestions = [
            {
              id: "q1",
              text: `MCQ question 1 about ${topic.name}?`,
              options: ["Option A", "Option B", "Option C", "Option D"],
              correctAnswer: 2,
              type: "mcq",
            },
            {
              id: "q2",
              text: `MCQ question 2 about ${topic.name}?`,
              options: ["Option A", "Option B", "Option C", "Option D"],
              correctAnswer: 0,
              type: "mcq",
            },
            {
              id: "q3",
              text: `MCQ question 3 about ${topic.name}?`,
              options: ["Option A", "Option B", "Option C", "Option D"],
              correctAnswer: 3,
              type: "mcq",
            },
          ];
          break;
        case "question":
          generatedQuestions = [
            {
              id: "q1",
              text: `Short answer question 1 about ${topic.name}?`,
              options: ["Answer 1"],
              correctAnswer: 0,
              type: "question",
            },
            {
              id: "q2",
              text: `Short answer question 2 about ${topic.name}?`,
              options: ["Answer 2"],
              correctAnswer: 0,
              type: "question",
            },
            {
              id: "q3",
              text: `Short answer question 3 about ${topic.name}?`,
              options: ["Answer 3"],
              correctAnswer: 0,
              type: "question",
            },
          ];
          break;
        case "matching":
          generatedQuestions = [
            {
              id: "q1",
              text: `Match the following terms with their definitions for ${topic.name}:`,
              options: [
                "Term A - Definition 1",
                "Term B - Definition 2",
                "Term C - Definition 3",
                "Term D - Definition 4",
              ],
              correctAnswer: 0,
              type: "matching",
            },
          ];
          break;
        case "truefalse":
          generatedQuestions = [
            {
              id: "q1",
              text: `True or False: Statement 1 about ${topic.name}.`,
              options: ["True", "False"],
              correctAnswer: 0,
              type: "truefalse",
            },
            {
              id: "q2",
              text: `True or False: Statement 2 about ${topic.name}.`,
              options: ["True", "False"],
              correctAnswer: 1,
              type: "truefalse",
            },
            {
              id: "q3",
              text: `True or False: Statement 3 about ${topic.name}.`,
              options: ["True", "False"],
              correctAnswer: 0,
              type: "truefalse",
            },
          ];
          break;
        default:
          generatedQuestions = [
            {
              id: "q1",
              text: `Sample question 1 about ${topic.name}?`,
              options: ["Option A", "Option B", "Option C", "Option D"],
              correctAnswer: 2,
              type: "mcq",
            },
            {
              id: "q2",
              text: `Sample question 2 about ${topic.name}?`,
              options: ["Option A", "Option B", "Option C", "Option D"],
              correctAnswer: 0,
              type: "mcq",
            },
            {
              id: "q3",
              text: `Sample question 3 about ${topic.name}?`,
              options: ["Option A", "Option B", "Option C", "Option D"],
              correctAnswer: 3,
              type: "mcq",
            },
          ];
      }

      setQuestions(generatedQuestions);
      setIsGenerating(false);
    }, 1500);
  };

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const submitTest = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const resetTest = () => {
    setQuestions([]);
    setAnswers({});
    setShowResults(false);
  };

  const renderQuestionContent = (question: Question, index: number) => {
    switch (question.type) {
      case "mcq":
        return (
          <RadioGroup
            value={answers[question.id]?.toString()}
            onValueChange={(value) =>
              handleAnswerChange(question.id, parseInt(value))
            }
            disabled={showResults}
          >
            {question.options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className={`flex items-center space-x-2 p-3 rounded-md mb-2 ${showResults && optionIndex === question.correctAnswer ? "bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-900" : ""} ${showResults && answers[question.id] === optionIndex && optionIndex !== question.correctAnswer ? "bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-900" : ""} ${!showResults ? "hover:bg-[#f5fcff] dark:hover:bg-gray-900" : ""}`}
              >
                <RadioGroupItem
                  value={optionIndex.toString()}
                  id={`${question.id}-${optionIndex}`}
                  className="text-[#0197cf]"
                />
                <Label
                  htmlFor={`${question.id}-${optionIndex}`}
                  className="flex-1"
                >
                  {option}
                </Label>
                {showResults && optionIndex === question.correctAnswer && (
                  <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                )}
                {showResults &&
                  answers[question.id] === optionIndex &&
                  optionIndex !== question.correctAnswer && (
                    <XCircle className="h-5 w-5 text-red-500 ml-2" />
                  )}
              </div>
            ))}
          </RadioGroup>
        );
      case "question":
        return (
          <div className="space-y-4">
            <Textarea
              placeholder="Type your answer here..."
              className="w-full p-3 border rounded-md"
              disabled={showResults}
              value={
                answers[question.id] !== undefined
                  ? question.options[answers[question.id]]
                  : ""
              }
              onChange={(e) => {
                const userAnswer = e.target.value;
                setAnswers((prev) => ({
                  ...prev,
                  [question.id]: 0,
                  [`${question.id}_text`]: userAnswer,
                }));
              }}
            />
            {showResults && (
              <div className="mt-4 p-3 bg-[#f5fcff] dark:bg-gray-900 rounded-md border border-[#e6f7fc] dark:border-gray-700">
                <p className="font-medium text-[#0197cf]">Sample Answer:</p>
                <p>{question.options[0]}</p>
              </div>
            )}
          </div>
        );
      case "matching":
        return (
          <div className="space-y-4">
            {question.options.map((item, itemIndex) => {
              const [term, definition] = item.split(" - ");
              return (
                <div
                  key={itemIndex}
                  className="flex flex-col md:flex-row md:items-center gap-2 p-3 border rounded-md"
                >
                  <div className="font-medium min-w-[100px]">{term}</div>
                  <ArrowRight className="hidden md:block h-4 w-4 text-gray-400 mx-2" />
                  <select
                    className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-800"
                    value={
                      answers[`${question.id}_${itemIndex}`] !== undefined
                        ? answers[`${question.id}_${itemIndex}`]
                        : ""
                    }
                    onChange={(e) => {
                      const selectedIndex = parseInt(e.target.value);
                      setAnswers((prev) => ({
                        ...prev,
                        [`${question.id}_${itemIndex}`]: selectedIndex,
                      }));
                    }}
                    disabled={showResults}
                  >
                    <option value="">Select a definition</option>
                    {question.options.map((_, defIndex) => {
                      const [, defText] =
                        question.options[defIndex].split(" - ");
                      return (
                        <option key={defIndex} value={defIndex}>
                          {defText}
                        </option>
                      );
                    })}
                  </select>
                  {showResults &&
                    (itemIndex === answers[`${question.id}_${itemIndex}`] ? (
                      <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 ml-2" />
                    ))}
                </div>
              );
            })}
          </div>
        );
      case "truefalse":
        return (
          <RadioGroup
            value={answers[question.id]?.toString()}
            onValueChange={(value) =>
              handleAnswerChange(question.id, parseInt(value))
            }
            disabled={showResults}
            className="flex flex-col md:flex-row gap-4"
          >
            {question.options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className={`flex items-center space-x-2 p-3 rounded-md border flex-1 ${showResults && optionIndex === question.correctAnswer ? "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-900" : ""} ${showResults && answers[question.id] === optionIndex && optionIndex !== question.correctAnswer ? "bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-900" : ""} ${!showResults ? "hover:bg-[#f5fcff] dark:hover:bg-gray-900" : ""}`}
              >
                <RadioGroupItem
                  value={optionIndex.toString()}
                  id={`${question.id}-${optionIndex}`}
                  className="text-[#0197cf]"
                />
                <Label
                  htmlFor={`${question.id}-${optionIndex}`}
                  className="flex-1"
                >
                  {option}
                </Label>
                {showResults && optionIndex === question.correctAnswer && (
                  <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                )}
                {showResults &&
                  answers[question.id] === optionIndex &&
                  optionIndex !== question.correctAnswer && (
                    <XCircle className="h-5 w-5 text-red-500 ml-2" />
                  )}
              </div>
            ))}
          </RadioGroup>
        );
      default:
        return (
          <RadioGroup
            value={answers[question.id]?.toString()}
            onValueChange={(value) =>
              handleAnswerChange(question.id, parseInt(value))
            }
            disabled={showResults}
          >
            {question.options.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className={`flex items-center space-x-2 p-3 rounded-md mb-2 ${showResults && optionIndex === question.correctAnswer ? "bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-900" : ""} ${showResults && answers[question.id] === optionIndex && optionIndex !== question.correctAnswer ? "bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-900" : ""} ${!showResults ? "hover:bg-[#f5fcff] dark:hover:bg-gray-900" : ""}`}
              >
                <RadioGroupItem
                  value={optionIndex.toString()}
                  id={`${question.id}-${optionIndex}`}
                  className="text-[#0197cf]"
                />
                <Label
                  htmlFor={`${question.id}-${optionIndex}`}
                  className="flex-1"
                >
                  {option}
                </Label>
                {showResults && optionIndex === question.correctAnswer && (
                  <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                )}
                {showResults &&
                  answers[question.id] === optionIndex &&
                  optionIndex !== question.correctAnswer && (
                    <XCircle className="h-5 w-5 text-red-500 ml-2" />
                  )}
              </div>
            ))}
          </RadioGroup>
        );
    }
  };

  return (
    <div className="border rounded-md bg-white dark:bg-gray-800 p-4 shadow-md">
      <div className="flex flex-col space-y-4 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#0197cf] dark:text-[#01d2ff] flex items-center">
            <Brain className="mr-2 h-5 w-5" />
            {topic
              ? `Test: ${topic.name}`
              : "Select a topic to generate a test"}
          </h2>
          {!questions.length && (
            <Button
              onClick={generateTest}
              disabled={!topic || isGenerating}
              className="bg-[#0197cf] hover:bg-[#01729b] text-white"
            >
              {isGenerating ? "Generating..." : "Generate Test"}
            </Button>
          )}
          {questions.length > 0 && !showResults && (
            <Button
              onClick={submitTest}
              disabled={Object.keys(answers).length !== questions.length}
              className="bg-[#ff6600] hover:bg-[#e55c00] text-white"
            >
              Submit Test
            </Button>
          )}
          {showResults && (
            <Button
              onClick={resetTest}
              variant="outline"
              className="border-[#0197cf] text-[#0197cf]"
            >
              New Test
            </Button>
          )}
        </div>
      </div>

      {isGenerating && (
        <div className="flex justify-center items-center p-12 bg-[#f5fcff] dark:bg-gray-900 rounded-md">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#0197cf] animate-bounce" />
              <div className="w-3 h-3 rounded-full bg-[#0197cf] animate-bounce [animation-delay:0.2s]" />
              <div className="w-3 h-3 rounded-full bg-[#0197cf] animate-bounce [animation-delay:0.4s]" />
            </div>
            <p className="text-[#0197cf]">Generating test questions...</p>
          </div>
        </div>
      )}

      {showResults && (
        <Card className="mb-6 border-[#ffcc00] bg-[#fffbeb] dark:bg-[#2a2000] dark:border-[#ffcc00]/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-[#ff6600]">
              <Award className="w-5 h-5 mr-2 text-[#ffcc00]" />
              Test Results
            </CardTitle>
            <CardDescription className="text-[#ff6600] font-medium text-lg">
              You scored {calculateScore()} out of {questions.length}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {questions.length > 0 && (
        <div className="space-y-6">
          {questions.map((question, index) => (
            <Card
              key={question.id}
              className="border-[#e6f7fc] dark:border-gray-700"
            >
              <CardHeader className="bg-[#f5fcff] dark:bg-gray-900 pb-2">
                <CardTitle className="text-base flex items-start">
                  <span className="bg-[#0197cf] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{question.text}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {renderQuestionContent(question, index)}
              </CardContent>
              {showResults && (
                <CardFooter className="border-t pt-4 bg-[#f5fcff] dark:bg-gray-900">
                  <p className="text-sm">
                    {answers[question.id] === question.correctAnswer ? (
                      <span className="text-green-600 dark:text-green-400 font-medium flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" /> Correct
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 font-medium flex items-center">
                        <XCircle className="h-4 w-4 mr-1" /> Incorrect. The
                        correct answer is:{" "}
                        {question.options[question.correctAnswer]}
                      </span>
                    )}
                  </p>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}

      {!questions.length && !isGenerating && topic && (
        <div className="text-center text-[#0197cf] p-6 bg-[#f5fcff] dark:bg-gray-900 rounded-md">
          Click "Generate Test" to create a{" "}
          {testType === "mcq"
            ? "multiple choice"
            : testType === "question"
              ? "short answer"
              : testType === "matching"
                ? "matching"
                : testType === "truefalse"
                  ? "true/false"
                  : ""}{" "}
          test for this topic
        </div>
      )}
    </div>
  );
}
