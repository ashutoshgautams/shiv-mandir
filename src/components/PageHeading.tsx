export function PageHeading({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <div className="bg-card border-b border-line">
      <div className="wrap py-8 md:py-12 grid gap-2">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="text-[2.1rem] md:text-[2.8rem]">{title}</h1>
        {lead && <p className="text-ink-soft text-[1.08rem] max-w-[60ch]">{lead}</p>}
      </div>
    </div>
  );
}

export function SectionTitle({ eyebrow, title, lead, id }: { eyebrow: string; title: string; lead?: string; id?: string }) {
  return (
    <div className="grid gap-1.5 mb-6 max-w-[60ch]">
      <span className="eyebrow">{eyebrow}</span>
      <h2 id={id} className="text-[1.9rem] md:text-[2.3rem]">{title}</h2>
      {lead && <p className="text-ink-soft">{lead}</p>}
    </div>
  );
}
