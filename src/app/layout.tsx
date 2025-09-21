import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Элитные квартиры и виллы в Дубае | WIZI PROPERTIES",
  description:
    "Индивидуальный подбор объектов недвижимости в Дубае с учетом бюджета и предпочтений. От 200 000 $",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
