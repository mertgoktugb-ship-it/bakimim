import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// GOOGLE BURAYA BAKIYOR!
export const metadata: Metadata = {
  title: "bakımım.com | Güncel Araç Servis ve Bakım Fiyatları 2026",
  description: "Toyota, Honda, Mercedes ve tüm markaların yetkili ve özel servis bakım ücretlerini kıyaslayın. Gerçek kullanıcı faturalarıyla en güncel servis rehberi.",
  keywords: "araç bakım fiyatları, servis ücretleri 2026, periyodik bakım ne kadar, toyota bakım fiyatı, özel servis fiyatları, araba bakım masrafı",
  authors: [{ name: "bakımım.com" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow", // Google'a "sitemi tara ve listele" diyoruz.
  openGraph: {
    title: "bakımım.com | Servis Fiyatlarını Kıyasla",
    description: "Gerçek fatura verileriyle güncel servis ücretlerini öğrenin.",
    type: "website",
    locale: "tr_TR",
    url: "https://bakimim.com",
    siteName: "bakımım.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
