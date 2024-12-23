"use client";

import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { ConfigProvider, theme as antdTheme } from "antd";

export function GlobalTheme({ children }: { children: React.ReactNode }) {
  const { currentTheme } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm:
          currentTheme.type === "dark"
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: currentTheme.colors.primary,
          colorBgContainer: currentTheme.colors.background,
          colorText: currentTheme.colors.text,
          colorTextSecondary: currentTheme.colors.secondaryText,
          colorBorder: currentTheme.colors.border,
          borderRadius: 8,
        },
      }}
    >
      <div
        style={{
          backgroundColor: currentTheme.colors.background,
          color: currentTheme.colors.text,
          minHeight: "100vh",
          transition: "all 0.3s",
        }}
      >
        {children}
      </div>
    </ConfigProvider>
  );
}
