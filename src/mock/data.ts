export const mockRecentChats = [
  {
    id: "1",
    name: "张三",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    lastMessage: "今天晚上要一起吃饭吗？",
    timestamp: "14:30",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "李四",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    lastMessage: "项目进展如何？",
    timestamp: "昨天",
    unread: 0,
    online: false,
  },
  // ... 更多聊天记录
];

export const mockFriends = [
  {
    id: "1",
    name: "张三",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    online: true,
    status: "我正在使用ChatWeb",
  },
  {
    id: "2",
    name: "李四",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    online: false,
    status: "忙碌中",
  },
  // ... 更多好友
];

export const mockGroups = [
  {
    id: "1",
    name: "项目讨论组",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=1",
    memberCount: 8,
    lastActive: "刚刚",
  },
  {
    id: "2",
    name: "周末活动群",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=2",
    memberCount: 16,
    lastActive: "1小时前",
  },
  // ... 更多群组
];

export const mockMoments = [
  {
    id: "1",
    user_id: "1",
    user: {
      name: "张三",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    },
    content: "今天天气真好，出去散步了 🌞",
    images: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d",
    ],
    created_at: "2024-03-20T10:00:00Z",
    likes: 12,
    comments: [
      {
        id: "c1",
        user: {
          name: "李四",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
        },
        content: "确实是个好天气！",
        created_at: "2024-03-20T10:30:00Z",
      },
    ],
    liked: false,
  },
  {
    id: "2",
    user_id: "2",
    user: {
      name: "李四",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    },
    content: "分享一首最近很喜欢的歌 🎵",
    images: [
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
    ],
    created_at: "2024-03-19T15:20:00Z",
    likes: 8,
    comments: [],
    liked: true,
  },
  {
    id: "3",
    user_id: "3",
    user: {
      name: "王五",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    },
    content: "新买的相机，拍摄效果不错 📸",
    images: [
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e",
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
      "https://images.unsplash.com/photo-1471922694854-ff1b63b20054",
    ],
    created_at: "2024-03-19T14:00:00Z",
    likes: 15,
    comments: [
      {
        id: "c2",
        user: {
          name: "张三",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
        },
        content: "照片拍得真好看！",
        created_at: "2024-03-19T14:30:00Z",
      },
      {
        id: "c3",
        user: {
          name: "李四",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
        },
        content: "用的什么相机？",
        created_at: "2024-03-19T14:35:00Z",
      },
    ],
    liked: false,
  },
  // ... 更多动态
]; 