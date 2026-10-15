import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { AuthBootstrap } from "@/components/auth/auth-bootstrap";
import { MobileModeProvider } from "@/components/viewport/mobile-mode-provider";
import { MobileModeToggle } from "@/components/viewport/mobile-mode-toggle";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Presto - Préstamos y créditos",
  description: "Tu asistente financiero inteligente",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Presto",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1f3a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme'); if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}var r=document.documentElement;r.classList.remove('dark','light');r.classList.add(t);r.style.colorScheme=t;}catch(e){}})();",
          }}
        />
        <ThemeProvider>
          <MobileModeProvider>
            <AuthBootstrap />
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
            >
              <div className="absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-accent/20 blur-3xl" />
              <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-accent-strong/20 blur-3xl" />
            </div>
            <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
              <ThemeToggle />
              <MobileModeToggle />
            </div>
            {children}
            <InstallPrompt />
          </MobileModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}