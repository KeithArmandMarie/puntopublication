import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SkipLink } from "@/components/SkipLink";
import { SmoothScroll } from "@/components/SmoothScroll";
import { logo, siteDescription, siteName } from "@/config/site";
import { getMetadataBase } from "@/lib/site-url";
import { themeScript } from "@/lib/theme";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: { default: siteName, template: `%s | ${siteName}` },
  description: siteDescription,
  icons: { icon: logo.src },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-theme is set by the inline script before first paint, so React must
    // not treat the difference from the server HTML as an error.
    <html lang="en" suppressHydrationWarning className={`${plusJakartaSans.variable} h-full`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <SmoothScroll />
        <SkipLink />
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
