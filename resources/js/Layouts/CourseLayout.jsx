import React from 'react';
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import CourseContent from "@/Pages/SingleCourse/Components/CourseContent.jsx";
const CourseLayout = ({
                          auth,
                          course,
                          children = null,
                          showPayment = null
}) => {

    return (
        auth?.user?.userInfo ?
            <AuthenticatedLayout>
               <CourseContent
                   auth={true}
                   course={course}
                   children={children}
                   showPayment={showPayment}
               />
            </AuthenticatedLayout>

        :
            <CourseContent
                course={course}
                children={children}
                showPayment={showPayment}
            />
    )
}

export default CourseLayout;
