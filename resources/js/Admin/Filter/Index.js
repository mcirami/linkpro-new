import React from 'react';
import ReactDOM from 'react-dom';
import Filter from './App';

if (document.getElementById('admin_filters')) {

    ReactDOM.render(
        <React.StrictMode>
            <Filter />
        </React.StrictMode>,
        document.getElementById('admin_filters'));
}

