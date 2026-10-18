export const NAV = [
  { href: "/", label: "मुख्य पृष्ठ", short: "होम" },
  { href: "/darshan", label: "दर्शन", short: "दर्शन" },
  { href: "/puja", label: "पूजा-पाठ", short: "पूजा" },
  { href: "/chanda", label: "चंदा / दान", short: "चंदा" },
  { href: "/sadasya", label: "सदस्यता", short: "सदस्य" },
  { href: "/sampark", label: "समय एवं संपर्क", short: "संपर्क" },
] as const;

export const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
