import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx', 'resources/js/custom.jsx'],
            refresh: true,
        }),
        react(),
        viteStaticCopy({
            targets: [
                {
                    src: 'resources/js/custom.jsx',
                    dest: 'js'
                }
            ]
        })
    ],
    resolve: {
        alias: {
            '$': 'jQuery'
        },
    },
});
