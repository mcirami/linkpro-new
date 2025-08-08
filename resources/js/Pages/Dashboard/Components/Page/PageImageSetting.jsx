import React, { useState } from "react";
import ImageUploader from "@/Pages/Dashboard/Components/Page/ImageUploader.jsx";
import RadioComponent
    from '@/Pages/Dashboard/Components/Page/RadioComponent.jsx';
const PageImageSetting = ({
                              page,
                              element
}) => {

    const [pageSettings, setPageSettings] = useState(page);
    const [imageType, setImageType] = useState(pageSettings[element]);

    return (
        <div className="setting_wrap w-full">
            <h3 className="label">Main Image</h3>
            { (!completedCrop.header_img && !completedCrop.page_img) &&
                <RadioComponent
                    setRadioValue={setImageType}
                    radioValue={imageType}
                    pageId={pageSettings.id}
                    setPageSettings={setPageSettings}
                    elementName="main_img_type"
                    label={{
                        header: "Header Only",
                        page: "Full Page"
                    }}
                    radioValues={[
                        "header",
                        "page"
                    ]}
                />
            }

            <ImageUploader
                ref={nodesRef}
                completedCrop={completedCrop}
                setCompletedCrop={setCompletedCrop}
                setShowLoader={setShowLoader}
                imageType={imageType}
                elementName={imageType === "header" ? "header_img" : "page_img"}
                label="Main Image"
                cropSettings={{
                    unit: '%',
                    aspect: imageType === "header" ? 16 / 9 : 6 / 8,
                    width: 30
                }}
            />
        </div>
    );
};

export default PageImageSetting;
