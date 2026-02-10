import "./globals.css";
import Layout from "@/components/Layout";

export const metadata = {
  title: "Canvas Communities",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
