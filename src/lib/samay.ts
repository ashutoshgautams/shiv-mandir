// Example timings — TODO: confirm with the committee.
export type SamayRow = { label: string; time: string; until?: string; aarti?: boolean };
export type Season = { id: string; title: string; range: string; months: number[]; rows: SamayRow[] };

export const SEASONS: Season[] = [
  {
    id: "grishm",
    title: "गर्मी",
    range: "अप्रैल से सितंबर",
    months: [4, 5, 6, 7, 8, 9],
    rows: [
      { label: "पट खुलना", time: "04:30" },
      { label: "मंगला आरती", time: "05:00", aarti: true },
      { label: "भोग आरती", time: "12:00", aarti: true },
      { label: "विश्राम (पट बंद)", time: "12:30", until: "16:00" },
      { label: "संध्या आरती", time: "19:00", aarti: true },
      { label: "शयन आरती", time: "21:30", aarti: true },
    ],
  },
  {
    id: "shit",
    title: "सर्दी",
    range: "अक्टूबर से मार्च",
    months: [10, 11, 12, 1, 2, 3],
    rows: [
      { label: "पट खुलना", time: "05:00" },
      { label: "मंगला आरती", time: "05:30", aarti: true },
      { label: "भोग आरती", time: "12:00", aarti: true },
      { label: "विश्राम (पट बंद)", time: "12:30", until: "15:30" },
      { label: "संध्या आरती", time: "18:30", aarti: true },
      { label: "शयन आरती", time: "21:00", aarti: true },
    ],
  },
];

export const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export function hiTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const part = h < 12 ? "सुबह" : h < 16 ? "दोपहर" : h < 20 ? "शाम" : "रात";
  const h12 = ((h + 11) % 12) + 1;
  return `${part} ${h12}:${String(m).padStart(2, "0")}`;
}

export function seasonForMonth(month: number) {
  return SEASONS.find((s) => s.months.includes(month)) ?? SEASONS[0];
}

// Current time in Patna, regardless of the visitor's own timezone.
export function patnaNow(date = new Date()) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      weekday: "short",
      month: "numeric",
    })
      .formatToParts(date)
      .map((x) => [x.type, x.value]),
  );
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday);
  return { minutes: Number(p.hour) * 60 + Number(p.minute), weekday, month: Number(p.month) };
}

export function templeStatus(date = new Date()) {
  const now = patnaNow(date);
  const season = seasonForMonth(now.month);
  const r = season.rows;
  const open = toMin(r[0].time);
  const restStart = toMin(r[3].time);
  const restEnd = toMin(r[3].until!);
  const close = toMin(r[5].time) + 30;
  const isOpen = (now.minutes >= open && now.minutes < restStart) || (now.minutes >= restEnd && now.minutes < close);
  let statusText: string;
  if (isOpen) statusText = "मंदिर के पट खुले हैं";
  else if (now.minutes >= restStart && now.minutes < restEnd) statusText = `विश्राम, ${hiTime(r[3].until!)} बजे खुलेगा`;
  else statusText = `पट बंद हैं, ${hiTime(r[0].time)} बजे खुलेगा`;

  const aartis = r.filter((x) => x.aarti);
  let next = aartis.find((a) => toMin(a.time) > now.minutes);
  let wait: number;
  if (next) wait = toMin(next.time) - now.minutes;
  else {
    next = aartis[0];
    wait = 1440 - now.minutes + toMin(next.time);
  }
  return { now, season, isOpen, statusText, next, wait };
}

export function waitText(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m} मिनट में`;
  return `${h} घंटे ${m ? m + " मिनट" : ""} में`;
}

export const PARV = [
  { masa: "आश्विन", name: "दुर्गा पूजा (शारदीय नवरात्रि)", about: "कलशस्थापन, दुर्गासप्तशती पाठ, कन्या पूजन और विजयादशमी पर विसर्जन।" },
  { masa: "कार्तिक", name: "छठ महापर्व", about: "सूर्यदेव को डूबते और उगते सूर्य का अर्घ्य।" },
  { masa: "कार्तिक", name: "दीपावली", about: "मंदिर परिसर में दीपोत्सव और विशेष आरती।" },
  { masa: "फाल्गुन", name: "महाशिवरात्रि", about: "रात भर चार प्रहर की पूजा, महारुद्राभिषेक और शिव-विवाह।" },
  { masa: "चैत्र", name: "राम नवमी एवं चैत्र नवरात्रि", about: "रामार्चा पूजा, ध्वज संकल्प और महावीरी झंडा।" },
  { masa: "चैत्र पूर्णिमा", name: "हनुमान जयंती", about: "सुन्दरकाण्ड पाठ, 108 हनुमान चालीसा और भंडारा।" },
  { masa: "श्रावण", name: "सावन सोमवारी", about: "हर सोमवार जलाभिषेक, काँवरियों का स्वागत और विशेष श्रृंगार।" },
  { masa: "भाद्रपद", name: "श्रीकृष्ण जन्माष्टमी", about: "आधी रात जन्मोत्सव, झूलन और माखन-मिश्री भोग।" },
];
