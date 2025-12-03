import React from "react";

const CourseContent = ({
                           course,
                           children,
                           auth = null,
                           showPayment
}) => {
    return (
        <div className={`flex flex-col min-h-screen my_row ${auth ? "member" : ""} landing_page`}>
            <div className="page_content my_row flex">
                <div className="container">
                    {!showPayment &&
                        <header className="my_row" style={{background: course.header_color }}>
                            <nav className="p-10">
                                <a className="logo" href="/">
                                    <h1>
                                        <img src={course.logo || Vapor.asset('images/logo.png') } alt={course.title ?? ''} />
                                    </h1>
                                </a>
                                <h2 id="course_title" className="title" style={{ color: course.header_text_color, fontSize: course.header_font_size + "rem" }}>{course.title}</h2>
                            </nav>
                        </header>
                    }

                    <main className="!p-0">
                        {children || ""}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CourseContent;
