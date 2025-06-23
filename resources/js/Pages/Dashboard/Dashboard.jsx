import React, {
    useState,
    useReducer,
    createContext,
    useEffect,
    useRef,
    useMemo,
} from 'react';
import Preview from './Components/Preview/Preview';
import Links from './Components/Link/Links';
import PageName from './Components/Page/PageName';
import PageNav from './Components/Page/PageNav';
import PageSettingComponent from './Components/Page/PageSettingComponent.jsx';
import AddLink from './Components/Link/AddLink';
import PreviewButton from '../../Components/PreviewButton.jsx';
import { UpgradePopup } from '@/Utils/Popups/UpgradePopup';
import { ConfirmPopup } from '@/Utils/Popups/ConfirmPopup';
import { Loader } from '@/Utils/Loader.jsx';
import AddFolder from './Components/Folder/AddFolder';
import FolderLinks from './Components/Folder/FolderLinks';
import {ErrorBoundary} from 'react-error-boundary';
import {updateLinksPositions, getAllLinks} from '@/Services/LinksRequest.jsx';
import {
    previewButtonRequest,
} from '@/Services/PageRequests.jsx';
import {checkSubStatus} from '@/Services/UserService.jsx';
import DowngradeAlert from '@/Utils/Popups/DowngradeAlert';
import {
    folderLinksReducer,
    reducer,
    LINKS_ACTIONS,
} from '@/Services/Reducer.jsx';
import InfoText from '../../Utils/ToolTips/InfoText';
import {MessageAlertPopup} from '@/Utils/Popups/MessageAlertPopup';
import DeleteIcon from './Components/Link/Forms/DeleteIcon';
import FolderNameInput from './Components/Folder/FolderNameInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PageContext from '@/Context/PageContext.jsx';
export const UserLinksContext = createContext(undefined);
export const FolderLinksContext = createContext(undefined);
//export const PageContext = createContext(undefined);

import { ToolTipContextProvider } from '@/Utils/ToolTips/ToolTipContext.jsx';
import {Head} from '@inertiajs/react';
import SetFlash from '@/Utils/SetFlash.jsx';
import EventBus from '@/Utils/Bus.jsx';
import PageLayout from '@/Pages/Dashboard/Components/Page/PageLayout.jsx';
import RadioComponent
    from '@/Pages/Dashboard/Components/Page/RadioComponent.jsx';
import ImageUploader from '@/Pages/Dashboard/Components/Page/ImageUploader.jsx';
import SwitchComponent
    from '@/Pages/Dashboard/Components/Page/SwitchComponent.jsx';
import LinkTypeRadio from '@/Pages/Dashboard/Components/Link/LinkTypeRadio.jsx';

function Dashboard({
                       message = null,
                       userData,
}) {

    const {links, page, userPages, allPageNames, userSub, affStatus} = userData;

    const [userLinks, dispatch] = useReducer(reducer, links);

    const [folderLinks, dispatchFolderLinks] = useReducer(folderLinksReducer, []);

    const [pageSettings, setPageSettings] = useState(page);
    console.log("Page", page);
    const [infoText, setInfoText] = useState({section:'', text:[]});
    const [infoTextOpen, setInfoTextOpen] = useState(false)
    const [infoLocation, setInfoLocation] = useState({})
    const [infoClicked, setInfoClicked] = useState(null);
    const [triangleRef, setTriangleRef] = useState(null);

    const [imageType, setImageType] = useState(pageSettings.main_img_type);
    const [profileImgActive, setProfileImgActive] = useState(Boolean(pageSettings.profile_img_active));

    const [allUserPages, setAllUserPages] = useState(userPages);

    const [editLink, setEditLink] = useState({
        id: null,
        type: null,
        inputType: null,
        folder_id: null
    });
    const [formRow, setFormRow] = useState(null);
    const [showLinkTypeRadio, setShowLinkTypeRadio] = useState(false);

    const [storeID, setStoreID] = useState(null);
    const [shopifyStores, setShopifyStores] = useState([]);

    const [showUpgradePopup, setShowUpgradePopup] = useState({
        show: false,
        text: ""
    });
    const [showConfirmPopup, setShowConfirmPopup] = useState({
        show: false,
        id: null,
        type: null
    });
    const [showMessageAlertPopup, setShowMessageAlertPopup] = useState({
        show: false,
        text: ""
    });

    const nodesRef = useRef({});
    const [completedCrop, setCompletedCrop] = useState({});

    const pageLayoutRef = useRef();
    const leftColWrap = useRef();

    const subStatus = useMemo(
        () => {
            return checkSubStatus(userSub)
    },[]);

    const [showLoader, setShowLoader] = useState({
        show: false,
        icon: "",
        position: "",
        progress: null
    });

    const [row, setRow] = useState(null);
    const [value, setValue] = useState({
        index: null,
        url: null
    });

    const [showPreviewButton, setShowPreviewButton] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const [connectionError, setConnectionError] = useState(false);

    useEffect(() => {

        const data = getUrlParams();
        message = data.urlParams?.get('message');

        if(message) {
            EventBus.dispatch("success", { message: message });
            data.urlParams?.delete('message');
            window.history.pushState({}, document.title, data.href);
            localStorage.clear();

            return () => EventBus.remove("success");
        }

    },[])

    useEffect(() => {
        previewButtonRequest(setShowPreviewButton, setShowPreview);
    }, [])

    useEffect(() => {

        function setPreviewButton() {
            previewButtonRequest(setShowPreviewButton, setShowPreview);
        }

        window.addEventListener('resize', setPreviewButton);

        return () => {
            window.removeEventListener('resize', setPreviewButton);
        }

    }, [])

    useEffect(() => {

        const data = getUrlParams();

        const redirected = data.urlParams?.get('redirected');
        const storeID = data.urlParams?.get('store');
        const error = data.urlParams?.get('connection_error');

        if (redirected && redirected !== "") {
            setEditLink(prev => ({
                ...prev,
                id: JSON.parse(localStorage.getItem('editID')) || null
            }));

            setFormRow(JSON.parse(localStorage.getItem('formRow')));

            if(storeID && storeID !== "") {
                setStoreID(storeID)
            }
            const scrollTimeout = setTimeout(function(){
                document.querySelector('#scrollTo').scrollIntoView({
                    behavior: 'smooth',
                    block: "start",
                    inline: "nearest"
                });

                data.urlParams.delete('redirected')
                data.urlParams.delete('store');
                data.urlParams.delete('connection_error');
                window.history.pushState({}, document.title, data.href);
                localStorage.clear();

            }, 800)

            if (error && error !== "") {
                setConnectionError(error)
            }

            return () => window.clearTimeout(scrollTimeout);
        }

    }, []);

    const getUrlParams = () => {
        const href = window.location.href.split('?')[0]
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        return {
            href,
            urlParams
        }
    }

    const myErrorHandler = (Error, {componentStack: string}) => {

        if (String(Error).includes("Invalid attempt to destructure non-iterable instance")) {
            const packets = {
                userLinks: userLinks,
            }
            updateLinksPositions(packets)
            .then(() => {

                getAllLinks(pageSettings["id"])
                .then((data) => {
                    if (data["success"]) {
                        dispatch({ type: LINKS_ACTIONS.SET_LINKS, payload: { links: data["userLinks"]} })
                    }
                })
            });
        }
    }

    function errorFallback ({error, resetErrorBoundary}) {
        return (
            <div role="alert" className="my_row text-center">
                <p>Something went wrong:</p>
                {/*<pre>{error.message}</pre>*/}
                <button className="button red" onClick={(e) => {window.location.reload()}}>Refresh Page</button>
            </div>
        )
    }

    const handleDisabledClick = (e) => {
        const type = e.target.dataset.type;
        if (!subStatus) {

            let text;
            if (type === "custom" ) {
                text = "add custom icons"
            } else if (type === "integration") {
                text = "add an integration"
            } else if (type === "offer") {
                text = "earn money from an affiliate offer"
            }

            setShowUpgradePopup({
                show: true,
                text: text
            });
        }
    }

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="container">

                <h2 className="page_title">Pages</h2>
                <section className="card edit_page">
                    <div id="links_page">
                        <div className="my_row page_wrap">

                            { (showLoader.show && showLoader.position === "fixed") &&
                                <Loader
                                    showLoader={showLoader}
                                />
                            }

                            <SetFlash />

                            {showUpgradePopup.show &&
                                <UpgradePopup
                                    showUpgradePopup={showUpgradePopup}
                                    setShowUpgradePopup={setShowUpgradePopup}
                                />
                            }

                            {showMessageAlertPopup.show &&
                                <MessageAlertPopup
                                    showMessageAlertPopup={showMessageAlertPopup}
                                    setShowMessageAlertPopup={setShowMessageAlertPopup}
                                />
                            }
                            <UserLinksContext.Provider value={{userLinks, dispatch }} >
                                <FolderLinksContext.Provider value={{ folderLinks, dispatchFolderLinks}} >

                                    {showConfirmPopup.show &&
                                        <ConfirmPopup
                                            editLink={editLink}
                                            setEditLink={setEditLink}
                                            showConfirmPopup={showConfirmPopup}
                                            setShowConfirmPopup={setShowConfirmPopup}
                                        />
                                    }

                                    <PageContext.Provider value={{
                                        pageSettings,
                                        setPageSettings
                                    }}>
                                        <ToolTipContextProvider value={{
                                            infoText,
                                            setInfoText,
                                            infoTextOpen,
                                            setInfoTextOpen,
                                            infoLocation,
                                            setInfoLocation,
                                            infoClicked,
                                            setInfoClicked,
                                            setTriangleRef,
                                            triangleRef
                                        }}>

                                            <div className="left_column">
                                                <PageNav
                                                    allUserPages={allUserPages}
                                                    setAllUserPages={setAllUserPages}
                                                    userSub={userSub}
                                                    subStatus={subStatus}
                                                    setShowUpgradePopup={setShowUpgradePopup}
                                                    pageNames={allPageNames}
                                                />

                                                <div ref={leftColWrap} className="content_wrap my_row" id="left_col_wrap">
                                                    <div className="top_section">
                                                        <PageName
                                                            pageNames={allPageNames}
                                                        />

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

                                                       {/* { !completedCrop.profile_img &&

                                                            <ImageTypeRadio
                                                                setRadioValue={setProfileImgActive}
                                                                radioValue={profileImgActive}
                                                                pageId={pageSettings.id}
                                                                setPageSettings={setPageSettings}
                                                                elementName="profile_img"
                                                                label={{
                                                                    true: "Enable Profile Image",
                                                                    false: "Disable Profile Image"
                                                                }}
                                                                radioValues={[
                                                                    true,
                                                                    false
                                                                ]}
                                                            />
                                                        }*/}

                                                        <SwitchComponent
                                                            setSwitchValue={setProfileImgActive}
                                                            switchValue={profileImgActive}
                                                            pageId={pageSettings.id}
                                                            setPageSettings={setPageSettings}
                                                            elementName="profile_img_active"
                                                            hoverText="Profile Image"
                                                        />
                                                        <ImageUploader
                                                            ref={nodesRef}
                                                            completedCrop={completedCrop}
                                                            setCompletedCrop={setCompletedCrop}
                                                            setShowLoader={setShowLoader}
                                                            elementName="profile_img"
                                                            label="Profile Image"
                                                            cropSettings={{
                                                                unit: '%',
                                                                aspect: 1,
                                                                width: 30
                                                            }}
                                                        />

                                                        <PageSettingComponent
                                                            element="title"
                                                            maxChar="30"
                                                        />
                                                        <PageSettingComponent
                                                            element="bio"
                                                            maxChar="65"
                                                        />

                                                        <PageLayout
                                                            pageLayoutRef={pageLayoutRef}
                                                        />

                                                        <InfoText
                                                            divRef={leftColWrap}
                                                        />

                                                        {showPreviewButton &&
                                                            <PreviewButton setShowPreview={setShowPreview}/>
                                                        }

                                                        { (userSub && !subStatus) &&
                                                            <DowngradeAlert/>
                                                        }
                                                    </div>

                                                    {editLink.id || editLink.folder_id ?
                                                        <div className="my_row icon_links" id="scrollTo">
                                                            <div className="links_row">
                                                                { (editLink.folder_id) &&
                                                                    <div className="delete_icon">
                                                                        <DeleteIcon
                                                                            setShowConfirmPopup={setShowConfirmPopup}
                                                                            editId={editLink.id}
                                                                        />
                                                                    </div>
                                                                }
                                                            </div>
                                                            {editLink.folder_id && !editLink.id ?
                                                                <div className="folder_name my_row">
                                                                    <FolderNameInput
                                                                        folder_id={editLink.folder_id}
                                                                    />
                                                                </div>
                                                                :
                                                                ""
                                                            }
                                                        </div>
                                                        :
                                                        ""
                                                    }

                                                    {/*{ !editLink.id && (!showLinkForm.show && !showLinkTypeRadio) ?*/}
                                                        <div className="my_row link_row">
                                                            <div className={`add_content_links ${pageSettings.page_layout === "layout_two" && "!border-0" } `}>
                                                                <div className="add_more_link">
                                                                    <AddLink
                                                                        setShowLinkTypeRadio={setShowLinkTypeRadio}
                                                                        subStatus={subStatus}
                                                                        setShowUpgradePopup={setShowUpgradePopup}
                                                                    />
                                                                </div>
                                                                {(pageSettings.page_layout === "layout_one" && !editLink.folder_id) &&
                                                                    <div className="add_more_link">
                                                                        <AddFolder
                                                                            subStatus={subStatus}
                                                                            setShowUpgradePopup={setShowUpgradePopup}
                                                                            setEditLink={setEditLink}
                                                                        />
                                                                    </div>
                                                                }
                                                            </div>
                                                        </div>
                                                        {/*:
                                                        ""
                                                    }*/}
                                                    {showLinkTypeRadio &&
                                                        <LinkTypeRadio
                                                            setEditLink={setEditLink}
                                                            setShowLinkTypeRadio={setShowLinkTypeRadio}
                                                            pageId={pageSettings.id}
                                                        />
                                                    }
                                                    {/*{( showLinkForm.show || editLink.id) &&
                                                        <div className="edit_form link my_row">
                                                            {
                                                                editLink.type ===  "url" ||
                                                                editLink.type ===  "email" ||
                                                                editLink.type ===  "phone" ?
                                                                    <StandardForm
                                                                        editLink={editLink}
                                                                        setEditLink={setEditLink}
                                                                        subStatus={subStatus}
                                                                        showLinkForm={showLinkForm}
                                                                        setShowLinkForm={setShowLinkForm}
                                                                        setShowUpgradePopup={setShowUpgradePopup}
                                                                        setShowLoader={setShowLoader}
                                                                    />
                                                                    :
                                                                    ""
                                                            }*/}
                                                            {/*<div className={"my_row tab_content_wrap"}>
                                                                <div className={`accordion_row my_row`}>
                                                                    <AccordionLink
                                                                        accordionValue={accordionValue}
                                                                        setAccordionValue={setAccordionValue}
                                                                        linkText="Standard Icon"
                                                                        type="standard"
                                                                    />
                                                                    {accordionValue === "standard" &&
                                                                        <div className={`inner_wrap ${accordionValue ===
                                                                        "standard" && "open"}`}>

                                                                            <StandardForm
                                                                                setAccordionValue={setAccordionValue}
                                                                                accordionValue={accordionValue}
                                                                                inputType={inputType}
                                                                                setInputType={setInputType}
                                                                                editLink={editLink}
                                                                                subStatus={subStatus}
                                                                                setShowLinkForm={setShowLinkForm}
                                                                                setEditLink={setEditLink}
                                                                                setShowUpgradePopup={setShowUpgradePopup}
                                                                                setShowLoader={setShowLoader}
                                                                            />

                                                                        </div>
                                                                    }
                                                                </div>
                                                                <div data-type="offer"
                                                                     className={`accordion_row my_row`}
                                                                >
                                                                    <AccordionLink
                                                                        accordionValue={accordionValue}
                                                                        setAccordionValue={setAccordionValue}
                                                                        linkText="Affiliate Offers"
                                                                        type="offer"
                                                                    />
                                                                    {accordionValue === "offer" &&
                                                                        <div className={`inner_wrap ${accordionValue} ${accordionValue ===
                                                                        "offer" && "open"}`}>

                                                                            <StandardForm
                                                                                accordionValue={accordionValue}
                                                                                setAccordionValue={setAccordionValue}
                                                                                inputType={inputType}
                                                                                setInputType={setInputType}
                                                                                editLink={editLink}
                                                                                subStatus={subStatus}
                                                                                setShowLinkForm={setShowLinkForm}
                                                                                setEditLink={setEditLink}
                                                                                setShowUpgradePopup={setShowUpgradePopup}
                                                                                affiliateStatus={affiliateStatus}
                                                                                setAffiliateStatus={setAffiliateStatus}
                                                                            />

                                                                        </div>
                                                                    }
                                                                </div>
                                                                <div data-type="custom"
                                                                     className={`accordion_row my_row ${!subStatus ? "disabled" : ""}`}
                                                                     onClick={(e) => handleDisabledClick(e)}
                                                                >
                                                                    <AccordionLink
                                                                        accordionValue={accordionValue}
                                                                        setAccordionValue={setAccordionValue}
                                                                        linkText="Custom Icon"
                                                                        type="custom"
                                                                    />
                                                                    {accordionValue === "custom" &&
                                                                        <div className={`inner_wrap ${accordionValue ===
                                                                        "custom" && "open"}`}>

                                                                            <CustomForm
                                                                                accordionValue={accordionValue}
                                                                                setAccordionValue={setAccordionValue}
                                                                                inputType={inputType}
                                                                                setInputType={setInputType}
                                                                                editLink={editLink}
                                                                                setShowLinkForm={setShowLinkForm}
                                                                                setEditLink={setEditLink}
                                                                                setShowLoader={setShowLoader}
                                                                            // />

                                                                        </div>
                                                                    }
                                                                </div>
                                                                {!editLink.folder_id &&
                                                                    <div data-type="integration"
                                                                         className={`accordion_row my_row ${!subStatus ? "disabled" : ""}`}
                                                                         onClick={(e) => handleDisabledClick(e)}
                                                                    >
                                                                        <AccordionLink
                                                                            accordionValue={accordionValue}
                                                                            setAccordionValue={setAccordionValue}
                                                                            linkText="Integrations"
                                                                            type="integration"
                                                                        />
                                                                        {accordionValue ===
                                                                            "integration" &&
                                                                            <div className={`inner_wrap ${accordionValue ===
                                                                            "integration" &&
                                                                            "open"}`}>

                                                                                <IntegrationForm
                                                                                    accordionValue={accordionValue}
                                                                                    setAccordionValue={setAccordionValue}
                                                                                    editID={editLink.id}
                                                                                    setShowLinkForm={setShowLinkForm}
                                                                                    setEditLink={setEditLink}
                                                                                    setShowMessageAlertPopup={setShowMessageAlertPopup}
                                                                                    setShowLoader={setShowLoader}
                                                                                    setIntegrationType={setIntegrationType}
                                                                                    integrationType={integrationType}
                                                                                    connectionError={connectionError}
                                                                                    shopifyStores={shopifyStores}
                                                                                    setShopifyStores={setShopifyStores}
                                                                                    redirectedType={redirectedType}
                                                                                    setStoreID={setStoreID}
                                                                                    storeID={storeID}
                                                                                />

                                                                            </div>
                                                                        }
                                                                    </div>
                                                                }

                                                            </div>*/}
                                                        {/*</div>
                                                    }*/}

                                                    { (editLink.folder_id &&
                                                        !editLink.id &&
                                                        !showLinkTypeRadio
                                                    ) ?

                                                        <ErrorBoundary FallbackComponent={errorFallback} onError={myErrorHandler}>
                                                            <FolderLinks
                                                                folder_id={editLink.folder_id}
                                                                subStatus={subStatus}
                                                                setEditLink={setEditLink}
                                                            />
                                                        </ErrorBoundary>

                                                        :

                                                        (!editLink.folder_id && !showLinkTypeRadio) &&

                                                            <ErrorBoundary FallbackComponent={errorFallback} onError={myErrorHandler}>
                                                                <Links
                                                                    editLink={editLink}
                                                                    setEditLink={setEditLink}
                                                                    subStatus={subStatus}
                                                                    setRow={setRow}
                                                                    setValue={setValue}
                                                                    setShowUpgradePopup={setShowUpgradePopup}
                                                                    pageLayoutRef={pageLayoutRef}
                                                                    setShowConfirmPopup={setShowConfirmPopup}
                                                                    setShowLoader={setShowLoader}
                                                                    affStatus={affStatus}
                                                                    connectionError={connectionError}
                                                                    formRow={formRow}
                                                                    setFormRow={setFormRow}
                                                                />
                                                            </ErrorBoundary>
                                                    }

                                                </div>
                                            </div>
                                            <Preview
                                                nodesRef={nodesRef}
                                                completedCrop={completedCrop}
                                                row={row}
                                                setRow={setRow}
                                                value={value}
                                                userSub={userSub}
                                                setValue={setValue}
                                                subStatus={subStatus}
                                                pageLayoutRef={pageLayoutRef}
                                                showPreview={showPreview}
                                                setShowPreview={setShowPreview}
                                                profileImgActive={profileImgActive}
                                            />
                                        </ToolTipContextProvider>
                                    </PageContext.Provider>
                                </FolderLinksContext.Provider>
                            </UserLinksContext.Provider>
                        </div>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}

export default Dashboard;
