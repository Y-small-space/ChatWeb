"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../src/store";
import { ThemeProvider } from "../src/contexts/ThemeContext";
import { LanguageProvider } from "../src/contexts/LanguageContext";
import { AuthCheck } from "../src/components/Auth/AuthCheck";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import "../src/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ConfigProvider locale={zhCN}>
              <ThemeProvider>
                <LanguageProvider>
                  <AuthCheck>{children}</AuthCheck>
                </LanguageProvider>
              </ThemeProvider>
            </ConfigProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
