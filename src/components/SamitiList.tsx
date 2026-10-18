import { SAMITI } from "@/lib/samiti";

// Committee names, used in the footer (compact) and on the membership page.
export function SamitiList({ compact = false }: { compact?: boolean }) {
  const groups = [
    ...SAMITI.padadhikari.map((p) => ({ title: p.role, names: p.names })),
    { title: "पुरोहित", names: SAMITI.purohit },
    { title: "पुजारी", names: SAMITI.pujari },
    { title: "कार्यकर्ता", names: SAMITI.karyakarta },
  ];
  return (
    <dl className={compact ? "grid gap-2 text-[0.95rem]" : "grid sm:grid-cols-2 gap-4"}>
      {groups.map((g) => (
        <div key={g.title} className={compact ? "grid grid-cols-[6.5rem_1fr] gap-2" : "bg-card rounded-xl border border-line p-4 grid gap-1"}>
          <dt className={compact ? "text-ink-soft" : "eyebrow"}>{g.title}</dt>
          <dd className={compact ? "text-ink" : "text-[1.08rem]"}>{g.names.join(", ")}</dd>
        </div>
      ))}
    </dl>
  );
}
