import { getBaseURL } from "@/lib/util/env"
import { I18nProvider } from "@/lib/i18n"
import { Toaster } from "@medusajs/ui"
import { Analytics } from "@vercel/analytics/next"
import { GeistSans } from "geist/font/sans"
import { Metadata } from "next"
import "@/styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="vi" data-mode="light" className={GeistSans.variable}>
      <body>
        <I18nProvider initialLocale="vi">
          <main className="relative">{props.children}</main>
        </I18nProvider>
        <Toaster className="z-[99999]" position="bottom-left" />
        <Analytics />
      </body>
    </html>
  )
}

