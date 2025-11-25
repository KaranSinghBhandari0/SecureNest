import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "SecureNest",
  description: "Save your passwords securely",
  icons: {
    icon: "/images/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Navbar />
        <main className="min-h-[calc(100vh-56px)] mt-14">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
