"use client";

import { Providers } from "./providers";
import { GlobalTheme } from "../src/components/Theme/GlobalTheme";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";
import { AuthCheck } from "../src/components/Auth/AuthCheck";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <Providers>
            <AuthCheck>
              <GlobalTheme>{children}</GlobalTheme>
            </AuthCheck>
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
