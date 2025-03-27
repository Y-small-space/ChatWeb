'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Button, Card, Col, Input, message, Modal, Row, Image } from 'antd';
import {
  ArrowLeftOutlined,
  PictureOutlined,
  TeamOutlined,
  FileOutlined,
  StopOutlined,
  AudioOutlined,
  InfoCircleOutlined,
  CloseOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { MessageItem } from './MessageItem';
import { Message } from '../../services/types';
import { api } from 'src/services/api';
import { useWebSocket } from 'src/contexts/WebSocketContext';
import { formatDistance } from 'date-fns';
import { zhCN, enUS } from "date-fns/locale";

const { Search } = Input;

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
  reply?: any;
  filename?: string
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

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

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
  const [isListening, setIsListening] = useState(false); // 语音输入状态
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isShowMessagesModal, setIsShowMessagesModal] = useState(false)
  const [messageHistory, setMessageHistory] = useState();
  const [reply, setReply] = useState()
  const { currentLanguage } = useLanguage();
  console.log(messages);
  const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
    console.log('input', value);
    if (String(value) === '') {
      setMessageHistory(messages)
      return
    }

    console.log(messageHistory.filter(i => i.content.includes(value)))
    setMessageHistory(messageHistory.filter(i => i.content.includes(String(value)) && i.type === 'text'))
  };

  // 处理发送消息
  const handleSend = (content: string) => {
    let newMessage: ChatMessage;
    if (!reply) {
      const user = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user') as string)
        : null;
      newMessage = {
        id: `m${Date.now()}`,
        type: 'text',
        content,
        sender_id: String(localStorage.getItem('userId')), // 当前用户 ID
        receiver_id: id,
        created_at: new Date().toISOString(),
        sender: String(user.username),
        receiver: chatInfo.username,
        status: 'sent',
      };
    } else {
      const user = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user') as string)
        : null;
      newMessage = {
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
        reply: [{ id: reply.id, sender: reply.sender, type: reply.type, created_at: reply.created_at, content: reply.content }]
      };
    }

    ws.sendMessage(newMessage)
    setMessages([...messages, newMessage]);
    setMessageText('')
    setReply('')
    getMessage()
  };

  const getMessage = async () => {
    const res: any = await api.chat.getMessagesById(userId, id);
    if (res) {
      setMessages(res.messages);
      setMessageHistory(res.messages)
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
        let messageUpload: ChatMessage;

        console.log('reply', reply);

        if (reply) {
          messageUpload = {
            id: `m${Date.now()}`,
            type,
            content: data.url,
            sender_id: String(localStorage.getItem('userId')), // 当前用户 ID
            receiver_id: id,
            created_at: new Date().toISOString(),
            sender: String(user.username),
            receiver: chatInfo.username,
            status: 'sent',
            filename: file.name,
            reply: [{ id: reply.id, sender: reply.sender, type: reply.type, created_at: reply.created_at, content: reply.content }],
          }
        } else {
          messageUpload = {
            id: `m${Date.now()}`,
            type,
            content: data.url,
            sender_id: String(localStorage.getItem('userId')), // 当前用户 ID
            receiver_id: id,
            created_at: new Date().toISOString(),
            sender: String(user.username),
            receiver: chatInfo.username,
            status: 'sent',
            filename: file.name,
          }
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
    // setReply('')
    // getMessage()
  };

  // 语音识别逻辑
  const handleVoiceInput = () => {
    if (!SpeechRecognition) {
      message.error('当前浏览器不支持语音输入');
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'zh-CN'; // 设置语言
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        message.success('正在聆听...');
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessageText(transcript); // 更新输入框
      };

      recognitionRef.current.onerror = (event) => {
        console.error('语音识别错误:', event.error);
        message.error('语音输入失败，请重试');
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // 开始录音
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        handleFileUpload(audioBlob, 'voice'); // 发送语音消息
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      message.error('无法访问麦克风');
    }
  };

  // 停止录音
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };


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

  useEffect(() => {
    getMessage();
    getMessageCurrent();
  }, []);

  useEffect(() => {
    const scrollTop = chatContainerRef.current?.scrollHeight

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
        </div>
        <div onClick={() => setIsShowMessagesModal(true)}><InfoCircleOutlined /></div>
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
            onReply={() => setReply(msg)}
            avatar={msg?.sender_id === userId ? user?.avatar : chatInfo?.avatar}
            showMessage={false}
            getMessage={getMessage}
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
        {
          reply && <>
            <Row>
              <Col span={23}><Card style={{ width: "100%", display: "flex" }}>
                <div>
                  {renderContent(reply)}

                </div>
                {/* 消息时间和状态 */}
                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "12px",
                    color: currentTheme.colors.secondaryText,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {formatDistance(new Date(reply.created_at), new Date(), {
                    addSuffix: true,
                    locale: currentLanguage === "zh" ? zhCN : enUS,
                  })}
                  {/* {isSelf && getStatusIcon()} */}
                </div>
              </Card></Col>
              <Col span={1} style={{ paddingLeft: '10px' }}>
                <CloseOutlined onClick={() => setReply('')} />
              </Col>
            </Row>

          </>
        }
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
          <Button
            type='text'
            icon={isListening ? <StopOutlined /> : <AudioOutlined />}
            onClick={handleVoiceInput}
          >
            {isListening ? '停止' : '语音输入'}
          </Button>
          <Button type='text' icon={isRecording ? <StopOutlined /> : <AudioOutlined />} onClick={isRecording ? stopRecording : startRecording} >发送语音</Button>
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
      <Modal title="聊天记录" centered open={isShowMessagesModal} onCancel={() => setIsShowMessagesModal(false)} footer="" width={600} style={{ height: "600px", overflow: "auto" }}>
        <Search placeholder="" onSearch={onSearch} size='middle' style={{ margin: "10px 0px" }} />
        {
          messageHistory?.map(i => <MessageItem
            key={i?.id}
            message={i}
            isSelf={false}
            avatar={i?.sender_id === userId ? user?.avatar : chatInfo?.avatar}
            showMessage={true}
            onReply={() => setReply(i)}
          />)
        }
      </Modal>
    </div>
  );
};

export default ChatWindow;
