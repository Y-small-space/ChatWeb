"use client";

import React, { useEffect, useRef } from "react";
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

interface ChatWindowProps {
  type: "private" | "group";
  id: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ type, id }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const [inputValue, setInputValue] = React.useState("");
  const [typingUsers, setTypingUsers] = React.useState<Set<string>>(new Set());
  const messageEndRef = React.useRef<HTMLDivElement>(null);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [forwardModalVisible, setForwardModalVisible] = React.useState(false);
  const [selectedMessage, setSelectedMessage] = React.useState<Message | null>(
    null
  );
  const [replyTo, setReplyTo] = React.useState<Message | null>(null);

  const { messages, loading } = useSelector((state: RootState) => state.chat);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { currentGroup } = useSelector((state: RootState) => state.groups);
  const { friends } = useSelector((state: RootState) => state.friends);
  const { groups } = useSelector((state: RootState) => state.groups);

  const chatInfo = type === "group" ? currentGroup : null; // 或者从用户列表获取私聊信息

  useEffect(() => {
    const unreadMessages = messages[id]?.filter(
      (msg) => msg.sender_id !== currentUser?.id && msg.status !== "read"
    );

    if (unreadMessages?.length) {
      const messageIds = unreadMessages.map((msg) => msg.id);
      wsManager.markMessagesAsRead(messageIds);
    }
  }, [messages, id, currentUser?.id]);

  const debouncedTyping = React.useCallback(
    debounce((typing: boolean) => {
      wsManager.sendTypingStatus(id, typing);
    }, 300),
    [id]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    debouncedTyping(!!e.target.value);
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages[id]?.length]);

  const renderMessageStatus = (message: Message) => {
    if (message.sender_id !== currentUser?.id) return null;

    return (
      <div
        style={{
          fontSize: "12px",
          marginTop: "4px",
          color: currentTheme.colors.secondaryText,
        }}
      >
        {message.status === "sent" && <CheckOutlined />}
        {message.status === "delivered" && <CheckCircleOutlined />}
        {message.status === "read" && (
          <Tooltip
            title={message.read_by?.map((reader) => (
              <div key={reader.user_id}>
                {reader.nickname}
                <br />
                {new Date(reader.read_at).toLocaleString()}
              </div>
            ))}
          >
            <CheckCircleFilled style={{ color: currentTheme.colors.primary }} />
          </Tooltip>
        )}
      </div>
    );
  };

  const handleSend = async () => {
    if (inputValue.trim()) {
      try {
        await dispatch(
          sendMessage({
            type: "text",
            content: inputValue.trim(),
            ...(type === "group" ? { group_id: id } : { receiver_id: id }),
          })
        ).unwrap();

        setInputValue("");
      } catch (error) {
        message.error(t("chat.sendError"));
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInfoClick = () => {
    if (type === "group") {
      router.push(`/groups/${id}`);
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setInputValue((prev) => prev + emoji.native);
  };

  const handleFileUpload = async (url: string) => {
    try {
      await dispatch(
        sendMessage({
          type: "image",
          content: url,
          ...(type === "group" ? { group_id: id } : { receiver_id: id }),
        })
      ).unwrap();
    } catch (error) {
      message.error(t("chat.sendError"));
    }
  };

  const handleRecallMessage = async (messageId: string) => {
    try {
      await dispatch(recallMessage({ messageId })).unwrap();
      message.success(t("chat.messageRecalled"));
    } catch (error) {
      message.error(t("chat.recallError"));
    }
  };

  const handleForward = async (targetIds: string[]) => {
    try {
      await Promise.all(
        targetIds.map((targetId) =>
          dispatch(
            sendMessage({
              type: selectedMessage!.type,
              content: selectedMessage!.content,
              ...(targetId.startsWith("group_")
                ? { group_id: targetId.replace("group_", "") }
                : { receiver_id: targetId }),
              forward_from: selectedMessage!.id,
            })
          )
        )
      );
      message.success(t("chat.forwardSuccess"));
      setForwardModalVisible(false);
    } catch (error) {
      message.error(t("chat.forwardError"));
    }
  };

  const getMessageMenu = (message: Message): MenuProps => ({
    items: [
      {
        key: "recall",
        label: t("chat.recall"),
        icon: <DeleteOutlined />,
        danger: true,
        disabled:
          message.sender_id !== currentUser?.id ||
          Date.now() - new Date(message.created_at).getTime() > 2 * 60 * 1000,
        onClick: () => handleRecallMessage(message.id),
      },
      {
        key: "forward",
        label: t("chat.forward"),
        icon: <ForwardOutlined />,
        onClick: () => {
          setSelectedMessage(message);
          setForwardModalVisible(true);
        },
      },
      {
        key: "reply",
        label: t("chat.reply"),
        icon: <MessageOutlined />,
        onClick: () => {
          setReplyTo(message);
          // 聚焦输入框
          const textarea = document.querySelector(
            ".chat-input"
          ) as HTMLTextAreaElement;
          if (textarea) {
            textarea.focus();
          }
        },
      },
    ],
  });

  const renderMessage = (message: Message) => {
    if (message.recalled) {
      return (
        <div style={{ fontStyle: "italic", opacity: 0.6 }}>
          {t("chat.messageRecalled")}
        </div>
      );
    }

    switch (message.type) {
      case "image":
        return (
          <img
            src={message.content}
            alt={t("chat.imageMessage")}
            style={{
              maxWidth: "100%",
              maxHeight: "200px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => setPreviewImage(message.content)}
          />
        );
      case "file":
        return (
          <a
            href={message.content}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit" }}
          >
            📎 {message.fileName || "文件"}
          </a>
        );
      default:
        return message.content;
    }
  };

  const handleMessageSelect = (messageId: string) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.style.backgroundColor = currentTheme.colors.highlight;
      setTimeout(() => {
        element.style.backgroundColor = "transparent";
      }, 2000);
    }
  };

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop === 0 && !loadingHistory && hasMore) {
      const firstMessage = messages[id]?.[0];
      if (!firstMessage) return;

      setLoadingHistory(true);
      try {
        const result = await dispatch(
          fetchMessages({
            ...(type === "group" ? { group_id: id } : { receiver_id: id }),
            before: firstMessage.created_at,
            limit: 20,
          })
        ).unwrap();

        if (result.messages.length < 20) {
          setHasMore(false);
        }

        // 保持滚动位置
        const container = messageContainerRef.current;
        const oldHeight = container?.scrollHeight || 0;
        setTimeout(() => {
          if (container) {
            container.scrollTop = container.scrollHeight - oldHeight;
          }
        }, 0);
      } catch (error) {
        message.error(t("chat.loadHistoryError"));
      } finally {
        setLoadingHistory(false);
      }
    }
  };

  const renderReplyMessage = (message: Message) => {
    if (!message.reply_to) return null;

    const replyMessage = messages[id]?.find((m) => m.id === message.reply_to);
    if (!replyMessage) return null;

    return (
      <div
        style={{
          padding: "4px 8px",
          backgroundColor: currentTheme.colors.hover,
          borderRadius: "4px",
          marginBottom: "4px",
          fontSize: "12px",
          cursor: "pointer",
        }}
        onClick={() => handleMessageSelect(replyMessage.id)}
      >
        <div style={{ color: currentTheme.colors.primary }}>
          {replyMessage.sender?.nickname}
        </div>
        <div style={{ color: currentTheme.colors.secondaryText }}>
          {replyMessage.type === "text"
            ? replyMessage.content.slice(0, 50)
            : t(`chat.${replyMessage.type}Message`)}
        </div>
      </div>
    );
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 聊天头部 */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: `1px solid ${currentTheme.colors.border}`,
          backgroundColor: currentTheme.colors.secondaryBackground,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          type="text"
          style={{ marginRight: "16px" }}
          onClick={() => router.push("/chat")}
        />
        <Avatar
          src={chatInfo?.avatar}
          icon={!chatInfo?.avatar && <TeamOutlined />}
          size={40}
          style={{ marginRight: "12px" }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, color: currentTheme.colors.text }}>
            {chatInfo?.name}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: currentTheme.colors.secondaryText,
            }}
          >
            {type === "group"
              ? `${chatInfo?.members?.length || 0} ${t("groups.members")}`
              : chatInfo?.online
              ? t("chat.online")
              : t("chat.offline")}
          </div>
        </div>
        <Tooltip title={t("chat.viewInfo")}>
          <Button
            type="text"
            icon={<InfoCircleOutlined />}
            onClick={handleInfoClick}
          />
        </Tooltip>
        <MessageSearch
          messages={messages[id] || []}
          onSelect={handleMessageSelect}
        />
      </div>

      {/* 消息区域 */}
      <div
        ref={messageContainerRef}
        onScroll={handleScroll}
        style={{ flex: 1, padding: "24px", overflow: "auto" }}
      >
        {loadingHistory && (
          <div style={{ textAlign: "center", padding: "16px" }}>
            <Spin />
          </div>
        )}
        {messages[id]?.map((message) => (
          <div
            key={message.id}
            id={`message-${message.id}`}
            style={{
              transition: "background-color 0.3s",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              {/* 消息内容 */}
              <div>
                {renderMessage(message)}
                {renderMessageStatus(message)}
              </div>

              {/* 消息操作菜单 */}
              {message.sender_id === currentUser?.id && !message.recalled && (
                <Dropdown
                  menu={getMessageMenu(message)}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <Button
                    type="text"
                    icon={<MoreOutlined />}
                    size="small"
                    style={{ opacity: 0.6 }}
                  />
                </Dropdown>
              )}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* 转发对话框 */}
      <Modal
        title={t("chat.forward")}
        open={forwardModalVisible}
        onCancel={() => setForwardModalVisible(false)}
        onOk={() => {
          const form = document.querySelector(
            ".forward-form"
          ) as HTMLFormElement;
          if (form) {
            form.submit();
          }
        }}
      >
        <Form className="forward-form" onFinish={handleForward}>
          <Form.Item
            name="targets"
            rules={[{ required: true, message: t("chat.selectTarget") }]}
          >
            <Select
              mode="multiple"
              placeholder={t("chat.selectForwardTarget")}
              style={{ width: "100%" }}
            >
              {friends.map((friend) => (
                <Select.Option key={friend.id} value={friend.id}>
                  {friend.nickname}
                </Select.Option>
              ))}
              {groups.map((group) => (
                <Select.Option
                  key={`group_${group.id}`}
                  value={`group_${group.id}`}
                >
                  {group.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 输入区域 */}
      <div
        style={{
          padding: "16px 24px",
          borderTop: `1px solid ${currentTheme.colors.border}`,
          backgroundColor: currentTheme.colors.secondaryBackground,
        }}
      >
        {typingUsers.size > 0 && (
          <div
            style={{
              fontSize: "12px",
              color: currentTheme.colors.secondaryText,
              padding: "4px 24px",
            }}
          >
            {Array.from(typingUsers)
              .map((userId) => {
                const user = chatInfo?.members?.find(
                  (m) => m.user_id === userId
                );
                return user?.nickname;
              })
              .join(", ")}{" "}
            {typingUsers.size === 1 ? t("chat.isTyping") : t("chat.areTyping")}
          </div>
        )}
        <div style={{ display: "flex", gap: "12px" }}>
          <EmojiPicker onSelect={handleEmojiSelect} />
          <FileUploader onUploadSuccess={handleFileUpload} />
          <Input.TextArea
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={t("chat.inputPlaceholder")}
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{ resize: "none" }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!inputValue.trim()}
          >
            {t("chat.send")}
          </Button>
        </div>
      </div>

      {/* 图片预览 */}
      <ImagePreview
        url={previewImage || ""}
        visible={!!previewImage}
        onClose={() => setPreviewImage(null)}
      />

      {/* 输入区域 */}
      <div>
        {replyTo && (
          <div
            style={{
              padding: "8px 24px",
              borderTop: `1px solid ${currentTheme.colors.border}`,
              backgroundColor: currentTheme.colors.secondaryBackground,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>{t("chat.replyTo")}:</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>
                  {replyTo.sender?.nickname}
                </div>
                <div style={{ color: currentTheme.colors.secondaryText }}>
                  {replyTo.type === "text"
                    ? replyTo.content.slice(0, 50)
                    : t(`chat.${replyTo.type}Message`)}
                </div>
              </div>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => setReplyTo(null)}
              />
            </div>
          </div>
        )}
        {/* ... 现有的输入区域代码 */}
      </div>
    </div>
  );
};

export default ChatWindow;
