import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sổ Thu Chi Pro - Quản Lý Tài Chính Cá Nhân & Bạn Bè",
  description: "Ứng dụng theo dõi thu chi cá nhân an toàn, bảo mật bằng Supabase và Google OAuth, giao diện hiện đại.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className={`${inter.className} bg-[#090d16] text-slate-100 min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
