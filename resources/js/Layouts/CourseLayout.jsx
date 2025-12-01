import React from 'react';

const CourseLayout = ({auth, children = null, course}) => {

    return (
        <div id="app_wrap" className={`flex flex-col min-h-screen md:py-20 my_row ${auth?.user?.userInfo?.length > 0 ? "member" : ""} landing_page`}>
            <div className="page_content my_row">
                <header className="my_row nav_row" style={{background: course.header_color }}>
                    <nav>
                        <div className="container">
                            <a className="logo" href="/">
                                <h1>
                                    <img src={course.logo || Vapor.asset('images/logo.png') } alt={course.title ?? ''} />
                                </h1>
                            </a>
                            <h2 id="course_title" className="title" style={{ color: course.header_text_color, fontSize: course.header_font_size + "rem" }}>{course.title}</h2>
                        </div>
                    </nav>
                </header>

                <main className="!p-0">
                    {children || ""}
                </main>
            </div>
        </div>
    )
}

export default CourseLayout;
