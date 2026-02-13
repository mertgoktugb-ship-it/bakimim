import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "bakimim.com | Araç Bakım Fiyatları",
  description: "Şen Kardeşler Araç Bakım Karşılaştırma Platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
