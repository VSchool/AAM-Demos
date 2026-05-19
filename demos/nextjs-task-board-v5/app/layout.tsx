import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PaletteToggle from "@/components/PaletteToggle";
import { TaskStoreProvider } from "@/lib/task-store";
import { getTasks } from "@/lib/tasks";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cadence v5 — CRUD UI (local state, no persistence) | nextjs-task-board",
  description:
    "Progressive Next.js task-board demo · state v5 of 7. Create / edit / delete UI patterns running on local in-memory state. Real persistence is Week 6 territory.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialTasks = getTasks();
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${geistMono.variable}`}>
      <body>
        <TaskStoreProvider initial={initialTasks}>
          <Nav />
          {children}
          <Footer />
        <PaletteToggle />
        </TaskStoreProvider>
      </body>
    </html>
  );
}
