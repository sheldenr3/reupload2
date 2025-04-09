import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  Video,
  FileCheck,
  BookText,
  Lightbulb,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface GradeSyllabusProps {
  grade: string;
  country?: string;
  subject?: string;
  userGrade?: string;
  onSelectTopic?: (topic: {
    id: string;
    name: string;
    content?: string;
    grade?: string;
  }) => void;
}

export default function GradeSyllabus({
  grade = "7",
  country = "za", // Default to South Africa
  subject,
  userGrade,
  onSelectTopic,
}: GradeSyllabusProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch syllabus data from Supabase based on country and grade
  useEffect(() => {
    const fetchSyllabus = async () => {
      setLoading(true);
      try {
        console.log(
          `Fetching syllabus for grade ${userGrade || grade} in country ${country}`,
        );

        // In a production app, this would fetch from the database
        // const { data, error } = await supabase
        //   .from('topics')
        //   .select(`
        //     id, name, description, content,
        //     subjects(id, name),
        //     grades(id, name, number)
        //   `)
        //   .eq('grades.number', grade)
        //   .eq('country_curricula.country_code', country);

        // if (error) throw error;

        // For now, we'll filter the static data based on grade
        // In a real implementation, this filtering would happen in the database query

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (err: any) {
        console.error("Error fetching syllabus:", err);
        setError(err.message || "Failed to load syllabus data");
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabus();
  }, [grade, country, userGrade]);

  // Grade 10 South African curriculum subjects and topics
  const subjects = [
    // Languages
    {
      id: "afrikaans-home",
      name: "Afrikaans Home Language",
      terms: [
        {
          id: "term1",
          name: "Term 1",
          topics: [
            { id: "topic1", name: "Listening and Speaking" },
            { id: "topic2", name: "Reading and Viewing" },
            { id: "topic3", name: "Writing and Presenting" },
            { id: "topic4", name: "Language Structures and Conventions" },
          ],
        },
        {
          id: "term2",
          name: "Term 2",
          topics: [
            { id: "topic5", name: "Listening and Speaking" },
            { id: "topic6", name: "Reading and Viewing" },
            { id: "topic7", name: "Writing and Presenting" },
            { id: "topic8", name: "Language Structures and Conventions" },
          ],
        },
        {
          id: "term3",
          name: "Term 3",
          topics: [
            { id: "topic9", name: "Listening and Speaking" },
            { id: "topic10", name: "Reading and Viewing" },
            { id: "topic11", name: "Writing and Presenting" },
            { id: "topic12", name: "Language Structures and Conventions" },
          ],
        },
        {
          id: "term4",
          name: "Term 4",
          topics: [
            { id: "topic13", name: "Listening and Speaking" },
            { id: "topic14", name: "Reading and Viewing" },
            { id: "topic15", name: "Writing and Presenting" },
            { id: "topic16", name: "Language Structures and Conventions" },
          ],
        },
      ],
    },
    {
      id: "english-home",
      name: "English Home Language",
      terms: [
        {
          id: "term1",
          name: "Term 1",
          topics: [
            { id: "topic1", name: "Listening and Speaking" },
            { id: "topic2", name: "Reading and Viewing" },
            { id: "topic3", name: "Writing and Presenting" },
            { id: "topic4", name: "Language Structures and Conventions" },
          ],
        },
        {
          id: "term2",
          name: "Term 2",
          topics: [
            { id: "topic5", name: "Listening and Speaking" },
            { id: "topic6", name: "Reading and Viewing" },
            { id: "topic7", name: "Writing and Presenting" },
            { id: "topic8", name: "Language Structures and Conventions" },
          ],
        },
        {
          id: "term3",
          name: "Term 3",
          topics: [
            { id: "topic9", name: "Listening and Speaking" },
            { id: "topic10", name: "Reading and Viewing" },
            { id: "topic11", name: "Writing and Presenting" },
            { id: "topic12", name: "Language Structures and Conventions" },
          ],
        },
        {
          id: "term4",
          name: "Term 4",
          topics: [
            { id: "topic13", name: "Listening and Speaking" },
            { id: "topic14", name: "Reading and Viewing" },
            { id: "topic15", name: "Writing and Presenting" },
            { id: "topic16", name: "Language Structures and Conventions" },
          ],
        },
      ],
    },
    {
      id: "isizulu-home",
      name: "isiZulu Home Language",
      terms: [
        {
          id: "term1",
          name: "Term 1",
          topics: [
            {
              id: "topic1",
              name: "Ukulalela nokukhuluma (Listening and Speaking)",
            },
            { id: "topic2", name: "Ukufunda nokubuka (Reading and Viewing)" },
            {
              id: "topic3",
              name: "Ukubhala nokwethula (Writing and Presenting)",
            },
            {
              id: "topic4",
              name: "Izakhiwo zolimi nokusetshenziswa kolimi (Language Structures and Conventions)",
            },
          ],
        },
        {
          id: "term2",
          name: "Term 2",
          topics: [
            {
              id: "topic5",
              name: "Ukulalela nokukhuluma (Listening and Speaking)",
            },
            { id: "topic6", name: "Ukufunda nokubuka (Reading and Viewing)" },
            {
              id: "topic7",
              name: "Ukubhala nokwethula (Writing and Presenting)",
            },
            {
              id: "topic8",
              name: "Izakhiwo zolimi nokusetshenziswa kolimi (Language Structures and Conventions)",
            },
          ],
        },
        {
          id: "term3",
          name: "Term 3",
          topics: [
            {
              id: "topic9",
              name: "Ukulalela nokukhuluma (Listening and Speaking)",
            },
            { id: "topic10", name: "Ukufunda nokubuka (Reading and Viewing)" },
            {
              id: "topic11",
              name: "Ukubhala nokwethula (Writing and Presenting)",
            },
            {
              id: "topic12",
              name: "Izakhiwo zolimi nokusetshenziswa kolimi (Language Structures and Conventions)",
            },
          ],
        },
        {
          id: "term4",
          name: "Term 4",
          topics: [
            {
              id: "topic13",
              name: "Ukulalela nokukhuluma (Listening and Speaking)",
            },
            { id: "topic14", name: "Ukufunda nokubuka (Reading and Viewing)" },
            {
              id: "topic15",
              name: "Ukubhala nokwethula (Writing and Presenting)",
            },
            {
              id: "topic16",
              name: "Izakhiwo zolimi nokusetshenziswa kolimi (Language Structures and Conventions)",
            },
          ],
        },
      ],
    },
    // Non-Language Subjects
    {
      id: "mathematics",
      name: "Mathematics",
      terms: [
        {
          id: "term1",
          name: "Term 1",
          topics: [
            { id: "topic1", name: "Algebraic Expressions" },
            { id: "topic2", name: "Equations and Inequalities" },
            { id: "topic3", name: "Functions" },
          ],
        },
        {
          id: "term2",
          name: "Term 2",
          topics: [
            { id: "topic4", name: "Finance, Growth, and Decay" },
            { id: "topic5", name: "Probability" },
            { id: "topic6", name: "Statistics" },
          ],
        },
        {
          id: "term3",
          name: "Term 3",
          topics: [
            { id: "topic7", name: "Analytical Geometry" },
            { id: "topic8", name: "Trigonometry" },
          ],
        },
        {
          id: "term4",
          name: "Term 4",
          topics: [
            { id: "topic9", name: "Euclidean Geometry" },
            { id: "topic10", name: "Revision and Exam Preparation" },
          ],
        },
      ],
    },
    {
      id: "physical-sciences",
      name: "Physical Sciences",
      terms: [
        {
          id: "term1",
          name: "Term 1",
          topics: [
            { id: "topic1", name: "Physics: Mechanics" },
            { id: "topic2", name: "Chemistry: Matter and Materials" },
          ],
        },
        {
          id: "term2",
          name: "Term 2",
          topics: [
            { id: "topic3", name: "Physics: Waves, Sound, and Light" },
            { id: "topic4", name: "Chemistry: Chemical Systems" },
          ],
        },
        {
          id: "term3",
          name: "Term 3",
          topics: [
            { id: "topic5", name: "Physics: Electricity and Magnetism" },
            { id: "topic6", name: "Chemistry: Chemical Change" },
          ],
        },
        {
          id: "term4",
          name: "Term 4",
          topics: [
            { id: "topic7", name: "Revision: Physics" },
            { id: "topic8", name: "Revision: Chemistry" },
          ],
        },
      ],
    },
    {
      id: "life-sciences",
      name: "Life Sciences",
      terms: [
        {
          id: "term1",
          name: "Term 1",
          topics: [
            { id: "topic1", name: "Molecules to Organisms" },
            {
              id: "topic2",
              name: "Structures and Control Processes in Basic Life Systems",
            },
          ],
        },
        {
          id: "term2",
          name: "Term 2",
          topics: [
            { id: "topic3", name: "Diversity, Change, and Continuity" },
            { id: "topic4", name: "Environmental Studies" },
          ],
        },
        {
          id: "term3",
          name: "Term 3",
          topics: [
            { id: "topic5", name: "Cellular Processes" },
            { id: "topic6", name: "Human Physiology" },
          ],
        },
        {
          id: "term4",
          name: "Term 4",
          topics: [
            { id: "topic7", name: "Ecology and Ecosystems" },
            { id: "topic8", name: "Revision and Exam Preparation" },
          ],
        },
      ],
    },
    {
      id: "accounting",
      name: "Accounting",
      terms: [
        {
          id: "term1",
          name: "Term 1",
          topics: [
            { id: "topic1", name: "Concepts of Accounting" },
            { id: "topic2", name: "GAAP Principles" },
            { id: "topic3", name: "Bookkeeping: Subsidiary Journals" },
          ],
        },
        {
          id: "term2",
          name: "Term 2",
          topics: [
            { id: "topic4", name: "Ledger Accounts" },
            { id: "topic5", name: "Trial Balance" },
            { id: "topic6", name: "Final Accounts" },
          ],
        },
        {
          id: "term3",
          name: "Term 3",
          topics: [
            { id: "topic7", name: "Reconciliations" },
            { id: "topic8", name: "Asset Disposal" },
            { id: "topic9", name: "Manufacturing Accounts" },
          ],
        },
        {
          id: "term4",
          name: "Term 4",
          topics: [
            { id: "topic10", name: "Budgeting" },
            { id: "topic11", name: "Revision and Exam Preparation" },
          ],
        },
      ],
    },
    {
      id: "business-studies",
      name: "Business Studies",
      terms: [
        {
          id: "term1",
          name: "Term 1",
          topics: [
            { id: "topic1", name: "Business Environments" },
            { id: "topic2", name: "Business Ventures" },
          ],
        },
        {
          id: "term2",
          name: "Term 2",
          topics: [
            { id: "topic3", name: "Business Roles" },
            { id: "topic4", name: "Business Operations" },
          ],
        },
        {
          id: "term3",
          name: "Term 3",
          topics: [
            { id: "topic5", name: "Entrepreneurship" },
            { id: "topic6", name: "Business Management" },
          ],
        },
        {
          id: "term4",
          name: "Term 4",
          topics: [
            { id: "topic7", name: "Business Ethics" },
            { id: "topic8", name: "Revision and Exam Preparation" },
          ],
        },
      ],
    },
    {
      id: "economics",
      name: "Economics",
      terms: [
        {
          id: "term1",
          name: "Term 1",
          topics: [
            { id: "topic1", name: "Basic Concepts" },
            { id: "topic2", name: "Basic Economic Problem" },
            { id: "topic3", name: "Circular Flow" },
          ],
        },
        {
          id: "term2",
          name: "Term 2",
          topics: [
            { id: "topic4", name: "Quantitative Elements" },
            { id: "topic5", name: "Dynamics of Markets" },
            { id: "topic6", name: "Economic Systems" },
          ],
        },
        {
          id: "term3",
          name: "Term 3",
          topics: [
            { id: "topic7", name: "Public Sector" },
            { id: "topic8", name: "Labour Markets" },
          ],
        },
        {
          id: "term4",
          name: "Term 4",
          topics: [
            { id: "topic9", name: "Economic Growth and Development" },
            { id: "topic10", name: "Money and Banking" },
            { id: "topic11", name: "Revision and Exam Preparation" },
          ],
        },
      ],
    },
    {
      id: "geography",
      name: "Geography",
      terms: [
        {
          id: "term1",
          name: "Term 1",
          topics: [
            { id: "topic1", name: "The Atmosphere" },
            { id: "topic2", name: "Geomorphology" },
          ],
        },
        {
          id: "term2",
          name: "Term 2",
          topics: [
            { id: "topic3", name: "Population Geography" },
            { id: "topic4", name: "Water Resources" },
          ],
        },
        {
          id: "term3",
          name: "Term 3",
          topics: [
            { id: "topic5", name: "Development Geography" },
            { id: "topic6", name: "Geographical Skills and Techniques" },
          ],
        },
        {
          id: "term4",
          name: "Term 4",
          topics: [
            { id: "topic7", name: "Map Work" },
            { id: "topic8", name: "Revision and Exam Preparation" },
          ],
        },
      ],
    },
    {
      id: "history",
      name: "History",
      terms: [
        {
          id: "term1",
          name: "Term 1",
          topics: [
            { id: "topic1", name: "The World Around 1600" },
            {
              id: "topic2",
              name: "European Expansion and Conquest During the 15th to 18th Centuries",
            },
          ],
        },
        {
          id: "term2",
          name: "Term 2",
          topics: [
            { id: "topic3", name: "The French Revolution" },
            {
              id: "topic4",
              name: "Transformations in Southern Africa After 1750",
            },
          ],
        },
        {
          id: "term3",
          name: "Term 3",
          topics: [
            { id: "topic5", name: "Colonial Expansion After 1750" },
            { id: "topic6", name: "The South African War and Union" },
          ],
        },
        {
          id: "term4",
          name: "Term 4",
          topics: [
            { id: "topic7", name: "Historical Skills" },
            { id: "topic8", name: "Revision and Exam Preparation" },
          ],
        },
      ],
    },
    {
      id: "life-orientation",
      name: "Life Orientation",
      terms: [
        {
          id: "term1",
          name: "Term 1",
          topics: [
            { id: "topic1", name: "Development of the Self in Society" },
            { id: "topic2", name: "Social and Environmental Responsibility" },
          ],
        },
        {
          id: "term2",
          name: "Term 2",
          topics: [
            { id: "topic3", name: "Democracy and Human Rights" },
            { id: "topic4", name: "Careers and Career Choices" },
          ],
        },
        {
          id: "term3",
          name: "Term 3",
          topics: [
            { id: "topic5", name: "Study Skills" },
            { id: "topic6", name: "Physical Education" },
          ],
        },
        {
          id: "term4",
          name: "Term 4",
          topics: [
            { id: "topic7", name: "World of Work" },
            { id: "topic8", name: "Revision and Exam Preparation" },
          ],
        },
      ],
    },
    {
      id: "agricultural-management",
      name: "Agricultural Management Practices",
      terms: [
        {
          id: "term1",
          name: "Term 1",
          topics: [
            { id: "topic1", name: "Animal Management: Housing" },
            { id: "topic2", name: "Animal Management: Facilities" },
          ],
        },
        {
          id: "term2",
          name: "Term 2",
          topics: [
            { id: "topic3", name: "Animal Management: After-care" },
            { id: "topic4", name: "Animal Management: Identification Methods" },
          ],
        },
        {
          id: "term3",
          name: "Term 3",
          topics: [
            { id: "topic5", name: "Farm Planning" },
            { id: "topic6", name: "Agri-tourism" },
          ],
        },
        {
          id: "term4",
          name: "Term 4",
          topics: [
            { id: "topic7", name: "Harvesting" },
            { id: "topic8", name: "Revision and Exam Preparation" },
          ],
        },
      ],
    },
    {
      id: "computer-applications",
      name: "Computer Applications Technology",
      terms: [
        {
          id: "term1",
          name: "Term 1",
          topics: [
            { id: "topic1", name: "Solution Development: Word Processing" },
            { id: "topic2", name: "Solution Development: Spreadsheets" },
          ],
        },
        {
          id: "term2",
          name: "Term 2",
          topics: [
            { id: "topic3", name: "Solution Development: Databases" },
            { id: "topic4", name: "Solution Development: Fourth Application" },
          ],
        },
        {
          id: "term3",
          name: "Term 3",
          topics: [
            { id: "topic5", name: "Systems Technologies" },
            { id: "topic6", name: "Internet Technologies" },
          ],
        },
        {
          id: "term4",
          name: "Term 4",
          topics: [
            { id: "topic7", name: "Information Management" },
            { id: "topic8", name: "Revision and Exam Preparation" },
          ],
        },
      ],
    },
  ];

  const [selectedSubject, setSelectedSubject] = useState(
    subject || subjects[0].id,
  );

  // Update selected subject when prop changes
  useEffect(() => {
    if (subject && subjects.some((s) => s.id === subject)) {
      setSelectedSubject(subject);
    }
  }, [subject]);

  // Always use the user's grade from their profile for content filtering
  // This ensures we show content specific to the student's grade level
  const actualGrade = userGrade || grade || "10";

  console.log("GradeSyllabus - Using grade:", {
    actualGrade,
    userGrade,
    propGrade: grade,
  });

  // Log the grade being used for debugging
  useEffect(() => {
    console.log(
      `GradeSyllabus - Using grade: ${actualGrade}, userGrade: ${userGrade}, prop grade: ${grade}`,
    );
  }, [actualGrade, userGrade, grade]);

  // Helper function to generate sample content for topics
  function getTopicContent(subject: string, topic: string): string {
    const contentMap: Record<string, Record<string, string>> = {
      Mathematics: {
        "Whole numbers":
          "Whole numbers are the positive integers (1, 2, 3, ...) along with zero (0). In Grade 7, students learn to perform operations with whole numbers including addition, subtraction, multiplication, and division. They also explore properties of whole numbers such as commutative, associative, and distributive properties.",
        Exponents:
          "Exponents represent repeated multiplication of the same factor. For example, 2³ means 2 × 2 × 2 = 8. Students learn to calculate powers, understand the laws of exponents, and solve problems involving exponents.",
        "Patterns, functions and algebra":
          "This topic introduces students to recognizing, describing, and representing patterns using words, tables, and expressions. Students learn to identify relationships between variables and represent them using algebraic expressions.",
        "Geometry of 2D shapes":
          "Students study the properties of 2D shapes including triangles, quadrilaterals, and circles. They learn to classify shapes based on their properties and calculate angles in various geometric figures.",
      },
      "English Home Language": {
        "Listening and speaking":
          "Students develop skills in active listening and effective speaking. They learn to comprehend oral texts, participate in discussions, and present information clearly and confidently.",
        "Reading and viewing":
          "This topic focuses on developing reading comprehension skills. Students learn to analyze texts, identify main ideas, make inferences, and evaluate information from various sources.",
        "Writing and presenting":
          "Students learn to write for different purposes and audiences. They develop skills in planning, drafting, revising, and editing their writing to communicate effectively.",
        "Language structures and conventions":
          "This topic covers grammar, vocabulary, and language usage. Students learn about parts of speech, sentence structures, and punctuation to improve their communication skills.",
      },
      "Natural Sciences": {
        "Life and living":
          "Students explore the characteristics of living organisms, their interactions with each other, and their environment. Topics include the basic structure of plants and animals, biodiversity, and ecosystems.",
        Biodiversity:
          "This topic covers the variety of life forms on Earth, including different species of plants, animals, and microorganisms. Students learn about classification systems and the importance of biodiversity for ecosystem health.",
        "Sexual reproduction":
          "Students learn about reproduction in plants and animals, focusing on the processes and structures involved in sexual reproduction. They study the reproductive organs, fertilization, and development of offspring.",
        Variation:
          "This topic explores the differences between individuals of the same species. Students learn about genetic and environmental factors that contribute to variation and how variation relates to natural selection and adaptation.",
      },
    };

    return (
      contentMap[subject]?.[topic] ||
      `Content for ${topic} in ${subject} will be covered in this lesson. The South African curriculum for Grade ${actualGrade} includes detailed study of this topic to build a strong foundation for future learning.`
    );
  }

  // Fetch subjects from database based on grade level
  const getGradeAppropriateSubjects = async () => {
    try {
      console.log(`Fetching subjects for grade ${actualGrade}`);

      // Fetch subjects from database using the stored function
      const { data, error } = await supabase.rpc("get_subjects_for_grade", {
        p_grade: actualGrade,
      });

      if (error) {
        console.error("Error fetching subjects:", error);
        throw error;
      }

      if (data && data.length > 0) {
        console.log(
          `Found ${data.length} subjects for grade ${actualGrade}:`,
          data,
        );

        // Map database results to our subject structure
        // We need to map the UUID ids from the database to the string ids used in our static data
        const mappedSubjects = data.map((dbSubject) => {
          // Find the matching subject in our static data by code
          const matchingSubject = subjects.find((s) => s.id === dbSubject.code);
          if (matchingSubject) {
            return {
              ...matchingSubject,
              dbId: dbSubject.id, // Store the database UUID for future use
            };
          }
          // If no match found, create a new subject entry
          return {
            id: dbSubject.code,
            name: dbSubject.name,
            dbId: dbSubject.id,
            terms: [], // Empty terms for now
          };
        });

        return mappedSubjects;
      }

      // Fallback to client-side filtering if no data from database
      console.log("No subjects found in database, using fallback filtering");
      const gradeNum = parseInt(actualGrade);

      // Primary school grades (1-7)
      if (gradeNum >= 1 && gradeNum <= 7) {
        return subjects.filter((subject) =>
          [
            "english-home",
            "afrikaans-home",
            "isizulu-home",
            "mathematics",
            "life-skills",
            "natural-sciences",
          ].includes(subject.id),
        );
      }
      // High school grades (8-12)
      else if (gradeNum >= 8 && gradeNum <= 12) {
        // Grade 8-9 (GET Phase)
        if (gradeNum <= 9) {
          return subjects.filter((subject) =>
            [
              "english-home",
              "afrikaans-home",
              "isizulu-home",
              "mathematics",
              "natural-sciences",
              "life-orientation",
              "geography",
              "history",
            ].includes(subject.id),
          );
        }
        // Grade 10-12 (FET Phase)
        else {
          return subjects;
        }
      }

      // Default fallback
      return subjects;
    } catch (error) {
      console.error("Error in getGradeAppropriateSubjects:", error);
      // Fallback to all subjects if there's an error
      return subjects;
    }
  };

  const [filteredSubjects, setFilteredSubjects] = useState(subjects);

  // Fetch grade-appropriate subjects when the component mounts or grade changes
  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const appropriateSubjects = await getGradeAppropriateSubjects();
        setFilteredSubjects(appropriateSubjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setError("Failed to load subjects for your grade");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [actualGrade]);

  return (
    <div className="p-3 sm:p-4 border rounded-md bg-white dark:bg-gray-800 shadow-md font-sans">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#0197cf] dark:text-[#01d2ff] flex items-center">
        <BookOpen className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
        Grade {actualGrade} Syllabus
      </h2>

      <Tabs
        defaultValue={filteredSubjects.length > 0 ? filteredSubjects[0].id : ""}
        onValueChange={setSelectedSubject}
        value={selectedSubject}
      >
        <div className="mb-3 sm:mb-4 border rounded-md overflow-x-auto pb-2">
          <TabsList className="w-max flex gap-1 px-1 pt-1">
            {filteredSubjects.map((subject) => (
              <TabsTrigger
                key={subject.id}
                value={subject.id}
                className="flex-shrink-0 text-xs sm:text-sm whitespace-nowrap"
              >
                {subject.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {filteredSubjects.map((subject) => (
          <TabsContent key={subject.id} value={subject.id}>
            <Card>
              <CardHeader className="bg-[#f5fcff] dark:bg-gray-900 p-3 sm:p-4">
                <CardTitle className="text-[#0197cf] dark:text-[#01d2ff] text-base sm:text-lg">
                  {subject.name}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Select a term to view topics for Grade {actualGrade}{" "}
                  {subject.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-3 sm:pt-6 p-3 sm:p-6">
                <Accordion type="single" collapsible className="w-full">
                  {subject.terms.map((term) => (
                    <AccordionItem key={term.id} value={term.id}>
                      <AccordionTrigger className="text-[#0197cf] hover:text-[#01729b] hover:no-underline text-sm sm:text-base py-2 sm:py-4">
                        {term.name}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-2 sm:pl-4 pt-1 sm:pt-2 space-y-1 sm:space-y-2">
                          {term.topics.map((topic) => (
                            <div
                              key={topic.id}
                              className="flex items-center p-2 rounded-md hover:bg-[#e6f7fc] dark:hover:bg-[#01729b]/30 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700"
                              onClick={() =>
                                onSelectTopic &&
                                onSelectTopic({
                                  id: topic.id,
                                  name: topic.name,
                                  content: getTopicContent(
                                    subject.name,
                                    topic.name,
                                  ),
                                  grade: actualGrade,
                                })
                              }
                            >
                              <div className="flex-1">
                                <h4 className="text-sm sm:text-base font-medium">
                                  {topic.name}
                                </h4>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#0197cf]" />
        </div>
      )}

      {error && (
        <div className="p-4 mt-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}
