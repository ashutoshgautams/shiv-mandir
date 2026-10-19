export function PageHeading({ eyebrow, title, lead, en }: { eyebrow: string; title: string; lead?: string; en?: string }) {
  return (
    <div className="bg-card border-b border-line">
      <div className="wrap py-6 md:py-12 grid gap-1.5 md:gap-2">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="text-[1.7rem] md:text-[2.8rem] leading-tight">{title}</h1>
        {en && <p lang="en" className="text-ink-soft text-[0.95rem] font-medium">{en}</p>}
        {lead && <p className="text-ink-soft text-[1rem] md:text-[1.08rem] max-w-[60ch]">{lead}</p>}
      </div>
    </div>
  );
}

export function SectionTitle({ eyebrow, title, lead, id }: { eyebrow: string; title: string; lead?: string; id?: string }) {
  return (
    <div className="grid gap-1 md:gap-1.5 mb-4 md:mb-6 max-w-[60ch]">
      <span className="eyebrow">{eyebrow}</span>
      <h2 id={id} className="text-[1.5rem] md:text-[2.3rem] leading-tight">{title}</h2>
      {lead && <p className="text-ink-soft">{lead}</p>}
    </div>
  );
}
