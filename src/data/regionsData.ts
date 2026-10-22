export interface RegionInfo {
  id: string;
  country: string;
  nameAm: string;
  nameEn: string;
  nameOr?: string;
  nameTi?: string;
  flag: string;
  majorCities: { am: string; en: string; zones?: string[] }[];
  primaryUtility: {
    nameAm: string;
    nameEn: string;
    code: string;
    hotline: string;
  };
}

export const REGIONS_DIRECTORY: RegionInfo[] = [
  {
    id: 'addis_ababa',
    country: 'Ethiopia',
    nameAm: 'አዲስ አበባ',
    nameEn: 'Addis Ababa',
    nameOr: 'Finfinnee',
    nameTi: 'ኣዲስ ኣበባ',
    flag: '🇪🇹',
    majorCities: [
      { am: 'ቦሌ', en: 'Bole', zones: ['ቦሌ መድሃኒአለም', 'ሩዋንዳ', 'ቡልቡላ', 'ገርጂ', 'ጃፓን'] },
      { am: 'የካ', en: 'Yeka', zones: ['ሲኤምሲ', 'መገናኛ', 'ፈረንሳይ ለጋሲዮን', 'ኮተቤ', 'ካራ'] },
      { am: 'ቂርቆስ', en: 'Kirkos', zones: ['ካዛንቺስ', 'ባምቢስ', 'ጎተራ', 'መስቀል ፍላወር', 'ቄራ'] },
      { am: 'አራዳ', en: 'Arada', zones: ['ፒያሳ', 'አራት ኪሎ', 'ስድስት ኪሎ', 'ራስ መኮንን ድልድይ'] },
      { am: 'ንፋስ ስልክ ላፍቶ', en: 'Nifas Silk Lafto', zones: ['ሳሪስ', 'ጎፋ', 'ጀሞ 1-3', 'ለቡ', 'ሀና ማሪያም'] },
      { am: 'ኮልፌ ቀራኒዮ', en: 'Kolfe Keranio', zones: ['ቶር ኃይሎች', 'አስኮ', 'ዘነበወርቅ', 'አጠና ተራ'] },
      { am: 'ጉለሌ', en: 'Gulele', zones: ['ሽሮ ሜዳ', 'ሩፋኤል', 'ሸጎሌ', 'ሰንጋ ተራ'] },
      { am: 'አቃቂ ቃሊቲ', en: 'Akaki Kality', zones: ['ቃሊቲ ማዕከል', 'ቱሉ ዲምቱ', 'ኮይፌ ቆጬ'] },
      { am: 'ልደታ', en: 'Lideta', zones: ['አብኔት', 'ሜክሲኮ', 'ባልቻ', 'ተክለ ሃይማኖት'] },
      { am: 'አዲስ ከተማ', en: 'Addis Ketema', zones: ['መርካቶ', 'አውቶቡስ ተራ', 'አምስት ኪሎ', 'ሰባተኛ'] }
    ],
    primaryUtility: {
      nameAm: 'የአዲስ አበባ ውሃና ፍሳሽ ባለስልጣን (አውፍባ)',
      nameEn: 'Addis Ababa Water and Sewerage Authority (AAWSA)',
      code: 'AAWSA-HQ',
      hotline: '939'
    }
  },
  {
    id: 'oromia',
    country: 'Ethiopia',
    nameAm: 'ኦሮሚያ ክልል',
    nameEn: 'Oromia Region',
    nameOr: 'Naannoo Oromiyaa',
    nameTi: 'ክልል ኦሮሚያ',
    flag: '🌳',
    majorCities: [
      { am: 'አዳማ / ናዝሬት', en: 'Adama', zones: ['ቦሌ ዞን', 'ደመካ', 'ዋንጂ መንገድ', 'ፖስታ ቤት አካባቢ'] },
      { am: 'ቢሾፍቱ / ደብረዘይት', en: 'Bishoftu', zones: ['ሆራ ሐይቅ', 'ባቦጋያ', 'አየር ኃይል', 'ቂልጦ'] },
      { am: 'ጅማ', en: 'Jimma', zones: ['ጂንካ', 'መንዲራ', 'ቦሬ', 'አጋሮ መንገድ'] },
      { am: 'ሻሸመኔ', en: 'Shashemene', zones: ['አዋሳ በር', 'ኩዬራ', 'አባስቶ'] },
      { am: 'ነቀምቴ', en: 'Nekemte', zones: ['ባኬ', 'ቀበሌ 04', 'ዩኒቨርሲቲ ጊቢ'] },
      { am: 'ቡራዩ', en: 'Burayu', zones: ['ገፈርሳ', 'አሸዋ ሜዳ', 'ሜልካ ገፈርሳ'] },
      { am: 'ሰበታ', en: 'Sebeta', zones: ['አለምገና', 'ዲማ', 'ዋልያ'] },
      { am: 'አምቦ', en: 'Ambo', zones: ['ሰንቀሌ', 'ሆቴል ዞን', 'አዋሮ'] },
      { am: 'አሰላ', en: 'Asella', zones: ['ጭልሎ', 'ቀበሌ 01', 'ቀበሌ 05'] },
      { am: 'ባሌ ሮቤ', en: 'Bale Robe', zones: ['ጎባ በር', 'ሲናና', 'ሮቤ ማዕከል'] }
    ],
    primaryUtility: {
      nameAm: 'የኦሮሚያ ውሃና ኢነርጂ ቢሮ',
      nameEn: 'Oromia Water and Energy Bureau (OWEB)',
      code: 'OWEB-REG',
      hotline: '8844'
    }
  },
  {
    id: 'amhara',
    country: 'Ethiopia',
    nameAm: 'አማራ ክልል',
    nameEn: 'Amhara Region',
    nameOr: 'Naannoo Amaaraa',
    nameTi: 'ክልል ኣምሓራ',
    flag: '🇪🇹',
    majorCities: [
      { am: 'ባህር ዳር', en: 'Bahir Dar', zones: ['ቀበሌ 04 (ጣና)', 'ዳግማዊ ምኒልክ', 'አባይ ማዶ', 'ሽምቢት'] },
      { am: 'ጎንደር', en: 'Gondar', zones: ['አራዳ', 'ፋሲል', 'አዘዞ', 'ማራኪ ዩኒቨርሲቲ'] },
      { am: 'ደሴ', en: 'Dessie', zones: ['ፒያሳ', 'ሆቴሼ', 'ቦሩ', 'ሮቢት'] },
      { am: 'ደብረ ብርሃን', en: 'Debre Birhan', zones: ['ኢንዱስትሪ መንደር', 'ቀበሌ 07', 'ተበሴ'] },
      { am: 'ኮምቦልቻ', en: 'Kombolcha', zones: ['አውሮፕላን ማረፊያ', 'ቀበሌ 03', 'ሚሊኒየም'] },
      { am: 'ደብረ ማርቆስ', en: 'Debre Markos', zones: ['ንጉሥ ተክለሃይማኖት አደባባይ', 'ቀበሌ 02', 'መንደር 5'] },
      { am: 'ወልዲያ', en: 'Woldiya', zones: ['ቀበሌ 01', 'አዴት በር', 'ገረዶ'] }
    ],
    primaryUtility: {
      nameAm: 'የአማራ ክልል ውሃና ኢነርጂ ልማት ቢሮ',
      nameEn: 'Amhara Region Water & Energy Resource Development Bureau',
      code: 'AWEB-REG',
      hotline: '8221'
    }
  },
  {
    id: 'tigray',
    country: 'Ethiopia',
    nameAm: 'ትግራይ ክልል',
    nameEn: 'Tigray Region',
    nameOr: 'Naannoo Tigraay',
    nameTi: 'ክልል ትግራይ',
    flag: '🇪🇹',
    majorCities: [
      { am: 'መቐለ', en: 'Mekelle', zones: ['ሓወልቲ', 'ሰሜን', 'ዓይደር', 'ሓድነት', 'ቀዳማይ ወያነ'] },
      { am: 'ሽረ እንዳስላሴ', en: 'Shire Inda Selassie', zones: ['ቀበሌ 01', 'ማዕከል', 'ሱዳን በር'] },
      { am: 'አክሱም', en: 'Axum', zones: ['ሓወልቲ አክሱም', 'ማይ ሹም', 'ቀበሌ 03'] },
      { am: 'ዓዲግራት', en: 'Adigrat', zones: ['ቀበሌ 02', 'ዛላምበሳ በር', 'ዩኒቨርሲቲ'] },
      { am: 'ማይጨው', en: 'Maychew', zones: ['ቀበሌ 01', 'ዓዲ ቀይሕ'] },
      { am: 'አላማጣ', en: 'Alamata', zones: ['ራያ ዞን', 'ቀበሌ 02'] }
    ],
    primaryUtility: {
      nameAm: 'የትግራይ ውሃ ሃብት ልማት ቢሮ',
      nameEn: 'Tigray Water Resources Development Bureau',
      code: 'TWRB-MEK',
      hotline: '8550'
    }
  },
  {
    id: 'sidama',
    country: 'Ethiopia',
    nameAm: 'ሲዳማ ክልል',
    nameEn: 'Sidama Region',
    nameOr: 'Naannoo Sidaamaa',
    nameTi: 'ክልል ሲዳማ',
    flag: '🇪🇹',
    majorCities: [
      { am: 'ሀዋሳ', en: 'Hawassa', zones: ['ፒያሳ', 'ታቦር', 'መነሐሪያ', 'ሚሊኒየም', 'ዳቱ'] },
      { am: 'ይርጋለም', en: 'Yirgalem', zones: ['አፓርቶማ', 'ቀበሌ 02', 'አፖስቶ'] },
      { am: 'ለኩ', en: 'Leku', zones: ['ማዕከል', 'ቀበሌ 01'] },
      { am: 'አለታ ወንዶ', en: 'Aleta Wondo', zones: ['ወንዶ ገነት በር', 'ቀበሌ 03'] }
    ],
    primaryUtility: {
      nameAm: 'የሲዳማ ክልል ውሃ፣ ማዕድንና ኢነርጂ ቢሮ',
      nameEn: 'Sidama Region Water, Mines & Energy Bureau',
      code: 'SRWMB-HAW',
      hotline: '8910'
    }
  },
  {
    id: 'somali',
    country: 'Ethiopia',
    nameAm: 'ሶማሌ ክልል',
    nameEn: 'Somali Region',
    nameOr: 'Naannoo Somaalee',
    nameTi: 'ክልል ሶማሌ',
    flag: '🇪🇹',
    majorCities: [
      { am: 'ጅግጅጋ', en: 'Jigjiga', zones: ['ቀበሌ 06', 'ዱዳህዳብ', 'ሸይኽ አብዲ', 'ማዕከላዊ'] },
      { am: 'ጎዴ', en: 'Gode', zones: ['ሸበሌ ዳርቻ', 'ቀበሌ 02'] },
      { am: 'ደምበል / ቀብሪደሃር', en: 'Kebri Dahar', zones: ['ቀበሌ 01', 'ዋቢ ዞን'] },
      { am: 'ደገሃቡር', en: 'Degehabur', zones: ['ማዕከል', 'ጀሬር ሸለቆ'] }
    ],
    primaryUtility: {
      nameAm: 'የሶማሌ ክልል ውሃ ልማት ቢሮ',
      nameEn: 'Somali Regional Water Development Bureau',
      code: 'SRWDB-JIG',
      hotline: '8700'
    }
  },
  {
    id: 'dire_dawa',
    country: 'Ethiopia',
    nameAm: 'ድሬዳዋ አስተዳደር',
    nameEn: 'Dire Dawa Administration',
    nameOr: 'Bulchiinsa Dirree Dhawaa',
    nameTi: 'ምምሕዳር ድሬዳዋ',
    flag: '🇪🇹',
    majorCities: [
      { am: 'ድሬዳዋ ከተማ', en: 'Dire Dawa City', zones: ['ቀዛንቺስ', 'ገንደ ቆሬ', 'መልካ ጀብዱ', 'ሳቢያን', 'ደቻቱ'] }
    ],
    primaryUtility: {
      nameAm: 'የድሬዳዋ ውሃና ፍሳሽ አገልግሎት ባለስልጣን',
      nameEn: 'Dire Dawa Water & Sewerage Authority (DDWSA)',
      code: 'DDWSA-DIR',
      hotline: '992'
    }
  },
  {
    id: 'harari',
    country: 'Ethiopia',
    nameAm: 'ሐረሪ ክልል',
    nameEn: 'Harari Region',
    nameOr: 'Naannoo Hararii',
    nameTi: 'ክልል ሓረሪ',
    flag: '🇪🇹',
    majorCities: [
      { am: 'ሐረር ከተማ', en: 'Harar City', zones: ['ጀጎል ቅጥር ግቢ', 'ሸንኮር', 'አባዲር', 'ጂንኤላ', 'አሚር ኑር'] }
    ],
    primaryUtility: {
      nameAm: 'የሐረሪ ውሃና ፍሳሽ አገልግሎት ባለስልጣን',
      nameEn: 'Harari People Regional State Water Supply & Sewerage Authority',
      code: 'HWSSA-HAR',
      hotline: '8400'
    }
  },
  {
    id: 'south_ethiopia',
    country: 'Ethiopia',
    nameAm: 'ደቡብ ኢትዮጵያ ክልል',
    nameEn: 'South Ethiopia Region',
    nameOr: 'Naannoo Kibba Itoophiyaa',
    nameTi: 'ክልል ደቡብ ኢትዮጵያ',
    flag: '🇪🇹',
    majorCities: [
      { am: 'አርባ ምንጭ', en: 'Arba Minch', zones: ['ሸቻ', 'ሲቀላ', 'ኩሌ', 'ጫሞ ዳርቻ'] },
      { am: 'ወላይታ ሶዶ', en: 'Wolaita Sodo', zones: ['መርካቶ', 'ጉተራ', 'ደልቦ', 'ዩኒቨርሲቲ'] },
      { am: 'ዲላ', en: 'Dilla', zones: ['ወደሶ', 'ቀበሌ 03', 'ማዕከል'] },
      { am: 'ጂንካ', en: 'Jinka', zones: ['ኦሞ ሸለቆ', 'ቀበሌ 01'] },
      { am: 'ሳውላ', en: 'Sawla', zones: ['ጎፋ ማዕከል', 'ቀበሌ 02'] }
    ],
    primaryUtility: {
      nameAm: 'የደቡብ ኢትዮጵያ ክልል ውሃና ማዕድን ቢሮ',
      nameEn: 'South Ethiopia Regional Water and Energy Bureau',
      code: 'SEWEB-ARB',
      hotline: '8114'
    }
  },
  {
    id: 'central_ethiopia',
    country: 'Ethiopia',
    nameAm: 'ማዕከላዊ ኢትዮጵያ ክልል',
    nameEn: 'Central Ethiopia Region',
    nameOr: 'Naannoo Giddugaleessa Itoophiyaa',
    nameTi: 'ማእከላይ ኢትዮጵያ',
    flag: '🇪🇹',
    majorCities: [
      { am: 'ሆሳዕና', en: 'Hossana', zones: ['ሊቾ', 'ቀበሌ 04', 'ማዕከላዊ አደባባይ'] },
      { am: 'ቡታጅራ', en: 'Butajira', zones: ['ጉራጌ ማዕከል', 'ቀበሌ 02', 'ዶቢ'] },
      { am: 'ወልቂጤ', en: 'Welkite', zones: ['ጉብሬ', 'ቀበሌ 01'] },
      { am: 'ሀላባ ቁሊቶ', en: 'Halaba Kulito', zones: ['ማዕከል', 'ቀበሌ 03'] }
    ],
    primaryUtility: {
      nameAm: 'የማዕከላዊ ኢትዮጵያ ውሃና ኢነርጂ ቢሮ',
      nameEn: 'Central Ethiopia Water and Energy Bureau',
      code: 'CEWEB-HOS',
      hotline: '8330'
    }
  },
  {
    id: 'south_west',
    country: 'Ethiopia',
    nameAm: 'ደቡብ ምዕራብ ኢትዮጵያ ክልል',
    nameEn: 'South West Ethiopia Peoples Region',
    nameOr: 'Kibba Lixa Itoophiyaa',
    nameTi: 'ደቡብ ምዕራብ ኢትዮጵያ',
    flag: '🇪🇹',
    majorCities: [
      { am: 'ሚዛን አማን', en: 'Mizan Aman', zones: ['ሚዛን ማዕከል', 'አማን', 'ቀበሌ 01'] },
      { am: 'ቦንጋ', en: 'Bonga', zones: ['ካፋ ዞን', 'ቀበሌ 02'] },
      { am: 'ቴፒ', en: 'Tepi', zones: ['ሸካ ማዕከል', 'ቀበሌ 01'] }
    ],
    primaryUtility: {
      nameAm: 'የደቡብ ምዕራብ ውሃና ኢነርጂ ቢሮ',
      nameEn: 'South West Ethiopia Water and Energy Resource Bureau',
      code: 'SWEWEB-MIZ',
      hotline: '8660'
    }
  },
  {
    id: 'afar',
    country: 'Ethiopia',
    nameAm: 'አፋር ክልል',
    nameEn: 'Afar Region',
    nameOr: 'Naannoo Afaar',
    nameTi: 'ክልል ዓፋር',
    flag: '🇪🇹',
    majorCities: [
      { am: 'ሰመራ', en: 'Semera', zones: ['ዩኒቨርሲቲ ዞን', 'ማዕከላዊ አስተዳደር'] },
      { am: 'ሎጊያ', en: 'Logia', zones: ['ጉምሩክ', 'ቀበሌ 02'] },
      { am: 'አዋሽ 7 ኪሎ', en: 'Awash Sebat', zones: ['አዋሽ ብሔራዊ ፓርክ በር', 'ቀበሌ 01'] },
      { am: 'አሳይታ', en: 'Asayita', zones: ['ሱልጣኔት አደባባይ', 'ቀበሌ 03'] }
    ],
    primaryUtility: {
      nameAm: 'የአፋር ክልል ውሃ ሃብት ቢሮ',
      nameEn: 'Afar Regional State Water Resource Development Bureau',
      code: 'AWRDB-SEM',
      hotline: '8770'
    }
  },
  {
    id: 'benishangul',
    country: 'Ethiopia',
    nameAm: 'ቤኒሻንጉል ጉሙዝ ክልል',
    nameEn: 'Benishangul-Gumuz Region',
    nameOr: 'Baniishaangul-Gumuz',
    nameTi: 'ቤኒሻንጉል ጉሙዝ',
    flag: '🇪🇹',
    majorCities: [
      { am: 'አሶሳ', en: 'Assosa', zones: ['ቀበሌ 02', 'ዩኒቨርሲቲ', 'ማዕከላዊ ገበያ'] },
      { am: 'ግልገል በለስ', en: 'Gilgel Beles', zones: ['መተከል ማዕከል', 'ቀበሌ 01'] },
      { am: 'ኩርሙክ', en: 'Kurmuk', zones: ['ድንበር ማዶ', 'ቀበሌ 01'] }
    ],
    primaryUtility: {
      nameAm: 'የቤኒሻንጉል ጉሙዝ ውሃ ልማት ቢሮ',
      nameEn: 'Benishangul-Gumuz Water Resource Development Bureau',
      code: 'BGWRB-ASO',
      hotline: '8220'
    }
  },
  {
    id: 'gambella',
    country: 'Ethiopia',
    nameAm: 'ጋምቤላ ክልል',
    nameEn: 'Gambella Region',
    nameOr: 'Naannoo Gambeellaa',
    nameTi: 'ክልል ጋምቤላ',
    flag: '🇪🇹',
    majorCities: [
      { am: 'ጋምቤላ ከተማ', en: 'Gambella City', zones: ['ባሮ ወንዝ ዳርቻ', 'ቀበሌ 01', 'ቀበሌ 05'] },
      { am: 'ኢታንግ', en: 'Itang', zones: ['ልዩ ወረዳ ማዕከል', 'ቀበሌ 02'] }
    ],
    primaryUtility: {
      nameAm: 'የጋምቤላ ክልል ውሃና ኢነርጂ ልማት ቢሮ',
      nameEn: 'Gambella Regional Water and Energy Development Bureau',
      code: 'GWEB-GAM',
      hotline: '8119'
    }
  },
  // INTERNATIONAL / CROSS-BORDER & DIASPORA
  {
    id: 'international_diaspora',
    country: 'International',
    nameAm: 'አለም አቀፍና የዲያስፖራ ማህበረሰብ',
    nameEn: 'International & Diaspora Global Network',
    nameOr: 'Hawaasa Addunyaa fi Diyaaspooraa',
    nameTi: 'ዓለም ለኸን ማሕበረሰብ ዲያስፖራን',
    flag: '🌍',
    majorCities: [
      { am: 'ዋሽንግተን ዲሲ / ሰሜን አሜሪካ', en: 'North America (USA & Canada)', zones: ['DMV Metro', 'Minneapolis', 'Seattle', 'Dallas', 'Toronto'] },
      { am: 'አውሮፓ (ዩናይትድ ኪንግደም፣ ጀርመን፣ ስዊዘርላንድ)', en: 'Europe (UK, Germany, Switzerland)', zones: ['London', 'Frankfurt', 'Geneva', 'Stockholm'] },
      { am: 'መካከለኛው ምስራቅ (ዱባይ፣ ሪያድ)', en: 'Middle East (UAE, Saudi Arabia)', zones: ['Dubai Marina', 'Riyadh', 'Doha'] },
      { am: 'ምስራቅ አፍሪካ (ኬንያ፣ ጅቡቲ፣ ሩዋንዳ)', en: 'East Africa Cross-Border (Kenya, Djibouti, Rwanda)', zones: ['Nairobi (Eastleigh)', 'Djibouti City', 'Moyale Border', 'Kigali'] },
      { am: 'አውስትራሊያና ኒውዚላንድ', en: 'Australia & New Zealand', zones: ['Melbourne', 'Sydney', 'Auckland'] }
    ],
    primaryUtility: {
      nameAm: 'አለም አቀፍ የውሃ ትብብርና የዲያስፖራ ፈንድ ጽ/ቤት',
      nameEn: 'Global Diaspora Water Partnership & Cross-Border Utility Hub',
      code: 'GLOBAL-WATER-INTL',
      hotline: '+251 11 551 0000'
    }
  }
];

export const INITIAL_UTILITIES = REGIONS_DIRECTORY.map((r, idx) => ({
  id: `util-${r.id}`,
  nameAm: r.primaryUtility.nameAm,
  nameEn: r.primaryUtility.nameEn,
  code: r.primaryUtility.code,
  country: r.country,
  region: r.nameEn,
  headquartersCity: r.majorCities[0]?.en || 'Headquarters',
  contactPhone: r.primaryUtility.hotline,
  emergencyHotline: r.primaryUtility.hotline,
  directorName: `Eng. Official (${r.nameEn})`,
  coverageZones: r.majorCities.map(c => c.en),
  serviceLevel: (r.country === 'International' ? 'international' : 'regional') as 'regional' | 'international',
  totalSubscribers: Math.floor(15000 + idx * 8500),
  registeredAt: new Date(Date.now() - (idx + 1) * 86400000 * 30).toISOString(),
  isVerified: true
}));
