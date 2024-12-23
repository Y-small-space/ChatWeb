"use client";

import React, { useEffect } from "react";
import { List, Avatar, Button, Spin } from "antd";
import { TeamOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "../../store/slices/groupsSlice";
import { RootState } from "../../store";
import { useRouter } from "next/navigation";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";

export default function GroupList() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const { groups, loading } = useSelector((state: RootState) => state.groups);

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>{t("groups.title")}</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/groups/create")}
        >
          {t("groups.create")}
        </Button>
      </div>

      <List
        itemLayout="horizontal"
        dataSource={groups}
        renderItem={(group) => (
          <List.Item
            style={{
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "8px",
              background: currentTheme.colors.background,
              cursor: "pointer",
              transition: "all 0.3s",
              ":hover": {
                background: "rgba(0, 0, 0, 0.02)",
              },
            }}
            onClick={() => router.push(`/chat/group/${group.group_id}`)}
          >
            <List.Item.Meta
              avatar={
                <Avatar size={48} icon={<TeamOutlined />} src={group.avatar} />
              }
              title={group.name}
              description={`${group.member_count} ${t("groups.members")}`}
            />
          </List.Item>
        )}
      />
    </div>
  );
}
