import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: './',
    base: './',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                en: resolve(__dirname, 'index-en.html')
            }
        }
    },
    server: {
        open: true,
    }
});
