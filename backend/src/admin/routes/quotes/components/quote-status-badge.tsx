import { StatusBadge } from "@medusajs/ui";
import { useTranslation } from "react-i18next";

const StatusColors: Record<string, "green" | "orange" | "red" | "blue"> = {
  accepted: "green",
  customer_rejected: "orange",
  merchant_rejected: "red",
  pending_merchant: "blue",
  pending_customer: "blue",
};

export default function QuoteStatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();

  const title = t(`quotes.status.${status}`, {
    defaultValue: status ? status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ") : "",
  });

  return (
    <StatusBadge color={StatusColors[status] || "blue"}>
      {title}
    </StatusBadge>
  );
}

