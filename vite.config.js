import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx', 'resources/js/custom.jsx', 'resources/js/Admin/admin.jsx'],
            refresh: true,
        }),
        react(),
        /*viteStaticCopy({
            targets: [
                {
                    src: 'resources/js/Admin/admin.jsx',
                    dest: 'js/admin.js'
                },
            ]
        })*/
    ],

   /* build : {
        rollupOptions: {
            /!*input: {
                admin: 'resources/js/Admin/admin.jsx'
            },*!/
            output:

                {
                    manualChunks(id) {
                        if(id.includes('node_modules')) {
                            return id.toString().split('node_modules/')[1].split('/')[0].toString();
                        }
                    },
                    /!*format: 'es',
                    strict: true,
                    entryFileNames: "admin.jsx",
                    dir: 'public/js/admin'*!/
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
