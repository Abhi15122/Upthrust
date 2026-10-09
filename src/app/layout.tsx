import { siteUrl } from "@/lib/sanity/site-url";
import type { Metadata } from "next";
import Script from "next/script";
import "@fontsource/inter/400.css";
import "@fontsource/inter/400-italic.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/900-italic.css";
import "@fontsource/anton/400.css";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: siteUrl(),
  icons: { icon: "/svgs/favicon.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const id = process.env.NEXT_PUBLIC_GTM_ID || process.env.PUBLIC_GTM_ID || "";
  return (
    <html lang="en">
      <body>
        <a
          className="fixed -top-[70px] left-5 z-100 bg-[#121212] px-5 py-3 text-white focus:top-4"
          href="#main"
        >
          Skip to content
        </a>
        {children}
        {/^GTM-[A-Z0-9]+$/.test(id) && (
          <Script
            id="gtm"
            strategy="afterInteractive"
          >{`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtm.js?id=${id}';document.head.appendChild(s);`}</Script>
        )}
      </body>
    </html>
  );
}
