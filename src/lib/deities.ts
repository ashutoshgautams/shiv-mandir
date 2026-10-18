import { ABHIYAN } from "./mandir";

export type Deity = {
  slug: string;
  name: string;
  short: string;
  role: string;
  mantra: string;
  about: string;
  days: string;
  offerings: string;
  image: string; // 4:3 crop used on cards
  detail?: { src: string; width: number; height: number }; // full photo for the darshan page, if different
  festival?: boolean;
};


const DURGA_PUJA: Deity = {
  slug: "durga-puja-2026",
  name: "दुर्गा पूजा 2026",
  short: "दुर्गा पूजा 2026",
  role: "शारदीय नवरात्रि · पंडाल दर्शन",
  mantra: "या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता",
  about:
    "मंदिर परिसर के पंडाल में माँ दुर्गा महिषासुरमर्दिनी रूप में विराजमान हैं, साथ में गणेश जी, लक्ष्मी जी, सरस्वती जी और कार्तिकेय जी। नवरात्रि भर पूजा, आरती और प्रसाद वितरण होता है।",
  days: "शारदीय नवरात्रि से विजयादशमी तक",
  offerings: "लाल चुनरी, नारियल, फल, मिठाई",
  image: "/images/deities/durga-puja-2026.jpg",
  detail: { src: "/images/durga-puja-2026.jpg", width: 1596, height: 986 },
  festival: true,
};

// Photos of the mandir's own murtis, supplied by the committee.
export const DEITIES: Deity[] = [
  ...(ABHIYAN.active ? [DURGA_PUJA] : []),
  {
    slug: "shivling",
    name: "श्री शान्तेश्वर महादेव",
    short: "शिवलिंग",
    role: "प्रधान देव",
    mantra: "ॐ नमः शिवाय",
    about:
      "मंदिर के प्रधान देव। जल, दूध और बेलपत्र अर्पित करने से प्रसन्न होने वाले भोलेनाथ। सावन की सोमवारी और महाशिवरात्रि पर यहाँ विशेष रुद्राभिषेक होता है।",
    days: "सोमवार, सावन मास, महाशिवरात्रि",
    offerings: "जल, दूध, बेलपत्र, धतूरा",
    image: "/images/deities/shivling.jpg",
  },
  {
    slug: "durga",
    name: "माँ दुर्गा",
    short: "माँ दुर्गा",
    role: "आदिशक्ति",
    mantra: "ॐ दुं दुर्गायै नमः",
    about:
      "शक्ति स्वरूपा जगदम्बा। चैत्र और शारदीय नवरात्रि में कलशस्थापन और दुर्गासप्तशती पाठ के साथ नौ दिन माँ की आराधना होती है।",
    days: "नवरात्रि, शुक्रवार",
    offerings: "लाल चुनरी, गुड़हल के फूल, नारियल",
    image: "/images/deities/durga.jpg",
  },
  {
    slug: "hanuman",
    name: "श्री हनुमान जी",
    short: "हनुमान जी",
    role: "संकटमोचन",
    mantra: "ॐ हं हनुमते नमः",
    about:
      "श्रीराम के परम भक्त, बल, बुद्धि और विद्या देने वाले। मंगलवार और शनिवार को हनुमान चालीसा और सुन्दरकाण्ड का पाठ होता है।",
    days: "मंगलवार, शनिवार",
    offerings: "सिंदूर, चमेली का तेल, बूँदी के लड्डू",
    image: "/images/deities/hanuman.jpg",
  },
  {
    slug: "lakshmi-narayan",
    name: "श्री लक्ष्मी-नारायण",
    short: "लक्ष्मी-नारायण",
    role: "श्री हरि एवं माँ लक्ष्मी · बाल गोपाल सहित",
    mantra: "ॐ नमो भगवते वासुदेवाय",
    about:
      "भगवान विष्णु और माँ लक्ष्मी युगल रूप में विराजमान हैं, और उनके चरणों में सिंहासन पर बाल रूप में श्रीकृष्ण (बाल गोपाल)। गुरुवार, एकादशी और जन्माष्टमी पर विशेष पूजा होती है।",
    days: "गुरुवार, एकादशी, जन्माष्टमी",
    offerings: "तुलसी दल, पीले फूल, पंचामृत, माखन-मिश्री",
    image: "/images/deities/lakshmi-narayan.jpg",
    detail: { src: "/images/deities/lakshmi-narayan-full.jpg", width: 900, height: 1329 },
  },
  {
    slug: "suryadev",
    name: "श्री सूर्यदेव",
    short: "सूर्यदेव",
    role: "प्रत्यक्ष देव",
    mantra: "ॐ घृणि सूर्याय नमः",
    about:
      "जगत को प्रकाश और ऊर्जा देने वाले प्रत्यक्ष देवता। रविवार को अर्घ्य और आदित्य हृदय स्तोत्र का पाठ, और छठ महापर्व पर विशेष आराधना होती है।",
    days: "रविवार, छठ महापर्व",
    offerings: "जल अर्घ्य, लाल फूल, गुड़",
    image: "/images/deities/suryadev.jpg",
  },
  {
    slug: "sapta-pindi",
    name: "सप्त पिंडी",
    short: "सप्त पिंडी",
    role: "मातृशक्ति",
    mantra: "या देवी सर्वभूतेषु मातृरूपेण संस्थिता",
    about:
      "सात पिंडियों के रूप में विराजमान मातृशक्ति। नवरात्रि और मनोकामना पूजा में श्रद्धालु यहाँ सिंदूर और चुनरी अर्पित करते हैं।",
    days: "नवरात्रि, मंगलवार",
    offerings: "सिंदूर, चुनरी, बताशा",
    image: "/images/deities/sapta-pindi.jpg",
  },
];

export const getDeity = (slug: string) => DEITIES.find((d) => d.slug === slug);

// Day of week (0 = Sunday) → deity traditionally worshipped that day.
export const DAY_DEITY: Record<number, string> = { 0: "suryadev", 1: "shivling", 2: "hanuman", 4: "lakshmi-narayan", 5: "durga", 6: "hanuman" };
