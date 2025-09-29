import React from 'react';
import LivePageButton from '@/Pages/Dashboard/Components/LivePageButton.jsx';

const PageHeader = ({
    heading,
    description,
                    }) => {
    return (
        <div className="w-full">
            <div className="flex items-center">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{heading}</h1>
            </div>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
    );
};

export default PageHeader;
