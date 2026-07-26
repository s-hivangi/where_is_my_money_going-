import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "Where Is My Money Going",
  description: "AI-Powered Personal Finance Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-[#0a0a0f] text-white`}>
        {children}
      </body>
    </html>
  );
}
