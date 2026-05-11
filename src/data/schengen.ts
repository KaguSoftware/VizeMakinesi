import type { FAQItem } from '@/data/countries.types';

export interface SchengenMemberMeta {
  flag: string;
  name: string;
  slug: string;
  presetKey: string;
  summary: string;
  faqs: FAQItem[];
}

const DEFAULT_FAQS = (name: string): FAQItem[] => [
  {
    q: `${name} vizesi için kimler başvurabilir?`,
    a: `Türkiye Cumhuriyeti vatandaşları ${name} Schengen vizesi için başvurabilir. Geçerli pasaport, yeterli maddi imkân ve seyahat amacını belgeleyen evraklar temel gereksinimlerdir.`,
  },
  {
    q: `${name} vize başvurusu için hangi belgeler gereklidir?`,
    a: `Temel belgeler şunlardır: geçerli pasaport (seyahat tarihinden itibaren en az 3 ay geçerli), biyometrik fotoğraf, seyahat sigortası, konaklama belgesi, uçuş rezervasyonu, son 3 aylık banka ekstresi ve iş belgesi veya öğrenci belgesi.`,
  },
  {
    q: `${name} vizesi kaç günde çıkar?`,
    a: `${name} konsolosluğu başvuruları genellikle 10–15 iş günü içinde değerlendirir. Yoğun dönemlerde bu süre uzayabilir; bu nedenle seyahat tarihinizden en az 4–6 hafta önce başvurmanızı öneririz.`,
  },
  {
    q: `${name} vizesi için randevu nasıl alınır?`,
    a: `Randevu, ${name} konsolosluğunun resmi vize başvuru merkezi üzerinden çevrimiçi olarak alınmaktadır. Yoğun dönemlerde randevu bulmak güçleşebilir; ekibimiz randevu takibi konusunda da destek sağlamaktadır.`,
  },
  {
    q: `Schengen vizesiyle ${name} dışında başka ülkelere gidebilir miyim?`,
    a: `Evet. ${name} üzerinden alınan Schengen vizesi, 27 Schengen üyesi ülkenin tamamında geçerlidir. Ancak vizenizin alındığı ülke, seyahatinizin ana destinasyonu olmalıdır.`,
  },
];

export const SCHENGEN_MEMBERS: SchengenMemberMeta[] = [
  {
    flag: '🇦🇹', name: 'Avusturya', slug: 'avusturya', presetKey: 'austria',
    summary: 'Avusturya, Schengen bölgesinin kalbinde yer alan, sanat ve kültürüyle öne çıkan bir ülkedir. Turizm, iş ve öğrenim amaçlı vize başvurularında uzman desteği sunuyoruz.',
    faqs: DEFAULT_FAQS('Avusturya'),
  },
  {
    flag: '🇧🇪', name: 'Belçika', slug: 'belcika', presetKey: 'belgium',
    summary: 'Belçika; AB kurumlarına ev sahipliği yapan, iş ve kültür açısından stratejik bir Schengen ülkesidir. Vize sürecinizde her adımda yanınızdayız.',
    faqs: DEFAULT_FAQS('Belçika'),
  },
  {
    flag: '🇧🇬', name: 'Bulgaristan', slug: 'bulgaristan', presetKey: 'bulgaria',
    summary: 'Bulgaristan, Schengen bölgesine yeni katılan ve ziyaret başvuruları için titiz belge gereksinimleri olan bir ülkedir. Ekibimiz sürecinizi doğru yönetir.',
    faqs: DEFAULT_FAQS('Bulgaristan'),
  },
  {
    flag: '🇭🇷', name: 'Hırvatistan', slug: 'hirvatistan', presetKey: 'croatia',
    summary: 'Hırvatistan, eşsiz Adriyatik kıyıları ve zengin tarihi ile popüler bir Schengen destinasyonudur. Turizm vize başvurularında sizi yönlendiriyoruz.',
    faqs: DEFAULT_FAQS('Hırvatistan'),
  },
  {
    flag: '🇨🇿', name: 'Çekya', slug: 'cekya', presetKey: 'czech',
    summary: 'Çekya, Orta Avrupa\'nın gözdesi; eğitim ve iş seyahati başvuruları için güçlü bir dosya hazırlamanız kritik önem taşır. Deneyimli ekibimiz yanınızda.',
    faqs: DEFAULT_FAQS('Çekya'),
  },
  {
    flag: '🇩🇰', name: 'Danimarka', slug: 'danimarka', presetKey: 'denmark',
    summary: 'Danimarka, yüksek yaşam standartları ve güçlü iş ekosistemiyle öne çıkan İskandinav Schengen ülkesidir. Vize dosyanızı birlikte hazırlayalım.',
    faqs: DEFAULT_FAQS('Danimarka'),
  },
  {
    flag: '🇪🇪', name: 'Estonya', slug: 'estonya', presetKey: 'estonia',
    summary: 'Estonya, dijital altyapısı ve dinamik iş ortamıyla dikkat çeken Baltık Schengen ülkesidir. Başvurunuzu doğru adımlarla ilerletelim.',
    faqs: DEFAULT_FAQS('Estonya'),
  },
  {
    flag: '🇫🇮', name: 'Finlandiya', slug: 'finlandiya', presetKey: 'finland',
    summary: 'Finlandiya, doğal güzellikleri ve güçlü eğitim sistemiyle öne çıkan İskandinav Schengen ülkesidir. Vize sürecinizi eksiksiz yönetiyoruz.',
    faqs: DEFAULT_FAQS('Finlandiya'),
  },
  {
    flag: '🇬🇷', name: 'Yunanistan', slug: 'yunanistan', presetKey: 'greece',
    summary: 'Yunanistan, antik mirası ve Ege kıyılarıyla en çok tercih edilen Schengen destinasyonlarından biridir. Turizm vize başvurunuzu güvenle teslim alıyoruz.',
    faqs: DEFAULT_FAQS('Yunanistan'),
  },
  {
    flag: '🇭🇺', name: 'Macaristan', slug: 'macaristan', presetKey: 'hungary',
    summary: 'Macaristan, Orta Avrupa\'nın kültür merkezi ve uygun fiyatlı Schengen destinasyonlarından biridir. Başvuru dosyanızı hatasız hazırlıyoruz.',
    faqs: DEFAULT_FAQS('Macaristan'),
  },
  {
    flag: '🇮🇸', name: 'İzlanda', slug: 'izlanda', presetKey: 'iceland',
    summary: 'İzlanda, kuzey ışıkları ve volkanik manzaralarıyla benzersiz bir Schengen deneyimi sunar. Seyahat sigortası ve güzergah planlamasında yanınızdayız.',
    faqs: DEFAULT_FAQS('İzlanda'),
  },
  {
    flag: '🇱🇻', name: 'Letonya', slug: 'letonya', presetKey: 'latvia',
    summary: 'Letonya, tarihi eski şehirleri ve canlı kültürüyle keşfedilmeyi bekleyen bir Baltık Schengen ülkesidir. Vize başvurunuzu birlikte hazırlayalım.',
    faqs: DEFAULT_FAQS('Letonya'),
  },
  {
    flag: '🇱🇮', name: 'Lihtenştayn', slug: 'lihtenstayn', presetKey: 'liechtenstein',
    summary: 'Lihtenştayn, İsviçre ile ortak sınır kapısı kullanan küçük bir Schengen prensliğidir. Başvuru sürecinin incelikleri için uzmanlarımıza danışın.',
    faqs: DEFAULT_FAQS('Lihtenştayn'),
  },
  {
    flag: '🇱🇹', name: 'Litvanya', slug: 'litvanya', presetKey: 'lithuania',
    summary: 'Litvanya, Avrupa\'nın yeşil başkenti Vilnius ile dikkat çeken ve ziyaretçi sayısı artan bir Schengen ülkesidir. Dosyanızı güvenle hazırlıyoruz.',
    faqs: DEFAULT_FAQS('Litvanya'),
  },
  {
    flag: '🇱🇺', name: 'Lüksemburg', slug: 'luksemburg', presetKey: 'luxembourg',
    summary: 'Lüksemburg, finans merkezi olma özelliğiyle iş seyahati başvurularında ön planlama gerektiren bir Schengen ülkesidir. Sürecinizi birlikte kolaylaştıralım.',
    faqs: DEFAULT_FAQS('Lüksemburg'),
  },
  {
    flag: '🇲🇹', name: 'Malta', slug: 'malta', presetKey: 'malta',
    summary: 'Malta, Akdeniz\'in incisi; dil okulları ve turizmiyle popüler bir Schengen adası. Başvurunuzu eksiksiz belgelerle hazırlıyoruz.',
    faqs: DEFAULT_FAQS('Malta'),
  },
  {
    flag: '🇳🇴', name: 'Norveç', slug: 'norvec', presetKey: 'norway',
    summary: 'Norveç, fiyortları ve kuzey ışıklarıyla eşsiz manzaralar sunan İskandinav Schengen ülkesidir. Seyahat dosyanızı birlikte hazırlayalım.',
    faqs: DEFAULT_FAQS('Norveç'),
  },
  {
    flag: '🇵🇱', name: 'Polonya', slug: 'polonya', presetKey: 'poland',
    summary: 'Polonya, tarihi şehirleri ve gelişen ekonomisiyle hem turizm hem iş seyahati için tercih edilen bir Schengen ülkesidir. Yanınızda olduğumuz her adımda.',
    faqs: DEFAULT_FAQS('Polonya'),
  },
  {
    flag: '🇵🇹', name: 'Portekiz', slug: 'portekiz', presetKey: 'portugal',
    summary: 'Portekiz, Atlantik kıyıları ve köklü kültürüyle en popüler Schengen destinasyonlarından biridir. Turizm vize başvurunuzu güvenle yönetiyoruz.',
    faqs: DEFAULT_FAQS('Portekiz'),
  },
  {
    flag: '🇷🇴', name: 'Romanya', slug: 'romanya', presetKey: 'romania',
    summary: 'Romanya, Schengen bölgesine yeni katılan ve başvurularda özel dikkat isteyen bir ülkedir. Güncel gereksinimler konusunda sizi bilgilendiriyoruz.',
    faqs: DEFAULT_FAQS('Romanya'),
  },
  {
    flag: '🇸🇰', name: 'Slovakya', slug: 'slovakya', presetKey: 'slovakia',
    summary: 'Slovakya, Orta Avrupa\'nın sakin ve uygun maliyetli Schengen destinasyonlarından biridir. Vize dosyanızı hızlı ve eksiksiz hazırlıyoruz.',
    faqs: DEFAULT_FAQS('Slovakya'),
  },
  {
    flag: '🇸🇮', name: 'Slovenya', slug: 'slovenya', presetKey: 'slovenia',
    summary: 'Slovenya, doğal güzellikleri ve güvenli ortamıyla ailelerin tercih ettiği bir Schengen ülkesidir. Başvurunuzu birlikte kolaylaştıralım.',
    faqs: DEFAULT_FAQS('Slovenya'),
  },
  {
    flag: '🇪🇸', name: 'İspanya', slug: 'ispanya', presetKey: 'spain',
    summary: 'İspanya, her yıl milyonlarca turisti ağırlayan güneşli bir Schengen destinasyonudur. Başvurunuzun her aşamasında deneyimli ekibimiz yanınızda.',
    faqs: DEFAULT_FAQS('İspanya'),
  },
  {
    flag: '🇸🇪', name: 'İsveç', slug: 'isvec', presetKey: 'sweden',
    summary: 'İsveç, yaşam kalitesi ve inovasyon ortamıyla öne çıkan İskandinav Schengen ülkesidir. Vize sürecinizi en doğru adımlarla yönetiyoruz.',
    faqs: DEFAULT_FAQS('İsveç'),
  },
  {
    flag: '🇨🇭', name: 'İsviçre', slug: 'isvicre', presetKey: 'switzerland',
    summary: 'İsviçre, Alp manzaraları ve güçlü ekonomisiyle hem turizm hem iş seyahati başvurularında özenli dosya isteyen bir Schengen ülkesidir.',
    faqs: DEFAULT_FAQS('İsviçre'),
  },
  // Already in DB — included for completeness so grid links always work
  {
    flag: '🇫🇷', name: 'Fransa',   slug: 'fransa',   presetKey: 'france',      summary: '', faqs: [],
  },
  {
    flag: '🇩🇪', name: 'Almanya',  slug: 'almanya',  presetKey: 'germany',     summary: '', faqs: [],
  },
  {
    flag: '🇮🇹', name: 'İtalya',   slug: 'italya',   presetKey: 'italy',       summary: '', faqs: [],
  },
  {
    flag: '🇳🇱', name: 'Hollanda', slug: 'hollanda', presetKey: 'netherlands', summary: '', faqs: [],
  },
];

export const SCHENGEN_SLUG_MAP = new Map(SCHENGEN_MEMBERS.map((m) => [m.slug, m]));
export const SCHENGEN_NAME_TO_SLUG = new Map(SCHENGEN_MEMBERS.map((m) => [m.name, m.slug]));
