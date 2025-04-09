import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  FileText,
  Video,
  GraduationCap,
  Brain,
  Award,
  Sparkles,
  Calendar,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="container py-10">
      <div className="text-center mb-10 bg-[#0197cf]/10 dark:bg-[#01729b]/20 p-8 rounded-xl">
        <div className="flex justify-center mb-4">
          <div className="bg-[#0197cf] text-white p-3 rounded-full">
            <Brain className="h-10 w-10" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4 text-[#0197cf] dark:text-[#01d2ff]">
          Lumerous
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A comprehensive learning platform for South African students
        </p>
        <p className="text-lg mt-2">
          Welcome to your personalized learning journey!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* All cards will have the same height with this wrapper */}
        <Card className="border-[#e6f7fc] dark:border-gray-700 hover:shadow-lg transition-all hover:translate-y-[-5px] h-full flex flex-col">
          <div className="absolute top-0 right-0 bg-[#0197cf] text-white p-2 rounded-bl-lg rounded-tr-lg">
            <Sparkles className="h-4 w-4" />
          </div>
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-[#0197cf]/10 flex items-center justify-center mb-2">
              <BookOpen className="h-6 w-6 text-[#0197cf]" />
            </div>
            <CardTitle className="text-[#0197cf] dark:text-[#01d2ff]">
              Syllabus
            </CardTitle>
            <CardDescription>
              Browse the South African curriculum structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Navigate through subjects, grades, and topics in an interactive
              tree structure.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-[#0197cf] hover:bg-[#01729b]">
              <Link to="/syllabus">Explore Syllabus</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-[#e6f7fc] dark:border-gray-700 hover:shadow-lg transition-all hover:translate-y-[-5px] h-full flex flex-col">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-[#0197cf]/10 flex items-center justify-center mb-2">
              <BookOpen className="h-6 w-6 text-[#0197cf]" />
            </div>
            <CardTitle className="text-[#0197cf] dark:text-[#01d2ff]">
              World Library
            </CardTitle>
            <CardDescription>Access global learning resources</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Explore a vast collection of international educational materials
              and references for all subjects.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-[#0197cf] hover:bg-[#01729b]">
              <Link to="/library">Explore Library</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-[#e6f7fc] dark:border-gray-700 hover:shadow-lg transition-all hover:translate-y-[-5px] h-full flex flex-col">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-[#0197cf]/10 flex items-center justify-center mb-2">
              <FileText className="h-6 w-6 text-[#0197cf]" />
            </div>
            <CardTitle className="text-[#0197cf] dark:text-[#01d2ff]">
              Resources
            </CardTitle>
            <CardDescription>Access learning materials</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Find textbooks, study guides, and reference materials to enhance
              your learning experience.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-[#0197cf] hover:bg-[#01729b]">
              <Link to="/resources">View Resources</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-[#e6f7fc] dark:border-gray-700 hover:shadow-lg transition-all hover:translate-y-[-5px] h-full flex flex-col">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-[#0197cf]/10 flex items-center justify-center mb-2">
              <Video className="h-6 w-6 text-[#0197cf]" />
            </div>
            <CardTitle className="text-[#0197cf] dark:text-[#01d2ff]">
              Labs
            </CardTitle>
            <CardDescription>Hands-on learning experiences</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Engage with interactive experiments, simulations, and practical
              activities to reinforce concepts.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-[#0197cf] hover:bg-[#01729b]">
              <Link to="/labs">Explore Labs</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-16 bg-[#f5fcff] dark:bg-gray-800 p-8 rounded-xl shadow-sm">
        <div className="flex justify-between items-start gap-6">
          <div className="w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-[#0197cf] dark:text-[#01d2ff] flex items-center">
              <Calendar className="h-6 w-6 mr-2" />
              Your Learning Calendar
            </h2>
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-lg mb-3">Upcoming Events</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-[#0197cf]/10 p-2 rounded-md mr-3">
                    <FileText className="h-5 w-5 text-[#0197cf]" />
                  </div>
                  <div>
                    <p className="font-medium">Mathematics Test</p>
                    <p className="text-sm text-muted-foreground">
                      Tomorrow, 10:00 AM
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-[#0197cf]/10 p-2 rounded-md mr-3">
                    <BookOpen className="h-5 w-5 text-[#0197cf]" />
                  </div>
                  <div>
                    <p className="font-medium">Science Assignment Due</p>
                    <p className="text-sm text-muted-foreground">
                      Friday, 3:00 PM
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-[#0197cf]/10 p-2 rounded-md mr-3">
                    <Video className="h-5 w-5 text-[#0197cf]" />
                  </div>
                  <div>
                    <p className="font-medium">
                      English Literature Video Lesson
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Saturday, 11:00 AM
                    </p>
                  </div>
                </li>
              </ul>
              <Button
                variant="outline"
                className="w-full mt-4 border-[#0197cf] text-[#0197cf] hover:bg-[#0197cf] hover:text-white"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Reminder
              </Button>
            </div>
          </div>

          <div className="w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-[#0197cf] dark:text-[#01d2ff] flex items-center">
              <Calendar className="h-6 w-6 mr-2" />
              Monthly Calendar
            </h2>
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm">
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                <div className="font-medium text-sm text-[#0197cf]">Sun</div>
                <div className="font-medium text-sm text-[#0197cf]">Mon</div>
                <div className="font-medium text-sm text-[#0197cf]">Tue</div>
                <div className="font-medium text-sm text-[#0197cf]">Wed</div>
                <div className="font-medium text-sm text-[#0197cf]">Thu</div>
                <div className="font-medium text-sm text-[#0197cf]">Fri</div>
                <div className="font-medium text-sm text-[#0197cf]">Sat</div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {(() => {
                  const today = new Date();
                  const currentMonth = today.getMonth();
                  const currentYear = today.getFullYear();
                  const firstDay = new Date(
                    currentYear,
                    currentMonth,
                    1,
                  ).getDay();
                  const daysInMonth = new Date(
                    currentYear,
                    currentMonth + 1,
                    0,
                  ).getDate();

                  // Create array for calendar days including empty cells for proper alignment
                  const days = [];

                  // Add empty cells for days before the 1st of the month
                  for (let i = 0; i < firstDay; i++) {
                    days.push(
                      <div key={`empty-${i}`} className="aspect-square"></div>,
                    );
                  }

                  // Add cells for each day of the month
                  for (let i = 1; i <= daysInMonth; i++) {
                    const isToday = i === today.getDate();
                    const hasEvent = [10, 15, 22].includes(i); // Example dates with events

                    days.push(
                      <div
                        key={i}
                        className={`aspect-square flex items-center justify-center rounded-md text-sm cursor-pointer
                          ${isToday ? "bg-[#0197cf] text-white" : hasEvent ? "bg-[#0197cf]/20" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                        title={hasEvent ? "You have events on this day" : ""}
                      >
                        {i}
                      </div>,
                    );
                  }

                  return days;
                })()}
              </div>
              <div className="mt-4 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // This would normally update state to show previous month
                    alert("Navigate to previous month");
                  }}
                >
                  Previous Month
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // This would normally update state to show next month
                    alert("Navigate to next month");
                  }}
                >
                  Next Month
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
