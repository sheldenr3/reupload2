import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import PointsDisplay from "@/components/points/PointsDisplay";
import UserMenu from "@/components/auth/UserMenu";
import { Search, Bell, Palette } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  return (
    <header className="border-b bg-[#0197cf] dark:bg-[#01729b] sticky top-0 z-10">
      <div className="container flex h-14 sm:h-16 items-center justify-between py-2 sm:py-4">
        <Link to="/home" className="flex items-center">
          <div className="font-sans font-bold text-lg sm:text-xl">
            <span className="text-black dark:text-white">Lumerous</span>
            <span className="text-[#0197cf] dark:text-[#01d2ff]">.</span>
            <span className="text-black dark:text-white">com</span>
          </div>
        </Link>
        <div className="flex items-center space-x-2 sm:space-x-6">
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search topics..."
              className="pl-10 pr-4 py-2 rounded-full text-sm bg-white/90 w-[150px] sm:w-[200px] focus:w-[200px] sm:focus:w-[300px] transition-all duration-300 focus:outline-none"
            />
          </div>
          <PointsDisplay />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/syllabus">
              <Button
                variant="ghost"
                className={`text-white hover:bg-[#01729b] hover:text-white ${location.pathname === "/syllabus" ? "bg-[#01729b]" : ""}`}
              >
                Syllabus
              </Button>
            </Link>
            <Link to="/learn">
              <Button
                variant="ghost"
                className={`text-white hover:bg-[#01729b] hover:text-white ${location.pathname === "/learn" ? "bg-[#01729b]" : ""}`}
              >
                Learn
              </Button>
            </Link>
            <Link to="/library">
              <Button
                variant="ghost"
                className={`text-white hover:bg-[#01729b] hover:text-white ${location.pathname === "/library" ? "bg-[#01729b]" : ""}`}
              >
                Library
              </Button>
            </Link>
            <Link to="/resources">
              <Button
                variant="ghost"
                className={`text-white hover:bg-[#01729b] hover:text-white ${location.pathname === "/resources" ? "bg-[#01729b]" : ""}`}
              >
                Resources
              </Button>
            </Link>
            <Link to="/study-buddy">
              <Button
                variant="ghost"
                className={`text-white hover:bg-[#01729b] hover:text-white ${location.pathname === "/study-buddy" ? "bg-[#01729b]" : ""}`}
              >
                Study Buddy
              </Button>
            </Link>
            <Link to="/labs">
              <Button
                variant="ghost"
                className={`text-white hover:bg-[#01729b] hover:text-white ${location.pathname === "/labs" ? "bg-[#01729b]" : ""}`}
              >
                Labs
              </Button>
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-[#01729b]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-menu"
                  >
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/syllabus" className="w-full">
                    Syllabus
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/learn" className="w-full">
                    Learn
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/library" className="w-full">
                    Library
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/resources" className="w-full">
                    Resources
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/study-buddy" className="w-full">
                    Study Buddy
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/labs" className="w-full">
                    Labs
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 ml-1 sm:ml-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-[#01729b] h-8 w-8 sm:h-10 sm:w-10"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {/* Theme Selection Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-[#01729b] h-8 w-8 sm:h-10 sm:w-10"
                >
                  <Palette className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Choose a Theme</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setTheme("default")}
                  className={theme === "default" ? "bg-secondary" : ""}
                >
                  Default
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("space")}
                  className={theme === "space" ? "bg-secondary" : ""}
                >
                  Space
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("character")}
                  className={theme === "character" ? "bg-secondary" : ""}
                >
                  Character
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("rainforest")}
                  className={theme === "rainforest" ? "bg-secondary" : ""}
                >
                  Rainforest
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <UserMenu />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
