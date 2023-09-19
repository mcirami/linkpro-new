import React from 'react';
import ReactDOM from 'react-dom';
import Contact from './Contact.jsx';

if (document.getElementById('contact_form')) {

    ReactDOM.render(
        <React.StrictMode>
            <Contact />
        </React.StrictMode>,
        document.getElementById('contact_form'));
}
