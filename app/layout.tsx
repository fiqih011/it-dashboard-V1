// app/layout.tsx
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
