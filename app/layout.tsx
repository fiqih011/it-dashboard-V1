import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IT Budgeting",
  description: "IT Budgeting System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
