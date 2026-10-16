// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://icabrera-portfolio.com',
    trailingSlash: 'always',

    // Spanish at the root, English under /en/
    i18n: {
        defaultLocale: 'es',
        locales: ['es', 'en'],
        routing: { prefixDefaultLocale: false },
    },

    integrations: [
        sitemap({
            i18n: { defaultLocale: 'es', locales: { es: 'es', en: 'en' } },
            lastmod: new Date(),
        }),
    ],

    // The CloudFront CSP only allows same-origin scripts and styles, so nothing may be inlined
    build: { inlineStylesheets: 'never' },
    vite: { build: { assetsInlineLimit: 0 } },
});
