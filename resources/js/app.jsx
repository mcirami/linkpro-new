import './bootstrap';
import '../css/app.css';
import '../sass/app.scss'

import { createRoot } from 'react-dom/client';
import { hydrateRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

import 'laravel-vapor';
import _ from 'lodash';
window._ = _;
import Vapor from 'laravel-vapor';
Vapor.withBaseAssetUrl(import.meta.env.VITE_VAPOR_ASSET_URL);
window.Vapor = Vapor;

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(
        `./Pages/${name}.jsx`,
        import.meta.glob('./Pages/**/*.jsx'),
    ),
    setup({ el, App, props, plugin }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
