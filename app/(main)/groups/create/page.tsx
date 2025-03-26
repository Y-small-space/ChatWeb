"use client";

import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useTheme } from "../../../../src/contexts/ThemeContext";
import { useLanguage } from "../../../../src/contexts/LanguageContext";
import { api } from 'src/services/api';
import { useRouter } from "next/navigation";

export default function CreateGroupPage() {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const [form] = Form.useForm();
  const router = useRouter();

  const handleSubmit = async (value) => {
    api.groups.createGroup(value)
    message.success("创建成功！");
    router.push("/groups")
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card
        style={{
          maxWidth: 600,
          margin: "0 auto",
          backgroundColor: currentTheme.colors.secondaryBackground,
          border: `1px solid ${currentTheme.colors.border}`,
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "32px",
            color: currentTheme.colors.text,
          }}
        >
          {t("groups.createTitle")}
        </h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label={t("groups.groupName")}
            rules={[
              {
                required: true,
                message: t("groups.groupNameRequired"),
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item name="description" label={t("groups.groupDescription")}>
            <Input.TextArea
              rows={4}
              placeholder={t("groups.groupDescriptionPlaceholder")}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              style={{ height: "40px" }}
            >
              {t("groups.create")}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
