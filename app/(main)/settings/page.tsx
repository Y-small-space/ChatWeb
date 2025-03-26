"use client";
import { useLanguage } from "../../../src/contexts/LanguageContext";
import { useTheme } from "../../../src/contexts/ThemeContext";
import { Avatar, Card, Divider, Switch, Button, Space, message, Upload } from "antd";
import {
  UserOutlined,
  GlobalOutlined,
  EditOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { wsManager } from "../../../src/services/websocket";

export default function SettingsPage() {
  const { t } = useLanguage();
  const { currentTheme } = useTheme();
  const router = useRouter();
  const [user, setUser] = useState();

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    const user = localStorage.getItem("user");
    const _ = JSON.parse(user);
    setUser(_);
  };

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

  // 限制上传格式和大小
  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error(t("settings.uploadOnlyJpgPng"));
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(t("settings.uploadMaxSize"));
      return false;
    }
    return true;
  };

  // 处理上传
  const handleUpload = (info: any) => {
    if (info.file.status === "done") {
      // 这里假设后端返回新头像的 URL
      const newAvatar = info.file.response?.url || URL.createObjectURL(info.file.originFileObj);
      const updatedUser = { ...user, avatar: newAvatar };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      message.success(t("settings.uploadSuccess"));
    }
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
          {/* 上传按钮 */}
          <Upload
            name="avatar"
            action="http://localhost:8080/api/v1/user/uploadAvatar" // 你需要替换成后端的上传 API
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleUpload}
            data={{ userId: user?.user_id }}
          >
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              style={{
                position: "absolute",
                right: 0,
                bottom: "16px",
                borderRadius: "50%",
                padding: "8px",
              }}
            />
          </Upload>
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
          <span style={valueStyle}>{user?.username}</span>
        </div>
        <Divider style={{ margin: "0" }} />
        <div style={sectionStyle}>
          <GlobalOutlined style={iconStyle} />
          <span style={labelStyle}>{t("settings.email")}</span>
          <span style={valueStyle}>{user?.email}</span>
        </div>
        <Divider style={{ margin: "0" }} />
        <div style={sectionStyle}>
          <PhoneOutlined style={iconStyle} />
          <span style={labelStyle}>{t("settings.phone")}</span>
          <span style={valueStyle}>
            {user?.phone || t("settings.notSet")}
          </span>
        </div>
        <div style={{ textAlign: "center", color: currentTheme.colors.text }}>
          <Button
            shape="circle"
            size="large"
            style={{ width: "80px", height: "80px" }}
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              wsManager.disconnect();
              router.push(`/auth/login`);
            }}
          >
            {t("auth.logout")}
          </Button>
        </div>
      </Card>

      {/* <Card title={t("settings.notifications")} style={cardStyle}>
        <div style={sectionStyle}>
          <BellOutlined style={iconStyle} />
          <span style={labelStyle}>{t("settings.messageNotifications")}</span>
          <Switch defaultChecked size="small" />
        </div>
        <Divider style={{ margin: "0" }} />
        <div style={sectionStyle}>
          <BellOutlined style={iconStyle} />
          <span style={labelStyle}>{t("settings.soundEnabled")}</span>
          <Switch defaultChecked size="small" />
        </div>
      </Card>

      <Card title={t("settings.privacy")} style={cardStyle}>
        <div style={sectionStyle}>
          <LockOutlined style={iconStyle} />
          <span style={labelStyle}>{t("settings.lastSeen")}</span>
          <span style={valueStyle}>{t("settings.everyone")}</span>
        </div>
        <Divider style={{ margin: "0" }} />
        <div style={sectionStyle}>
          <LockOutlined style={iconStyle} />
          <span style={labelStyle}>{t("settings.blockList")}</span>
          <span style={valueStyle}>0</span>
        </div>
      </Card> */}
    </div>
  );
}
