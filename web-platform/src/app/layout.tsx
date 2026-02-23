import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import GlobalLogoHeader from "@/components/GlobalLogoHeader";

export const metadata = {
  title: "Canvas Communities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <GlobalLogoHeader />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
