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
  const [moments, setMoments] = useState([]);
  const [commentInput, setCommentInput] = useState<{ [key: string]: string }>(
    {}
  );
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [loading, setLoading] = useState(false);

  // 头部背景图
  const headerStyle = {
    height: "300px",
    background: `url(https://picsum.photos/1200/400)`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative" as const,
    marginBottom: "60px",
  };

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
      <div style={headerStyle}>
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
            src={"https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
          />
        </div>
      </div>

      {/* 发布动态按钮 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: "sticky",
          top: 20,
          zIndex: 100,
          padding: "0 20px",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <Card
          style={{
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Avatar size={40}>Me</Avatar>
            <Input
              placeholder={t("moments.contentPlaceholder")}
              style={{
                borderRadius: "20px",
                backgroundColor: currentTheme.colors.secondaryBackground,
              }}
              suffix={
                <Space>
                  <Button type="text" icon={<PictureOutlined />} />
                  <Button type="text" icon={<CameraOutlined />} />
                </Space>
              }
            />
          </div>
        </Card>
      </motion.div>

      {/* 动态列表 */}
      <div
        style={{ maxWidth: "600px", margin: "20px auto", padding: "0 20px" }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size={20}>
          <AnimatePresence>
            {moments.map((moment, index) => (
              <motion.div
                key={moment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  style={{
                    borderRadius: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* 用户信息 */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    <Avatar src={moment.user.avatar} size={44} />
                    <div style={{ marginLeft: 12 }}>
                      <div style={{ fontWeight: 600 }}>{moment.user.name}</div>
                      <div
                        style={{
                          fontSize: 12,
                          color: currentTheme.colors.secondaryText,
                        }}
                      >
                        {formatDistance(
                          new Date(moment.created_at),
                          new Date(),
                          {
                            addSuffix: true,
                            locale: currentLanguage === "zh" ? zhCN : enUS,
                          }
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 动态内容 */}
                  <div style={{ fontSize: 16, marginBottom: 16 }}>
                    {moment.content}
                  </div>

                  {/* 图片展示 */}
                  {moment.images && (
                    <Image.PreviewGroup>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            moment.images.length === 1
                              ? "1fr"
                              : "repeat(auto-fill, minmax(180px, 1fr))",
                          gap: 8,
                          marginBottom: 16,
                          borderRadius: 12,
                          overflow: "hidden",
                        }}
                      >
                        {moment.images.map((img, index) => (
                          <Image
                            key={index}
                            src={img}
                            alt={`动态图片 ${index + 1}`}
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              height:
                                moment.images.length === 1 ? "auto" : "180px",
                            }}
                          />
                        ))}
                      </div>
                    </Image.PreviewGroup>
                  )}

                  {/* 操作栏 */}
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      padding: "12px 0",
                      borderTop: `1px solid ${currentTheme.colors.border}`,
                      borderBottom: showComments[moment.id]
                        ? `1px solid ${currentTheme.colors.border}`
                        : "none",
                    }}
                  >
                    <Button
                      type="text"
                      icon={
                        moment.liked ? (
                          <LikeFilled style={{ color: "#ff2d55" }} />
                        ) : (
                          <LikeOutlined />
                        )
                      }
                      onClick={() => handleLike(moment.id)}
                    >
                      {moment.likes} {t("moments.likes")}
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
                      {moment.comments.length} {t("moments.comments")}
                    </Button>
                  </div>

                  {/* 评论区 */}
                  <AnimatePresence>
                    {showComments[moment.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div style={{ padding: "12px 0" }}>
                          {moment.comments.map((comment) => (
                            <div
                              key={comment.id}
                              style={{
                                display: "flex",
                                gap: 8,
                                marginBottom: 12,
                                padding: "8px 12px",
                                borderRadius: "12px",
                                background:
                                  currentTheme.colors.secondaryBackground,
                              }}
                            >
                              <Avatar src={comment.user.avatar} size={32} />
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 500 }}>
                                  {comment.user.name}
                                </div>
                                <div>{comment.content}</div>
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: currentTheme.colors.secondaryText,
                                    marginTop: 4,
                                  }}
                                >
                                  {formatDistance(
                                    new Date(comment.created_at),
                                    new Date(),
                                    {
                                      addSuffix: true,
                                      locale:
                                        currentLanguage === "zh" ? zhCN : enUS,
                                    }
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          <div
                            style={{ display: "flex", gap: 8, marginTop: 12 }}
                          >
                            <Input.TextArea
                              value={commentInput[moment.id] || ""}
                              onChange={(e) =>
                                setCommentInput((prev) => ({
                                  ...prev,
                                  [moment.id]: e.target.value,
                                }))
                              }
                              placeholder={t("moments.commentPlaceholder")}
                              autoSize={{ minRows: 1, maxRows: 4 }}
                              style={{
                                flex: 1,
                                borderRadius: "20px",
                                backgroundColor:
                                  currentTheme.colors.secondaryBackground,
                              }}
                            />
                            <Button
                              type="primary"
                              onClick={() => handleComment(moment.id)}
                              style={{ borderRadius: "20px" }}
                            >
                              {t("moments.send")}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </Space>
      </div>
    </div>
  );
}
