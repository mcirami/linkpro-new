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
                                  placeholder,
                                  maxChar = null,
                                  isEditing = null,
                                  setIsEditing = null,
                                  id = null,
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
        console.log("draft", draft);
        if (maxChar != null) {
            const remainder = maxChar - (draft?.length);
            setCharactersLeft(remainder < 0 ? 0 : remainder);
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

    console.log("currentValue", currentValue);
    return (
        pageSettings.page_layout === 'layout_two' ?
                <div className="relative">
                    {/* Reserve height to prevent layout jump */}
                    <div className="min-h-[2.50rem]"/>
                    {/* READ LAYER */}
                    <div
                        aria-hidden={isActive}
                        className={[
                            'absolute inset-0 flex items-center gap-2',
                            'transition-all duration-200 ease-out',
                            isActive ?
                                'opacity-0 scale-95 pointer-events-none' :
                                'opacity-100 scale-100',
                        ].join(' ')}
                    >
                        <p className={`text-gray-900 ${currentValue ?
                            '' :
                            'text-gray-400'}`}>
                            {currentValue || placeholder}
                        </p>
                        {setIsEditing && (
                            <a
                                href="#"
                                className="edit_icon text-gray-500 hover:text-indigo-600 transition"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsEditing({
                                        active: true,
                                        section: elementName,
                                        value: currentValue,
                                        id: editLink?.id ?? id,
                                        type: editLink?.type ? editLink?.type :
                                            inputType === "text" ? "url" :
                                                inputType === "tel" ?
                                                    "phone" :
                                                    "url",
                                    })
                                }}
                                aria-label={`Edit ${label || elementName}`}
                            >
                                <RiEdit2Fill/>
                            </a>
                        )}
                    </div>
                </div>
                    :
                    <div className="relative">
                    {/* EDIT LAYER */}
                    <div
                        aria-hidden={!isActive}
                        className={[
                            'inset-0 flex items-center flex-wrap',
                            'transition-all duration-200 ease-out',
                        ].join(' ')}
                    >
                        {maxChar != null &&
                            <div className="info_text w-full flex justify-end mb-2">
                                <p className="char_count">
                                    <span className="count"> {charactersLeft} </span> / {maxChar}
                                </p>
                            </div>
                        }
                        <div className="input_wrap w-full">
                            <input
                                ref={inputRef}
                                className={`w-full ${currentValue ?
                                    'active' :
                                    ''} rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500`}
                                name={elementName}
                                type={inputType === 'phone' ? 'tel' : inputType}
                                value={draft}
                                onChange={handleChange}
                                onFocus={(e) => HandleFocus(e.target)}
                                onBlur={() => {
                                    HandleBlur(inputRef.current);
                                    onBlur();
                                }}
                                onKeyDown={onKeyDown}
                                autoFocus={isActive}
                                placeholder={placeholder}
                            />
                            <label className="capitalize">{label}</label>
                        </div>
                    </div>
                    <div className="my_row info_text title min-h-[1.5rem]">
                        {maxChar != null &&
                            <p className="char_count text-right">
                                {charactersLeft < 0 ?
                                    <span className="over">Only {maxChar} Characters Will Be Shown</span>
                                    :
                                    ""}
                            </p>
                        }
                    </div>

                    </div>

    );
};

export default IconSettingComponent;
