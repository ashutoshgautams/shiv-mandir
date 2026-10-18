"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "./Icons";

export function CopyAddress({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-outline"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        } catch {}
      }}
    >
      {done ? <CheckIcon /> : <CopyIcon />} {done ? "कॉपी हो गया" : "पता कॉपी करें"}
    </button>
  );
}
