import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx', 'resources/js/custom.jsx'],
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
        /*viteStaticCopy({
            targets: [
                {
                    src: 'resources/js/custom.jsx',
                    dest: 'js'
                },
            ]
        })*/
    ],
   /* build : {
        rollupOptions: {
            input: {
                admin: 'resources/js/admin/admin.jsx'
            },
            output:
                {
                    format: 'es',
                    strict: true,
                    entryFileNames: "admin.js",
                    dir: 'public/js/admin'
                }
        },
    },*/
    resolve: {
        alias: {
            '$': 'jQuery'
        },
    },
    define: {
        global: 'globalThis',
    },
});
