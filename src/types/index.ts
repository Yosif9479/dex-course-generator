export interface Translation {
  locale: string;
  value: string;
}

export interface Word {
  id: string;
  term: string;
  translations: Translation[];
}

export interface Module {
  id: string;
  name: string;
  words: Word[];
}

export interface Course {
  id: string;
  name: string;
  modules: Module[];
  createdAt: string;
}

export interface LocaleOption {
  code: string;
  name: string;
}

export interface Settings {
  locales: LocaleOption[];
  defaultTranslationLocales: string[];
}

export const DEFAULT_LOCALE_OPTIONS: LocaleOption[] = [
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Russian' },
  { code: 'tj', name: 'Tajik' }
];

export const DEFAULT_SETTINGS: Settings = {
  locales: DEFAULT_LOCALE_OPTIONS,
  defaultTranslationLocales: ['ru', 'tj']
};