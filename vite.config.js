import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
//import fs from 'fs';
//import path from 'path';
//const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/js/app.jsx"],
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: 'linkpro-new.test', // <- this is the key
        port: 5173,
        cors: true, // Add this
        https: false, // or true, if you want to try again with SSL later
        origin: 'http://linkpro-new.test:5173',
        headers: {
            'Access-Control-Allow-Origin': '*', // Allow from all origins
        },
        hmr: {
            host: 'linkpro-new.test',
        },
    },
    build: {
        rollupOptions: {
            /* input: {
                admin: "resources/js/Admin/admin.jsx",
            }, */
            output: {
                manualChunks(id) {
                    /*if (id.includes("node_modules")) {
                        return id
                            .toString()
                            .split("node_modules/")[1]
                            .split("/")[0]
                            .toString();
                    }*/
                    if (id.includes("node_modules/react")) return "react";
                    if (id.includes("node_modules/@icons")) return "icons";
                },
                /* format: "es",
                strict: true,
                entryFileNames: "admin.jsx",
                dir: "public/js/admin", */
            },
        },
    },

    resolve: {
        alias: {
            $: "jQuery",
        },
    },
    define: {
        global: "globalThis",
    },
});
