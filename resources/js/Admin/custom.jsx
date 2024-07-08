'use strict'
import axios from 'axios';

document.addEventListener("DOMContentLoaded", function(event) {

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

    const banUserButtons = document.querySelectorAll('.ban_user');
    banUserButtons.forEach((button) => {
        banUser(button);
    })

    const unbanUserButtons = document.querySelectorAll('.un_ban_user');
    unbanUserButtons.forEach((button) => {
        unbanUser(button);
    })

    function banUser(element) {
        element.addEventListener('click', function(e) {
            e.preventDefault();

            return axios.post('/admin/ban-user/' + element.dataset.id)
            .then(
                (response) => {
                    const success = response.data.success;

                    if (success) {
                        element.classList.remove('ban');
                        element.classList.remove('btn-danger');
                        element.classList.add('un_ban_user');
                        element.classList.add('btn-dark');
                        element.textContent = 'UnBan User';
                        unbanUser(element);
                    }

                })
            .catch(error => {
                if (error.response) {
                    console.error("error.response: ", error.response);
                } else {
                    console.error("ERROR:: ", error);
                }

            });
        })
    }

    function unbanUser (element) {
        element.addEventListener('click', function(e) {
            e.preventDefault();

            return axios.post('/admin/unban-user/' + element.dataset.id)
            .then(
                (response) => {
                    const success = response.data.success;

                    if (success) {
                        element.classList.remove('un_ban_user');
                        element.classList.remove('btn-dark');
                        element.classList.add('ban');
                        element.classList.add('btn-danger');
                        element.textContent = 'Ban User';
                        banUser(element);
                    }

                })
            .catch(error => {
                if (error.response) {
                    console.error("error.response: ", error.response);
                } else {
                    console.error("ERROR:: ", error);
                }

            });
        })
    }
});
