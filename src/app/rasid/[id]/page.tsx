import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MANDIR } from "@/lib/mandir";
import { STATUS_LABEL, getPayment, type Payment } from "@/lib/records";
import { StoreNotConfigured } from "@/lib/store";
import { rupees } from "@/lib/contact";
import { SITE_URL } from "@/lib/site";
import { ReceiptActions } from "@/components/ReceiptActions";
import { ShikharMark } from "@/components/Icons";

export const metadata: Metadata = { title: "रसीद", robots: { index: false, follow: false } };

export default function RasidPage(props: PageProps<"/rasid/[id]">) {
  return (
    <div className="wrap py-8 md:py-12 max-w-3xl">
      <Suspense fallback={<p className="text-ink-soft">रसीद खुल रही है…</p>}>
        <Receipt params={props.params} />
      </Suspense>
    </div>
  );
}

const STATUS_STYLE: Record<Payment["status"], { box: string; text: string }> = {
  awaiting: { box: "bg-saffron-soft border-saffron/50", text: "भुगतान अभी पूरा नहीं हुआ है। नीचे दिए QR या UPI से भुगतान करें।" },
  pending: {
    box: "bg-saffron-soft border-saffron/50",
    text: "आपकी जानकारी मिल गई है। समिति बैंक विवरण से मिलान करके पुष्टि करेगी। पुष्टि होते ही यही पृष्ठ “पुष्ट” दिखाएगा।",
  },
  confirmed: { box: "bg-leaf-soft border-leaf/40", text: "समिति ने भुगतान की पुष्टि कर दी है। आपके सहयोग के लिए हृदय से धन्यवाद।" },
  rejected: { box: "bg-[#fbe9e7] border-maroon/40", text: "समिति को यह भुगतान बैंक खाते में नहीं मिला। कृपया UTR के साथ WhatsApp पर संपर्क करें।" },
};

async function Receipt({ params }: { params: PageProps<"/rasid/[id]">["params"] }) {
  const { id } = await params;
  let p: Payment | null;
  try {
    p = await getPayment(id);
  } catch (e) {
    if (e instanceof StoreNotConfigured) return <p className="text-maroon">{e.message}</p>;
    throw e;
  }
  if (!p) notFound();

  const s = STATUS_STYLE[p.status];
  const date = new Intl.DateTimeFormat("hi-IN", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(p.createdAt));
  const link = `${SITE_URL}/rasid/${p.id}`;

  return (
    <div className="grid gap-6">
      <div className={`rounded-2xl border-2 p-5 grid gap-1 ${s.box}`} role="status">
        <span className="font-bold text-[1.35rem]">
          {p.status === "confirmed" ? "✓ " : ""}स्थिति: {STATUS_LABEL[p.status]}
        </span>
        <span className="text-[1.05rem]">{s.text}</span>
      </div>

      <article className="bg-card rounded-2xl border-2 border-dashed border-gold p-6 md:p-8 grid gap-3">
        <header className="flex items-center gap-3 border-b border-line pb-4 mb-1">
          <ShikharMark className="w-12 h-9 shrink-0" />
          <div className="min-w-0">
            <p className="font-display text-[1.3rem] leading-tight">{MANDIR.name}</p>
            <p className="text-ink-soft text-[0.9rem]">{MANDIR.addressLines.join(", ")}</p>
          </div>
        </header>
        <Row k="रसीद संख्या" v={p.receipt} />
        <Row k="नाम" v={p.name} />
        <Row k="राशि" v={rupees(p.amount)} strong />
        <Row k="कार्य" v={p.purpose} />
        <Row k="मोबाइल" v={`XXXXXX${p.phone.slice(-4)}`} />
        {p.utr && <Row k="UPI लेनदेन संख्या (UTR)" v={p.utr} />}
        <Row k="दिनांक" v={date} />
        <Row k="स्थिति" v={STATUS_LABEL[p.status]} strong />
        <p className="text-[0.9rem] text-ink-soft border-t border-line pt-3 mt-1">
          यह ऑनलाइन रसीद है। “पुष्ट” स्थिति ही भुगतान की अंतिम पुष्टि है। इस पृष्ठ का लिंक संभाल कर रखें।
        </p>
      </article>

      <ReceiptActions
        payment={{ id: p.id, receipt: p.receipt, amount: p.amount, purpose: p.purpose, name: p.name, utr: p.utr, status: p.status }}
        link={link}
      />
    </div>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-ink-soft">{k}</span>
      <span className={`text-right ${strong ? "font-bold text-[1.15rem]" : "font-medium"}`}>{v}</span>
    </div>
  );
}
