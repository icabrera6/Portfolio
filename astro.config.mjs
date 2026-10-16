// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { execSync } from 'node:child_process';

// Sitemap lastmod: date of the last commit that changed the site's content, not of the build
function contentLastModified() {
    try {
        const iso = execSync('git log -1 --format=%cI -- src public', { encoding: 'utf8' }).trim();
        return iso ? new Date(iso) : new Date();
    } catch {
        return new Date();
    }
}

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
            lastmod: contentLastModified(),
        }),
    ],

    // The CloudFront CSP only allows same-origin scripts and styles, so nothing may be inlined
    build: { inlineStylesheets: 'never' },
    vite: { build: { assetsInlineLimit: 0 } },
});
