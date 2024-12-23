"use client";

import React from "react";
import { Layout, Menu } from "antd";
import {
  MessageOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
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
  const { t } = useLanguage();
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
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid #f0f0f0",
            textAlign: "center",
          }}
        >
          <h3>{user?.username || t("auth.notLoggedIn")}</h3>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[pathname || ""]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
          style={{ height: "calc(100% - 64px)", borderRight: 0 }}
        />
      </Sider>
      <Layout style={{ marginLeft: 200, height: "100vh" }}>{children}</Layout>
    </Layout>
  );
}
