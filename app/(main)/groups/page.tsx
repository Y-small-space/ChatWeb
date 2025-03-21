"use client";

import { Avatar, Button, Card, List } from "antd";
import { TeamOutlined, UserAddOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../../src/contexts/LanguageContext";
import { api } from 'src/services/api';
import { useEffect, useState } from 'react';
import { useTheme } from 'src/contexts/ThemeContext';

export default function GroupsPage() {
  const router = useRouter();
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const [groupList, setGroupList] = useState();

  const getGroupList = async () => {
    const res = await api.groups.getGroups();
    console.log(res.groups);
    setGroupList(res.groups)
  }

  useEffect(() => {
    getGroupList();
  }, [])

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px", display: "flex", gap: "16px" }}>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => router.push("/groups/create")}
        >
          {t("groups.create")}
        </Button>
      </div>

      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={groupList || []}
        renderItem={(group) => (
          <List.Item>
            <Card
              hoverable
              onClick={() => router.push(`/chat/group/${group.id}`)}
              style={{
                background: currentTheme.colors.background,
                borderColor: currentTheme.colors.border,
              }}
            >
              <Card.Meta
                avatar={
                  <Avatar
                    src={group.avatar}
                    size={48}
                    icon={<TeamOutlined />}
                  />
                }
                title={group.name}
                description={
                  <div>
                    <div>
                      {t("groups.members").replace(
                        "{count}",
                        String(group.members.length)
                      )}
                    </div>
                    <div style={{ color: currentTheme.colors.secondaryText }}>
                      {group.description}
                    </div>
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}
