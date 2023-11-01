'use strict'

jQuery(document).ready(function($) {

    const refPopup = document.querySelector('#ref_popup');

    if (refPopup) {
        document.querySelector('.open_ref_pop').
            addEventListener('click', function(e) {
                e.preventDefault();
                refPopup.classList.add('open');
            });

        document.querySelector('.close_popup').addEventListener('click', function(e){
            e.preventDefault();
            refPopup.classList.remove('open');
        })
    }

});
