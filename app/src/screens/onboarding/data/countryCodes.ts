export const countryCodes = [
  { code: 'AU', name: 'Australia (+61)' },
  { code: 'BE', name: 'Belgium (+32)' },
  { code: 'BR', name: 'Brazil (+55)' },
  { code: 'CA', name: 'Canada (+1)' },
  { code: 'CN', name: 'China (+86)' },
  { code: 'DK', name: 'Denmark (+45)' },
  { code: 'FR', name: 'France (+33)' },
  { code: 'IN', name: 'India (+91)' },
  { code: 'IT', name: 'Italy (+39)' },
  { code: 'JP', name: 'Japan (+81)' },
  { code: 'MX', name: 'Mexico (+52)' },
  { code: 'NL', name: 'Netherlands (+31)' },
  { code: 'NO', name: 'Norway (+47)' },
  { code: 'PL', name: 'Poland (+48)' },
  { code: 'RU', name: 'Russia (+7)' },
  { code: 'SG', name: 'Singapore (+65)' },
  { code: 'ES', name: 'Spain (+34)' },
  { code: 'SE', name: 'Sweden (+46)' },
  { code: 'GB', name: 'United Kingdom (+44)' },
  { code: 'US', name: 'United States (+1)' },
] as const;

export type CountryCode = (typeof countryCodes)[number]['code'];
