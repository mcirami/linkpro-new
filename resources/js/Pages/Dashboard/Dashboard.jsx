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
import PageTitle from './Components/Page/PageTitle';
import PageBio from './Components/Page/PageBio';
import AddLink from './Components/Link/AddLink';
import PreviewButton from '../../Components/PreviewButton.jsx';
import { UpgradePopup } from '@/Utils/Popups/UpgradePopup';
import { ConfirmPopup } from '@/Utils/Popups/ConfirmPopup';
import { Loader } from '@/Utils/Loader.jsx';
import AddFolder from './Components/Folder/AddFolder';
import FolderLinks from './Components/Folder/FolderLinks';
import { ConfirmFolderDelete } from '@/Utils/Popups/ConfirmFolderDelete';
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
import PageHeaderLayout from './Components/Page/PageHeaderLayout';
import LivePageButton from './Components/LivePageButton';
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

export const UserLinksContext = createContext();
export const FolderLinksContext = createContext();
export const PageContext = createContext();

import { ToolTipContextProvider } from '@/Utils/ToolTips/ToolTipContext.jsx';
import {Head} from '@inertiajs/react';
import SetFlash from '@/Utils/SetFlash.jsx';
import EventBus from '@/Utils/Bus.jsx';

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

    const [allUserPages, setAllUserPages] = useState(userPages);
    const [editFolderID, setEditFolderID] = useState(null);

    const [editID, setEditID] = useState(null);
    const [showLinkForm, setShowLinkForm] = useState(false);

    const [accordionValue, setAccordionValue] = useState(null);
    const [inputType, setInputType] = useState(null);
    const [integrationType, setIntegrationType] = useState(null);
    const [storeID, setStoreID] = useState(null);
    const [shopifyStores, setShopifyStores] = useState([]);

    const [showUpgradePopup, setShowUpgradePopup] = useState(false);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [showMessageAlertPopup, setShowMessageAlertPopup] = useState(false);
    const [showConfirmFolderDelete, setShowConfirmFolderDelete] = useState(false);
    const [optionText, setOptionText] = useState("");

    const nodesRef = useRef({});
    const [completedCrop, setCompletedCrop] = useState({});

    const pageHeaderRef = useRef();
    const leftColWrap = useRef();

    const [showTiny, setShowTiny] = useState(false);

    const subStatus = useMemo(
        () => {
            return checkSubStatus(userSub)
    },[]);

    const [showLoader, setShowLoader] = useState({
        show: false,
        icon: "",
        position: ""
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
        previewButtonRequest(setShowPreviewButton);
    }, [])

    useEffect(() => {

        function setPreviewButton() {
            previewButtonRequest(setShowPreviewButton);
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
            setEditID(JSON.parse(localStorage.getItem('editID')) || null)
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

            setShowUpgradePopup(true);
            setOptionText(text);
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

                            {showUpgradePopup &&
                                <UpgradePopup
                                    optionText={optionText}
                                    showUpgradePopup={showUpgradePopup}
                                    setShowUpgradePopup={setShowUpgradePopup}
                                />
                            }

                            {showMessageAlertPopup &&
                                <MessageAlertPopup
                                    optionText={optionText}
                                    showMessageAlertPopup={showMessageAlertPopup}
                                    setShowMessageAlertPopup={setShowMessageAlertPopup}
                                />
                            }
                            <UserLinksContext.Provider value={{userLinks, dispatch }} >
                                <FolderLinksContext.Provider value={{ folderLinks, dispatchFolderLinks}} >

                                    {showConfirmPopup &&
                                        <ConfirmPopup
                                            editID={editID}
                                            setEditID={setEditID}
                                            showConfirmPopup={showConfirmPopup}
                                            setShowConfirmPopup={setShowConfirmPopup}
                                            folderID={editFolderID}
                                            setInputType={setInputType}
                                            setIntegrationType={setIntegrationType}
                                            setAccordionValue={setAccordionValue}
                                        />
                                    }

                                    {showConfirmFolderDelete &&
                                        <ConfirmFolderDelete
                                            showConfirmFolderDelete={showConfirmFolderDelete}
                                            setShowConfirmFolderDelete={setShowConfirmFolderDelete}
                                            folderID={editFolderID}
                                            setEditFolderID={setEditFolderID}
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
                                                    setOptionText={setOptionText}
                                                    pageNames={allPageNames}
                                                />

                                                <div ref={leftColWrap} className="content_wrap my_row" id="left_col_wrap">
                                                    <div className="top_section">
                                                        <PageName
                                                            pageNames={allPageNames}
                                                        />

                                                        <PageHeader
                                                            ref={nodesRef}
                                                            completedCrop={completedCrop}
                                                            setCompletedCrop={setCompletedCrop}
                                                            setShowLoader={setShowLoader}
                                                            elementName="header_img"
                                                        />

                                                        <PageProfile
                                                            ref={nodesRef}
                                                            completedCrop={completedCrop}
                                                            setCompletedCrop={setCompletedCrop}
                                                            setShowLoader={setShowLoader}
                                                            elementName="profile_img"
                                                        />

                                                        <PageTitle />
                                                        <PageBio />

                                                        <PageHeaderLayout
                                                            pageHeaderRef={pageHeaderRef} />

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

                                                    <div className="my_row view_live_link link_row">
                                                        <LivePageButton pageName={pageSettings['name']}/>
                                                    </div>

                                                    {editID || showLinkForm || editFolderID ?
                                                        <div className="my_row icon_links" id="scrollTo">
                                                            <p className="form_title">
                                                                {editID || (editFolderID && !showLinkForm) ? "Editing " : "" }
                                                                {showLinkForm ? "Adding " : "" }
                                                                {(editFolderID && !editID && !showLinkForm) ? "Folder" : "Icon"}
                                                            </p>
                                                            <div className="links_row">
                                                                <FormBreadcrumbs
                                                                    setEditFolderID={setEditFolderID}
                                                                    setShowLinkForm={setShowLinkForm}
                                                                    folderID={editFolderID}
                                                                    setAccordionValue={setAccordionValue}
                                                                    editID={editID}
                                                                    setEditID={setEditID}
                                                                    setIntegrationType={setIntegrationType}
                                                                    setInputType={setInputType}
                                                                    showLinkForm={showLinkForm}
                                                                />
                                                                { (editID || editFolderID && !showLinkForm) &&
                                                                    <div className="delete_icon">
                                                                        <DeleteIcon
                                                                            setShowConfirmFolderDelete={setShowConfirmFolderDelete}
                                                                            setShowConfirmPopup={setShowConfirmPopup}
                                                                            editFolderID={editFolderID}
                                                                            editID={editID}
                                                                            setAccordionValue={setAccordionValue}
                                                                        />
                                                                    </div>
                                                                }
                                                            </div>
                                                            {editFolderID && !editID ?
                                                                <div className="folder_name my_row">
                                                                    <FolderNameInput
                                                                        folderID={editFolderID}
                                                                    />
                                                                </div>
                                                                :
                                                                ""
                                                            }
                                                        </div>
                                                        :
                                                        ""
                                                    }

                                                    {!editID && !editFolderID && !showLinkForm ?
                                                        <div className="my_row link_row">
                                                            <div className="add_more_link">
                                                                <AddLink
                                                                    setShowLinkForm={setShowLinkForm}
                                                                    subStatus={subStatus}
                                                                    setShowUpgradePopup={setShowUpgradePopup}
                                                                    setOptionText={setOptionText}
                                                                />
                                                            </div>
                                                            <div className="add_more_link">
                                                                <AddFolder
                                                                    subStatus={subStatus}
                                                                    setShowUpgradePopup={setShowUpgradePopup}
                                                                    setOptionText={setOptionText}
                                                                    setEditFolderID={setEditFolderID}
                                                                />
                                                            </div>
                                                        </div>
                                                        :
                                                        editFolderID && !editID && !showLinkForm ?
                                                            <div className="my_row link_row">
                                                                <div className="add_more_link">
                                                                    <AddLink
                                                                        setShowLinkForm={setShowLinkForm}
                                                                        subStatus={subStatus}
                                                                        setShowUpgradePopup={setShowUpgradePopup}
                                                                        setOptionText={setOptionText}
                                                                    />
                                                                </div>
                                                            </div>
                                                            :
                                                            ""
                                                    }

                                                    {(showLinkForm || editID) &&
                                                        <div className="edit_form link my_row">
                                                            <div className={"my_row tab_content_wrap"}>
                                                                <div className={`accordion_row my_row`}>
                                                                    <AccordionLink
                                                                        accordionValue={accordionValue}
                                                                        setAccordionValue={setAccordionValue}
                                                                        linkText="Standard Icon"
                                                                        type="standard"
                                                                        setShowTiny={setShowTiny}
                                                                    />
                                                                    {accordionValue === "standard" &&
                                                                        <div className={`inner_wrap ${accordionValue ===
                                                                        "standard" && "open"}`}>

                                                                            <StandardForm
                                                                                setAccordionValue={setAccordionValue}
                                                                                accordionValue={accordionValue}
                                                                                inputType={inputType}
                                                                                setInputType={setInputType}
                                                                                editID={editID}
                                                                                subStatus={subStatus}
                                                                                setShowLinkForm={setShowLinkForm}
                                                                                setEditID={setEditID}
                                                                                setShowUpgradePopup={setShowUpgradePopup}
                                                                                setOptionText={setOptionText}
                                                                                folderID={editFolderID}
                                                                                showTiny={showTiny}
                                                                                setShowTiny={setShowTiny}
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
                                                                        setShowTiny={setShowTiny}
                                                                    />
                                                                    {accordionValue === "offer" &&
                                                                        <div className={`inner_wrap ${accordionValue} ${accordionValue ===
                                                                        "offer" && "open"}`}>

                                                                            <StandardForm
                                                                                accordionValue={accordionValue}
                                                                                setAccordionValue={setAccordionValue}
                                                                                inputType={inputType}
                                                                                setInputType={setInputType}
                                                                                editID={editID}
                                                                                subStatus={subStatus}
                                                                                setShowLinkForm={setShowLinkForm}
                                                                                setEditID={setEditID}
                                                                                setShowUpgradePopup={setShowUpgradePopup}
                                                                                setOptionText={setOptionText}
                                                                                folderID={editFolderID}
                                                                                affiliateStatus={affiliateStatus}
                                                                                setAffiliateStatus={setAffiliateStatus}
                                                                                showTiny={showTiny}
                                                                                setShowTiny={setShowTiny}
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
                                                                        setShowTiny={setShowTiny}
                                                                    />
                                                                    {accordionValue === "custom" &&
                                                                        <div className={`inner_wrap ${accordionValue ===
                                                                        "custom" && "open"}`}>

                                                                            <CustomForm
                                                                                accordionValue={accordionValue}
                                                                                setAccordionValue={setAccordionValue}
                                                                                inputType={inputType}
                                                                                setInputType={setInputType}
                                                                                editID={editID}
                                                                                setShowLinkForm={setShowLinkForm}
                                                                                setEditID={setEditID}
                                                                                setShowLoader={setShowLoader}
                                                                                folderID={editFolderID}
                                                                                showTiny={showTiny}
                                                                                setShowTiny={setShowTiny}
                                                                            />

                                                                        </div>
                                                                    }
                                                                </div>
                                                                {!editFolderID &&
                                                                    <div data-type="integration"
                                                                         className={`accordion_row my_row ${!subStatus ? "disabled" : ""}`}
                                                                         onClick={(e) => handleDisabledClick(e)}
                                                                    >
                                                                        <AccordionLink
                                                                            accordionValue={accordionValue}
                                                                            setAccordionValue={setAccordionValue}
                                                                            linkText="Integrations"
                                                                            type="integration"
                                                                            setShowTiny={setShowTiny}
                                                                        />
                                                                        {accordionValue ===
                                                                            "integration" &&
                                                                            <div className={`inner_wrap ${accordionValue ===
                                                                            "integration" &&
                                                                            "open"}`}>

                                                                                <IntegrationForm
                                                                                    accordionValue={accordionValue}
                                                                                    setAccordionValue={setAccordionValue}
                                                                                    editID={editID}
                                                                                    setShowLinkForm={setShowLinkForm}
                                                                                    setEditID={setEditID}
                                                                                    setShowMessageAlertPopup={setShowMessageAlertPopup}
                                                                                    setOptionText={setOptionText}
                                                                                    setShowLoader={setShowLoader}
                                                                                    setIntegrationType={setIntegrationType}
                                                                                    integrationType={integrationType}
                                                                                    connectionError={connectionError}
                                                                                    shopifyStores={shopifyStores}
                                                                                    setShopifyStores={setShopifyStores}
                                                                                    redirectedType={redirectedType}
                                                                                    storeID={storeID}
                                                                                />

                                                                            </div>
                                                                        }
                                                                    </div>
                                                                }

                                                            </div>
                                                        </div>
                                                    }

                                                    { (editFolderID && !editID && !showLinkForm) ?

                                                        <ErrorBoundary FallbackComponent={errorFallback} onError={myErrorHandler}>
                                                            <FolderLinks
                                                                folderID={editFolderID}
                                                                subStatus={subStatus}
                                                                setEditID={setEditID}
                                                                setAccordionValue={setAccordionValue}
                                                            />
                                                        </ErrorBoundary>

                                                        :

                                                        (!showLinkForm && !editID && !editFolderID) &&

                                                            <ErrorBoundary FallbackComponent={errorFallback} onError={myErrorHandler}>
                                                                <Links
                                                                    setEditID={setEditID}
                                                                    setEditFolderID={setEditFolderID}
                                                                    subStatus={subStatus}
                                                                    setRow={setRow}
                                                                    setValue={setValue}
                                                                    setShowUpgradePopup={setShowUpgradePopup}
                                                                    setOptionText={setOptionText}
                                                                    setAccordionValue={setAccordionValue}
                                                                />
                                                            </ErrorBoundary>
                                                    }

                                                </div>
                                            </div>
                                            <div className={`right_column links_col preview ${showPreview ? "show" : ""}`}>
                                                <Preview
                                                    nodesRef={nodesRef}
                                                    completedCrop={completedCrop}
                                                    row={row}
                                                    setRow={setRow}
                                                    value={value}
                                                    setValue={setValue}
                                                    subStatus={subStatus}
                                                    pageHeaderRef={pageHeaderRef}
                                                    setShowPreview={setShowPreview}
                                                />
                                            </div>
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
