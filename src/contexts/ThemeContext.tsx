"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeColors {
  primary: string;
  background: string;
  secondaryBackground: string;
  text: string;
  secondaryText: string;
  border: string;
  hover: string;
  active: string;
  error: string;
  success: string;
  warning: string;
}

interface Theme {
  type: "light" | "dark";
  colors: ThemeColors;
}

const lightTheme: Theme = {
  type: "light",
  colors: {
    primary: "#1890ff",
    background: "#ffffff",
    secondaryBackground: "#f5f5f5",
    text: "#000000",
    secondaryText: "#666666",
    border: "#e8e8e8",
    hover: "#f0f0f0",
    active: "#e6f7ff",
    error: "#ff4d4f",
    success: "#52c41a",
    warning: "#faad14",
  },
};

const darkTheme: Theme = {
  type: "dark",
  colors: {
    primary: "#177ddc",
    background: "#141414",
    secondaryBackground: "#1f1f1f",
    text: "#ffffff",
    secondaryText: "#999999",
    border: "#303030",
    hover: "#262626",
    active: "#111d2c",
    error: "#a61d24",
    success: "#49aa19",
    warning: "#d89614",
  },
};

interface ThemeContextType {
  currentTheme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(lightTheme);

  useEffect(() => {
    // 检查系统主题偏好
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setCurrentTheme(darkModeQuery.matches ? darkTheme : lightTheme);

    const handleThemeChange = (e: MediaQueryListEvent) => {
      setCurrentTheme(e.matches ? darkTheme : lightTheme);
    };

    darkModeQuery.addEventListener("change", handleThemeChange);
    return () => darkModeQuery.removeEventListener("change", handleThemeChange);
  }, []);

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev.type === "light" ? darkTheme : lightTheme));
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
