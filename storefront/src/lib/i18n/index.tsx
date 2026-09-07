"use client"

import React, { createContext, useContext, useEffect, useState, useTransition } from "react"
import viMessages from "@/messages/vi.json"
import enMessages from "@/messages/en.json"

export type Locale = "vi" | "en"

type Messages = typeof viMessages

const dictionaries: Record<Locale, any> = {
  vi: viMessages,
  en: enMessages,
}

export const getNestedValue = (obj: any, path: string): string | undefined => {
  if (!obj || typeof obj !== "object") return undefined
  return path.split(".").reduce((prev, curr) => prev?.[curr], obj)
}

export const interpolate = (
  text: string,
  params?: Record<string, string | number>
): string => {
  if (!params) return text
  let result = text
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), String(value))
    result = result.replace(new RegExp(`{\\s*${key}\\s*}`, "g"), String(value))
  })
  return result
}

export const translate = (
  locale: Locale,
  key: string,
  params?: Record<string, string | number>,
  defaultValue?: string
): string => {
  const currentDict = dictionaries[locale] || dictionaries.vi
  const fallbackDict = dictionaries.en

  let val = getNestedValue(currentDict, key)
  if (val === undefined || typeof val !== "string") {
    val = getNestedValue(fallbackDict, key)
  }

  if (typeof val === "string") {
    return interpolate(val, params)
  }

  return defaultValue || key
}

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>, defaultValue?: string) => string
}

const I18nContext = createContext<I18nContextType>({
  locale: "vi",
  setLocale: () => {},
  t: (key, params, defaultValue) => translate("vi", key, params, defaultValue),
})

export const I18nProvider = ({
  children,
  initialLocale = "vi",
}: {
  children: React.ReactNode
  initialLocale?: Locale
}) => {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const [, startTransition] = useTransition()

  useEffect(() => {
    // Check cookie or localStorage on client mount
    const savedLocale = (typeof window !== "undefined"
      ? localStorage.getItem("NEXT_LOCALE") ||
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("NEXT_LOCALE="))
          ?.split("=")[1]
      : null) as Locale | null

    if (savedLocale && (savedLocale === "vi" || savedLocale === "en")) {
      setLocaleState(savedLocale)
    } else {
      // If country in pathname is 'vn' or user browser language is vi
      if (typeof window !== "undefined") {
        const pathCountry = window.location.pathname.split("/")[1]?.toLowerCase()
        if (pathCountry === "vn") {
          setLocaleState("vi")
        }
      }
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    startTransition(() => {
      setLocaleState(newLocale)
      if (typeof window !== "undefined") {
        localStorage.setItem("NEXT_LOCALE", newLocale)
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
      }
    })
  }

  const t = (
    key: string,
    params?: Record<string, string | number>,
    defaultValue?: string
  ) => {
    return translate(locale, key, params, defaultValue)
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useTranslations = () => {
  const context = useContext(I18nContext)
  return context
}

export const useI18n = useTranslations
