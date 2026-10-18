"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, isActive } from "./nav";
import { BookIcon, DiyaIcon, HandsIcon, HomeIcon, PinIcon } from "./Icons";

const ICONS = { "/": HomeIcon, "/darshan": DiyaIcon, "/puja": BookIcon, "/chanda": HandsIcon, "/sampark": PinIcon };

// Phone navigation: five large labelled tabs pinned to the bottom, like familiar phone apps.
export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="मुख्य मेनू"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t border-line pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] shadow-[0_-4px_16px_rgba(35,23,15,0.06)]"
    >
      <ul className="grid grid-cols-5">
        {NAV.map((n) => {
          const Icon = ICONS[n.href];
          const active = isActive(pathname, n.href);
          return (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center justify-center gap-0.5 h-[4.5rem] no-underline text-[0.85rem] font-semibold ${
                  active ? "text-maroon" : "text-ink-soft"
                }`}
              >
                <span className={`grid place-items-center w-12 h-8 rounded-full ${active ? "bg-saffron-soft" : ""}`}>
                  <Icon width={24} height={24} />
                </span>
                {n.short}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
