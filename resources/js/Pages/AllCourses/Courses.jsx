import React, {useMemo, useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {Head} from '@inertiajs/react';
import ColumnComponent from '@/Pages/AllCourses/ColumnComponent.jsx';

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
                <div id="links_page" className="live_page course">
                    <div className="my_row courses_grid all_courses">
                        <div className="container">
                            {purchasedCourses.length > 0 &&
                                <section className="section_wrap my_row">
                                    <h2 className="page_title">Your Courses</h2>
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
                                </section>
                            }
                            <section className="section_wrap my_row">
                                <h2 className="page_title">Available Courses</h2>
                                <div className="filters" style={{display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem'}}>
                                    <div className="filter_control" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '180px'}}>
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
                                    <div className="filter_control" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '180px'}}>
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
                                    <div className="filter_control search" style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1, minWidth: '220px'}}>
                                        <label htmlFor="course-search">Search</label>
                                        <input
                                            id="course-search"
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
