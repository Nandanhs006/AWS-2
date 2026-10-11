import React, { createContext, useContext, useState, ReactNode } from 'react';

export type SupportedLanguage = 'en' | 'hi' | 'kn' | 'mr' | 'te' | 'ta' | 'gu';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // TopBar & Branding
    brandName: 'HeatSutra',
    brandTagline: 'PARAMETRIC HEAT-COVER WORKBENCH',
    activeCohort: 'Active Union Cohort',
    cohortSubtitle: 'SEWA Informal Workers Protection · 31 Pilot Hubs',
    logout: 'Log Out',
    langSelect: 'Language',

    // Screens / Nav Tabs
    'nav.studio': 'Trigger Studio',
    'nav.distress': 'Distress Map',
    'nav.desk': 'Heat-Day Desk',
    'nav.replay': 'Season Replay',
    'nav.datatrust': 'Data Trust',
    'nav.datasets': 'Open Datasets',
    'nav.microclimate': 'Ward Heat Islands',
    'nav.cohorts': 'Cohort Registry',
    'nav.actuarial': 'Actuarial Solvency',
    'nav.disbursement': 'UPI Disbursement',
    'nav.decisions': 'Decision Record',
    'nav.contract': 'Policy Schedule',

    // Common labels
    officer: 'Programme Officer',
    reviewer: 'Auditor & Actuary',
    statusAdvisory: 'Heat Advisory',
    statusPartial: 'Partial Payout',
    statusFull: 'Full Relief Fired',
    statusNormal: 'Normal Range',

    // Worker Alert SMS/WhatsApp preview
    workerAlert: 'HeatSutra Alert: Extreme humid heat today. Your income protection payout of ₹400 has been credited to your Aadhaar-linked UPI account. Please rest in shade from 12 PM to 4 PM and hydrate with ORS.',
  },

  hi: {
    brandName: 'HeatSutra',
    brandTagline: 'पैरामीट्रिक हीट-कवर वर्कबेंच',
    activeCohort: 'सक्रिय श्रमिक समूह',
    cohortSubtitle: 'सेवा (SEWA) अनौपचारिक कामगार सुरक्षा · 31 पायलट केंद्र',
    logout: 'लॉग आउट',
    langSelect: 'भाषा',

    'nav.studio': 'ट्रिगर स्टूडियो',
    'nav.distress': 'डिस्ट्रेस मैप',
    'nav.desk': 'हीट-डे डेस्क',
    'nav.replay': 'सीज़न रीप्ले',
    'nav.datatrust': 'डेटा ट्रस्ट',
    'nav.datasets': 'ओपन डेटासेट्स',
    'nav.microclimate': 'वार्ड हीट आइलैंड्स',
    'nav.cohorts': 'श्रमिक रजिस्ट्री',
    'nav.actuarial': 'सॉल्वेंसी ऑडिट',
    'nav.disbursement': 'यूपीआई संवितरण',
    'nav.decisions': 'निर्णय रिकॉर्ड',
    'nav.contract': 'पॉलिसी अनुसूची',

    officer: 'कार्यक्रम अधिकारी',
    reviewer: 'ऑडिटर व एक्चुअरी',
    statusAdvisory: 'गर्मी चेतावनी',
    statusPartial: 'आंशिक राहत',
    statusFull: 'पूर्ण राहत जारी',
    statusNormal: 'सामान्य स्तर',

    workerAlert: 'हीटसूत्रा अलर्ट: आज अत्यधिक उमस भरी गर्मी दर्ज की गई है। आपकी ₹400 की आय सुरक्षा सहायता आपके यूपीआई खाते में भेज दी गई है। कृपया दोपहर 12 से 4 बजे तक छांव में आराम करें और ओआरएस पिएं।',
  },

  kn: {
    brandName: 'HeatSutra',
    brandTagline: 'ಪ್ಯಾರಾಮೆಟ್ರಿಕ್ ಹೀಟ್-ಕವರ್ ವರ್ಕ್‌ಬೆಂಚ್',
    activeCohort: 'ಸಕ್ರಿಯ ಕಾರ್ಮಿಕ ಸಮೂಹ',
    cohortSubtitle: 'ಸೇವಾ (SEWA) ಅಸಂಘಟಿತ ಕಾರ್ಮಿಕರ ರಕ್ಷಣೆ · 31 ಪ್ರಾಯೋಗಿಕ ಕೇಂದ್ರಗಳು',
    logout: 'ಲಾಗ್ ಔಟ್',
    langSelect: 'ಭಾಷೆ',

    'nav.studio': 'ಟ್ರಿಗ್ಗರ್ ಸ್ಟುಡಿಯೋ',
    'nav.distress': 'ಸಂಕಷ್ಟ ನಕ್ಷೆ',
    'nav.desk': 'ಶಾಖ-ದಿನ ಡೆಸ್ಕ್',
    'nav.replay': 'ಸೀಸನ್ ರಿಪ್ಲೇ',
    'nav.datatrust': 'ಡೇಟಾ ವಿಶ್ವಾಸಾರ್ಹತೆ',
    'nav.datasets': 'ಮುಕ್ತ ಡೇಟಾಸೆಟ್‌ಗಳು',
    'nav.microclimate': 'ವಾರ್ಡ್ ಶಾಖ ದ್ವೀಪಗಳು',
    'nav.cohorts': 'ಕಾರ್ಮಿಕ ನೋಂದಣಿ',
    'nav.actuarial': 'ಆಕ್ಚುಯರಿಯಲ್ ಪರಿಶೋಧನೆ',
    'nav.disbursement': 'ಯುಪಿಐ ಪಾವತಿ',
    'nav.decisions': 'ನಿರ್ಧಾರ ದಾಖಲೆ',
    'nav.contract': 'ಪಾಲಿಸಿ ವೇಳಾಪಟ್ಟಿ',

    officer: 'ಕಾರ್ಯಕ್ರಮ ಅಧಿಕಾರಿ',
    reviewer: 'ಪರಿಶೋಧಕ & ಆಕ್ಚುರಿ',
    statusAdvisory: 'ಶಾಖ ಎಚ್ಚರಿಕೆ',
    statusPartial: 'ಭಾಗಶಃ ಪರಿಹಾರ',
    statusFull: 'ಪೂರ್ಣ ಪರಿಹಾರ ಜಾರಿ',
    statusNormal: 'ಸಾಮಾನ್ಯ ಮಟ್ಟ',

    workerAlert: 'ಹೀಟ್ಸೂತ್ರ ಎಚ್ಚರಿಕೆ: ಇಂದು ತೀವ್ರ ಉಷ್ಣಾಂಶ ಹಾಗೂ ತೇವಾಂಶ ದಾಖಲಾಗಿದೆ. ನಿಮ್ಮ ₹400 ದಿನಗೂಲಿ ರಕ್ಷಣಾ ಹಣವನ್ನು ನಿಮ್ಮ ಯುಪಿಐ ಖಾತೆಗೆ ನೇರವಾಗಿ ಜಮೆ ಮಾಡಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಮಧ್ಯಾಹ್ನ 12 ರಿಂದ 4 ರವರೆಗೆ ನೆರಳಿನಲ್ಲಿ ವಿಶ್ರಮಿಸಿ ಮತ್ತು ನೀರು ಕುಡಿಯಿರಿ.',
  },

  mr: {
    brandName: 'HeatSutra',
    brandTagline: 'पॅरामीट्रिक हीट-कव्हर वर्कबेंच',
    activeCohort: 'सक्रिय कामगार गट',
    cohortSubtitle: 'सेवा (SEWA) असंघटित कामगार संरक्षण · 31 केंद्र',
    logout: 'लॉग आऊट',
    langSelect: 'भाषा',

    'nav.studio': 'ट्रिगर स्टुडिओ',
    'nav.distress': 'डिस्ट्रेस नकाशा',
    'nav.desk': 'हीट-डे डेस्क',
    'nav.replay': 'हंगाम रिप्ले',
    'nav.datatrust': 'डेटा विश्वासार्हता',
    'nav.datasets': 'ओपन डेटासेट्स',
    'nav.microclimate': 'वॉर्ड हीट आयलंड',
    'nav.cohorts': 'कामगार नोंदणी',
    'nav.actuarial': 'सॉल्व्हन्सी ऑडिट',
    'nav.disbursement': 'यूपीआय वितरण',
    'nav.decisions': 'निर्णय नोंदवही',
    'nav.contract': 'पॉलिसी वेळापत्रक',

    officer: 'कार्यक्रम अधिकारी',
    reviewer: 'ऑडिटर व ॲक्च्युअरी',
    statusAdvisory: 'उष्णता इशारा',
    statusPartial: 'अंशतः मदत',
    statusFull: 'पूर्ण मदत वितरित',
    statusNormal: 'सामान्य तापमान',

    workerAlert: 'हीटसूत्रा अलर्ट: आज तीव्र दमट उष्णता नोंदवली गेली आहे. तुमची ₹400 ची उत्पन्न संरक्षण रक्कम थेट तुमच्या यूपीआय खात्यात जमा झाली आहे. कृपया दुपारी 12 ते 4 दरम्यान सावलीत विश्रांती घ्या आणि ओआरएस प्या.',
  },

  te: {
    brandName: 'HeatSutra',
    brandTagline: 'పారామెట్రిక్ హీట్-కవర్ వర్క్‌బెంచ్',
    activeCohort: 'క్రియాశీల కార్మిక సమూహం',
    cohortSubtitle: 'సేవా (SEWA) అసంఘటిత కార్మిక రక్షణ · 31 పైలట్ కేంద్రాలు',
    logout: 'లాగ్ అవుట్',
    langSelect: 'భాష',

    'nav.studio': 'ట్రిగ్గర్ స్టూడియో',
    'nav.distress': 'డిస్ట్రెస్ మ్యాప్',
    'nav.desk': 'హీట్-డే డెస్క్',
    'nav.replay': 'సీజన్ రీప్లే',
    'nav.datatrust': 'డేటా విశ్వసనీయత',
    'nav.datasets': 'ఓపెన్ డేటాసెట్లు',
    'nav.microclimate': 'వార్డు హీట్ దీవులు',
    'nav.cohorts': 'కార్మికుల రిజిస్ట్రీ',
    'nav.actuarial': 'సాల్వెన్సీ ఆడిట్',
    'nav.disbursement': 'యూపీఐ చెల్లింపు',
    'nav.decisions': 'నిర్ణయాల రికార్డు',
    'nav.contract': 'పాలసీ షెడ్యూల్',

    officer: 'కార్యక్రమ అధికారి',
    reviewer: 'ఆడిటర్ & యాక్చువరీ',
    statusAdvisory: 'వడగాల్పుల హెచ్చరిక',
    statusPartial: 'పాక్షిక ఉపశమనం',
    statusFull: 'పూర్తి చెల్లింపు విడుదల',
    statusNormal: 'సాధారణ స్థాయి',

    workerAlert: 'హీట్సూత్ర హెచ్చరిక: ఈరోజు అత్యధిక తేమతో కూడిన ఎండ నమోదైంది. మీ ₹400 ఆదాయ రక్షణ చెల్లింపు మీ యూపీఐ ఖాతాకు జమ చేయబడింది. దయచేసి మధ్యాహ్నం 12 నుండి 4 గంటల వరకు నీడలో విశ్రాంతి తీసుకోండి మరియు ఓఆర్ఎస్ నీరు త్రాగండి.',
  },

  ta: {
    brandName: 'HeatSutra',
    brandTagline: 'பாராமெட்ரிக் வெப்ப பாதுகாப்பு பணித்தளம்',
    activeCohort: 'செயலில் உள்ள தொழிலாளர் குழு',
    cohortSubtitle: 'சேவா (SEWA) முறைசாரா தொழிலாளர் பாதுகாப்பு · 31 மையங்கள்',
    logout: 'வெளியேறு',
    langSelect: 'மொழி',

    'nav.studio': 'ட்ரிக்கர் ஸ்டுடியோ',
    'nav.distress': 'பாதிப்பு வரைபடம்',
    'nav.desk': 'வெப்ப நாள் டெஸ்க்',
    'nav.replay': 'பருவ மறுபார்வை',
    'nav.datatrust': 'தரவு நம்பகத்தன்மை',
    'nav.datasets': 'திறந்த தரவுத்தொகுப்புகள்',
    'nav.microclimate': 'வார்டு வெப்ப தீவுகள்',
    'nav.cohorts': 'தொழிலாளர் பதிவேடு',
    'nav.actuarial': 'நிதி தணிக்கை',
    'nav.disbursement': 'யுபிஐ பட்டுவாடா',
    'nav.decisions': 'முடிவு ஆவணம்',
    'nav.contract': 'பாலிசி அட்டவணை',

    officer: 'திட்ட அலுவலர்',
    reviewer: 'தணிக்கையாளர்',
    statusAdvisory: 'வெப்ப எச்சரிக்கை',
    statusPartial: 'பகுதி நிவாரணம்',
    statusFull: 'முழு நிவாரணம் வழங்கப்பட்டது',
    statusNormal: 'இயல்பு நிலை',

    workerAlert: 'ஹீட்சூத்ரா எச்சரிக்கை: இன்று மிகக் கடுமையான வெப்பம் நிலவுகிறது. உங்கள் ₹400 வருமான பாதுகாப்புத் தொகை உங்கள் யுபிஐ வங்கிக் கணக்கில் வரவு வைக்கப்பட்டுள்ளது. மதியம் 12 முதல் 4 மணி வரை நிழலில் ஓய்வெடுக்கவும்.',
  },

  gu: {
    brandName: 'HeatSutra',
    brandTagline: 'પેરામેટ્રિક હીટ-કવર વર્કબેન્ચ',
    activeCohort: 'સક્રિય શ્રમિક જૂથ',
    cohortSubtitle: 'સેવા (SEWA) અસંગઠિત કામદાર સુરક્ષા · 31 પાયલોટ કેન્દ્રો',
    logout: 'લૉગ આઉટ',
    langSelect: 'ભાષા',

    'nav.studio': 'ટ્રિગર સ્ટુડિયો',
    'nav.distress': 'ડિસ્ટ્રેસ નકશો',
    'nav.desk': 'હીટ-ડે ડેસ્ક',
    'nav.replay': 'સીઝન રિપ્લે',
    'nav.datatrust': 'ડેટા વિશ્વસનીયતા',
    'nav.datasets': 'ઓપન ડેટાસેટ્સ',
    'nav.microclimate': 'વોર્ડ હીટ આઇલેન્ડ્સ',
    'nav.cohorts': 'શ્રમિક રજિસ્ટ્રી',
    'nav.actuarial': 'સોલ્વન્સી ઓડિટ',
    'nav.disbursement': 'યુપીઆઈ વિતરણ',
    'nav.decisions': 'નિર્ણય રિકોર્ડ',
    'nav.contract': 'પોલિસી સમયપત્રક',

    officer: 'પ્રોગ્રામ ઓફિસર',
    reviewer: 'ઓડિટર અને એક્ચ્યુરી',
    statusAdvisory: 'ગરમીની ચેતવણી',
    statusPartial: 'આંશિક રાહત',
    statusFull: 'સંપૂર્ણ રાહત જારી',
    statusNormal: 'સામાન્ય સ્તર',

    workerAlert: 'હીટસૂત્ર એલર્ટ: આજે અતિશય ગરમી અને ભેજ નોંધાયા છે. તમારી ₹400 ની આવક સુરક્ષા સહાય તમારા યુપીઆઈ ખાતામાં જમા કરવામાં આવી છે. કૃપા કરીને બપોરે 12 થી 4 છાંયડામાં આરામ કરો અને ઓઆરએસ પીવો.',
  },
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('heatsutra_lang') as SupportedLanguage;
    if (saved && TRANSLATIONS[saved]) return saved;
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('heatsutra_lang', lang);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
};
