// 聊天类型定义
export interface ChatMessage {
  id: string;
  type: "text" | "image" | "file";
  content: string;
  sender_id: string;
  receiver_id?: string;
  group_id?: string;
  created_at: string;
  status: "sent" | "delivered" | "read";
  recalled?: boolean;
  reply_to?: string;
  file_info?: {
    name: string;
    size: number;
    type: string;
    url: string;
  };
}

export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  last_seen?: string;
}

export interface GroupChat {
  id: string;
  name: string;
  avatar: string;
  members: ChatUser[];
  created_at: string;
  owner_id: string;
  description?: string;
  announcement?: string;
}

// 模拟用户数据
export const mockChatUsers: ChatUser[] = [
  {
    id: "1",
    name: "张三",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    online: true,
  },
  {
    id: "2",
    name: "李四",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    online: false,
    last_seen: "2024-03-20T08:30:00Z",
  },
  {
    id: "3",
    name: "王五",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    online: true,
  },
  {
    id: "4",
    name: "赵六",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    online: true,
  },
  {
    id: "5",
    name: "小明",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
    online: false,
    last_seen: "2024-03-20T09:15:00Z",
  },
];

// 模拟群组数据
export const mockGroupChats: GroupChat[] = [
  {
    id: "g1",
    name: "项目讨论组",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=g1",
    members: mockChatUsers,
    created_at: "2024-01-01T00:00:00Z",
    owner_id: "1",
    description: "项目相关讨论",
    announcement: "下周一开始进入开发阶段",
  },
  {
    id: "g2",
    name: "周末活动群",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=g2",
    members: mockChatUsers.slice(0, 4),
    created_at: "2024-02-01T00:00:00Z",
    owner_id: "2",
    description: "周末活动安排",
  },
];

// 模拟私聊消息
export const mockPrivateMessages: { [key: string]: ChatMessage[] } = {
  "2": [ // 与李四的聊天
    {
      id: "p1",
      type: "text",
      content: "你好，最近在忙什么？",
      sender_id: "2",
      receiver_id: "1",
      created_at: "2024-03-20T09:00:00Z",
      status: "read",
      sender: mockChatUsers[1],
    },
    {
      id: "p2",
      type: "text",
      content: "在做一个新项目，你呢？",
      sender_id: "1",
      receiver_id: "2",
      created_at: "2024-03-20T09:01:00Z",
      status: "delivered",
      sender: mockChatUsers[0],
    },
    {
      id: "p3",
      type: "image",
      content: "https://images.unsplash.com/photo-1516912481808-3406841bd33c",
      sender_id: "2",
      receiver_id: "1",
      created_at: "2024-03-20T09:02:00Z",
      status: "delivered",
      sender: mockChatUsers[1],
    },
  ],
  "3": [ // 与王五的聊天
    {
      id: "p4",
      type: "text",
      content: "周末有空吗？一起打球？",
      sender_id: "3",
      receiver_id: "1",
      created_at: "2024-03-19T15:00:00Z",
      status: "read",
      sender: mockChatUsers[2],
    },
    {
      id: "p5",
      type: "text",
      content: "好啊，几点？",
      sender_id: "1",
      receiver_id: "3",
      created_at: "2024-03-19T15:05:00Z",
      status: "read",
      sender: mockChatUsers[0],
    },
    {
      id: "p6",
      type: "text",
      content: "下午2点，老地方见",
      sender_id: "3",
      receiver_id: "1",
      created_at: "2024-03-19T15:10:00Z",
      status: "read",
      sender: mockChatUsers[2],
    },
  ],
};

// 模拟群聊消息
export const mockGroupMessages: { [key: string]: ChatMessage[] } = {
  "g1": [ // 项目讨论组
    {
      id: "g1m1",
      type: "text",
      content: "大家看看这个设计稿",
      sender_id: "1",
      group_id: "g1",
      created_at: "2024-03-20T10:00:00Z",
      status: "delivered",
      sender: mockChatUsers[0],
    },
    {
      id: "g1m2",
      type: "file",
      content: "设计稿v1.0",
      sender_id: "1",
      group_id: "g1",
      created_at: "2024-03-20T10:01:00Z",
      status: "delivered",
      sender: mockChatUsers[0],
      file_info: {
        name: "design_v1.0.fig",
        size: 2048576,
        type: "application/fig",
        url: "#",
      },
    },
    {
      id: "g1m3",
      type: "text",
      content: "看起来不错，我这边开始开发",
      sender_id: "2",
      group_id: "g1",
      created_at: "2024-03-20T10:05:00Z",
      status: "delivered",
      sender: mockChatUsers[1],
    },
    {
      id: "g1m4",
      type: "text",
      content: "UI风格很现代，我很喜欢",
      sender_id: "3",
      group_id: "g1",
      created_at: "2024-03-20T10:07:00Z",
      status: "delivered",
      sender: mockChatUsers[2],
    },
    {
      id: "g1m5",
      type: "image",
      content: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d",
      sender_id: "4",
      group_id: "g1",
      created_at: "2024-03-20T10:10:00Z",
      status: "delivered",
      sender: mockChatUsers[3],
    },
    {
      id: "g1m6",
      type: "text",
      content: "这是我做的一些修改建议",
      sender_id: "4",
      group_id: "g1",
      created_at: "2024-03-20T10:11:00Z",
      status: "delivered",
      sender: mockChatUsers[3],
    },
  ],
  "g2": [ // 周末活动群
    {
      id: "g2m1",
      type: "text",
      content: "这周末去爬山怎么样？",
      sender_id: "2",
      group_id: "g2",
      created_at: "2024-03-19T16:00:00Z",
      status: "delivered",
      sender: mockChatUsers[1],
    },
    {
      id: "g2m2",
      type: "text",
      content: "天气不错，可以啊",
      sender_id: "1",
      group_id: "g2",
      created_at: "2024-03-19T16:02:00Z",
      status: "delivered",
      sender: mockChatUsers[0],
    },
    {
      id: "g2m3",
      type: "text",
      content: "我也想去！",
      sender_id: "3",
      group_id: "g2",
      created_at: "2024-03-19T16:05:00Z",
      status: "delivered",
      sender: mockChatUsers[2],
    },
    {
      id: "g2m4",
      type: "image",
      content: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
      sender_id: "2",
      group_id: "g2",
      created_at: "2024-03-19T16:10:00Z",
      status: "delivered",
      sender: mockChatUsers[1],
    },
    {
      id: "g2m5",
      type: "text",
      content: "这是上次我们去的地方，风景很好",
      sender_id: "2",
      group_id: "g2",
      created_at: "2024-03-19T16:11:00Z",
      status: "delivered",
      sender: mockChatUsers[1],
    },
  ],
};

// 获取聊天记录的辅助函数
export const getChatMessages = (chatId: string, isGroup: boolean = false) => {
  if (isGroup) {
    return mockGroupMessages[chatId] || [];
  }
  return mockPrivateMessages[chatId] || [];
};

// 获取聊天对象信息的辅助函数
export const getChatInfo = (chatId: string, isGroup: boolean = false) => {
  if (isGroup) {
    return mockGroupChats.find(group => group.id === chatId);
  }
  return mockChatUsers.find(user => user.id === chatId);
}; 