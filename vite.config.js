import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx', 'resources/js/custom.jsx', 'resources/js/admin/admin.js', 'resources/sass/admin.scss'],
            refresh: true,
        }),
        react(),
        viteStaticCopy({
            targets: [
                {
                    src: 'resources/js/custom.jsx',
                    dest: 'js'
                },
                {
                    src: 'resources/js/admin/admin.js',
                    dest: 'js/admin.js'
                },
                {
                    src: 'resources/sass/admin.scss',
                    dest: 'css/admin.css'
                }
            ]
        })
    ],
    resolve: {
        alias: {
            '$': 'jQuery'
        },
    },
    define: {
        global: 'globalThis',
    },
});
