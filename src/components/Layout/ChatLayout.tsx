"use client";

import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, Tooltip, Avatar } from "antd";
import {
  MessageOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
  BulbOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTheme } from "../../contexts/ThemeContext";
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
  const [user, setUser] = useState();

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    const user = localStorage.getItem("user");
    const _ = JSON.parse(user);
    setUser(_);
  };

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
      key: "/moments",
      icon: <CompassOutlined />,
      label: t("menu.moments"),
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: t("menu.settings"),
    },
  ];

  return (
    <Layout style={{ maxHeight: "100vh" }}>
      <Sider
        width={200}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          background: currentTheme.colors.background,
          borderRight: `1px solid ${currentTheme.colors.border}`,
        }}
      >
        <div
          style={{
            padding: "20px 16px",
            borderBottom: `1px solid ${currentTheme.colors.border}`,
            background: currentTheme.colors.secondaryBackground,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Avatar
            size={64}
            src={
              user?.avatar ||
              "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
            }
            style={{
              border: `2px solid ${currentTheme.colors.primary}`,
              cursor: "pointer",
            }}
            onClick={() => router.push("/settings")}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div
              style={{
                fontWeight: 500,
                color: currentTheme.colors.text,
                fontSize: "16px",
                marginBottom: "4px",
                textAlign: "center",
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.username || t("auth.notLoggedIn")}
            </div>
            {user?.email && (
              <div
                style={{
                  fontSize: "12px",
                  color: currentTheme.colors.secondaryText,
                  textAlign: "center",
                  width: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user.email}
              </div>
            )}
          </div>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[pathname || ""]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
          style={{
            flex: 1,
            borderRight: 0,
            background: "transparent",
          }}
          theme={currentTheme.type === "dark" ? "dark" : "light"}
        />
        {/* <div style={{ height: "100%" }}></div> */}
        <div
          style={{
            height: "40px",
            padding: "12px",
            borderTop: `1px solid ${currentTheme.colors.border}`,
            display: "flex",
            justifyContent: "space-around",
            background: currentTheme.colors.background,
          }}
        >
          <Tooltip title={t("settings.toggleTheme")} placement="top">
            <Button
              type="text"
              icon={<BulbOutlined />}
              onClick={toggleTheme}
              style={{
                color: currentTheme.colors.text,
                width: "40px",
                height: "40px",
                borderRadius: "20px",
              }}
            />
          </Tooltip>
          <Tooltip title={t("settings.toggleLanguage")} placement="top">
            <Button
              type="text"
              onClick={toggleLanguage}
              style={{
                color: currentTheme.colors.text,
                width: "40px",
                height: "40px",
                borderRadius: "20px",
                fontWeight: 500,
              }}
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
