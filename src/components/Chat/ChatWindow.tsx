"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Input,
  message,
  Tooltip,
  Dropdown,
  Spin,
  Modal,
  Select,
  Form,
  Space,
} from "antd";
import {
  ArrowLeftOutlined,
  SendOutlined,
  SmileOutlined,
  PictureOutlined,
  TeamOutlined,
  InfoCircleOutlined,
  CheckOutlined,
  CheckCircleOutlined,
  CheckCircleFilled,
  DeleteOutlined,
  MoreOutlined,
  ForwardOutlined,
  MessageOutlined,
  CloseOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../src/store";
import {
  sendMessage,
  recallMessage,
} from "../../../src/store/slices/chatSlice";
import { wsManager } from "../../services/websocket";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { FileUploader } from "./FileUploader";
import { EmojiPicker } from "./EmojiPicker";
import { debounce } from "lodash";
import { ImagePreview } from "./ImagePreview";
import type { MenuProps } from "antd";
import { MessageSearch } from "./MessageSearch";
import { getChatMessages, getChatInfo } from "../../mock/chatData";
import { MessageItem } from "./MessageItem";

interface ChatWindowProps {
  type: "private" | "group";
  id: string;
  messages: ChatMessage[];
  chatInfo: ChatUser | GroupChat;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  type,
  id,
  messages: initialMessages,
  chatInfo,
}) => {
  const [messages, setMessages] = useState(initialMessages);
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // 处理发送消息
  const handleSend = (content: string) => {
    const newMessage: ChatMessage = {
      id: `m${Date.now()}`,
      type: "text",
      content,
      sender_id: "1", // 当前用户 ID
      receiver_id: type === "private" ? id : undefined,
      group_id: type === "group" ? id : undefined,
      created_at: new Date().toISOString(),
      status: "sent",
    };

    setMessages((prev) => [...prev, newMessage]);
    scrollToBottom();
  };

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = (
    url: string,
    fileType: "image" | "file",
    fileInfo?: {
      name: string;
      size: number;
      type: string;
      url: string;
    }
  ) => {
    const newMessage: ChatMessage = {
      id: `m${Date.now()}`,
      type: fileType,
      content: url,
      sender_id: "1",
      receiver_id: type === "private" ? id : undefined,
      group_id: type === "group" ? id : undefined,
      created_at: new Date().toISOString(),
      status: "sent",
      file_info: fileInfo,
    };

    setMessages((prev) => [...prev, newMessage]);
    scrollToBottom();
  };

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
          src={chatInfo.avatar}
          size={40}
          icon={type === "group" ? <TeamOutlined /> : undefined}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500 }}>{chatInfo.name}</div>
          {type === "private" && (
            <div
              style={{
                fontSize: "12px",
                color: currentTheme.colors.secondaryText,
              }}
            >
              {(chatInfo as ChatUser).online
                ? t("chat.online")
                : t("chat.offline")}
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
        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            isSelf={msg.sender_id === "1"}
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
                handleFileUpload(url, "image");
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
                handleFileUpload("#", "file", {
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  url: "#",
                });
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
          suffix={
            <Space>
              <EmojiPicker
                onSelect={(emoji) => {
                  const input = e.currentTarget;
                  const start = input.selectionStart || 0;
                  const end = input.selectionEnd || 0;
                  input.value =
                    input.value.substring(0, start) +
                    emoji.native +
                    input.value.substring(end);
                  input.focus();
                }}
              />
              <Button type="primary" icon={<SendOutlined />} />
            </Space>
          }
        />
      </div>

      {/* 图片预览 */}
      <ImagePreview
        url={previewImage}
        visible={showImagePreview}
        onClose={() => setShowImagePreview(false)}
      />
    </div>
  );
};

export default ChatWindow;
