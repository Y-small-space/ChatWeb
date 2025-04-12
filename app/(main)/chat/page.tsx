'use client';

import { useEffect, useState } from 'react';
import { Avatar, Badge, List } from 'antd';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../../src/contexts/ThemeContext';
import { wsManager } from '../../../src/services/websocket';
import { api } from '../../../src/services/api';
import { TeamOutlined } from '@ant-design/icons';
import { useWebSocket } from 'src/contexts/WebSocketContext';

interface ChatMessage {
  content: string;
  created_at: string;
  group_id: string;
  id: string;
  read_by: null;
  receiver_id: string;
  receiverer: string;
  sender: string;
  sender_id: string;
  status: string;
  type: string;
  updated_at: string;
  avatar: string;
}
export default function ChatListPage() {
  const router = useRouter();
  const { currentTheme } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>();
  const user = JSON.parse(localStorage.getItem('user') || '');
  const userId: string | null = localStorage.getItem('userId');
  const GroupToName = JSON.parse(localStorage.getItem('GroupToName') || '')
  const friendsList = JSON.parse(localStorage.getItem('userList') || '')
  const ws = useWebSocket();

  const getAllLastMessages = async () => {
    const { messages } = await api.chat.getAllLastMessages(String(userId), Object.keys(GroupToName));
    const idToAvatar = Object.fromEntries(friendsList.map(i => [i.id, i.avatar]))
    const messagesHandle = messages && Object.values(messages)
    console.log(messagesHandle);

    const result = [];
    if (Array.isArray(messagesHandle)) {
      messagesHandle.forEach((messageByIds) => {
        console.log(messageByIds[0].receiverer);
        if (Array.isArray(messageByIds)) {
          if (messageByIds[0].receiverer) {
            const unreadMessages = messageByIds.filter(i => i.sender_id !== userId && i.status === 'sent')
            const lastMessage = messageByIds.pop();
            result.push({
              ...lastMessage,
              unreadCount: unreadMessages.length,
              avatar: lastMessage.sender_id !== userId ? idToAvatar[messageByIds.pop().receiver_id] : idToAvatar[messageByIds.pop().sender_id]
            })
          } else {
            const unreadMessages = messageByIds.filter(i => !i.read_by.includes(userId) && i.sender_id !== userId)
            console.log(unreadMessages);

            const lastMessage = messageByIds.pop();
            result.push({
              ...lastMessage,
              unreadCount: unreadMessages.length,
              avatar: lastMessage.sender_id !== userId ? idToAvatar[messageByIds.pop().receiver_id] : idToAvatar[messageByIds.pop().sender_id]
            })
          }
        }
      })
    }
    console.log(result);
    setMessages(result);
  };

  useEffect(() => {
    wsManager.connect();
    const handleMessage = (data) => {
      if (data.type === "read") {
        console.log("updated!");
        getAllLastMessages()
        return;
      }
    };
    ws.onMessage = handleMessage;
    getAllLastMessages();

  }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <List
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px',
        }}
        dataSource={messages}
        renderItem={(chat: ChatMessage) => (
          <List.Item
            style={{
              padding: '12px',
              cursor: 'pointer',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              marginBottom: '8px',
              background: currentTheme.colors.background,
              border: 'none',
            }}
            onClick={() => {
              if (chat.receiverer === '') {
                router.push(`/chat/group/${chat.group_id}`);
                return;
              }
              router.push(
                `/chat/${chat?.type === 'group' ? 'group/' : ''}${chat?.sender_id === userId
                  ? chat?.receiver_id
                  : chat?.sender_id
                }`
              )
            }}
          >
            <List.Item.Meta
              avatar={
                <Badge
                  // dot={chat?.type === "private" && chat?.online}
                  offset={[-6, 28]}
                  color='green'
                >
                  {
                    chat.receiverer === '' ?
                      <Avatar
                        size={40}
                        icon={<TeamOutlined />}
                      /> :
                      <Avatar
                        src={
                          chat?.avatar ||
                          'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
                        }
                        size={48}
                      />
                  }

                </Badge>
              }
              title={
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: currentTheme.colors.text }}>
                    {chat.receiverer !== '' && ((chat?.sender === user.username)
                      ? chat?.receiverer
                      : chat?.sender)
                    }

                    {
                      chat && chat?.group_id !== '' && GroupToName[chat?.group_id]
                    }

                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: currentTheme.colors.secondaryText,
                    }}
                  >
                    {new Date(chat?.created_at).toLocaleString()}
                  </span>
                </div>
              }
              description={
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span
                    style={{
                      color: currentTheme.colors.secondaryText,
                      maxWidth: '70%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {chat?.content}
                  </span>
                  {chat?.unreadCount > 0 && (
                    <Badge
                      count={chat?.unreadCount}
                      style={{ backgroundColor: "#ff2d55" }}
                    />
                  )}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
}
