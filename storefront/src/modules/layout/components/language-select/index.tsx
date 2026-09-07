"use client"

import { useTranslations, Locale } from "@/lib/i18n"
import { clx } from "@medusajs/ui"
import { useState, useRef, useEffect } from "react"

const languages: { code: Locale; label: string; flag: string }[] = [
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", label: "English", flag: "🇺🇸" },
]

export default function LanguageSelect({ className }: { className?: string }) {
  const { locale, setLocale } = useTranslations()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLang = languages.find((l) => l.code === locale) || languages[0]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className={clx("relative inline-block text-left", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors"
      >
        <span>{currentLang.flag}</span>
        <span>{currentLang.label}</span>
      </button>

      {open && (
        <div className="absolute right-0 bottom-full mb-2 small:bottom-auto small:top-full small:mt-2 w-32 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setLocale(lang.code)
                setOpen(false)
              }}
              className={clx(
                "w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left hover:bg-neutral-100 transition-colors",
                locale === lang.code ? "font-semibold text-neutral-900 bg-neutral-50" : "text-neutral-600"
              )}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
