"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

const listNav = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "root-api",
    href: "/root-api",
  },
  {
    name: "dashboard",
    href: "/dashboard",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav>
          <div style={{ display: "flex" }}>
            {listNav.map((nav) => (
              <div
                key={nav.href}
                style={{
                  marginRight: "20px",
                }}
              >
                <Link href={nav.href}>{nav.name}</Link>
              </div>
            ))}
          </div>
        </nav>

        {children}

        <Analytics />
      </body>
    </html>
  );
}
