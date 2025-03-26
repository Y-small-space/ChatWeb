'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Button, Input } from 'antd';
import {
  ArrowLeftOutlined,
  PictureOutlined,
  TeamOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { MessageItem } from './MessageItem';
import { Message } from '../../services/types';
import { wsManager } from '../../services/websocket';
import { api } from 'src/services/api';
import { useWebSocket } from 'src/contexts/WebSocketContext';

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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const ws = useWebSocket();
  const userId = localStorage.getItem("userId");
  const user = JSON.parse(localStorage.getItem("user"));

  // 处理发送消息
  const handleSend = (content: string) => {

    const user = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') as string)
      : null;
    const newMessage: ChatMessage = {
      id: `m${Date.now()}`,
      type: 'text',
      content,
      sender_id: String(localStorage.getItem('userId')), // 当前用户 ID
      receiver_id: id,
      // group_id: type === "group" ? id : undefined,
      created_at: new Date().toISOString(),
      sender: String(user.username),
      receiver: chatInfo.username,
      status: 'sent',
    };
    // wsManager.sendMessage(newMessage);
    ws.sendMessage(newMessage)
    setMessages([...messages, newMessage]);
  };

  const getMessage = async () => {
    const res: any = await api.chat.getMessagesById(userId, id);
    if (res) {
      setMessages(res.messages);
    }
  }

  const getMessageCurrent = () => {
    if (!ws) return;
    const handleMessage = (data: any) => {
      setMessages((prev) => [...prev, data]);
    };

    ws.onMessage = handleMessage;
  }
  useEffect(() => {
    getMessage();
    getMessageCurrent();
  }, []);

  useEffect(() => {
    const scrollTop = chatContainerRef.current?.scrollTop
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: scrollTop });
    }
  }, [messages])

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 聊天头部 */}
      <div
        style={{
          padding: '16px',
          borderBottom: `1px solid ${currentTheme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <Button
          type='text'
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
        />
        <Avatar
          src={
            chatInfo?.avatar ||
            'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
          }
          size={40}
          icon={type === 'group' ? <TeamOutlined /> : undefined}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500 }}>{chatInfo?.username}</div>
          {type === 'private' && (
            <div
              style={{
                fontSize: '12px',
                color: currentTheme.colors.secondaryText,
              }}
            >
              {chatInfo?.online ? t('chat.online') : t('chat.offline')}
            </div>
          )}
        </div>
      </div>

      {/* 消息列表 */}
      <div
        style={{
          flex: 1,
          maxHeight: "100%",
          overflow: 'auto',
          padding: '20px',
          background: currentTheme.colors.secondaryBackground,
        }}
        ref={chatContainerRef}
      >
        {(messages ? messages : []).map((msg: any) => (
          <MessageItem
            key={msg?.id}
            message={msg}
            isSelf={msg?.sender_id === userId}
            onReply={() => setReplyTo(msg)}
            avatar={msg?.sender_id === userId ? user?.avatar : chatInfo?.avatar}
          />
        ))}
      </div>

      {/* 输入区域 */}
      <div
        style={{
          padding: '16px',
          borderTop: `1px solid ${currentTheme.colors.border}`,
          background: currentTheme.colors.background,
        }}
      >
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <Button
            type='text'
            icon={<PictureOutlined />}
            onClick={() => document.getElementById('upload-image')?.click()}
          >
            {t('chat.image')}
          </Button>
          <Button
            type='text'
            icon={<FileOutlined />}
            onClick={() => document.getElementById('upload-file')?.click()}
          >
            {t('chat.file')}
          </Button>
          <input
            id='upload-image'
            type='file'
            accept='image/*'
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                // handleFileUpload(url, "image");
              }
              e.target.value = '';
            }}
          />
          <input
            id='upload-file'
            type='file'
            style={{ display: 'none' }}
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
              e.target.value = '';
            }}
          />
        </div>
        <Input.TextArea
          placeholder={t('chat.inputPlaceholder')}
          autoSize={{ minRows: 1, maxRows: 4 }}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              const content = e.currentTarget.value.trim();
              if (content) {
                handleSend(content);
                e.currentTarget.value = '';
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
