"use client";

import React from "react";
import { Form, Input, Button, Card, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { createGroup } from "../../../../src/store/slices/groupSlice";
import { useTheme } from "../../../../src/contexts/ThemeContext";
import { useLanguage } from "../../../../src/contexts/LanguageContext";

export default function CreateGroupPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const [form] = Form.useForm();

  const handleSubmit = async (values: {
    name: string;
    description?: string;
    avatar?: string;
  }) => {
    try {
      await dispatch(createGroup(values)).unwrap();
      message.success(t("groups.createSuccess"));
      router.push("/groups");
    } catch (error) {
      message.error(t("groups.createError"));
    }
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
            name="avatar"
            style={{ textAlign: "center", marginBottom: "24px" }}
          >
            <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              action="/api/upload"
              maxCount={1}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传群头像</div>
              </div>
            </Upload>
          </Form.Item>

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
