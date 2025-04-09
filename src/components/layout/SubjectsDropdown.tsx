import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronDown } from "lucide-react";

// South African subjects by grade level
const subjectsByGrade = {
  "Primary School": [
    { id: "english-home", name: "English Home Language" },
    { id: "afrikaans-home", name: "Afrikaans Home Language" },
    { id: "isizulu-home", name: "isiZulu Home Language" },
    { id: "mathematics", name: "Mathematics" },
    { id: "life-skills", name: "Life Skills" },
    { id: "natural-sciences", name: "Natural Sciences" },
  ],
  "High School": [
    { id: "english-home", name: "English Home Language" },
    { id: "afrikaans-home", name: "Afrikaans Home Language" },
    { id: "isizulu-home", name: "isiZulu Home Language" },
    { id: "mathematics", name: "Mathematics" },
    { id: "physical-sciences", name: "Physical Sciences" },
    { id: "life-sciences", name: "Life Sciences" },
    { id: "accounting", name: "Accounting" },
    { id: "business-studies", name: "Business Studies" },
    { id: "economics", name: "Economics" },
    { id: "geography", name: "Geography" },
    { id: "history", name: "History" },
    { id: "life-orientation", name: "Life Orientation" },
    { id: "computer-applications", name: "Computer Applications Technology" },
  ],
};

export default function SubjectsDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-white hover:bg-[#01729b] hover:text-white flex items-center gap-1"
        >
          <BookOpen className="h-4 w-4 mr-1" />
          Subjects
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Primary School</DropdownMenuLabel>
        {subjectsByGrade["Primary School"].map((subject) => (
          <DropdownMenuItem key={subject.id} asChild>
            <Link
              to={`/syllabus?subject=${subject.id}`}
              className="cursor-pointer w-full"
              onClick={() => setIsOpen(false)}
            >
              {subject.name}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuLabel>High School</DropdownMenuLabel>
        {subjectsByGrade["High School"].map((subject) => (
          <DropdownMenuItem key={subject.id} asChild>
            <Link
              to={`/syllabus?subject=${subject.id}`}
              className="cursor-pointer w-full"
              onClick={() => setIsOpen(false)}
            >
              {subject.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
