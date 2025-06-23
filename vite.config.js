import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import fs from 'fs';
import path from 'path';
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
        https: {
            key: fs.readFileSync(
                path.resolve(
                    process.env.HOME,
                    'Library/Application Support/Herd/Config/valet/Certificates/linkpro-new.test.key'
                )
            ),
            cert: fs.readFileSync(
                path.resolve(
                    process.env.HOME,
                    'Library/Application Support/Herd/Config/valet/Certificates/linkpro-new.test.crt'
                )
            ),
        },
        origin: 'https://linkpro-new.test:5173',
        headers: {
            'Access-Control-Allow-Origin': '*', // Allow from all origins
        },
        hmr: {
            protocol: 'wss', // Use secure WebSocket
            host: 'linkpro-new.test',
            port: 5173,
        },
    },
    build: {
        rollupOptions: {
            /* input: {
                admin: "resources/js/Admin/admin.jsx",
            }, */
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        return id
                            .toString()
                            .split("node_modules/")[1]
                            .split("/")[0]
                            .toString();
                    }
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
