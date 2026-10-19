export type PujaCategory = { id: string; name: string; blurb: string };
export type Puja = {
  cat: string;
  name: string;
  en: string; // English name, shown and searchable
  alias?: string; // other spellings people type
  about: string;
  options?: string[];
  duration?: string;
  note?: string;
};

export const CATEGORIES: PujaCategory[] = [
  { id: "archana", name: "पूजा-अर्चना", blurb: "रुद्राभिषेक, सत्यनारायण, ग्रहशान्ति, पाठ" },
  { id: "jap", name: "जप, यज्ञ एवं संस्कार", blurb: "दुर्गासप्तशती, कलशस्थापन, मुण्डन" },
  { id: "vahan", name: "वाहन-पूजा", blurb: "साइकिल से लेकर चार पहिया तक" },
  { id: "jyotish", name: "कुण्डली एवं ज्योतिष", blurb: "कुण्डली मिलान, निर्माण, परामर्श" },
];

export const PUJAS: Puja[] = [
  { cat: "archana", name: "रुद्राभिषेक", en: "Rudrabhishek", alias: "rudra abhishek rudrabhishekam shiv abhishek jal abhishek sawan somvar shivratri", about: "शिवलिंग पर जल, दूध और पंचामृत से रुद्र-मंत्रों के साथ अभिषेक।", options: ["सामान्य दिन", "सोमवार / विशेष दिन", "सावन सोमवारी", "सावन के अन्य दिन", "महाशिवरात्रि"] },
  { cat: "archana", name: "महारुद्राभिषेक", en: "Maha Rudrabhishek", alias: "maharudra rudri path rudrabhishek", about: "रुद्री पाठ के साथ विस्तृत रुद्राभिषेक।", duration: "लगभग 3 घंटे" },
  { cat: "archana", name: "सत्यनारायण पूजा", en: "Satyanarayan Puja", alias: "satyanarayan katha satya narayan vishnu", about: "भगवान सत्यनारायण की पूजा एवं कथा।" },
  { cat: "archana", name: "रामार्चा पूजा", en: "Ramarcha Puja", alias: "ram archa ram darbar puja", about: "श्रीराम दरबार की विधिवत अर्चना।" },
  { cat: "archana", name: "हनुमत-पूजा", en: "Hanuman Puja", alias: "hanumat hanuman ji puja bajrangbali", about: "संकटमोचन हनुमान जी का विधिवत पूजन।" },
  { cat: "archana", name: "ग्रहशान्ति पूजा", en: "Grah Shanti Puja", alias: "graha shanti planet dosh", about: "किसी एक ग्रह की शान्ति के लिए पूजा।", duration: "लगभग 1 घंटा" },
  { cat: "archana", name: "नवग्रहशान्ति पूजा", en: "Navgrah Shanti Puja", alias: "navagraha nav grah shanti nine planets", about: "सभी नौ ग्रहों की शान्ति के लिए पूजा।", duration: "लगभग 4 घंटे" },
  { cat: "archana", name: "हनुमान चालीसा पाठ", en: "Hanuman Chalisa Path", alias: "hanuman chalisa 108 path", about: "हनुमान चालीसा के 108 पाठ।" },
  { cat: "archana", name: "स्तोत्र पाठ", en: "Stotra Path", alias: "ram raksha stotra hanuman kavach aditya hriday path", about: "मनचाहे स्तोत्र का पाठ (एक पाठ)।", options: ["रामरक्षास्तोत्र", "हनुमत कवच", "आदित्य हृदय", "अन्य पाठ"] },
  { cat: "archana", name: "सुन्दरकाण्ड पाठ", en: "Sunderkand Path", alias: "sundarkand sunderkand ramcharitmanas valmiki", about: "रामचरितमानस अथवा वाल्मीकि रामायण का सुन्दरकाण्ड।", options: ["मानस सुन्दरकाण्ड", "वाल्मीकि सुन्दरकाण्ड"] },
  { cat: "jap", name: "दुर्गासप्तशती पाठ", en: "Durga Saptashati Path", alias: "durga path chandi path saptashati navratri", about: "श्री दुर्गासप्तशती का पाठ।", options: ["सम्पुट पाठ", "साधारण पाठ"] },
  { cat: "jap", name: "कलशस्थापन", en: "Kalash Sthapana", alias: "kalash sthapan ghatasthapana navratri nine days", about: "नवरात्रि में कलशस्थापन, नौ दिन दुर्गा पाठ सहित।", duration: "नौ दिन" },
  { cat: "jap", name: "मनोकामना यज्ञ", en: "Manokamna Yagya", alias: "havan yagya yagna hawan", about: "मनोकामना पूर्ति के लिए हवन एवं यज्ञ।" },
  { cat: "jap", name: "जन्ममंगलानुष्ठान", en: "Birthday Puja (Janma Mangal Anushthan)", alias: "janmadin birthday janam din ayush", about: "जन्मदिन पर आयु और आरोग्य के लिए अनुष्ठान।" },
  { cat: "jap", name: "महामृत्युंजय जप", en: "Mahamrityunjay Jaap", alias: "maha mrityunjay jap mantra jaap grah jap", about: "महामृत्युंजय अथवा अन्य ग्रह-मंत्रों का जप।", options: ["महामृत्युंजय", "अन्य ग्रह जप"], duration: "प्रति हज़ार जप" },
  { cat: "jap", name: "ध्वज संकल्प", en: "Dhwaj Sankalp (Temple Flag)", alias: "dhwaja flag jhanda", about: "मंदिर पर ध्वजा चढ़ाने का संकल्प।" },
  { cat: "jap", name: "मुण्डन संस्कार", en: "Mundan Sanskar", alias: "mundan head shaving tonsure child", about: "बच्चों का मुण्डन संस्कार।", note: "मंदिर परिसर में बाजा नहीं बजेगा।" },
  { cat: "jap", name: "रामावत सम्प्रदाय में दीक्षा", en: "Diksha (Ramavat Sampraday)", alias: "diksha guru deeksha ramavat", about: "रामावत सम्प्रदाय में गुरु-दीक्षा।" },
  { cat: "vahan", name: "साइकिल / रिक्शा पूजा", en: "Cycle / Rickshaw Puja", alias: "bicycle cycle rickshaw vehicle puja vahan", about: "नई साइकिल या रिक्शा का पूजन।" },
  { cat: "vahan", name: "दो पहिया वाहन पूजा", en: "Two-Wheeler Puja", alias: "bike scooter scooty motorcycle e-rickshaw vehicle puja vahan", about: "मोटरसाइकिल, स्कूटर या ई-रिक्शा का पूजन।" },
  { cat: "vahan", name: "चार पहिया वाहन पूजा", en: "Car / Four-Wheeler Puja", alias: "car jeep suv truck new car vehicle puja vahan", about: "कार, जीप और बड़े वाहनों का पूजन।" },
  { cat: "jyotish", name: "कुण्डली मिलान", en: "Kundli Milan (Marriage Matching)", alias: "kundali milan horoscope matching marriage shadi guna", about: "विवाह के लिए वर-वधू की कुण्डली मिलान।" },
  { cat: "jyotish", name: "कुण्डली निर्माण", en: "Kundli Making (Horoscope)", alias: "kundali banwana janam kundli horoscope birth chart", about: "भविष्यफल सहित जन्म-कुण्डली।", options: ["18 वर्ष से कम", "18 वर्ष से अधिक"] },
  { cat: "jyotish", name: "ज्योतिष परामर्श", en: "Astrology Consultation", alias: "jyotish astrologer palmistry hast rekha kundli dikhana", about: "हस्तरेखा या जन्म-कुण्डली देखकर परामर्श।", options: ["हस्तरेखा", "जन्म-कुण्डली"] },
];
