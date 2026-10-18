import { MANDIR } from "./mandir";

export const telHref = MANDIR.phone ? `tel:+${MANDIR.phone}` : null;

export const whatsappHref = (text: string) =>
  MANDIR.whatsapp ? `https://wa.me/${MANDIR.whatsapp}?text=${encodeURIComponent(text)}` : null;

export const rupees = (n: number) => "₹" + n.toLocaleString("en-IN");
