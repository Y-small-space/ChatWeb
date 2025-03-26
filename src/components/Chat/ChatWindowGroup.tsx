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
import { useWebSocket } from 'src/contexts/WebSocketContext';
import { api } from 'src/services/api';

interface ChatMessage {
  id: string;
  type: string;
  content: string;
  sender_id: string; // 当前用户 ID
  group_id?: string;
  created_at: string;
  sender: string;
  receiver?: string;
  status: string;
}

export const ChatWindowGroup = ({ id, GroupInfo }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const ws = useWebSocket();
  const userId = localStorage.getItem("userId")
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const GroupToName = localStorage.getItem('GroupToName')

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
      group_id: id,
      created_at: new Date().toISOString(),
      sender: String(user.username),
      status: 'sent',
    };
    ws.sendMessage(newMessage)
    setMessages([...messages, newMessage]);
  };

  const getMessage = async () => {
    const res: any = await api.chat.getGroupMessages(id)
    if (res) {
      setMessages(res.messages);
    }
  }

  const getMessageCurrent = () => {
    if (!ws) return;
    const handleMessage = (data: any) => {
      if (data.sender_id === userId || data.group_id !== id) return;
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
          size={40}
          icon={<TeamOutlined />}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500 }}>{GroupInfo?.name}</div>
          {/* {type === 'private' && (
            <div
              style={{
                fontSize: '12px',
                color: currentTheme.colors.secondaryText,
              }}
            >
              {chatInfo?.online ? t('chat.online') : t('chat.offline')}
            </div>
          )} */}
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

export default ChatWindowGroup;
