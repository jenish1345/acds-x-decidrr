import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DECIDR — Personal Mode",
  description:
    "DECIDR connects organizational decisions with individual execution without compromising privacy.",
  keywords: ["AI", "decision", "personal assistant", "scheduling", "B2B2C"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center">
                  <span className="text-white font-bold text-sm">D</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 tracking-tight">DECIDR</h1>
                  <p className="text-xs text-gray-500 font-medium">PERSONAL MODE</p>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <a href="http://localhost:5173" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md transition-colors flex items-center gap-2">
                Switch to Organization Mode →
              </a>
            </div>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
