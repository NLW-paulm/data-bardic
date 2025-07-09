export const languages = {
  cy: 'Cymraeg',
  en: 'English',
};

export const defaultLang = 'cy';

export const ui = {
  cy: {
    'nav.home': 'Cartref',
    'nav.data': 'Data',
    'nav.about': 'Amdanom',
    'nav.brand': 'Data LlGC',
    'site.title': 'Data LlGC',
    'site.description': 'Set ddata Enwau Barddol Llyfrgell Genedlaethol Cymru',
    'search.placeholder': 'Chwilio cofnodion barddol...',
    'search.noResults': 'Dim canlyniadau ar gyfer',
    'search.readMore': 'Darllen Mwy →',
    'pagination.previous': 'Blaenorol',
    'pagination.next': 'Nesaf',
    'about.title': 'Amdanom',
    'about.projectTitle': 'Am y Prosiect',
    'about.projectDescription1': 'Mae\'r wefan hon yn darparu mynediad at set ddata Enwau Barddol Llyfrgell Genedlaethol Cymru, gan gynnig cipolwg ar hanes diwylliannol Cymru trwy gofnodion traddodiadau barddol.',
    'about.projectDescription2': 'Mae\'r set ddata yn cynnwys gwybodaeth am feirdd Cymru, gan gynnwys eu henwau barddol, lleoliadau, dyddiadau derbyn, a mathau o aelodaeth.',
    'about.contactTitle': 'Gwybodaeth Gyswllt',
    'about.address': '📍 Cyfeiriad: Llyfrgell Genedlaethol Cymru, Aberystwyth, Ceredigion, SY23 3BU',
    'data.title': 'Data',
    'data.downloadTitle': 'Lawrlwytho Set Ddata',
    'data.downloadButton': 'Lawrlwytho BardicNames.json',
    'data.sampleTitle': 'Sampl Data',
    'bard.backToSearch': 'Yn ôl i\'r Chwilio',
    'bard.unknown': 'Anhysbys',
    'field.bardicName': 'Enw Barddol',
    'field.surname': 'Cyfenw',
    'field.firstName': 'Enwau Cyntaf',
    'field.title': 'Teitl',
    'field.townVillage': 'Tref/Pentref',
    'field.dateAdmitted': 'Dyddiad Derbyn',
    'field.examHonorary': 'Arholiad neu Anrhydedd',
    'field.membershipType': 'Math o Aelodaeth',
    'field.source': 'Ffynhonnell',
    'field.additionalInfo': 'Gwybodaeth Ychwanegol',
  },
  en: {
    'nav.home': 'Home',
    'nav.data': 'Data',
    'nav.about': 'About',
    'nav.brand': 'NLW Data',
    'site.title': 'NLW Data',
    'site.description': 'National Library of Wales Bardic Names Dataset',
    'search.placeholder': 'Search bardic records...',
    'search.noResults': 'No results found for',
    'search.readMore': 'Read More →',
    'pagination.previous': 'Previous',
    'pagination.next': 'Next',
    'about.title': 'About',
    'about.projectTitle': 'About the Project',
    'about.projectDescription1': 'This website provides access to the National Library of Wales\' Bardic Names dataset, offering insights into Welsh cultural history through records of bardic traditions.',
    'about.projectDescription2': 'The dataset contains information about Welsh bards, including their bardic names, locations, dates of admission, and types of membership.',
    'about.contactTitle': 'Contact Information',
    'about.address': '📍 Address: The National Library of Wales, Aberystwyth, Ceredigion, SY23 3BU',
    'data.title': 'Data',
    'data.downloadTitle': 'Download Dataset',
    'data.downloadButton': 'Download BardicNames.json',
    'data.sampleTitle': 'Data Sample',
    'bard.backToSearch': 'Back to Search',
    'bard.unknown': 'Unknown',
    'field.bardicName': 'Bardic Name',
    'field.surname': 'Surname',
    'field.firstName': 'First Names',
    'field.title': 'Title',
    'field.townVillage': 'Town/Village',
    'field.dateAdmitted': 'Date Admitted',
    'field.examHonorary': 'Exam or Honorary',
    'field.membershipType': 'Type of Membership',
    'field.source': 'Source',
    'field.additionalInfo': 'Additional Information',
  },
} as const;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}