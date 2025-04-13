"use client";

import React, { useState } from "react";
import {
  Card,
  Avatar,
  Image,
  Button,
  Input,
  Space,
  Divider,
  message,
  Skeleton,
} from "antd";
import {
  LikeOutlined,
  LikeFilled,
  CommentOutlined,
  PictureOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { formatDistance } from "date-fns";
import { zhCN, enUS } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

const { TextArea } = Input;

export default function MomentsList() {
  const { currentTheme } = useTheme();
  const { t, currentLanguage } = useLanguage();
  const [moments, setMoments] = useState([
    {
      id: "m1",
      user: { name: "user004", avatar: "http://localhost:8080/uploads/avator/1743084021-WechatIMG6775.jpg" },
      content: "今天的天空真美 🌤️",
      images: [
        "http://localhost:8080/uploads/avator/1743079260-122589936_p0.jpg",
        "http://localhost:8080/uploads/avator/1743079260-122589936_p0.jpg",
        "http://localhost:8080/uploads/avator/1743080973-125754553_p0.jpg",
        "http://localhost:8080/uploads/avator/1743080973-125754553_p0.jpg",
        "http://localhost:8080/uploads/avator/1743081034-WechatIMG6772.jpg",
        "http://localhost:8080/uploads/avator/1743081034-WechatIMG6772.jpg",
        // 最多9张
      ],
      created_at: "2025-04-12T10:00:00Z",
      likes: 5,
      liked: false,
      comments: [
        {
          id: "c1",
          user: { name: "李四", avatar: "..." },
          content: "确实很美！",
          created_at: "...",
        },
      ],
    },
    {
      id: "m2",
      user: { name: "张三", avatar: "..." },
      content: "今天的天空真美 🌤️",
      images: [
        "http://localhost:8080/uploads/xx1.jpg",
        "http://localhost:8080/uploads/xx2.jpg",
        // 最多9张
      ],
      created_at: "2025-04-12T10:00:00Z",
      likes: 5,
      liked: false,
      comments: [
        {
          id: "c1",
          user: { name: "李四", avatar: "..." },
          content: "确实很美！",
          created_at: "...",
        },
      ],
    },
    {
      id: "m3",
      user: { name: "张三", avatar: "..." },
      content: "今天的天空真美 🌤️",
      images: [
        "http://localhost:8080/uploads/xx1.jpg",
        "http://localhost:8080/uploads/xx2.jpg",
        // 最多9张
      ],
      created_at: "2025-04-12T10:00:00Z",
      likes: 5,
      liked: false,
      comments: [
        {
          id: "c1",
          user: { name: "李四", avatar: "..." },
          content: "确实很美！",
          created_at: "...",
        },
      ],
    },
    {
      id: "m4",
      user: { name: "张三", avatar: "..." },
      content: "今天的天空真美 🌤️",
      images: [
        "http://localhost:8080/uploads/xx1.jpg",
        "http://localhost:8080/uploads/xx2.jpg",
        // 最多9张
      ],
      created_at: "2025-04-12T10:00:00Z",
      likes: 5,
      liked: false,
      comments: [
        {
          id: "c1",
          user: { name: "李四", avatar: "..." },
          content: "确实很美！",
          created_at: "...",
        },
      ],
    },
    {
      id: "m5",
      user: { name: "张三", avatar: "..." },
      content: "今天的天空真美 🌤️",
      images: [
        "http://localhost:8080/uploads/xx1.jpg",
        "http://localhost:8080/uploads/xx2.jpg",
        "http://localhost:8080/uploads/xx2.jpg",
        "http://localhost:8080/uploads/xx2.jpg",
        // 最多9张
      ],
      created_at: "2025-04-12T10:00:00Z",
      likes: 5,
      liked: false,
      comments: [
        {
          id: "c1",
          user: { name: "李四", avatar: "..." },
          content: "确实很美！",
          created_at: "...",
        },
      ],
    },
  ]);
  const [commentInput, setCommentInput] = useState<{ [key: string]: string }>(
    {}
  );
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '');

  // 用户头像样式
  const avatarContainerStyle = {
    position: "absolute" as const,
    bottom: "-40px",
    right: "20px",
    display: "flex",
    alignItems: "flex-end",
    gap: "12px",
  };

  const handleLike = (momentId: string) => {
    setMoments((prev) =>
      prev.map((moment) =>
        moment.id === momentId
          ? {
            ...moment,
            likes: moment.liked ? moment.likes - 1 : moment.likes + 1,
            liked: !moment.liked,
          }
          : moment
      )
    );
  };

  const handleComment = (momentId: string) => {
    if (!commentInput[momentId]?.trim()) return;

    const newComment = {
      id: `c${Date.now()}`,
      user: {
        name: "我",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=me",
      },
      content: commentInput[momentId],
      created_at: new Date().toISOString(),
    };

    setMoments((prev) =>
      prev.map((moment) =>
        moment.id === momentId
          ? {
            ...moment,
            comments: [...moment.comments, newComment],
          }
          : moment
      )
    );

    setCommentInput((prev) => ({ ...prev, [momentId]: "" }));
    message.success(t("moments.commentSuccess"));
  };

  return (
    <div style={{ background: currentTheme.colors.background }}>
      {/* 头部背景 */}
      <div style={{
        height: "500px",
        background: 'url("http://localhost:8080/uploads/background/01.png")',
        backgroundPosition: "center",
        position: "relative" as const,
        backgroundSize: 'fill',
      }}>
        <div style={avatarContainerStyle}>
          <div style={{ textAlign: "right", color: "#fff" }}>
            <h2 style={{ margin: 0, textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
              我的动态
            </h2>
            <p style={{ margin: 0, textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
              已发布 {moments.length} 条动态
            </p>
          </div>
          <Avatar
            size={80}
            style={{
              border: "4px solid #fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
          />
        </div>
        <div style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 10,
        }}>
          <Button
            type="primary"
            icon={<PictureOutlined />}
            onClick={() => {
              // 示例：跳转到发布页或弹出发布框
              console.log("发布动态");
            }}
          >
            发布
          </Button>
        </div>

      </div>
      {/* 动态列表 */}
      <div style={{ padding: "20px", maxWidth: 700, margin: "0 auto" }}>
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          moments.map((moment) => (
            <Card
              key={moment.id}
              style={{
                marginBottom: 20,
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              {/* 用户信息 */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                <Avatar src={moment.user.avatar} />
                <div style={{ marginLeft: 10 }}>
                  <strong>{moment.user.name}</strong>
                  <div style={{ fontSize: 12, color: "#999" }}>
                    {formatDistance(new Date(moment.created_at), new Date(), {
                      addSuffix: true,
                      locale: currentLanguage === "zh" ? zhCN : enUS,
                    })}
                  </div>
                </div>
              </div>

              {/* 文本内容 */}
              <div style={{ marginBottom: 10 }}>{moment.content}</div>

              {/* 九宫格图片 */}
              {moment.images?.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  {moment.images.slice(0, 9).map((img: string, idx: number) => (
                    <Image
                      key={idx}
                      src={img}
                      alt={`moment-img-${idx}`}
                      width="100%"
                      height={100}
                      style={{ objectFit: "cover", borderRadius: 8 }}
                    />
                  ))}
                </div>
              )}

              {/* 点赞和评论按钮 */}
              <Space style={{ marginTop: 10 }}>
                <Button
                  type="text"
                  icon={moment.liked ? <LikeFilled /> : <LikeOutlined />}
                  onClick={() => handleLike(moment.id)}
                >
                  {moment.likes}
                </Button>
                <Button
                  type="text"
                  icon={<CommentOutlined />}
                  onClick={() =>
                    setShowComments((prev) => ({
                      ...prev,
                      [moment.id]: !prev[moment.id],
                    }))
                  }
                >
                  {moment.comments?.length || 0}
                </Button>
              </Space>

              {/* 评论输入框 + 列表 */}
              <AnimatePresence>
                {showComments[moment.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: "hidden", marginTop: 10 }}
                  >
                    <Divider />
                    <div style={{ marginBottom: 8 }}>
                      {moment.comments.map((comment: any) => (
                        <div key={comment.id} style={{ marginBottom: 6 }}>
                          <strong>{comment.user.name}:</strong> {comment.content}
                        </div>
                      ))}
                    </div>
                    <TextArea
                      rows={2}
                      placeholder={t("moments.commentPlaceholder")}
                      value={commentInput[moment.id] || ""}
                      onChange={(e) =>
                        setCommentInput((prev) => ({
                          ...prev,
                          [moment.id]: e.target.value,
                        }))
                      }
                    />
                    <Button
                      type="primary"
                      size="small"
                      style={{ marginTop: 6 }}
                      onClick={() => handleComment(moment.id)}
                    >
                      {t("moments.submitComment")}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))
        )}
      </div>

    </div>
  );
}
