import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat"; // استيراد مكون الذكاء الاصطناعي الجديد
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kemet AI",
  description: "حضارة الأجداد تلتقي بذكاء المستقبل",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // 1. فك الـ params أولاً للحصول على اللغة الحالية
  const { locale } = await params;
  
  // 2. تمرير الـ locale صراحةً لدالة getMessages
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col justify-between bg-white text-gray-900`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          
          {/* أيقونة ومساعد الذكاء الاصطناعي العائم */}
          <AIChat />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}