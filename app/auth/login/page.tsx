"use client";

import { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../src/store/slices/authSlice";
import { RootState } from "../../../src/store";
import { useLanguage } from "../../../src/contexts/LanguageContext";
import Link from "next/link";
import { AuthLayout } from "../../../src/components/Auth/AuthLayout";
import { useTheme } from "../../../src/contexts/ThemeContext";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const { currentTheme } = useTheme();
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const result = await dispatch(login(values)).unwrap();
      message.success(t("auth.loginSuccess"));
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error(t("auth.loginError"));
      }
    }
  };

  return (
    <AuthLayout title={t("auth.login")}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: t("auth.emailRequired") },
            { type: "email", message: t("auth.emailInvalid") },
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

        <Form.Item style={{ marginBottom: 12 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
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

        <div
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: currentTheme.colors.secondaryText,
          }}
        >
          {t("auth.noAccount")}{" "}
          <Link
            href="/auth/register"
            style={{
              color: currentTheme.colors.primary,
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
