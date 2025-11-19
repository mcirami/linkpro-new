import React, {useMemo, useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {Head} from '@inertiajs/react';
import ColumnComponent from '@/Pages/AllCourses/ColumnComponent.jsx';
import PageHeader from "@/Components/PageHeader.jsx";

const Courses = ({purchasedCourses, unPurchasedCourses}) => {

    const [selectedCreator, setSelectedCreator] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const creatorOptions = useMemo(() => {
        const creators = new Set();

        unPurchasedCourses.forEach((course) => {
            if (course.username) {
                creators.add(course.username);
            }
        });

        return Array.from(creators).sort((a, b) => a.localeCompare(b));
    }, [unPurchasedCourses]);

    const categoryOptions = useMemo(() => {
        const categoriesMap = new Map();

        unPurchasedCourses.forEach((course) => {
            course.categories?.forEach((category) => {
                if (!categoriesMap.has(category.id)) {
                    categoriesMap.set(category.id, category.name);
                }
            });
        });

        return Array.from(categoriesMap.entries())
        .map(([id, name]) => ({id: String(id), name}))
        .sort((a, b) => a.name.localeCompare(b.name));
    }, [unPurchasedCourses]);

    const filteredCourses = useMemo(() => {
        const filteredBySelection = unPurchasedCourses.filter((course) => {
            const matchesCreator = selectedCreator === 'all' || course.username === selectedCreator;
            const matchesCategory = selectedCategory === 'all' || course.categories?.some((category) => String(category.id) === selectedCategory);

            return matchesCreator && matchesCategory;
        });

        const trimmedSearch = searchTerm.trim().toLowerCase();

        if (!trimmedSearch) {
            return filteredBySelection;
        }

        return filteredBySelection.filter((course) => {
            const username = course.username?.toLowerCase() ?? '';
            const title = course.title?.toLowerCase() ?? '';

            return username.includes(trimmedSearch) || title.includes(trimmedSearch);
        });
    }, [unPurchasedCourses, searchTerm, selectedCategory, selectedCreator]);

    return (
        <AuthenticatedLayout>
            <Head title="Courses" />
            <div className="creator course_creator">
                <div id="links_page" className="course">
                    <div className="my_row courses_grid all_courses">
                        <div className="container">
                            <section className="section_wrap my_row">
                                <div className="pb-6 gap-3 flex justify-between align-bottom items-baseline mt-3 border-b border-gray-100">
                                    <PageHeader
                                        heading="Your Courses"
                                        description="Courses that you have purchased are displayed below."
                                    />
                                </div>
                                {purchasedCourses.length > 0 ?

                                        <div className="sections">
                                            {purchasedCourses.map((course) => {

                                                return (

                                                   <ColumnComponent
                                                       key={course.id}
                                                       course={course}
                                                       type="purchased"
                                                   />
                                                )
                                            })}
                                        </div>
                                    :
                                    <div className="text-center min-h-[300px] flex flex-col justify-center items-center relative">
                                        <img className="absolute top-4 w-[300px] h-[300px] opacity-[.05]" src={Vapor.asset('images/preview-device-bg.png')} alt="LinkPro"/>
                                        <p className="text-[1.8rem] mb-4">You have not purchased any courses.</p>
                                        <p className="text-lg">Check out our available courses for purchase below to get started.</p>
                                    </div>
                                }
                            </section>
                            <section className="section_wrap my_row mt-10">
                                <div className="pb-6 gap-3 flex justify-between align-bottom items-baseline mt-3 border-b border-gray-100 mb-10">
                                    <PageHeader
                                        heading="Available Courses"
                                        description="Click on a course below to view details and purchase. Filter by creator or category or search to find what you're looking for."
                                    />
                                </div>
                                <div className="filters w-full flex flex-wrap md:flex-nowrap gap-4 items-center justify-between mb-10">
                                    <div className="filter_control w-full sm:w-[48%] lg:w-1/3">
                                        <label htmlFor="creator-filter">Creator</label>
                                        <select
                                            id="creator-filter"
                                            value={selectedCreator}
                                            onChange={(event) => setSelectedCreator(event.target.value)}
                                        >
                                            <option value="all">All creators</option>
                                            {creatorOptions.map((creator) => (
                                                <option key={creator} value={creator}>{creator}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="filter_control w-full sm:w-[48%] lg:w-1/3">
                                        <label htmlFor="category-filter">Category</label>
                                        <select
                                            id="category-filter"
                                            value={selectedCategory}
                                            onChange={(event) => setSelectedCategory(event.target.value)}
                                        >
                                            <option value="all">All categories</option>
                                            {categoryOptions.map((category) => (
                                                <option key={category.id} value={category.id}>{category.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="filter_control search w-full lg:w-1/3 flex flex-col gap-2 grow-1">
                                        <label htmlFor="course-search">Search</label>
                                        <input
                                            id="course-search"
                                            className="mb-2"
                                            type="text"
                                            value={searchTerm}
                                            onChange={(event) => setSearchTerm(event.target.value)}
                                            placeholder="Search by creator or course title"
                                        />
                                    </div>
                                </div>
                                <div className="sections">

                                    {filteredCourses.map((course) => {

                                        return (
                                            <ColumnComponent
                                                key={course.id}
                                                course={course}
                                                type="available"
                                            />
                                        )
                                    })}

                                    {filteredCourses.length === 0 && (
                                        <p className="no_results">No courses match your current filters.</p>
                                    )}

                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
};

export default Courses;
