/**
 * Peptide Catalog — AINOA TIEDOSTO JOTA MUOKATA
 *
 * Lisää, poista tai muokkaa peptidejä tästä taulukosta.
 * Hinnat laskettu Biowell Labs -sivuston hinnoista (EUR → USD, per mg).
 *
 * Kenttien selitykset:
 *   name        — näytetään pickerissä ja kaikilla sivuilla
 *   pricePerMg  — hinta USD per mg (kustannuslaskentaan)
 *   defaultUnit — "mg" | "mcg" | "units"  (esivalittu annosyksikkö)
 */

export interface PeptideCatalogItem {
  name: string;
  pricePerMg: number;
  defaultUnit: 'mg' | 'mcg' | 'units';
}

export const PEPTIDE_CATALOG: PeptideCatalogItem[] = [
  { name: 'BPC-157',                  pricePerMg: 8.14,  defaultUnit: 'mcg' },
  { name: 'Ipamorelin',               pricePerMg: 7.29,  defaultUnit: 'mcg' },
  { name: 'Kisspeptin-10',            pricePerMg: 6.53,  defaultUnit: 'mcg' },
  { name: 'CJC-1295 (DAC)',           pricePerMg: 7.62,  defaultUnit: 'mcg' },
  { name: 'TB-500',                   pricePerMg: 7.90,  defaultUnit: 'mcg' },
  { name: 'HGH Fragment 176-191',     pricePerMg: 5.94,  defaultUnit: 'mcg' },
  { name: 'Retatrutide',              pricePerMg: 21.90, defaultUnit: 'mg'  },
  { name: 'Tirzepatide',              pricePerMg: 12.00, defaultUnit: 'mg'  },
  { name: 'Semaglutide',              pricePerMg: 15.00, defaultUnit: 'mg'  },
  { name: 'PT-141',                   pricePerMg: 6.53,  defaultUnit: 'mg'  },
  { name: 'Melanotan II',             pricePerMg: 3.54,  defaultUnit: 'mg'  },
  { name: 'AOD-9604',                 pricePerMg: 3.00,  defaultUnit: 'mcg' },
  { name: 'Thymosin Alpha-1',         pricePerMg: 7.57,  defaultUnit: 'mg'  },
  { name: 'Thymosin Beta-4 (TB-4)',   pricePerMg: 9.24,  defaultUnit: 'mg'  },
  { name: 'SS-31 (Elamipretide)',     pricePerMg: 8.14,  defaultUnit: 'mg'  },
  { name: 'MOTS-C',                   pricePerMg: 3.40,  defaultUnit: 'mg'  },
  { name: 'LL-37',                    pricePerMg: 7.40,  defaultUnit: 'mg'  },
  { name: 'N-Acetyl Selank Amidate',  pricePerMg: 3.43,  defaultUnit: 'mcg' },
  { name: 'N-Acetyl Semax Amidate',   pricePerMg: 3.43,  defaultUnit: 'mcg' },
  { name: 'Selank',                   pricePerMg: 4.00,  defaultUnit: 'mcg' },
  { name: 'Semax',                    pricePerMg: 4.00,  defaultUnit: 'mcg' },
  { name: 'DSIP',                     pricePerMg: 7.06,  defaultUnit: 'mcg' },
  { name: 'GHK-Cu',                   pricePerMg: 6.81,  defaultUnit: 'mcg' },
  { name: 'MGF PEG',                  pricePerMg: 7.08,  defaultUnit: 'mcg' },
  { name: 'MGF',                      pricePerMg: 6.00,  defaultUnit: 'mcg' },
  { name: 'IGF-1 LR3',               pricePerMg: 15.00, defaultUnit: 'mcg' },
  { name: 'IGF-1 DES',               pricePerMg: 20.00, defaultUnit: 'mcg' },
  { name: 'Tesamorelin',              pricePerMg: 15.93, defaultUnit: 'mg'  },
  { name: 'Follistatin 344',          pricePerMg: 50.00, defaultUnit: 'mcg' },
  { name: 'SLU-PP 332',              pricePerMg: 11.91, defaultUnit: 'mg'  },
];

export function findCatalogItem(name: string): PeptideCatalogItem | undefined {
  return PEPTIDE_CATALOG.find(p => p.name === name);
}
