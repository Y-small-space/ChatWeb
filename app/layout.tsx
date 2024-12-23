"use client";

import { Providers } from "./providers";
import { GlobalTheme } from "../src/components/Theme/GlobalTheme";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";

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
            <GlobalTheme>{children}</GlobalTheme>
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
