import type { Metadata, Viewport } from "next";
import type React from "react";
import "@/styles/globals.css";
import ThemeProvider from "../components/ThemeProvider";
import { getAppFont } from "@/lib/fonts";
import { novaConfig } from "@nova/config";

const appFont = getAppFont(novaConfig.theme.fontFamily);
const fontClassNames = [appFont.className, appFont.variable].filter(Boolean).join(" ");

export const metadata: Metadata = {
  title: "Novasphere Demo",
  description: "AI-native SaaS dashboard template",
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en" className={fontClassNames}>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
