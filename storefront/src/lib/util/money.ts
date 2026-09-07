import { isEmpty } from "@/lib/util/isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale,
}: ConvertToLocaleParams) => {
  if (!currency_code || isEmpty(currency_code)) {
    return amount.toString()
  }

  const isVnd = currency_code.toLowerCase() === "vnd"
  const defaultLocale = locale || (isVnd ? "vi-VN" : "en-US")
  const defaultMinDigits = minimumFractionDigits ?? (isVnd ? 0 : 2)
  const defaultMaxDigits = maximumFractionDigits ?? (isVnd ? 0 : 2)

  return new Intl.NumberFormat(defaultLocale, {
    style: "currency",
    currency: currency_code,
    minimumFractionDigits: defaultMinDigits,
    maximumFractionDigits: defaultMaxDigits,
  }).format(amount)
}

