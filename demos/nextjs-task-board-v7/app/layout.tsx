import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { BoardStoreProvider } from "@/lib/board-store";
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
  title: "Cadence — a task board for engineering teams",
  description:
    "Cadence is a lightweight task board: plan work across status columns, filter and sort in a tap, and open any ticket to its own detail page.",
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
        <BoardStoreProvider>
          <TaskStoreProvider initial={initialTasks}>
            <Nav />
            {children}
            <Footer />
          </TaskStoreProvider>
        </BoardStoreProvider>
      </body>
    </html>
  );
}
