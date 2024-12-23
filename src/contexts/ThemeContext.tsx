"use client";

import React, { createContext, useContext, useState } from "react";

interface Theme {
  colors: {
    primary: string;
    text: string;
    background: string;
    secondaryText: string;
    border: string;
  };
}

interface ThemeContextType {
  currentTheme: Theme;
  toggleTheme: () => void;
}

const lightTheme: Theme = {
  colors: {
    primary: "#1890ff",
    text: "#000000",
    background: "#ffffff",
    secondaryText: "#666666",
    border: "#e8e8e8",
  },
};

const darkTheme: Theme = {
  colors: {
    primary: "#1890ff",
    text: "#ffffff",
    background: "#141414",
    secondaryText: "#999999",
    border: "#303030",
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme: isDark ? darkTheme : lightTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
