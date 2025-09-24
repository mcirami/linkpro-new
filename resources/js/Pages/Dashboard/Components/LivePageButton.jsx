import React from 'react';
import {Link} from '@inertiajs/react';
import { IoOpenOutline } from "react-icons/io5";
const LivePageButton = ({pageName}) => {

    const host = window.location.origin;

    return (
        <a className="button green !w-60 !flex justify-center items-center gap-4 shadow-md" target="_blank" href={host + '/' + pageName}>
            <p>Open Live Page</p>
            <IoOpenOutline />
        </a>
    );
};

export default LivePageButton;
