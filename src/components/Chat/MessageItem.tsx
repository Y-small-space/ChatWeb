"use client";

import React, { useState } from "react";
import { Avatar, Button, Space, Image, Card } from "antd";
import {
  CheckOutlined,
  CheckCircleOutlined,
  CheckCircleFilled,
  DeleteOutlined,
  ForwardOutlined,
  MessageOutlined,
  FileOutlined,
  DownloadOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../contexts/ThemeContext";
import { formatDistance } from "date-fns";
import { zhCN, enUS } from "date-fns/locale";
import { useLanguage } from "../../contexts/LanguageContext";
import { api } from 'src/services/api';

export const MessageItem = ({
  message,
  isSelf,
  onReply,
  onDelete,
  onForward,
  avatar,
  showMessage,
  getMessage
}) => {
  const { currentTheme } = useTheme();
  const { currentLanguage } = useLanguage();
  const [showActions, setShowActions] = useState(false);

  const getStatusIcon = () => {
    switch (message.status) {
      case "sent":
        return null;
      case "read":
        return <CheckCircleFilled />;
      default:
        return null;
    }
  };

  const deleteMessage = async () => {
    await api.chat.deleteMessageById({ userId: message.receiver_id, otherId: message.sender_id, messageId: message.id })
    getMessage();
  }

  const renderContent = (message) => {
    switch (message.type) {
      case "image":
        return (
          <Image
            src={`${message.content}`}
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
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              background: currentTheme.colors.secondaryBackground,
              borderRadius: "8px",
            }}
          >
            {/* 文件类型图标 */}
            <FileOutlined style={{ fontSize: "20px", color: currentTheme.colors.secondaryText }} />

            {/* 文件名 */}
            <span style={{ flex: 1, wordBreak: "break-all" }}>{message.filename}</span>

            {/* 下载按钮 */}
            <Button
              type="link"
              icon={<DownloadOutlined />}
              onClick={() => window.open(message.content)}
            />
          </div>
        )
      case "voice":
        return (
          <audio
            controls
            style={{ maxWidth: "250px", display: "block" }}
            src={message.content}
          >
            您的浏览器不支持音频播放
          </audio>
        );
      default:
        return message.content;
    }
  };

  return (<>
    {
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
        <Avatar size={40} src={message.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} />
        <div
          style={{
            maxWidth: "70%",
          }}
        >
          {/* 消息内容 */}
          <div style={{ color: 'gray', fontSize: "11px", marginBottom: '5px' }}>
            {message.sender}
          </div>
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
            {renderContent(message)}
          </div>
          {message.reply?.length && <div
            style={{
              padding: "8px 12px",
              borderRadius: "12px",
              background: isSelf
                ? currentTheme.colors.primary
                : currentTheme.colors.background,
              color: isSelf ? "#fff" : "black",
              wordBreak: "break-word",
              marginTop: "10px"
            }}
          >
            <div style={{ color: 'gray', fontSize: "11px", marginBottom: '5px' }}>{message.reply[0].sender}</div>
            {renderContent(message.reply[0])}
          </div>}

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
        {showActions && !showMessage && (
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
              onClick={!showMessage && onReply}
            />
            {
              !isSelf && <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                onClick={deleteMessage}
                danger
              />
            }
            {isSelf && (
              <Button
                type="text"
                size="small"
                icon={<RollbackOutlined />}
                onClick={deleteMessage}
                danger
              />
            )}
          </Space>
        )}
      </div>
    }
  </>
  );
}
