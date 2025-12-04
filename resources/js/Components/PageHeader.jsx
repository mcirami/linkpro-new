import React from 'react';

const PageHeader = ({
                        heading,
                        description = null,
                    }) => {
    return (
        <div className="w-full">
            <div className="flex items-center">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 capitalize">{heading}</h1>
            </div>
            {description &&
                <p className="mt-1 text-sm text-gray-500 text-left">{description}</p>
            }
        </div>
    );
};

export default PageHeader;
