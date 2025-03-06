"use client";

import React, { useState } from "react";
import { Avatar, Button, Space, Image } from "antd";
import {
  CheckOutlined,
  CheckCircleOutlined,
  CheckCircleFilled,
  DeleteOutlined,
  ForwardOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../contexts/ThemeContext";
import { formatDistance } from "date-fns";
import { zhCN, enUS } from "date-fns/locale";
import { useLanguage } from "../../contexts/LanguageContext";
import type { ChatMessage } from "../../mock/chatData";

interface MessageItemProps {
  message: ChatMessage;
  isSelf: boolean;
  onReply: () => void;
  onDelete?: () => void;
  onForward?: () => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isSelf,
  onReply,
  onDelete,
  onForward,
}) => {
  const { currentTheme } = useTheme();
  const { t, currentLanguage } = useLanguage();
  const [showActions, setShowActions] = useState(false);

  const getStatusIcon = () => {
    switch (message.status) {
      case "sent":
        return <CheckOutlined />;
      case "delivered":
        return <CheckCircleOutlined />;
      case "read":
        return <CheckCircleFilled />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (message.type) {
      case "image":
        return (
          <Image
            src={message.content}
            alt="图片消息"
            style={{
              maxWidth: "300px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            preview={{
              mask: null,
            }}
          />
        );
      case "file":
        return (
          <div
            style={{
              padding: "8px 12px",
              background: currentTheme.colors.secondaryBackground,
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onClick={() => window.open(message.file_info?.url)}
          >
            <div>{message.file_info?.name}</div>
            <div
              style={{
                fontSize: "12px",
                color: currentTheme.colors.secondaryText,
              }}
            >
              {(message.file_info?.size || 0) / 1024 / 1024} MB
            </div>
          </div>
        );
      default:
        return message.content;
    }
  };

  return (
    <div
      style={{
        marginBottom: "16px",
        display: "flex",
        flexDirection: isSelf ? "row-reverse" : "row",
        alignItems: "flex-start",
        gap: "12px",
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Avatar size={40} src={message.sender?.avatar} />
      <div
        style={{
          maxWidth: "70%",
        }}
      >
        {/* 消息内容 */}
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "12px",
            background: isSelf
              ? currentTheme.colors.primary
              : currentTheme.colors.background,
            color: isSelf ? "#fff" : currentTheme.colors.text,
            wordBreak: "break-word",
          }}
        >
          {renderContent()}
        </div>

        {/* 消息时间和状态 */}
        <div
          style={{
            marginTop: "4px",
            fontSize: "12px",
            color: currentTheme.colors.secondaryText,
            display: "flex",
            alignItems: "center",
            gap: "4px",
            justifyContent: isSelf ? "flex-end" : "flex-start",
          }}
        >
          {formatDistance(new Date(message.created_at), new Date(), {
            addSuffix: true,
            locale: currentLanguage === "zh" ? zhCN : enUS,
          })}
          {isSelf && getStatusIcon()}
        </div>
      </div>

      {/* 消息操作按钮 */}
      {showActions && (
        <Space
          style={{
            opacity: showActions ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        >
          <Button
            type="text"
            size="small"
            icon={<MessageOutlined />}
            onClick={onReply}
          />
          {isSelf && (
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              onClick={onDelete}
              danger
            />
          )}
        </Space>
      )}
    </div>
  );
};
