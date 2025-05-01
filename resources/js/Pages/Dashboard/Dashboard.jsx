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
import PageHeader from './Components/Page/PageHeader';
import PageProfile from './Components/Page/PageProfile';
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
import StandardForm from './Components/Link/Forms/StandardForm';
import FormBreadcrumbs from './Components/Link/Forms/FormBreadcrumbs';
import DeleteIcon from './Components/Link/Forms/DeleteIcon';
import FolderNameInput from './Components/Folder/FolderNameInput';
import AccordionLink from './Components/Link/Forms/AccordionLink';
import CustomForm from './Components/Link/Forms/CustomForm';
import IntegrationForm from './Components/Link/Forms/IntegrationForm';
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
import ImageTypeRadio
    from '@/Pages/Dashboard/Components/Page/ImageTypeRadio.jsx';
import ImageUploader from '@/Pages/Dashboard/Components/Page/ImageUploader.jsx';

function Dashboard({
                       message = null,
                       userData,
}) {

    const {links, page, userPages, allPageNames, userSub, affStatus} = userData;
    const [affiliateStatus, setAffiliateStatus] = useState(affStatus);

    const [userLinks, dispatch] = useReducer(reducer, links);
    const [folderLinks, dispatchFolderLinks] = useReducer(folderLinksReducer, []);

    const [pageSettings, setPageSettings] = useState(page);
    const [infoText, setInfoText] = useState({section:'', text:[]});
    const [infoTextOpen, setInfoTextOpen] = useState(false)
    const [infoLocation, setInfoLocation] = useState({})
    const [infoClicked, setInfoClicked] = useState(null);
    const [triangleRef, setTriangleRef] = useState(null);

    const [imageType, setImageType] = useState(pageSettings.main_img_type);

    const [allUserPages, setAllUserPages] = useState(userPages);

    const [inputType, setInputType] = useState(null);

    const [editIcon, setEditIcon] = useState({
        id: null,
        type: null,
        inputType: null,
        folderId: null
    });

    const [showLinkForm, setShowLinkForm] = useState(false);

    const [accordionValue, setAccordionValue] = useState(null);

    const [integrationType, setIntegrationType] = useState("mailchimp");

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

    const [redirectedType, setRedirectedType] = useState(null);

    useEffect(() => {

        const data = getUrlParams();

        const redirected = data.urlParams?.get('redirected');
        const storeID = data.urlParams?.get('store');
        const error = data.urlParams?.get('connection_error');

        if (redirected && redirected !== "") {
            setInputType(localStorage.getItem('inputType') || null)
            setAccordionValue("integration");
            setRedirectedType(redirected);
            setIntegrationType(localStorage.getItem('integrationType') || null);

            setEditIcon(prev => ({ ...prev, id: JSON.parse(localStorage.getItem('editID')) || null }));
            setShowLinkForm(JSON.parse(localStorage.getItem('showLinkForm')) || false)
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
                                            editIcon={editIcon}
                                            setEditIcon={setEditIcon}
                                            showConfirmPopup={showConfirmPopup}
                                            setShowConfirmPopup={setShowConfirmPopup}
                                            setInputType={setInputType}
                                            setIntegrationType={setIntegrationType}
                                            setAccordionValue={setAccordionValue}
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
                                                            <ImageTypeRadio
                                                                setImageType={setImageType}
                                                                imageType={imageType}
                                                                pageId={pageSettings.id}
                                                                setPageSettings={setPageSettings}
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

                                                        {/*<PageProfile
                                                            ref={nodesRef}
                                                            completedCrop={completedCrop}
                                                            setCompletedCrop={setCompletedCrop}
                                                            setShowLoader={setShowLoader}
                                                            elementName="profile_img"
                                                        />*/}

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

                                                    {editIcon.id || showLinkForm || editIcon.folderId ?
                                                        <div className="my_row icon_links" id="scrollTo">
                                                            <p className="form_title">
                                                                {editIcon.id || (editIcon.folderId && !showLinkForm) ? "Editing " : "" }
                                                                {showLinkForm ? "Adding " : "" }
                                                                {(editIcon.folderId && !editIcon.id && !showLinkForm) ? "Folder" : "Icon"}
                                                            </p>
                                                            <div className="links_row">
                                                                <FormBreadcrumbs
                                                                    setShowLinkForm={setShowLinkForm}
                                                                    setAccordionValue={setAccordionValue}
                                                                    editIcon={editIcon}
                                                                    setEditIcon={setEditIcon}
                                                                    setIntegrationType={setIntegrationType}
                                                                    setInputType={setInputType}
                                                                    showLinkForm={showLinkForm}
                                                                />
                                                                { (editIcon.id || editIcon.folderId && !showLinkForm) &&
                                                                    <div className="delete_icon">
                                                                        <DeleteIcon
                                                                            setShowConfirmPopup={setShowConfirmPopup}
                                                                            editId={editIcon.id}
                                                                        />
                                                                    </div>
                                                                }
                                                            </div>
                                                            {editIcon.folderId && !editIcon.id ?
                                                                <div className="folder_name my_row">
                                                                    <FolderNameInput
                                                                        folderID={editIcon.folderId}
                                                                    />
                                                                </div>
                                                                :
                                                                ""
                                                            }
                                                        </div>
                                                        :
                                                        ""
                                                    }

                                                    {Object.values(editIcon).every(value => value === null) && !showLinkForm ?
                                                        <div className="my_row link_row">
                                                            <div className={`add_content_links ${pageSettings.page_layout === "layout_two" && "!border-0" } `}>
                                                                <div className="add_more_link">
                                                                    <AddLink
                                                                        setShowLinkForm={setShowLinkForm}
                                                                        subStatus={subStatus}
                                                                        setShowUpgradePopup={setShowUpgradePopup}
                                                                    />
                                                                </div>
                                                                {pageSettings.page_layout === "layout_one" &&
                                                                    <div className="add_more_link">
                                                                        <AddFolder
                                                                            subStatus={subStatus}
                                                                            setShowUpgradePopup={setShowUpgradePopup}
                                                                            setEditIcon={setEditIcon}
                                                                        />
                                                                    </div>
                                                                }
                                                            </div>
                                                        </div>
                                                        :
                                                        editIcon.folderId && !editIcon.id && !showLinkForm ?
                                                            <div className="my_row link_row">
                                                                <div className="add_more_link">
                                                                    <AddLink
                                                                        setShowLinkForm={setShowLinkForm}
                                                                        subStatus={subStatus}
                                                                        setShowUpgradePopup={setShowUpgradePopup}
                                                                    />
                                                                </div>
                                                            </div>
                                                            :
                                                            ""
                                                    }

                                                    {(showLinkForm || editIcon.id) &&
                                                        <div className="edit_form link my_row">
                                                            <div className={"my_row tab_content_wrap"}>
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
                                                                                editIcon={editIcon}
                                                                                subStatus={subStatus}
                                                                                setShowLinkForm={setShowLinkForm}
                                                                                setEditIcon={setEditIcon}
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
                                                                                editIcon={editIcon}
                                                                                subStatus={subStatus}
                                                                                setShowLinkForm={setShowLinkForm}
                                                                                setEditIcon={setEditIcon}
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
                                                                                editIcon={editIcon}
                                                                                setShowLinkForm={setShowLinkForm}
                                                                                setEditIcon={setEditIcon}
                                                                                setShowLoader={setShowLoader}
                                                                            />

                                                                        </div>
                                                                    }
                                                                </div>
                                                                {!editIcon.folderId &&
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
                                                                                    editID={editIcon.id}
                                                                                    setShowLinkForm={setShowLinkForm}
                                                                                    setEditIcon={setEditIcon}
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

                                                            </div>
                                                        </div>
                                                    }

                                                    { (editIcon.folderId && !editIcon.id && !showLinkForm) ?

                                                        <ErrorBoundary FallbackComponent={errorFallback} onError={myErrorHandler}>
                                                            <FolderLinks
                                                                folderID={editIcon.folderId}
                                                                subStatus={subStatus}
                                                                setEditIcon={setEditIcon}
                                                                setAccordionValue={setAccordionValue}
                                                            />
                                                        </ErrorBoundary>

                                                        :

                                                        (!showLinkForm && !editIcon.id && !editIcon.folderId) &&

                                                            <ErrorBoundary FallbackComponent={errorFallback} onError={myErrorHandler}>
                                                                <Links
                                                                    setEditIcon={setEditIcon}
                                                                    subStatus={subStatus}
                                                                    setRow={setRow}
                                                                    setValue={setValue}
                                                                    setShowUpgradePopup={setShowUpgradePopup}
                                                                    setAccordionValue={setAccordionValue}
                                                                    pageLayoutRef={pageLayoutRef}
                                                                    setShowConfirmPopup={setShowConfirmPopup}
                                                                    editIcon={editIcon}
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
