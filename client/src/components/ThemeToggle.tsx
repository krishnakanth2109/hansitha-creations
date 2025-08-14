import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Button } from "@/components/ui/button"; // Assuming you use shadcn/ui button

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Sun className="h-6 w-6" />
      ) : (
        <Moon className="h-6 w-6" />
      )}
    </Button>
  );
};