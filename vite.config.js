import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

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
        minify: 'esbuild',
        /*rollupOptions: {
            output: {
                 manualChunks(id) {
                    if (id.includes("node_modules")) {
                        if (id.includes("react") ||
                            id.includes('@react-icons')) {
                            return "react-vendor"; // Group React and React-DOM into one chunk
                        }
                        return "vendor";
                    }
                },
            },
        },*/
    },
    optimizeDeps: {
        include: ['react', 'react-dom'], // Ensures prebundling of these dependencies
    },
    resolve: {
        alias: {
            $: "jQuery",
        },
    },
    /*
    define: {
        global: "globalThis",
    },*/
});
