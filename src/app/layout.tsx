import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "F&W - Quản Lý Tài Chính & Đám Cưới (QH & YN)",
  description: "Ứng dụng theo dõi thu chi cá nhân & đám cưới an toàn, đồng bộ tự động bằng Supabase.",
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
