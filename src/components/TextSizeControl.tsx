"use client";

import { useSyncExternalStore } from "react";

const SIZES = [
  { id: "md", label: "अ", name: "सामान्य अक्षर" },
  { id: "lg", label: "अ+", name: "बड़े अक्षर" },
  { id: "xl", label: "अ++", name: "बहुत बड़े अक्षर" },
] as const;

const EVENT = "mandir-text-size";

// The size lives on <html data-size>, set before paint by the inline script in layout.tsx.
function setTextSize(id: string) {
  const root = document.documentElement;
  if (id === "md") delete root.dataset.size;
  else root.dataset.size = id;
  try {
    localStorage.setItem("mandir-text", id);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
};
const getSnapshot = () => document.documentElement.dataset.size || "md";
const getServerSnapshot = () => "md";

export function TextSizeControl() {
  const size = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div role="group" aria-label="अक्षर का आकार" className="ml-auto lg:ml-2 flex items-center rounded-lg border border-line bg-paper p-0.5 shrink-0">
      {SIZES.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => setTextSize(s.id)}
          aria-pressed={size === s.id}
          aria-label={s.name}
          title={s.name}
          className={`min-w-9 sm:min-w-10 h-10 px-1.5 sm:px-2 rounded-md font-display leading-none transition-colors ${
            size === s.id ? "bg-ink text-white" : "text-ink hover:bg-saffron-soft"
          } ${s.id === "md" ? "text-[0.95rem]" : s.id === "lg" ? "text-[1.1rem]" : "text-[1.25rem]"}`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
