import i18next from "i18next";

export const formatAmount = (amount: number, currency_code: string) => {
  const currentLang = i18next.language || "vi";
  const locale = currentLang.startsWith("vi") ? "vi-VN" : "en-US";
  const isVnd = currency_code?.toLowerCase() === "vnd";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency_code,
    maximumFractionDigits: isVnd ? 0 : 2,
    minimumFractionDigits: isVnd ? 0 : 2,
  }).format(amount);
};

