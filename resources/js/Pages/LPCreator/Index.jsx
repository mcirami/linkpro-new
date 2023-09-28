import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

if (document.getElementById('creator')) {

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('creator'));

}
