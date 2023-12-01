'use strict'

window.addEventListener("load", function(){

    $(window).on('resize', function() {

        if (window.outerWidth < 769) {
            const videoWrap = document.querySelectorAll('#desktop_video .video_wrap');
            if (videoWrap[0] !== undefined) {
                document.querySelector('#mobile_video').innerHTML = videoWrap[0].outerHTML;
                videoWrap[0].remove();
            }
        } else {
            const videoWrap = document.querySelectorAll('#mobile_video .video_wrap');
            if (videoWrap[0] !== undefined) {
                document.querySelector('#desktop_video').innerHTML = videoWrap[0].outerHTML;
                videoWrap[0].remove();
            }
        }

    });

    if (window.outerWidth < 769) {
        const videoWrap = document.querySelectorAll('#desktop_video .video_wrap');
        if (videoWrap[0] !== undefined) {
            document.querySelector('#mobile_video').innerHTML = videoWrap[0].outerHTML;
            videoWrap[0].remove();
        }
    }

    // prevent click if no url or image on preview icon
    const defaultIcons = document.querySelectorAll('a.default');
    if (defaultIcons.length > 0) {
        defaultIcons.forEach(element => {
            element.addEventListener('click', function(e) {
                e.preventDefault();
            })
        })
    }
});
