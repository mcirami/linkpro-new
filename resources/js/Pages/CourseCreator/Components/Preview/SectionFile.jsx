import React from 'react';

const SectionFile = ({file}) => {

    //get file name - separate by "/" get last one and separate by "."
    // get file type/ext - separate by "." get last one to show extension name
    return (
        <div className="file_section p-5 text-center">
            <a className="download_file" target="_blank" href={file} download={file}>Download File</a>
        </div>
    );
};

export default SectionFile;
