import type { Metadata } from "next";
import { Inter } from "next/font/google";  // ✅ Use Inter instead of Geist
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Agent Dispatcher Dashboard",
  description: "Real-time PR automation monitoring with AI-powered decision making",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>  {/* ✅ Use inter.className */}
        {children}
      </body>
    </html>
  );
}