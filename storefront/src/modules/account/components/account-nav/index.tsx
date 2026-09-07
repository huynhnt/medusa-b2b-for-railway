"use client"

import { signout } from "@/lib/data/customer"
import { useTranslations } from "@/lib/i18n"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import ChevronDown from "@/modules/common/icons/chevron-down"
import FilePlus from "@/modules/common/icons/file-plus"
import MapPin from "@/modules/common/icons/map-pin"
import Package from "@/modules/common/icons/package"
import User from "@/modules/common/icons/user"
import { B2BCustomer } from "@/types/global"
import { ArrowRightOnRectangle, BuildingStorefront } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useParams, usePathname } from "next/navigation"

const AccountNav = ({
  customer,
  numPendingApprovals,
}: {
  customer: B2BCustomer | null
  numPendingApprovals: number
}) => {
  const { t } = useTranslations()
  const route = usePathname()

  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode, customer?.id as string)
  }

  return (
    <div>
      <div className="small:hidden" data-testid="mobile-account-nav">
        {route !== `/${countryCode}/account` ? (
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-x-2 text-small-regular py-2"
            data-testid="account-main-link"
          >
            <>
              <ChevronDown className="transform rotate-90" />
              <span>{t("nav.account", undefined, "Tài khoản")}</span>
            </>
          </LocalizedClientLink>
        ) : (
          <>
            <div className="text-xl-semi mb-4 px-8">
              {t("account.welcome", undefined, "Xin chào")} {customer?.first_name}
            </div>
            <div className="text-base-regular">
              <ul>
                <li>
                  <LocalizedClientLink
                    href="/account/profile"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                    data-testid="profile-link"
                  >
                    <>
                      <div className="flex items-center gap-x-2">
                        <User size={20} />
                        <span>{t("account.profile", undefined, "Hồ sơ cá nhân")}</span>
                      </div>
                      <ChevronDown className="transform -rotate-90" />
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/company"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                    data-testid="company-link"
                  >
                    <>
                      <div className="flex items-center gap-x-2">
                        <BuildingStorefront width={20} />
                        <span>{t("account.company", undefined, "Thông tin công ty")}</span>
                      </div>
                      <ChevronDown className="transform -rotate-90" />
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/addresses"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                    data-testid="addresses-link"
                  >
                    <>
                      <div className="flex items-center gap-x-2">
                        <MapPin size={20} />
                        <span>{t("account.addresses", undefined, "Sổ địa chỉ")}</span>
                      </div>
                      <ChevronDown className="transform -rotate-90" />
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/orders"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                    data-testid="orders-link"
                  >
                    <div className="flex items-center gap-x-2">
                      <Package size={20} />
                      <span>{t("account.orders", undefined, "Đơn hàng")}</span>
                    </div>
                    <ChevronDown className="transform -rotate-90" />
                  </LocalizedClientLink>
                </li>
                {customer?.employee?.is_admin && (
                  <li>
                    <LocalizedClientLink
                      href="/account/approvals"
                      className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                      data-testid="approvals-link"
                    >
                      <div className="flex items-center gap-x-2">
                        <FilePlus size={16} />
                        <span>{t("account.approvals", undefined, "Phê duyệt đơn")}</span>
                      </div>
                      <ChevronDown className="transform -rotate-90" />
                    </LocalizedClientLink>
                  </li>
                )}
                <li>
                  <LocalizedClientLink
                    href="/account/quotes"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                    data-testid="quotes-link"
                  >
                    <div className="flex items-center gap-x-2">
                      <FilePlus size={16} />
                      <span>{t("account.quotes", undefined, "Báo giá B2B")}</span>
                    </div>
                    <ChevronDown className="transform -rotate-90" />
                  </LocalizedClientLink>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex items-center justify-between py-4 border-b border-gray-200 px-8 w-full"
                    onClick={handleLogout}
                    data-testid="logout-button"
                  >
                    <div className="flex items-center gap-x-2">
                      <ArrowRightOnRectangle />
                      <span>{t("nav.signOut", undefined, "Đăng xuất")}</span>
                    </div>
                    <ChevronDown className="transform -rotate-90" />
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
      <div className="hidden small:block" data-testid="account-nav">
        <div className="text-lg">
          <ul className="flex mb-0 justify-start items-start flex-col gap-y-4">
            <li>
              <AccountNavLink
                href="/account"
                route={route!}
                data-testid="overview-link"
              >
                {t("account.overview", undefined, "Tổng quan")}
              </AccountNavLink>
            </li>
            <li>
              <AccountNavLink
                href="/account/profile"
                route={route!}
                data-testid="profile-link"
              >
                {t("account.profile", undefined, "Hồ sơ")}
              </AccountNavLink>
            </li>
            <li>
              <AccountNavLink
                href="/account/company"
                route={route!}
                data-testid="company-link"
              >
                {t("account.company", undefined, "Công ty")}
              </AccountNavLink>
            </li>
            <li>
              <AccountNavLink
                href="/account/addresses"
                route={route!}
                data-testid="addresses-link"
              >
                {t("account.addresses", undefined, "Sổ địa chỉ")}
              </AccountNavLink>
            </li>
            <li>
              <AccountNavLink
                href="/account/orders"
                route={route!}
                data-testid="orders-link"
              >
                {t("account.orders", undefined, "Đơn hàng")}
              </AccountNavLink>
            </li>
            {customer?.employee?.is_admin && (
              <li>
                <AccountNavLink
                  href="/account/approvals"
                  route={route!}
                  data-testid="approvals-link"
                >
                  {t("account.approvals", undefined, "Phê duyệt")}{" "}
                  {numPendingApprovals > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-1.5 py-px rounded-full">
                      {numPendingApprovals}
                    </span>
                  )}
                </AccountNavLink>
              </li>
            )}
            <li>
              <AccountNavLink
                href="/account/quotes"
                route={route!}
                data-testid="quotes-link"
              >
                {t("account.quotes", undefined, "Báo giá")}
              </AccountNavLink>
            </li>
            <li className="text-neutral-400 hover:text-neutral-950">
              <button
                type="button"
                onClick={handleLogout}
                data-testid="logout-button"
              >
                {t("nav.signOut", undefined, "Đăng xuất")}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}


type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
  "data-testid"?: string
}

const AccountNavLink = ({
  href,
  route,
  children,
  "data-testid": dataTestId,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route.split(countryCode)[1] === href
  return (
    <LocalizedClientLink
      href={href}
      className={clx(
        "text-neutral-400 hover:text-neutral-950 flex items-center gap-x-2",
        {
          "text-neutral-950": active,
        }
      )}
      data-testid={dataTestId}
    >
      {children}
    </LocalizedClientLink>
  )
}

export default AccountNav
