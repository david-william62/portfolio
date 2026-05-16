import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "David William | Portfolio",
  description: "Bento-style portfolio with projects, skills, and social links."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
