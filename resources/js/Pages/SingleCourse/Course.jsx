import ColumnComponent from './Components/ColumnComponent';
import VideoComponent from './Components/VideoComponent';
import React, {useEffect, useState} from 'react';
import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'dompurify';
import isJSON from 'validator/es/lib/isJSON';
import {Head} from '@inertiajs/react';
import CourseLayout from '@/Layouts/CourseLayout.jsx';
import Menu from '@/Menu/Menu.jsx';
import EventBus from '@/Utils/Bus.jsx';
import SetFlash from '@/Utils/SetFlash.jsx';
import {isEmpty} from 'lodash';

function Course({
                    auth,
                    course,
                    creator,
                    sections,
                    hasCourseAccess,
                    page = null,
                    affRef = null,
                    clickId = null,

}) {

    const {intro_video, intro_text, intro_background_color, title} = course;
    const [indexValue, setIndexValue] = useState(null);

    const [introText, setIntroText] = useState(intro_text);

    useEffect(() => {

        const href = window.location.href.split('?')[0]
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const message = urlParams?.get('message');

        if(message) {
            EventBus.dispatch("success", { message: message });
            urlParams?.delete('message');
            window.history.pushState({}, document.title, href);
            //localStorage.clear();

            return () => EventBus.remove("success");
        }

    },[])

    useEffect(() => {

            if (introText && isJSON(introText)) {
                const allContent = JSON.parse(introText);
                allContent["blocks"] = allContent["blocks"].map((block) => {
                    if (!block.text) {
                        block.text = ""
                    }

                    return block;
                })

                setIntroText(draftToHtml(allContent));
            } else {
                setIntroText(introText)
            }

    },[])

    useEffect(() => {
        const handleScroll = (e) => {
            const divClass = document.querySelector('.member.course_page');

            if(divClass) {
                if (window.innerWidth < 768) {
                    const scrollPosition = window.scrollY;
                    const divTop = document.getElementById('course_title').offsetTop;
                    const header = document.querySelector('header');
                    const mainDiv = document.querySelector('main');

                    if (scrollPosition > divTop - 22) {
                        const headerHeight = header.offsetHeight;
                        const topPosition = headerHeight - 68;
                        header.style.position = 'fixed';
                        header.style.left = 0;
                        header.style.top = "-" + topPosition + "px";
                        mainDiv.style.paddingTop = headerHeight + 40 + "px";
                    } else {
                        header.style.top = "auto";
                        header.style.position = 'relative';
                        mainDiv.style.paddingTop = 40 + "px";
                    }

                }
            }
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.addEventListener('scroll', handleScroll)
        }

    }, []);

    const createMarkup = (text) => {

        return {
            __html: DOMPurify.sanitize(text)
        }
    }

    return (

        <CourseLayout course={course} auth={auth}>
            {!isEmpty(auth.user.userInfo) &&
                <Menu />
            }
            <Head title={title} />
            <SetFlash />
            <div className="creator course_creator">
                <div id="links_page" className="live_page course">
                    <div id="single_course" className="my_row">
                        <div className="single_course_content my_row">
                            <div className="container">
                                <div className="my_row courses_grid">
                                    {indexValue &&
                                        <VideoComponent
                                            indexValue={indexValue}
                                            sections={sections}
                                        />
                                    }
                                    <section className="header">
                                        { (intro_video && !indexValue) &&
                                            <div className="intro_video">
                                                <div className="video_wrapper">
                                                    <iframe src={intro_video} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;" allowFullScreen></iframe>
                                                </div>
                                            </div>
                                        }
                                        {intro_text &&
                                            <div className="intro_text my_row" style={{background: intro_background_color}}>
                                                <div dangerouslySetInnerHTML={createMarkup(introText)}>
                                                </div>
                                            </div>
                                        }
                                    </section>
                                    <section className="my_row">
                                        <div className="sections">
                                            {sections.map((section, index) => {
                                                return(
                                                    <React.Fragment key={section.id}>
                                                         <ColumnComponent
                                                            section={section}
                                                            indexValue={indexValue}
                                                            setIndexValue={setIndexValue}
                                                            index={index}
                                                            course={course}
                                                            hasCourseAccess={hasCourseAccess}
                                                            affRef={affRef}
                                                            clickId={clickId}
                                                            creator={creator}
                                                            page={page}
                                                        />
                                                    </React.Fragment>
                                                )
                                            })}
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CourseLayout>
    )
}

export default Course;
