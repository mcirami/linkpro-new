import React, {useEffect, useState} from 'react';
import {getFileParts} from '@/Services/FileService.jsx';

const SectionFile = ({file}) => {

    //get file name - separate by "/" get last one and separate by "."
    // get file type/ext - separate by "." get last one to show extension name
    const [currentFile, setCurrentFile] = useState(
        {
            name: "",
            type: ""
        }
    )
    useEffect(() => {
        setCurrentFile(getFileParts(file));
    }, []);

    return (
        <div className="file_section p-5 text-center">
            <a className="download_file" target="_blank" href={file} download={file}>Download {currentFile.name} {currentFile.type}</a>
        </div>
    );
};

export default SectionFile;
