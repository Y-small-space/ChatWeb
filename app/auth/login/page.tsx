"use client"; // 启用 React 服务器组件的客户端模式

import { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../src/store/slices/authSlice"; // 引入 Redux 登录操作
import { RootState } from "../../../src/store"; // 获取全局 state 类型
import { useLanguage } from "../../../src/contexts/LanguageContext"; // 使用多语言 hook
import Link from "next/link";
import { AuthLayout } from "../../../src/components/Auth/AuthLayout"; // 认证页面布局组件
import { useTheme } from "../../../src/contexts/ThemeContext"; // 使用主题 hook

export default function LoginPage() {
  const router = useRouter(); // Next.js 路由
  const dispatch = useDispatch(); // Redux 派发函数
  const { t } = useLanguage(); // 获取翻译函数
  const { currentTheme } = useTheme(); // 获取当前主题
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  ); // 获取 Redux 中的认证状态和加载状态

  // 监听 isAuthenticated 状态，已登录则跳转首页
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // 登录表单提交处理
  const onFinish = async (values: { email: string; password: string }) => {
    try {
      // 触发 Redux 登录 action，并等待结果
      const result = await dispatch(login(values)).unwrap();
      message.success(t("auth.loginSuccess")); // 显示登录成功消息
      router.push("/"); // 跳转到首页
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message); // 显示错误信息
      } else {
        message.error(t("auth.loginError")); // 默认错误信息
      }
    }
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
