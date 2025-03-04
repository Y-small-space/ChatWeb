"use client"; // 启用 React 服务器组件的客户端模式
import { Form, Input, Button, message } from "antd";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../../src/contexts/LanguageContext"; // 使用多语言 hook
import Link from "next/link";
import { AuthLayout } from "../../../src/components/Auth/AuthLayout"; // 认证页面布局组件
import { useTheme } from "../../../src/contexts/ThemeContext"; // 使用主题 hook
import { useState } from "react";
import { api } from "../../../src/services/api";
import { wsManager } from "../../../src/services/websocket";

export default function LoginPage() {
  const router = useRouter(); // Next.js 路由
  const { t } = useLanguage(); // 获取翻译函数
  const [loading, setLoading] = useState(false);
  const { currentTheme } = useTheme(); // 获取当前主题

  // 登录表单提交处理
  const onFinish = async (values: { email: string; password: string }) => {
    try {
      // 触发 Redux 登录 action，并等待结果
      setLoading(true);
      const response: any = await api.auth.login(values); // 调用登录 API
      if (response.code === 200) {
        // 如果登录成功
        const { token, ...userData } = response.data; // 拿到 token 和用户数据
        console.log(response);

        localStorage.setItem("token", token); // 将 token 存储到 localStorage
        localStorage.setItem("user", JSON.stringify(userData)); // 存储用户信息
        localStorage.setItem("userId", userData?.user_id); // 存储用户信息
        wsManager.connect();
      }
      router.push("/");
      setLoading(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message); // 显示错误信息
      } else {
        message.error(t("auth.loginError")); // 默认错误信息
      }
    }
    setLoading(false);
  };

  return (
    <AuthLayout title={t("auth.login")}>
      {/* 登录表单 */}
      <Form layout="vertical" onFinish={onFinish}>
        {/* 邮箱输入框 */}
        <Form.Item
          name="email"
          rules={[
            { required: true, message: t("auth.emailRequired") }, // 必填校验
            { type: "email", message: t("auth.emailInvalid") }, // 邮箱格式校验
          ]}
        >
          <Input
            size="large"
            placeholder={t("auth.emailPlaceholder")}
            style={{
              height: "48px",
              borderRadius: "12px",
              fontSize: "16px",
            }}
          />
        </Form.Item>

        {/* 密码输入框 */}
        <Form.Item
          name="password"
          rules={[{ required: true, message: t("auth.passwordRequired") }]}
        >
          <Input.Password
            size="large"
            placeholder={t("auth.passwordPlaceholder")}
            style={{
              height: "48px",
              borderRadius: "12px",
              fontSize: "16px",
            }}
          />
        </Form.Item>

        {/* 登录按钮 */}
        <Form.Item style={{ marginBottom: 12 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading} // 根据 Redux 状态控制加载状态
            style={{
              height: "48px",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 500,
            }}
          >
            {t("auth.loginButton")}
          </Button>
        </Form.Item>

        {/* 注册引导链接 */}
        <div
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: currentTheme.colors.secondaryText, // 主题文本颜色
          }}
        >
          {t("auth.noAccount")}{" "}
          <Link
            href="/auth/register"
            style={{
              color: currentTheme.colors.primary, // 主题主色
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            {t("auth.registerNow")}
          </Link>
        </div>
      </Form>
    </AuthLayout>
  );
}
