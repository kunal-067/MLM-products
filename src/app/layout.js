// import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import Link from "next/link";

// const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Richtrek || MLM",
  description: "Created by TECHBOOTH",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="/trekomi-logo.jpg" sizes="any" />
      <body>
        {children}
        <Toaster/>
      </body>
    </html>
  );
}
