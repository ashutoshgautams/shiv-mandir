// Temple-wide settings. Values marked TODO are placeholders the committee must fill in.
export const MANDIR = {
  name: "श्री श्री शान्तेश्वर शिवलोक मंदिर",
  shortName: "शान्तेश्वर शिवलोक मंदिर",
  englishName: "Sri Sri Shanteshwar Shivlok Mandir",
  addressLines: ["रोड नं. 24, राजीव नगर", "पटना, बिहार — 800024"],
  addressPlain: "श्री श्री शान्तेश्वर शिवलोक मंदिर, रोड नं. 24, राजीव नगर, पटना, बिहार - 800024",
  plusCode: "J3JR+H6H",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Sri+Sri+Shanteshwar+Shiv+Mandir+J3JR%2BH6H+Rajeev+Nagar+Patna",
  mapsEmbedUrl: "https://www.google.com/maps?q=Sri+Sri+Shanteshwar+Shiv+Mandir,+J3JR%2BH6H,+Rajeev+Nagar,+Patna&output=embed",

  // Puja bookings + general contact. Digits with country code for tel:/wa.me links.
  phone: "919939696698",
  phoneDisplay: "+91 99396 96698",
  whatsapp: "919939696698",

  // All chanda, daan and membership payments go to this UPI ID.
  upiId: "9334555817@ibl",
  upiPayee: "Shanteshwar Shivlok Mandir",
};

export const isPlaceholder = {
  phone: !MANDIR.phone,
  whatsapp: !MANDIR.whatsapp,
  upi: !MANDIR.upiId,
};

// The currently running appeal. Set active: false after the festival.
export const ABHIYAN = {
  active: true,
  id: "durga-puja-2026",
  title: "दुर्गा पूजा 2026",
  subtitle: "शारदीय नवरात्रि",
  appeal:
    "माँ दुर्गा की पूजा, पंडाल, प्रसाद और विसर्जन के लिए मोहल्ले के सभी श्रद्धालुओं से सहयोग का निवेदन है।",
  goal: 251000, // TODO: confirm with committee
};

export const MEMBERSHIP = {
  fee: 3100,
  year: "2026-27",
};
