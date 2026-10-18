"use client";

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="wrap py-10">
      <div className="bg-card rounded-2xl border border-line p-6 md:p-8 grid gap-4 max-w-xl">
        <h1 className="text-[1.8rem]">एडमिन पृष्ठ नहीं खुल सका</h1>
        <p className="text-ink-soft">डेटाबेस से जानकारी पढ़ने में दिक्कत हुई। थोड़ी देर बाद फिर कोशिश करें।</p>
        <button type="button" onClick={reset} className="btn btn-primary w-fit">फिर से कोशिश करें</button>
      </div>
    </div>
  );
}
