import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "xecbot dashboard",
  description: "Supabase auth and streamed assistant responses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
