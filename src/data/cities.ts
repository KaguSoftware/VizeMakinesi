// City → country mapping for search.
// Each entry: { city: Turkish city name, countrySlug: slug from countries table/schengen }
// To add a new city: append a new object to the array below.

export interface CityEntry {
  city: string;
  countrySlug: string;
}

export const CITY_TO_COUNTRY: CityEntry[] = [
  // İrlanda
  { city: 'Dublin', countrySlug: 'irlanda' },

  // İngiltere
  { city: 'Londra', countrySlug: 'ingiltere' },

  // Almanya
  { city: 'Berlin', countrySlug: 'almanya' },
  { city: 'Münih', countrySlug: 'almanya' },

  // Fransa
  { city: 'Paris', countrySlug: 'fransa' },

  // İtalya
  { city: 'Roma', countrySlug: 'italya' },
  { city: 'Venedik', countrySlug: 'italya' },
  { city: 'Floransa', countrySlug: 'italya' },

  // Hollanda
  { city: 'Amsterdam', countrySlug: 'hollanda' },
  { city: 'Rotterdam', countrySlug: 'hollanda' },

  // Amerika Birleşik Devletleri
  { city: 'New York', countrySlug: 'abd' },
  { city: 'Los Angeles', countrySlug: 'abd' },
  { city: 'Miami', countrySlug: 'abd' },

  // Kanada
  { city: 'Toronto', countrySlug: 'kanada' },
  { city: 'Vancouver', countrySlug: 'kanada' },

  // Avustralya
  { city: 'Sidney', countrySlug: 'avustralya' },
  { city: 'Melbourne', countrySlug: 'avustralya' },

  // Birleşik Arap Emirlikleri
  { city: 'Dubai', countrySlug: 'bae' },
  { city: 'Abu Dabi', countrySlug: 'bae' },

  // Finlandiya
  { city: 'Helsinki', countrySlug: 'finlandiya' },

  // Yunanistan
  { city: 'Atina', countrySlug: 'yunanistan' },
  { city: 'Selanik', countrySlug: 'yunanistan' },

  // Macaristan
  { city: 'Budapeşte', countrySlug: 'macaristan' },

  // İzlanda
  { city: 'Reykjavik', countrySlug: 'izlanda' },

  // Letonya
  { city: 'Riga', countrySlug: 'letonya' },

  // Litvanya
  { city: 'Vilnius', countrySlug: 'litvanya' },

  // Lüksemburg
  { city: 'Lüksemburg', countrySlug: 'luksemburg' },

  // Malta
  { city: 'Valetta', countrySlug: 'malta' },

  // Norveç
  { city: 'Oslo', countrySlug: 'norvec' },
  { city: 'Bergen', countrySlug: 'norvec' },

  // İspanya
  { city: 'Barselona', countrySlug: 'ispanya' },
  { city: 'Madrid', countrySlug: 'ispanya' },

  // İsviçre
  { city: 'Zürih', countrySlug: 'isvicre' },
  { city: 'Cenevre', countrySlug: 'isvicre' },

  // Danimarka
  { city: 'Kopenhag', countrySlug: 'danimarka' },

  // Estonya
  { city: 'Tallinn', countrySlug: 'estonya' },

  // Lihtenştayn
  { city: 'Vaduz', countrySlug: 'lihtenstayn' },

  // İsveç
  { city: 'Stockholm', countrySlug: 'isvec' },

  // Hırvatistan
  { city: 'Dubrovnik', countrySlug: 'hirvatistan' },
  { city: 'Zagreb', countrySlug: 'hirvatistan' },

  // Slovakya
  { city: 'Bratislava', countrySlug: 'slovakya' },

  // Slovenya
  { city: 'Ljubljana', countrySlug: 'slovenya' },

  // Romanya
  { city: 'Bükreş', countrySlug: 'romanya' },
  { city: 'Braşov', countrySlug: 'romanya' },

  // Polonya
  { city: 'Krakow', countrySlug: 'polonya' },
  { city: 'Varşova', countrySlug: 'polonya' },

  // Çin
  { city: 'Pekin', countrySlug: 'cin' },
  { city: 'Şanghay', countrySlug: 'cin' },

  // Avusturya
  { city: 'Viyana', countrySlug: 'avusturya' },
  { city: 'Salzburg', countrySlug: 'avusturya' },

  // Belçika
  { city: 'Brüksel', countrySlug: 'belcika' },
  { city: 'Brugge', countrySlug: 'belcika' },

  // Bulgaristan
  { city: 'Sofya', countrySlug: 'bulgaristan' },
  { city: 'Varna', countrySlug: 'bulgaristan' },

  // Portekiz
  { city: 'Lizbon', countrySlug: 'portekiz' },
  { city: 'Porto', countrySlug: 'portekiz' },

  // Çekya
  { city: 'Prag', countrySlug: 'cekya' },
];
