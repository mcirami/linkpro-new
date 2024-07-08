'use strict'

document.addEventListener("DOMContentLoaded", function(event) {

    const refPopup = document.querySelector('#ref_popup');

    if (refPopup) {
        document.querySelector('.open_ref_pop').
            addEventListener('click', function(e) {
                e.preventDefault();
                refPopup.classList.add('open');
                console.log("banUserButtons: ");
            });

        document.querySelector('.close_popup').addEventListener('click', function(e){
            e.preventDefault();
            refPopup.classList.remove('open');
        })
    }

    const banUserButtons = document.querySelectorAll('.ban_user');
    banUserButtons.forEach((button) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("fuckovfff");
        })
    })

    //console.log("banUserButtons: ", banUserButtons);
});
