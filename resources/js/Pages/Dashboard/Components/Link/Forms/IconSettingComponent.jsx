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
    const { dispatchFolderLinks } = useContext(FolderLinksContext);

    const [draft, setDraft] = useState(editLink[elementName] ?? "");

    const readTextRef = useRef(null);
    const [isOverflow, setIsOverflow] = useState(false);

    useEffect(() => {
        const el = readTextRef.current;
        if (!el) return;
        const check = () => setIsOverflow(el.scrollWidth > el.clientWidth);
        check();

        // keep it accurate on resizes/font changes
        const ro = new ResizeObserver(check);
        ro.observe(el);
        window.addEventListener('resize', check);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', check);
        };
    }, [currentValue]);

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
            <div className="relative">
                {/* Reserve height to prevent layout jump */}
                {pageSettings.page_layout === 'layout_two' &&
                    <div className="min-h-[2.50rem]"/>
                }
                {/* READ LAYER */}
                <div
                    className={[
                        `${pageSettings.page_layout === 'layout_two' && 'absolute'} ${elementName} inset-0 flex items-center min-w-0`,
                        'transition-all duration-200 ease-out ',
                        isActive ?
                            'opacity-0 scale-95 pointer-events-none' :
                            'opacity-100 scale-100',
                    ].join(' ')}
                >
                    {pageSettings.page_layout === 'layout_two' &&
                        <div className="inline-flex items-center gap-1 min-w-0">
                            <span
                              ref={readTextRef}
                              className={[
                                  'block min-w-0 truncate',
                                  currentValue ? 'text-gray-900' : 'text-gray-400',
                              ].join(' ')}
                              title={isOverflow ? (currentValue || placeholder) : undefined}
                            >
                                {currentValue || placeholder}
                            </span>

                            {setIsEditing && (
                                <button
                                    type="button"
                                    className="shrink-0 ml-1 text-[#88c3d7] hover:text-indigo-600 transition"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsEditing({
                                            active: true,
                                            section: elementName,
                                            value: currentValue,
                                            id: editLink?.id ?? id,
                                            type: editLink?.type
                                                ? editLink?.type
                                                : inputType === 'text'
                                                    ? 'url'
                                                    : inputType === 'tel'
                                                        ? 'phone'
                                                        : 'url',
                                        });
                                    }}
                                    aria-label={`Edit ${label || elementName}`}
                                >
                                    <RiEdit2Fill className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    }
                    {/*{setIsEditing && (
                        <a
                            href="#"
                            className="edit_icon text-gray-500 hover:text-indigo-600 transition flex-none"
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
                    )}*/}
                </div>

                {/* EDIT LAYER */}
                <div
                   /* aria-hidden={!isActive}*/
                    className={[
            `${pageSettings.page_layout === 'layout_two' && 'absolute'}`,
                        'inset-0 flex flex-wrap items-center',
                        'transition-all duration-200 ease-out',
                        pageSettings.page_layout === 'layout_two' && (isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'),
                    ].join(' ')}
                >
                    {maxChar != null &&
                        <div className="info_text w-full flex justify-end mb-2">
                            <p className="char_count">
                                <span className="count">
                                    {charactersLeft < 0 ? 0 : charactersLeft} </span> / {maxChar}
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
                            value={draft || ''}
                            onChange={handleChange}
                            onFocus={(e) => HandleFocus(e.target)}
                            onBlur={() => {
                                onBlur();
                                HandleBlur(inputRef.current);
                            }}
                            onKeyDown={onKeyDown}
                            autoFocus={isActive}
                            placeholder={placeholder}
                        />
                        <label className="capitalize">{label}</label>
                    </div>
                </div>
            </div>

            {pageSettings.page_layout === 'layout_one' && maxChar != null && draft?.length > maxChar && (
                <div className="my_row info_text title min-h-[1.5rem] text-right">
                    <p className="char_count">
                        <span className="over">Only {maxChar} Characters Will Be Shown</span>
                    </p>
                </div>
            )}
        </>
    );
};

export default IconSettingComponent;
