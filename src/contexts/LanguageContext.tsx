"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { messages } from "../locales/messages";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";

export type Language = keyof typeof messages;

interface LanguageContextType {
  currentLanguage: Language;
  t: (key: string, params?: Record<string, string>) => string;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

function getNestedValue(
  obj: any,
  path: string,
  params?: Record<string, string>
): string {
  const value = path.split(".").reduce((acc, part) => acc?.[part], obj) || path;

  if (typeof value === "string" && params) {
    return value.replace(/\{(\d+)\}/g, (_, index) => {
      const key = Object.keys(params)[Number(index)];
      return params[key] || "";
    });
  }

  return value;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("zh");

  // 从 localStorage 恢复语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && messages[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "zh" ? "en" : "zh";
    setCurrentLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  const t = (key: string, params?: Record<string, string>): string => {
    return getNestedValue(messages[currentLanguage], key, params);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, t, toggleLanguage }}>
      <ConfigProvider locale={currentLanguage === "zh" ? zhCN : enUS}>
        {children}
      </ConfigProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
