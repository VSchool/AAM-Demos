import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/auth-store";
import { TaskStoreProvider } from "@/lib/task-store";

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
    "Cadence is a task board with a real backend: sign in, plan work across status columns, and your tasks follow you to any device.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // V8 has no server-provided initial tasks — the board loads from the API
  // (GET /api/tasks) once the user is authenticated. AuthProvider wraps
  // everything so the task store can scope its fetches to the logged-in user.
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${geistMono.variable}`}>
      <body>
        <AuthProvider>
          <TaskStoreProvider>
            <Nav />
            {children}
            <Footer />
          </TaskStoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
