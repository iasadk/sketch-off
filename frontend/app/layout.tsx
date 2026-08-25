import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sketch Off",
  description: "Sketch Off is a free online drawing and guessing game where players take turns drawing and guessing each other's drawings in real-time. It's a fun and interactive way to test your artistic skills and creativity.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"
        style={{
          backgroundImage: 'url("/assets/background.png")',
          backgroundRepeat: "repeat",
        }}>
        {children}
        <Toaster toastOptions={{
          position:'bottom-right'
        }}/>
      </body>
    </html>
  );
}
