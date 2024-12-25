"use client";

import React from "react";
import { Layout, Menu, Button, Tooltip, Divider, Avatar } from "antd";
import {
  MessageOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
  TranslationOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const { Sider } = Layout;

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { t, currentLanguage, toggleLanguage } = useLanguage();
  const { currentTheme, toggleTheme } = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems = [
    {
      key: "/chat",
      icon: <MessageOutlined />,
      label: t("menu.chat"),
    },
    {
      key: "/friends",
      icon: <UserOutlined />,
      label: t("menu.friends"),
    },
    {
      key: "/groups",
      icon: <TeamOutlined />,
      label: t("menu.groups"),
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: t("menu.settings"),
    },
  ];

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        width={200}
        style={{
          background: currentTheme.colors.background,
          borderRight: `1px solid ${currentTheme.colors.border}`,
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "16px",
            borderBottom: `1px solid ${currentTheme.colors.border}`,
            textAlign: "center",
          }}
        >
          <Avatar size={40}>{user?.username?.charAt(0)}</Avatar>
          <h3 style={{ color: currentTheme.colors.text }}>
            {user?.username || t("auth.notLoggedIn")}
          </h3>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[pathname || ""]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
          style={{
            flex: 1,
            borderRight: 0,
            background: currentTheme.colors.background,
          }}
          theme={currentTheme.type === "dark" ? "dark" : "light"}
        />

        <div
          style={{
            padding: "16px",
            borderTop: `1px solid ${currentTheme.colors.border}`,
            display: "flex",
            justifyContent: "space-around",
            background: currentTheme.colors.background,
          }}
        >
          <Tooltip title={t("settings.toggleTheme")}>
            <Button
              type="text"
              icon={<BulbOutlined />}
              onClick={toggleTheme}
              style={{ color: currentTheme.colors.text }}
            />
          </Tooltip>
          <Tooltip title={t("settings.toggleLanguage")}>
            <Button
              type="text"
              icon={<TranslationOutlined />}
              onClick={toggleLanguage}
              style={{ color: currentTheme.colors.text }}
            >
              {currentLanguage.toUpperCase()}
            </Button>
          </Tooltip>
        </div>
      </Sider>
      <Layout style={{ marginLeft: 200, height: "100vh" }}>{children}</Layout>
    </Layout>
  );
}
