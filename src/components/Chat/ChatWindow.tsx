'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Button, Input, message } from 'antd';
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
  const [messageText, setMessageText] = useState();
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const ws = useWebSocket();
  const userId = localStorage.getItem("userId");
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);

  console.log(messages);


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
    ws.sendMessage(newMessage)
    setMessages([...messages, newMessage]);
    setMessageText('')
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

  const handleFileUpload = async (file: File, type: string) => {
    setLoading(true);

    // 创建 FormData 对象，将文件和类型加入
    const formData = new FormData();
    formData.append('file', file);
    console.log('filename', file.name);


    try {
      // 调用后端的文件上传接口 (请替换为你实际的 API 地址)
      const response = await fetch('http://localhost:8080/api/v1/file/uploadFile', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        // 文件上传成功，返回文件 URL
        message.success(`上传成功`);
        console.log('Uploaded file URL:', data.url);  // 打印文件 URL 或者在 UI 中显示
        const messageUpload = {
          id: `m${Date.now()}`,
          type,
          content: data.url,
          sender_id: String(localStorage.getItem('userId')), // 当前用户 ID
          receiver_id: id,
          created_at: new Date().toISOString(),
          sender: String(user.username),
          receiver: chatInfo.username,
          status: 'sent',
          filename: file.name
        }
        setMessages([...messages, messageUpload]);
        ws.sendMessage(messageUpload)
      } else {
        message.error(`上传失败: ${data.error}`);
      }
    } catch (error) {
      message.error('文件上传出错');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMessage();
    getMessageCurrent();
  }, []);

  useEffect(() => {
    const scrollTop = chatContainerRef.current?.scrollHeight

    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: scrollTop });
    }

    console.log(messages);

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
            onClick={() => {
              document.getElementById('upload-image')?.click()
            }}
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
          {/* 图片 */}
          <input
            id='upload-image'
            type='file'
            accept='image/*'
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.size <= 2 * 1024 * 1024) {
                  // 小于等于 2MB，作为可预览的图片发送
                  handleFileUpload(file, 'image');
                } else {
                  // 大于 2MB，作为文件发送
                  handleFileUpload(file, 'file');
                }
              }
              e.target.value = ''; // 清空文件输入框
            }}
          />
          {/* 文件 */}
          <input
            id='upload-file'
            type='file'
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleFileUpload(file, 'file');
              }
              e.target.value = ''; // 清空文件输入框
            }}
          />
        </div>
        {/* 文本 */}
        <Input.TextArea
          placeholder={t('chat.inputPlaceholder')}
          autoSize={{ minRows: 1, maxRows: 4 }}
          value={messageText}
          onChange={e => setMessageText(String(e.target.value))}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              const content = messageText.trim();
              if (content) {
                handleSend(content);
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
