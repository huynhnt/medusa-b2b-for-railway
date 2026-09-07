"use client"

import InteractiveLink from "@/modules/common/components/interactive-link"
import { Heading, Text } from "@medusajs/ui"
import { useTranslations } from "@/lib/i18n"

const EmptyCartMessage = () => {
  const { t } = useTranslations()

  return (
    <div
      className="py-48 px-2 flex flex-col justify-center items-start"
      data-testid="empty-cart-message"
    >
      <Heading
        level="h1"
        className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
      >
        {t("cart.title", undefined, "Giỏ hàng")}
      </Heading>
      <Text className="text-base-regular mt-4 mb-6 max-w-[32rem]">
        {t(
          "cart.emptySubtitle",
          undefined,
          "Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm nổi bật của chúng tôi."
        )}
      </Text>
      <div>
        <InteractiveLink href="/store">
          {t("cart.exploreProducts", undefined, "Khám phá sản phẩm")}
        </InteractiveLink>
      </div>
    </div>
  )
}


export default EmptyCartMessage
