"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { NAV, isActive } from "./nav";

// The active tab needs the URL, which must sit inside Suspense under Cache Components.
export function NavLinks() {
  return (
    <Suspense fallback={<Links pathname="" />}>
      <ActiveLinks />
    </Suspense>
  );
}

function ActiveLinks() {
  return <Links pathname={usePathname()} />;
}

function Links({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="मुख्य मेनू" className="hidden lg:flex ml-auto gap-1">
      {NAV.map((n) => {
        const active = isActive(pathname, n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active ? "page" : undefined}
            className={`px-3.5 py-2 rounded-lg no-underline text-[1rem] font-medium transition-colors whitespace-nowrap ${
              active ? "bg-maroon text-white" : "text-ink hover:bg-saffron-soft"
            } ${n.href === "/chanda" && !active ? "text-maroon font-semibold" : ""}`}
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
