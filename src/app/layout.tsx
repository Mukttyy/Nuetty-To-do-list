import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taskify — Minimalist Task Manager",
  description: "Things 3 & Linear-grade productivity task management system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-canvas text-primary selection:bg-accent-inbox/15 selection:text-accent-inbox">
        {children}
      </body>
    </html>
  );
}
