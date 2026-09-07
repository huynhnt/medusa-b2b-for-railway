"use client"

import { useTranslations } from "@/lib/i18n"
import { useCart } from "@/lib/context/cart-context"
import { getCheckoutStep } from "@/lib/util/get-checkout-step"
import CartToCsvButton from "@/modules/cart/components/cart-to-csv-button"
import CartTotals from "@/modules/cart/components/cart-totals"
import PromotionCode from "@/modules/checkout/components/promotion-code"
import Button from "@/modules/common/components/button"
import Divider from "@/modules/common/components/divider"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { RequestQuoteConfirmation } from "@/modules/quotes/components/request-quote-confirmation"
import { RequestQuotePrompt } from "@/modules/quotes/components/request-quote-prompt"
import { B2BCustomer } from "@/types"
import { ApprovalStatusType } from "@/types/approval"
import { ExclamationCircle } from "@medusajs/icons"
import { Container } from "@medusajs/ui"

type SummaryProps = {
  customer: B2BCustomer | null
  spendLimitExceeded: boolean
}

const Summary = ({ customer, spendLimitExceeded }: SummaryProps) => {
  const { t } = useTranslations()
  const { handleEmptyCart, cart } = useCart()

  if (!cart) return null

  const checkoutStep = getCheckoutStep(cart)
  const checkoutPath = checkoutStep
    ? `/checkout?step=${checkoutStep}`
    : "/checkout"

  const checkoutButtonLink = customer ? checkoutPath : "/account"

  const isPendingApproval = cart?.approvals?.some(
    (approval) => approval?.status === ApprovalStatusType.PENDING
  )

  return (
    <Container className="flex flex-col gap-y-3">
      <CartTotals />
      <Divider />
      <PromotionCode cart={cart} />
      <Divider className="my-6" />
      {spendLimitExceeded && (
        <div className="flex items-center gap-x-2 bg-neutral-100 p-3 rounded-md shadow-borders-base">
          <ExclamationCircle className="text-orange-500 w-fit overflow-visible" />
          <p className="text-neutral-950 text-xs">
            {t(
              "cart.spendingLimitWarning",
              undefined,
              "Đơn hàng này vượt quá hạn mức chi tiêu của bạn. Vui lòng liên hệ người quản lý để được phê duyệt."
            )}
          </p>
        </div>
      )}
      <LocalizedClientLink
        href={checkoutButtonLink}
        data-testid="checkout-button"
      >
        <Button
          className="w-full h-10 rounded-full shadow-none"
          disabled={spendLimitExceeded}
        >
          {customer
            ? spendLimitExceeded
              ? t("cart.spendingLimitExceededBtn", undefined, "Vượt quá hạn mức chi tiêu")
              : t("cart.checkout", undefined, "Tiến hành đặt hàng")
            : t("cart.loginToCheckout", undefined, "Đăng nhập để đặt hàng")}
        </Button>
      </LocalizedClientLink>
      {!!customer && (
        <RequestQuoteConfirmation>
          <Button
            className="w-full h-10 rounded-full shadow-borders-base"
            variant="secondary"
            disabled={isPendingApproval}
          >
            {t("cart.requestQuote", undefined, "Yêu cầu báo giá")}
          </Button>
        </RequestQuoteConfirmation>
      )}
      {!customer && (
        <RequestQuotePrompt>
          <Button
            className="w-full h-10 rounded-full shadow-borders-base"
            variant="secondary"
            disabled={isPendingApproval}
          >
            {t("cart.requestQuote", undefined, "Yêu cầu báo giá")}
          </Button>
        </RequestQuotePrompt>
      )}
      <CartToCsvButton cart={cart} />
      <Button
        onClick={handleEmptyCart}
        className="w-full h-10 rounded-full shadow-borders-base"
        variant="secondary"
        disabled={isPendingApproval}
      >
        {t("cart.emptyCart", undefined, "Xóa toàn bộ giỏ hàng")}
      </Button>
    </Container>
  )
}


export default Summary
