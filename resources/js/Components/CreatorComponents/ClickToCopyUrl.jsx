import React, { useEffect, useRef, useState } from "react";
import { IoCopy } from "react-icons/io5";
function copyToClipboard(text) {
    // Modern API
    if (navigator.clipboard?.writeText) {
        return navigator.clipboard.writeText(text);
    }
    // Fallback
    return new Promise((resolve, reject) => {
        try {
            const ta = document.createElement("textarea");
            ta.value = text;
            ta.setAttribute("readonly", "");
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            resolve();
        } catch (e) { reject(e); }
    });
}

const ClickToCopyUrl = ({url}) => {

    const [copied, setCopied] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => () => clearTimeout(timerRef.current), []);

    const handleCopy = async () => {
        try {
            await copyToClipboard(url);
            setCopied(true);
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setCopied(false), 1400);
        } catch {
            // Optional: surface an error toast
        }
    };
    return (
        <div className="url_wrap w-full border border-gray-100 p-4 rounded-md flex justify-between items-center">
            <a target="_blank" href={url}>{url}</a>
            <button onClick={handleCopy} className="text-blue-700 w-auto p-0">
                <IoCopy />
            </button>
        </div>

    );
};

export default ClickToCopyUrl;
