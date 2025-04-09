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
import { Textarea } from "@/components/ui/textarea";
import { Brain, BookOpen, Pencil, Lightbulb, Settings } from "lucide-react";

interface StudyMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
}

interface StudyMethodSelectorProps {
  onSelectMethod: (method: string, customNotes?: string) => void;
  selectedMethod?: string;
}

export default function StudyMethodSelector({
  onSelectMethod,
  selectedMethod = "",
}: StudyMethodSelectorProps) {
  const [customMethod, setCustomMethod] = useState("");
  const [currentMethod, setCurrentMethod] = useState(selectedMethod);

  const studyMethods: StudyMethod[] = [
    {
      id: "pomodoro",
      name: "Pomodoro Technique",
      description:
        "Study in focused 25-minute intervals with 5-minute breaks between sessions.",
      icon: <Clock className="h-5 w-5 text-[#0197cf]" />,
      benefits: [
        "Improves focus and concentration",
        "Reduces mental fatigue",
        "Creates a sense of urgency",
      ],
    },
    {
      id: "active-recall",
      name: "Active Recall",
      description:
        "Test yourself on material rather than passively reviewing notes.",
      icon: <Brain className="h-5 w-5 text-[#0197cf]" />,
      benefits: [
        "Strengthens memory retention",
        "Identifies knowledge gaps",
        "More effective than re-reading",
      ],
    },
    {
      id: "spaced-repetition",
      name: "Spaced Repetition",
      description: "Review material at increasing intervals over time.",
      icon: <BookOpen className="h-5 w-5 text-[#0197cf]" />,
      benefits: [
        "Optimizes long-term retention",
        "Efficient use of study time",
        "Prevents forgetting",
      ],
    },
    {
      id: "feynman-technique",
      name: "Feynman Technique",
      description:
        "Explain concepts in simple terms as if teaching someone else.",
      icon: <Pencil className="h-5 w-5 text-[#0197cf]" />,
      benefits: [
        "Identifies understanding gaps",
        "Simplifies complex concepts",
        "Improves explanation skills",
      ],
    },
    {
      id: "custom",
      name: "Custom Method",
      description: "Create your own personalized study approach.",
      icon: <Settings className="h-5 w-5 text-[#0197cf]" />,
      benefits: [
        "Tailored to your learning style",
        "Combines multiple techniques",
        "Adaptable to different subjects",
      ],
    },
  ];

  const handleMethodChange = (value: string) => {
    setCurrentMethod(value);
    if (value !== "custom") {
      onSelectMethod(value);
    }
  };

  const handleCustomSubmit = () => {
    if (customMethod.trim()) {
      onSelectMethod("custom", customMethod);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-[#0197cf]" />
          Study Method
        </CardTitle>
        <CardDescription>
          Choose a study technique that works best for you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={currentMethod}
          onValueChange={handleMethodChange}
          className="space-y-4"
        >
          {studyMethods.map((method) => (
            <div key={method.id} className="flex items-start space-x-2">
              <RadioGroupItem
                value={method.id}
                id={method.id}
                className="mt-1"
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor={method.id}
                  className="font-medium flex items-center"
                >
                  {method.icon}
                  <span className="ml-2">{method.name}</span>
                </Label>
                <p className="text-sm text-muted-foreground">
                  {method.description}
                </p>
                {currentMethod === method.id && (
                  <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                    {method.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0197cf] mr-2"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </RadioGroup>

        {currentMethod === "custom" && (
          <div className="mt-4">
            <Textarea
              placeholder="Describe your custom study method..."
              value={customMethod}
              onChange={(e) => setCustomMethod(e.target.value)}
              className="min-h-[100px]"
            />
            <Button
              onClick={handleCustomSubmit}
              className="mt-2 bg-[#0197cf] hover:bg-[#01729b]"
              disabled={!customMethod.trim()}
            >
              Save Custom Method
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-muted-foreground">
          Different methods work better for different subjects and learning
          styles.
        </p>
      </CardFooter>
    </Card>
  );
}

// Clock icon component
function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
