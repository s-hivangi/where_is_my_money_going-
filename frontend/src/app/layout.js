import { Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "FinSight",
  description: "AI-Powered Personal Finance Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-[#0a0a0f] text-white`}>
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-6 overflow-auto">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
