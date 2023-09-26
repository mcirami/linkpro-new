import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

if (document.getElementById('admin_affiliate_stats')) {

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('admin_affiliate_stats'));
}
