import React, { useEffect, useRef, useState } from "react";
import { RiEdit2Fill } from "react-icons/ri";
import {HandleBlur, HandleFocus} from '@/Utils/InputAnimations.jsx';

/**
 * EditableField
 * - Smoothly transitions between read view (<p>) and input
 * - Keeps both layers mounted, animates opacity/scale to avoid hard swaps
 * - Manages focus and Enter/Esc interactions
 *
 * Props:
 * - value: string | number
 * - onSave: (newVal) => void | Promise
 * - type: 'text' | 'email' | 'tel'
 * - placeholder?: string
 * - label?: string (optional floating label)
 */
const EditableField = ({
                           value,
                           onSave,
                           type = "text",
                           placeholder = "",
                           label,
                       }) => {

    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value ?? "");
    const inputRef = useRef(null);

// sync external value -> internal draft when not editing
    useEffect(() => {
        if (!editing) setDraft(value ?? "");
    }, [value, editing]);

    // focus input when entering edit mode
    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select?.();
        }
    }, [editing]);

    const commit = async () => {
        if (draft !== value) await onSave?.(draft);
        setEditing(false);
    };

    const cancel = () => {
        setDraft(value ?? "");
        setEditing(false);
    };

    return (
        <div className="relative">
            {/* container sets height so layout doesn't jump */}
            <div className="min-h-[2.5rem]">{/* ~40px */}</div>

            {/* READ LAYER */}
            <div
                aria-hidden={editing}
                className={[
                    "absolute inset-0 flex items-start gap-2", // layout
                    "transition-all duration-200 ease-out", // animation
                    editing ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100",
                ].join(" ")}
            >
                <p className="text-gray-900">
                    {value || placeholder || "—"}
                </p>
                <button
                    type="button"
                    className="edit_icon shadow-none text-gray-500 hover:text-indigo-600 transition"
                    onClick={() => setEditing(true)}
                    aria-label={`Edit ${label || "Field"}`}
                >
                    <RiEdit2Fill />
                </button>
            </div>

            {/* EDIT LAYER */}
            <div
                aria-hidden={!editing}
                className={[
                    "absolute inset-0 flex items-center", // layout
                    "transition-all duration-200 ease-out", // animation
                    editing ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
                ].join(" ")}
            >
                <input
                    ref={inputRef}
                    type={type === "phone" ? "tel" : type}
                    value={draft}
                    placeholder={placeholder}
                    onChange={(e) => setDraft(e.target.value)}
                    onFocus={(e) => HandleFocus(e.target)}
                    onBlur={(e) => {
                        commit();
                        HandleBlur(e.target);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") commit();
                        if (e.key === "Escape") cancel();
                    }}
                    className="rounded-lg border px-3 py-2
focus:outline-none focus:ring-2 shadow-md"
                />
            </div>
        </div>
    );
};

export default EditableField;
