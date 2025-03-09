"use client";

import React, { useEffect, useRef, useState } from "react";
import { Avatar, Button, Input } from "antd";
import {
  ArrowLeftOutlined,
  PictureOutlined,
  TeamOutlined,
  InfoCircleOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { MessageItem } from "./MessageItem";
import { Message } from "../../services/types";
import { wsManager } from "../../services/websocket";

interface ChatMessage {
  id: string;
  type: string;
  content: string;
  sender_id: string; // 当前用户 ID
  receiver_id?: string;
  // group_id?: string;
  created_at: string;
  sender: string;
  receiver?: string;
  status: string;
}

interface chantWindowProps {
  type: string;
  chatInfo: user;
  id: string;
}
interface user {
  created_at: string;
  email: string;
  id: string;
  phone: string;
  updated_at: string;
  username: string;
}

export const ChatWindow = ({ type, chatInfo, id }: chantWindowProps) => {
  const [messages, setMessages] = useState();
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  // const [showImagePreview, setShowImagePreview] = useState(false);
  // const [previewImage, setPreviewImage] = useState("");c
  console.log(chatInfo, id);

  // 处理发送消息
  const handleSend = (content: string) => {
    const user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") as string)
      : null;
    const newMessage: ChatMessage = {
      id: `m${Date.now()}`,
      type: "text",
      content,
      sender_id: String(localStorage.getItem("userId")), // 当前用户 ID
      receiver_id: id,
      // group_id: type === "group" ? id : undefined,
      created_at: new Date().toISOString(),
      sender: String(user.username),
      receiver: chatInfo.username,
      status: "sent",
    };
    console.log("newMessage", newMessage);

    wsManager.sendMessage(newMessage);
  };

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // const handleFileUpload = (
  //   url: string,
  //   fileType: "image" | "file",
  //   fileInfo?: {
  //     name: string;
  //     size: number;
  //     type: string;
  //     url: string;
  //   }
  // ) => {
  //   const newMessage: ChatMessage = {
  //     id: `m${Date.now()}`,
  //     type: fileType,
  //     content: url,
  //     sender_id: "1",
  //     receiver_id: type === "private" ? id : undefined,
  //     group_id: type === "group" ? id : undefined,
  //     created_at: new Date().toISOString(),
  //     status: "sent",
  //     file_info: fileInfo,
  //   };

  //   setMessages((prev) => [...prev, newMessage]);
  //   scrollToBottom();
  // };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* 聊天头部 */}
      <div
        style={{
          padding: "16px",
          borderBottom: `1px solid ${currentTheme.colors.border}`,
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
        />
        <Avatar
          src={chatInfo?.avatar}
          size={40}
          icon={type === "group" ? <TeamOutlined /> : undefined}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500 }}>{chatInfo?.username}</div>
          {type === "private" && (
            <div
              style={{
                fontSize: "12px",
                color: currentTheme.colors.secondaryText,
              }}
            >
              {chatInfo?.online ? t("chat.online") : t("chat.offline")}
            </div>
          )}
        </div>
        <Button
          type="text"
          icon={<InfoCircleOutlined />}
          onClick={() => {
            /* 显示聊天信息 */
          }}
        />
      </div>

      {/* 消息列表 */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "20px",
          background: currentTheme.colors.secondaryBackground,
        }}
      >
        {(messages ? messages : []).map((msg) => (
          <MessageItem
            key={msg?.id}
            message={msg}
            isSelf={msg?.sender_id === "1"}
            onReply={() => setReplyTo(msg)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div
        style={{
          padding: "16px",
          borderTop: `1px solid ${currentTheme.colors.border}`,
          background: currentTheme.colors.background,
        }}
      >
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          <Button
            type="text"
            icon={<PictureOutlined />}
            onClick={() => document.getElementById("upload-image")?.click()}
          >
            {t("chat.image")}
          </Button>
          <Button
            type="text"
            icon={<FileOutlined />}
            onClick={() => document.getElementById("upload-file")?.click()}
          >
            {t("chat.file")}
          </Button>
          <input
            id="upload-image"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                // handleFileUpload(url, "image");
              }
              e.target.value = "";
            }}
          />
          <input
            id="upload-file"
            type="file"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // handleFileUpload("#", "file", {
                //   name: file.name,
                //   size: file.size,
                //   type: file.type,
                //   url: "#",
                // });
              }
              e.target.value = "";
            }}
          />
        </div>
        <Input.TextArea
          placeholder={t("chat.inputPlaceholder")}
          autoSize={{ minRows: 1, maxRows: 4 }}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              const content = e.currentTarget.value.trim();
              if (content) {
                handleSend(content);
                e.currentTarget.value = "";
              }
            }
          }}
        />
      </div>

      {/* 图片预览 */}
      {/* <ImagePreview
        url={previewImage}
        visible={showImagePreview}
        onClose={() => setShowImagePreview(false)}
      /> */}
    </div>
  );
};

export default ChatWindow;
