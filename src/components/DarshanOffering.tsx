"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { BellIcon, FlowerIcon } from "./Icons";

const PETALS = ["#f28a1a", "#ffc93c", "#c93b22", "#f6efe1"];

// Synthesised temple bell: a few inharmonic partials with long decay.
function ringBell(ctxRef: React.RefObject<AudioContext | null>) {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctxRef.current = ctxRef.current ?? new Ctx();
    const ctx = ctxRef.current;
    const t0 = ctx.currentTime;
    const out = ctx.createGain();
    out.gain.value = 0.22;
    out.connect(ctx.destination);
    for (const [ratio, gain, decay] of [[1, 1, 3.2], [2, 0.45, 2.2], [2.76, 0.6, 1.7], [4.07, 0.25, 1], [5.43, 0.18, 0.7]]) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 620 * ratio;
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(gain, t0 + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + decay);
      o.connect(g).connect(out);
      o.start(t0);
      o.stop(t0 + decay + 0.05);
    }
  } catch {}
}

export function DarshanOffering({ image, name, ratio }: { image: string; name: string; ratio?: { width: number; height: number } }) {
  const portrait = ratio ? ratio.height > ratio.width : false;
  const [petals, setPetals] = useState<{ id: number; style: React.CSSProperties }[]>([]);
  const [message, setMessage] = useState("");
  const [swing, setSwing] = useState(0);
  const frame = useRef<HTMLDivElement>(null);
  const audio = useRef<AudioContext | null>(null);

  const offerFlowers = () => {
    const h = frame.current?.clientHeight ?? 400;
    const batch = Array.from({ length: 28 }, (_, i) => ({
      id: Date.now() + i,
      style: {
        left: `${6 + Math.random() * 88}%`,
        background: PETALS[i % PETALS.length],
        animationDuration: `${2.8 + Math.random() * 1.8}s`,
        animationDelay: `${Math.random() * 1}s`,
        "--fall": `${h * (0.8 + Math.random() * 0.2)}px`,
        "--drift": `${(Math.random() - 0.5) * 70}px`,
        "--spin": `${(Math.random() - 0.5) * 720}deg`,
      } as React.CSSProperties,
    }));
    setPetals((p) => [...p, ...batch]);
    setTimeout(() => setPetals((p) => p.filter((x) => !batch.includes(x))), 5200);
    setMessage(`${name} के चरणों में पुष्प अर्पित हुए।`);
  };

  const bell = () => {
    ringBell(audio);
    setSwing((n) => n + 1);
    setMessage("घंटी बजी। हर हर महादेव!");
  };

  return (
    <div className="grid gap-4">
      <div
        ref={frame}
        style={{ aspectRatio: ratio ? `${ratio.width} / ${ratio.height}` : "4 / 3" }}
        className={`relative w-full rounded-2xl overflow-hidden border-4 border-card ring-1 ring-gold/70 shadow-[0_14px_40px_rgba(35,23,15,0.16)] bg-saffron-soft ${portrait ? "max-w-[30rem] justify-self-center" : ""}`}
      >
        <Image src={image} alt={`${name} के दर्शन`} fill priority sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" />
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
          {petals.map((p) => (
            <span key={p.id} className="petal" style={p.style} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={offerFlowers} className="btn btn-primary">
          <FlowerIcon /> पुष्प अर्पित करें
        </button>
        <button type="button" onClick={bell} className="btn btn-outline">
          <BellIcon key={swing} className={swing ? "bell-swing" : ""} /> घंटी बजाएँ
        </button>
      </div>
      <p role="status" className="min-h-[1.7em] text-maroon font-medium text-center">
        {message}
      </p>
    </div>
  );
}
