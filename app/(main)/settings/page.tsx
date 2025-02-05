"use client";

import { useSelector } from "react-redux";
import { RootState } from "../../../src/store";
import { useLanguage } from "../../../src/contexts/LanguageContext";
import { useTheme } from "../../../src/contexts/ThemeContext";
import { Avatar, Card, Divider, Switch, Button, Space } from "antd";
import {
  UserOutlined,
  BellOutlined,
  LockOutlined,
  GlobalOutlined,
  EditOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

export default function SettingsPage() {
  const { t } = useLanguage();
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentTheme } = useTheme();

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
            onClick={() => message.info(t("settings.uploadAvatarTip"))}
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
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => message.info(t("settings.editUsernameTip"))}
            >
              {t("settings.edit")}
            </Button>
          </Space>
        </div>
        <Divider style={{ margin: "0" }} />
        <div style={sectionStyle}>
          <GlobalOutlined style={iconStyle} />
          <span style={labelStyle}>{t("settings.email")}</span>
          <Space>
            <span style={valueStyle}>{user?.email}</span>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => message.info(t("settings.editEmailTip"))}
            >
              {t("settings.edit")}
            </Button>
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
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => message.info(t("settings.editPhoneTip"))}
            >
              {t("settings.edit")}
            </Button>
          </Space>
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
