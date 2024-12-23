"use client";

import { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../../src/store/slices/authSlice";
import { RootState } from "../../../src/store";
import { useLanguage } from "../../../src/contexts/LanguageContext";
import Link from "next/link";
import { AuthLayout } from "../../../src/components/Auth/AuthLayout";
import { useTheme } from "../../../src/contexts/ThemeContext";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const { currentTheme } = useTheme();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const onFinish = async (values: {
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
    phone?: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      message.error(t("auth.passwordMismatch"));
      return;
    }

    try {
      const registerData = {
        email: values.email,
        password: values.password,
        username: values.username,
        phone: values.phone,
      };
      await dispatch(register(registerData)).unwrap();
      message.success(t("auth.registerSuccess"));
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error(t("auth.registerError"));
      }
    }
  };

  return (
    <AuthLayout title={t("auth.register")}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          label={t("email")}
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
          name="username"
          label={t("username")}
          rules={[{ required: true, message: t("auth.usernameRequired") }]}
        >
          <Input
            size="large"
            placeholder={t("auth.usernamePlaceholder")}
            style={{
              height: "48px",
              borderRadius: "12px",
              fontSize: "16px",
            }}
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label={t("phone")}
          rules={[
            { pattern: /^1[3-9]\d{9}$/, message: t("auth.phoneInvalid") },
          ]}
        >
          <Input
            size="large"
            placeholder={t("auth.phonePlaceholder")}
            style={{
              height: "48px",
              borderRadius: "12px",
              fontSize: "16px",
            }}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={t("password")}
          rules={[
            { required: true, message: t("auth.passwordRequired") },
            { min: 6, message: t("auth.passwordTooShort") },
          ]}
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

        <Form.Item
          name="confirmPassword"
          label={t("confirmPassword")}
          rules={[
            { required: true, message: t("auth.confirmPasswordRequired") },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t("auth.passwordMismatch")));
              },
            }),
          ]}
        >
          <Input.Password
            size="large"
            placeholder={t("auth.confirmPasswordPlaceholder")}
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
            {t("auth.registerButton")}
          </Button>
        </Form.Item>

        <div
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: currentTheme.colors.secondaryText,
          }}
        >
          {t("auth.hasAccount")}{" "}
          <Link
            href="/auth/login"
            style={{
              color: currentTheme.colors.primary,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            {t("auth.loginNow")}
          </Link>
        </div>
      </Form>
    </AuthLayout>
  );
}
