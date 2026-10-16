import { getAbsoluteLocaleUrl } from 'astro:i18n';
import es from './es.json';
import en from './en.json';

export const translations = { es, en };
export type Lang = keyof typeof translations;
export type Translation = typeof es;

// Per-locale settings that are not copy
export const localeSettings: Record<Lang, { htmlLang: string; ogLocale: string; label: string }> = {
    es: { htmlLang: 'es', ogLocale: 'es_ES', label: 'ES' },
    en: { htmlLang: 'en', ogLocale: 'en_GB', label: 'EN' },
};

export const langs = Object.keys(translations) as Lang[];

// Locale used for hreflang="x-default"
export const defaultHreflang: Lang = 'en';

export function t(lang: Lang): Translation {
    return translations[lang];
}

export function pageUrl(lang: Lang): string {
    return getAbsoluteLocaleUrl(lang);
}
