import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const { theme } = useTheme();

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    if (savedDarkMode !== undefined) {
      setDarkMode(savedDarkMode);
      document.documentElement.classList.toggle("dark", savedDarkMode);
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
      {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="sr-only">Toggle dark mode</span>
    </Button>
  );
}
