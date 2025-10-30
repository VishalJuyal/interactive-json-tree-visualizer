"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [savedTheme, setSavedTheme] = useState<string | null>(null);

  useEffect(() => {
    const updateTheme = () => {
      try {
        const stored = localStorage.getItem("theme");
        if (stored === "light" || stored === "dark") {
          setSavedTheme(stored);
          setTheme(stored);
        } else {
          const fallback = "light";
          setSavedTheme(fallback);
          setTheme(fallback);
        }
      } catch {
        setSavedTheme("light");
      }
    };
    
    setTimeout(updateTheme, 0);
  }, [setTheme]);

  const isDark = savedTheme === "dark";

  const handleThemeColorChange = () => {
    const themeColor = isDark ? "light" : "dark";
    setSavedTheme(themeColor);
    setTheme(themeColor);
    try {
      localStorage.setItem("theme", themeColor);
    } catch {}
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={handleThemeColorChange}
        className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-600"
        role="switch"
        aria-checked={!!isDark}
        aria-label={isDark ? "Switch to light" : "Switch to dark"}
        title={isDark ? "Dark" : "Light"}
        suppressHydrationWarning
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isDark ? "translate-x-6" : "translate-x-1"
          }`}
          suppressHydrationWarning
        />
      </button>
      <span className="text-sm text-gray-800 dark:text-gray-200" suppressHydrationWarning>
        {isDark ? "Dark" : "Light"}
      </span>
    </div>
  );
}

