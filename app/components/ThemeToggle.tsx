"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isReadyToRender, setIsReadyToRender] = useState(false);

  useEffect(() => {
    setIsReadyToRender(true);
  }, []);

  if (!isReadyToRender) {
    return (
      <div className="inline-flex items-center gap-2">
        <button
          className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-600"
          role="switch"
          aria-label="Toggle theme"
          disabled
        >
          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
        </button>
        <span className="text-sm text-gray-600">…</span>
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-600"
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? "Switch to light" : "Switch to dark"}
        title={isDark ? "Dark" : "Light"}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isDark ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span className="text-sm text-gray-800 dark:text-gray-200">{isDark ? "Dark" : "Light"}</span>
    </div>
  );
}

