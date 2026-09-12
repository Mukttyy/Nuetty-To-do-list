import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nuetty — Everything To Do List",
  applicationName: "Nuetty",
  description: "A quiet workspace for everything you need to do.",
  icons: {
    icon: [{ url: "/nuetty-mark.png", type: "image/png" }],
    shortcut: "/nuetty-mark.png",
    apple: "/nuetty-mark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full flex flex-col font-sans bg-canvas text-primary selection:bg-accent-inbox/15 selection:text-accent-inbox">
        {children}
      </body>
    </html>
  );
}
