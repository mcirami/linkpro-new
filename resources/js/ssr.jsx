import './bootstrap';
import '../css/app.css';
import '../sass/app.scss'

import { createInertiaApp } from '@inertiajs/react'
import createServer from '@inertiajs/react/server'
import ReactDOMServer from 'react-dom/server'

import 'laravel-vapor';
import _ from 'lodash';
window._ = _;
import Vapor from 'laravel-vapor';
Vapor.withBaseAssetUrl(import.meta.env.VITE_VAPOR_ASSET_URL);
window.Vapor = Vapor;

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer(page =>
    createInertiaApp({
        title: (title) => `${title} - ${appName}`,
        page,
        render: ReactDOMServer.renderToString,
        resolve: name => {
            const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
            return pages[`./Pages/${name}.jsx`]
        },
        setup: ({ App, props }) => <App {...props} />,
    }),
)
