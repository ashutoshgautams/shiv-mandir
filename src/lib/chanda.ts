export const CHANDA_PURPOSES = [
  { id: "durga-puja-2026", name: "दुर्गा पूजा 2026", about: "पंडाल, मूर्ति, प्रसाद और विसर्जन" },
  { id: "nitya-puja", name: "नित्य पूजा एवं भोग", about: "रोज़ की पूजा सामग्री और प्रसाद" },
  { id: "bhandara", name: "भंडारा", about: "पर्वों पर प्रसाद वितरण" },
  { id: "rakh-rakhav", name: "मंदिर रख-रखाव", about: "मरम्मत, रंग-रोगन, बिजली" },
] as const;

export const CHANDA_AMOUNTS = [101, 251, 501, 1100, 2100, 5100];

export type ChandaEntry = {
  id: string;
  receipt: string;
  name: string;
  phone: string;
  mohalla: string;
  amount: number;
  purpose: string;
  utr: string;
  anonymous: boolean;
  status: "pending" | "verified";
  createdAt: string;
};

export type ChandaPublic = { receipt: string; name: string; amount: number; purpose: string; createdAt: string };

export type ChandaSummary = { total: number; count: number; recent: ChandaPublic[] };
