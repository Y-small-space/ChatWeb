"use client";

import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button } from "antd";
import { SunOutlined, MoonOutlined, GlobalOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  const { currentTheme, toggleTheme } = useTheme();
  const { currentLanguage, setLanguage } = useLanguage();

  const buttonStyle = {
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: currentTheme.colors.text,
    transition: "all 0.3s ease",
    ":hover": {
      color: currentTheme.colors.primary,
      transform: "scale(1.1)",
      background: currentTheme.colors.hover,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: currentTheme.colors.background,
        padding: "48px 24px",
        position: "relative",
      }}
    >
      {/* 主题切换和语言切换按钮 */}
      <div
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          display: "flex",
          gap: 12,
        }}
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="text"
            icon={
              currentTheme.type === "light" ? <MoonOutlined /> : <SunOutlined />
            }
            onClick={toggleTheme}
            className="theme-toggle-btn"
            style={buttonStyle}
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="text"
            icon={<GlobalOutlined />}
            onClick={() => setLanguage(currentLanguage === "zh" ? "en" : "zh")}
            className="lang-toggle-btn"
            style={buttonStyle}
          />
        </motion.div>
      </div>

      {/* Logo 和项目名称 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          marginBottom: 48,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 600,
            color: currentTheme.colors.text,
            marginBottom: 8,
          }}
        >
          WebChat
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: currentTheme.colors.secondaryText,
          }}
        >
          {currentLanguage === "zh"
            ? "随时随地，与世界对话"
            : "Connect and chat with anyone, anywhere"}
        </p>
      </motion.div>

      {/* 主要内容区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          width: "100%",
          maxWidth: 400,
          padding: "32px",
          borderRadius: "16px",
          background: currentTheme.colors.background,
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 500,
            textAlign: "center",
            marginBottom: 32,
            color: currentTheme.colors.text,
          }}
        >
          {title}
        </h2>
        {children}
      </motion.div>

      {/* 页脚 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          marginTop: 24,
          fontSize: "14px",
          color: currentTheme.colors.secondaryText,
        }}
      >
        © 2024 WebChat. All rights reserved.
      </motion.div>
    </motion.div>
  );
}
