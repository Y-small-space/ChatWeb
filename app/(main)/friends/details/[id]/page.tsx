"use client";

import { useParams, useRouter } from "next/navigation";

import { Avatar, Card, Divider, Switch, Button, Space, message } from "antd";
import {
  UserOutlined,
  GlobalOutlined,
  EditOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { api } from "../../../../../src/services/api";
import { useLanguage } from "../../../../../src/contexts/LanguageContext";
import { useTheme } from "../../../../../src/contexts/ThemeContext";

export default function FriendsDetails() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { currentTheme } = useTheme();
  const [user, setUser] = useState();
  const router = useRouter();

  const getUserInfo = async () => {
    let searchValue = id;
    if (String(searchValue).includes("add")) {
      searchValue = searchValue.replace("add_", "");
    }
    const res = await api.friends.searchUser(searchValue);
    setUser(res.data.user);
  };

  const handleAddFriend = (userId: string) => {
    const res = api.friends.sendRequest(userId);
    console.log(res);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const containerStyle = {
    width: "100%",
    height: "100%",
    margin: "0 auto",
    padding: "40px 200px",
    overflow: "auto",
  };

  const headerStyle = {
    marginBottom: "32px",
    textAlign: "center" as const,
  };

  const cardStyle = {
    marginBottom: "24px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  };

  const sectionStyle = {
    display: "flex",
    alignItems: "center",
    padding: "16px 0",
  };

  const iconStyle = {
    fontSize: "20px",
    marginRight: "12px",
    color: currentTheme.colors.primary,
  };

  const labelStyle = {
    flex: 1,
    fontSize: "16px",
    color: currentTheme.colors.text,
  };

  const valueStyle = {
    color: currentTheme.colors.secondaryText,
    fontSize: "14px",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Avatar
            size={100}
            icon={<UserOutlined />}
            src={
              user?.avatar ||
              "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
            }
            style={{ marginBottom: "16px" }}
          />
        </div>
        <h1
          style={{
            fontSize: "24px",
            margin: "0",
            color: currentTheme.colors.text,
          }}
        >
          {user?.username}
        </h1>
        <p
          style={{
            color: currentTheme.colors.secondaryText,
            margin: "8px 0 0",
          }}
        >
          {user?.email}
        </p>
      </div>

      <Card title={t("settings.basicInfo")} style={cardStyle}>
        <div style={sectionStyle}>
          <UserOutlined style={iconStyle} />
          <span style={labelStyle}>{t("settings.username")}</span>
          <Space>
            <span style={valueStyle}>{user?.username}</span>
          </Space>
        </div>
        <Divider style={{ margin: "0" }} />
        <div style={sectionStyle}>
          <GlobalOutlined style={iconStyle} />
          <span style={labelStyle}>{t("settings.email")}</span>
          <Space>
            <span style={valueStyle}>{user?.email}</span>
          </Space>
        </div>
        <Divider style={{ margin: "0" }} />
        <div style={sectionStyle}>
          <PhoneOutlined style={iconStyle} />
          <span style={labelStyle}>{t("settings.phone")}</span>
          <Space>
            <span style={valueStyle}>
              {user?.phone || t("settings.notSet")}
            </span>
          </Space>
        </div>
      </Card>
      {String(id).includes("add") ? (
        <div style={{ textAlign: "center", color: currentTheme.colors.text }}>
          <Button
            shape="circle"
            size="large"
            style={{ width: "100px", height: "100px" }}
            onClick={() => handleAddFriend(user?.id)}
          >
            {t("friends.add")}
          </Button>
        </div>
      ) : (
        <div style={{ textAlign: "center", color: currentTheme.colors.text }}>
          <Button
            shape="circle"
            size="large"
            style={{ width: "80px", height: "80px" }}
            onClick={() => router.push(`/chat/${user.id}`)}
          >
            {t("friends.sendMessage")}
          </Button>
        </div>
      )}
    </div>
  );
}
