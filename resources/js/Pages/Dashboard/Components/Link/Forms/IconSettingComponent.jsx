import React, {
    useContext,
    useEffect,
    useState,
    useMemo,
    useRef
} from 'react';
import {HandleBlur, HandleFocus} from '@/Utils/InputAnimations.jsx';
import {usePageContext} from '@/Context/PageContext.jsx';
import {addLink, updateLink} from '@/Services/LinksRequest.jsx';
import {FOLDER_LINKS_ACTIONS, LINKS_ACTIONS} from '@/Services/Reducer.jsx';
import {FolderLinksContext} from '@/Pages/Dashboard/Dashboard.jsx';
import {useUserLinksContext} from '@/Context/UserLinksContext.jsx';
import { RiEdit2Fill } from "react-icons/ri";
const IconSettingComponent = ({
                                  inputType,
                                  editLink,
                                  setEditLink,
                                  elementName,
                                  label,
                                  currentValue,
                                  maxChar = null,
                                  isEditing = null,
                                  setIsEditing = null
}) => {

    const { pageSettings } = usePageContext();
    const { dispatch } = useUserLinksContext();
    const { folderLinks, dispatchFolderLinks } = useContext(FolderLinksContext);

    // ----- Value resolution
    /*const currentValue = useMemo(() => {
        // when editing this field, prefer live isEditing.value so typing is instant
        return editLink?.[elementName]
    }, [isEditing?.active, isEditing?.section, isEditing?.value, editLink, elementName]);*/

    const [draft, setDraft] = useState(editLink[elementName] ?? "");
    useEffect(() => setDraft(currentValue), [currentValue]);

    // ----- Character counter
    const [charactersLeft, setCharactersLeft] = useState(maxChar ?? 0);
    useEffect(() => {
        if (maxChar != null) {
            setCharactersLeft(maxChar - (draft?.length || 0));
        }
    }, [draft, maxChar]);

// ----- Focus when entering edit mode
    const inputRef = useRef(null);
    useEffect(() => {
        if (isEditing?.active && isEditing?.section === elementName && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select?.();
        }
    }, [isEditing?.active, isEditing?.section, elementName]);

    const handleChange = (e) => {
        const value = e.target.value;
        setDraft(value);
        if (isEditing?.active && setIsEditing) {
            setIsEditing((prev) => ({ ...prev, value }));
        } else if (setEditLink) {
            setEditLink((prev) => ({ ...prev, [elementName]: value }));
        }
    }

    // ----- Commit logic (updateLink) mirrors your existing cases
    const commitValue = async (value) => {
        // Case A: inline quick-edit path using isEditing payload
        if (isEditing?.id && setIsEditing && isEditing?.section ===
            elementName) {
            const packets = {
                [isEditing.section]: value,
                page_id: pageSettings.id,
                type: isEditing.type,
            };

            const res = await updateLink(packets, isEditing.id);
            if (res?.success) {
                dispatch({
                    type: LINKS_ACTIONS.UPDATE_LINK,
                    payload: {
                        id: isEditing.id,
                        editLink: null,
                        [isEditing.section]: value
                    },
                });
                setIsEditing({
                    active: false,
                    section: '',
                    value: '',
                    id: null,
                    type: null
                });
            }
            return;
        }
        // Case B: standard editLink path
        if (editLink?.id) {
            const packets = {
                [elementName]: value,
                page_id: pageSettings.id,
                folder_id: editLink.folder_id,
                type: editLink.type,
            };

            const res = await updateLink(packets, editLink.id);
            if (res?.success) {
                if (editLink.folder_id) {
                    dispatchFolderLinks({
                        type: FOLDER_LINKS_ACTIONS.UPDATE_FOLDER_LINKS,
                        payload: {
                            id: editLink.id,
                            currentLink: editLink,
                            [elementName]: value
                        },
                    });
                    dispatch({
                        type: LINKS_ACTIONS.UPDATE_LINK_IN_FOLDER,
                        payload: {
                            folder_id: editLink.folder_id,
                            id: editLink.id,
                            currentLink: editLink,
                            [elementName]: value,
                        },
                    });
                } else {
                    dispatch({
                        type: LINKS_ACTIONS.UPDATE_LINK,
                        payload: {
                            id: editLink.id,
                            editLink,
                            [elementName]: value
                        },
                    });
                }
            }
        }
    }
       /* const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing?.value && isEditing.id) {
            const packets = {
                [`${isEditing.section}`]: isEditing.value,
                page_id: pageSettings.id,
                type: isEditing.type,
            };

            updateLink(packets, isEditing.id).then((data) => {
                if (data.success) {

                    dispatch({
                        type: LINKS_ACTIONS.UPDATE_LINK,
                        payload: {
                            id: isEditing.id,
                            editLink: null,
                            [`${isEditing.section}`]: isEditing.value
                        }
                    })

                    setIsEditing &&
                    setIsEditing({
                        active: false,
                        section: "",
                        value: "",
                        id: null,
                        type: null
                    });
                }
            });
        } else if (editLink[elementName] && editLink.id) {

            const packets = {
                [`${elementName}`]: editLink[elementName],
                page_id: pageSettings.id,
                folder_id: editLink.folder_id,
                type: editLink.type,
            };

            updateLink(packets, editLink.id).then((data) => {
                if (data.success) {

                    if (editLink.folder_id) {
                        dispatchFolderLinks({
                            type: FOLDER_LINKS_ACTIONS.UPDATE_FOLDER_LINKS,
                            payload: {
                                id: editLink.id,
                                currentLink: editLink,
                                [`${elementName}`]: editLink[elementName],
                            }
                        })

                        dispatch({
                            type: LINKS_ACTIONS.UPDATE_LINK_IN_FOLDER,
                            payload: {
                                folder_id: editLink.folder_id,
                                id: editLink.id,
                                currentLink: editLink,
                                [`${elementName}`]: editLink[elementName]
                            }
                        })
                    } else {
                        dispatch({
                            type: LINKS_ACTIONS.UPDATE_LINK,
                            payload: {
                                id: editLink.id,
                                editLink: editLink,
                                [`${elementName}`]: editLink[elementName]
                            }
                        })
                    }
                }
            });
        }
    }*/

    // ----- Blur / Enter / Esc behavior
    const onBlur = async () => {
        // Only commit if something actually changed (prevents redundant API calls)
        if (draft !== currentValue) await commitValue(draft);
    };

    const onKeyDown = async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (draft !== currentValue) await commitValue(draft);
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            // revert visual draft
            setDraft(currentValue);
            // exit inline editing if using isEditing model
            if (isEditing?.active && setIsEditing) {
                setIsEditing({ active: false, section: '', value: '', id: null, type: null });
            }
        }
    };
    const isActive = Boolean(isEditing?.active && isEditing?.section === elementName);

    return (
        <>
        <div className="relative mt-3">
            {/* Reserve height to prevent layout jump */}
            <div className="min-h-[2.75rem]" />
            {/* READ LAYER */}
            <div
                aria-hidden={isActive}
                className={[
                    'absolute inset-0 flex items-start gap-2',
                    'transition-all duration-200 ease-out',
                    isActive ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100',
                ].join(' ')}
            >
            <p className={`text-gray-900 ${currentValue ? '' : 'text-gray-400'}`}>
                {currentValue ||
                    (elementName === 'url' ? 'Enter URL' :
                        elementName === 'email' ? 'Enter Email' :
                            elementName === 'phone' ? 'Enter Phone Number' :
                                'Enter text')}
            </p>
            {setIsEditing && (
                <button
                    type="button"
                    className="edit_icon text-gray-500 hover:text-indigo-600 transition"
                    onClick={() => setIsEditing({
                        active: true,
                        section: elementName,
                        value: currentValue,
                        id: editLink?.id ?? null,
                        type: editLink?.type ?? inputType,
                    })}
                    aria-label={`Edit ${label || elementName}`}
                >
                    <RiEdit2Fill />
                </button>
            )}
        </div>

        {/* EDIT LAYER */}
        <div
            aria-hidden={!isActive}
            className={[
                'absolute inset-0 flex items-center',
                'transition-all duration-200 ease-out',
                isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none',
            ].join(' ')}
        >
            <div className="input_wrap w-full">
                <input
                    ref={inputRef}
                    className={`w-full ${currentValue ? 'active' : ''} rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500`}
                    name={elementName}
                    type={inputType === 'phone' ? 'tel' : inputType}
                    value={draft}
                    onChange={handleChange}
                    onFocus={(e) => HandleFocus(e.target)}
                    onBlur={() => { HandleBlur(inputRef.current); onBlur(); }}
                    onKeyDown={onKeyDown}
                    autoFocus={isActive}
                />
                <label className="capitalize">{label}</label>
            </div>
        </div>
        </div>

            {pageSettings.page_layout === 'layout_one' && maxChar != null && (
                <div className="my_row info_text title">
                    <p className="char_max">Max {maxChar} Characters Shown</p>
                    <p className="char_count">
                        {charactersLeft < 0 ? (
                            <span className="over">Only {maxChar} Characters Will Be Shown</span>
                        ) : (
                            'Characters Left: ' + charactersLeft
                        )}
                    </p>
                </div>
            )}
            {/*<div className="input_wrap mt-3 relative">
                <input
                    className={`w-full ${editLink[elementName] ? "active" : ""}`}
                    name={elementName}
                    type={inputType === "phone" ? "tel" : inputType}
                    value={isEditing?.value || editLink[elementName] || ""}
                    autoFocus={isEditing?.section === elementName || false}
                    onChange={(e) => handleChange(e)}
                    onFocus={(e) => HandleFocus(e.target)}
                    onBlur={(e) => {HandleBlur(e.target); commitValue(e.target.value); }}
                    onKeyDown={ event => {
                        if(event.key === 'Enter') {
                            commitValue(e.target.value);
                        }
                    }}
                />
                <label className="capitalize">{label}</label>
            </div>
            {(pageSettings.page_layout === "layout_one" && maxChar) &&
                <div className="my_row info_text title">
                    <p className="char_max">Max {maxChar} Characters Shown</p>
                    <p className="char_count">
                        {charactersLeft < 0 ?
                            <span className="over">Only {maxChar} Characters Will Be Shown</span>
                            :
                            "Characters Left: " +
                            charactersLeft
                        }
                    </p>
                </div>
            }
            */}
        </>
    );
};

export default IconSettingComponent;
