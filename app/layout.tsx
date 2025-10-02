// app/layout.tsx
import "./globals.css";
import SessionProviderWrapper from "./providers/SessionProviderWrapper";

export const metadata = {
  title: "Library Admin Portal",
  description: "Library Management System Admin Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
