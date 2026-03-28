import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { EngineProvider } from "@/components/providers/EngineProvider";
import { ClientSettingsProvider } from "@/components/providers/ClientSettingsProvider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Omni-Tool App",
  description: "Hybrid-Online Enterprise Suite",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${geist.className} bg-slate-950 text-slate-50 min-h-screen`}>
        <ClientSettingsProvider>
          <EngineProvider>
            <Navbar />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 min-w-0">
                {children}
              </main>
            </div>
          </EngineProvider>
        </ClientSettingsProvider>
      </body>
    </html>
  );
}