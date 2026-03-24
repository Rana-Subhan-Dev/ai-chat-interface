/**
 * @file ThemeToggle.jsx
 * @description Dark/light mode toggle button shown at the bottom of the sidebar.
 *              Shows sun icon in dark mode (click to go light)
 *              Shows moon icon in light mode (click to go dark)
 */
import { SunIcon, MoonIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      variant="ghost"
      className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
      onClick={toggleTheme}
    >
      {isDark ? (
        <>
          <SunIcon className="h-4 w-4" />
          <span className="text-sm">Light mode</span>
        </>
      ) : (
        <>
          <MoonIcon className="h-4 w-4" />
          <span className="text-sm">Dark mode</span>
        </>
      )}
    </Button>
  );
}
