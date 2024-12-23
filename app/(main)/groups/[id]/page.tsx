"use client";

import React, { useEffect } from "react";
import { Card, Avatar, List, Button, Skeleton, Popconfirm } from "antd";
import { TeamOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import {
  fetchGroupDetail,
  removeMember,
} from "../../../../src/store/slices/groupSlice";
import { RootState } from "../../../../src/store";
import { useTheme } from "../../../../src/contexts/ThemeContext";
import { useLanguage } from "../../../../src/contexts/LanguageContext";

export default function GroupDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const { currentGroup, loading } = useSelector(
    (state: RootState) => state.groups
  );
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (id) {
      dispatch(fetchGroupDetail(id as string));
    }
  }, [dispatch, id]);

  const handleRemoveMember = async (userId: string) => {
    try {
      await dispatch(removeMember(userId)).unwrap();
      message.success(t("groups.memberRemoved"));
    } catch (error) {
      message.error(t("groups.memberRemoveError"));
    }
  };

  if (loading || !currentGroup) {
    return <Skeleton active />;
  }

  const isAdmin = currentGroup.admin_id === currentUser?.id;

  return (
    <div style={{ padding: "24px" }}>
      <Card
        style={{
          backgroundColor: currentTheme.colors.secondaryBackground,
          border: `1px solid ${currentTheme.colors.border}`,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          {currentGroup.avatar ? (
            <Avatar src={currentGroup.avatar} size={80} />
          ) : (
            <Avatar icon={<TeamOutlined />} size={80} />
          )}
          <h1
            style={{
              marginTop: "16px",
              color: currentTheme.colors.text,
            }}
          >
            {currentGroup.name}
          </h1>
          <p style={{ color: currentTheme.colors.secondaryText }}>
            {currentGroup.description}
          </p>
        </div>

        <div>
          <h2
            style={{
              marginBottom: "16px",
              color: currentTheme.colors.text,
            }}
          >
            {t("groups.members")} ({currentGroup.members.length})
          </h2>
          <List
            dataSource={currentGroup.members}
            renderItem={(member) => (
              <List.Item
                actions={
                  isAdmin && member.user_id !== currentUser?.id
                    ? [
                        <Popconfirm
                          title={t("groups.confirmRemoveMember")}
                          onConfirm={() => handleRemoveMember(member.user_id)}
                          okText={t("common.yes")}
                          cancelText={t("common.no")}
                        >
                          <Button
                            type="text"
                            icon={<UserDeleteOutlined />}
                            danger
                          />
                        </Popconfirm>,
                      ]
                    : undefined
                }
              >
                <List.Item.Meta
                  avatar={<Avatar src={member.avatar} />}
                  title={
                    <span style={{ color: currentTheme.colors.text }}>
                      {member.nickname}
                    </span>
                  }
                  description={
                    <span style={{ color: currentTheme.colors.secondaryText }}>
                      {member.role === "admin"
                        ? t("groups.admin")
                        : t("groups.member")}
                    </span>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </Card>
    </div>
  );
}
