import React, {useEffect, useState} from 'react';

import PageStats from './Components/PageStats';
import LinkStats from './Components/LinkStats';
import FolderStats from './Components/FolderStats';
import AffiliateStats from './Components/AffiliateStats';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {Head} from '@inertiajs/react';
import PageHeader from "@/Components/PageHeader.jsx";
import PageTabs from "@/Components/PageTabs.jsx";

function Stats() {

    const [isLoading, setIsLoading] = useState(true);
    const [tab, setTab] = useState("page");
    const [pageStats, setPageStats] = useState([]);
    const [pageTotals, setPageTotals] = useState(null);
    const [linkStats, setLinkStats] = useState([]);
    const [linkTotals, setLinkTotals] = useState(null);
    const [deletedStats, setDeletedStats] = useState([]);
    const [deletedTotals, setDeletedTotals] = useState(null);
    const [folderStats, setFolderStats] = useState([])
    const [affiliateStats, setAffiliateStats] = useState([]);
    const [affiliateTotals, setAffiliateTotals] = useState([]);

    const [linkStatsDate, setLinkStatsDate] = useState({
        startDate: null,
        endDate: null
    });
    const [pageStatsDate, setPageStatsDate] = useState({
        startDate: null,
        endDate: null
    });
    const [folderStatsDate, setFolderStatsDate] = useState({
        startDate: null,
        endDate: null
    });
    const [affiliateStatsDate, setAffiliateStatsDate] = useState({
        startDate: null,
        endDate: null
    });

    const [pageDropdownValue, setPageDropdownValue] = useState(1);
    const [linkDropdownValue, setLinkDropdownValue] = useState(1);
    const [folderDropdownValue, setFolderDropdownValue] = useState(1);
    const [affiliateDropdownValue, setAffiliateDropdownValue] = useState(1);
    const [filterByValue, setFilterByValue] = useState("offer");

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        setWindowWidth(window.innerWidth);
    }, []);

    useEffect(() => {

        function windowSize() {
            setWindowWidth(window.innerWidth);
        }

        window.addEventListener('resize', windowSize);

        return () => {
            window.removeEventListener('resize', windowSize);
        }

    }, [windowWidth]);

    return (

        <AuthenticatedLayout>

            <Head title={"Stats"} />

            <div className="container" id="stats_page">

                <div className="my_row form_page stats">
                    <div className="pb-6 gap-3 flex justify-between align-bottom items-baseline mt-3 border-b border-gray-100">
                        <PageHeader
                            heading="Stats"
                            description="View your page, icon, folder and affiliate clicks and sales."
                        />
                    </div>
                    <div className="max-w-5xl mx-auto flex relative mt-10 md:mt-20">
                        <div id="stats" className="my_row">
                            <div className="tabs_wrap shadow-md w-full">
                                <div className="page_tabs w-full">
                                    <PageTabs
                                        tabs={[
                                            { value: "page", label: window.innerWidth > 549 ? "Page Stats" : "Page" },
                                            { value: "icon", label:  window.innerWidth > 549 ? "Icon Stats" : "Icon" },
                                            { value: "folder", label:  window.innerWidth > 549 ? "Folder Stats" : "Folder" },
                                            { value: "affiliate", label:  window.innerWidth > 549 ? "Affiliate Stats" : "Affiliate" }
                                        ]}
                                        pageTab={tab}
                                        setPageTab={setTab}
                                    />
                                </div>
                                <div className="relative w-full flex flex-col">

                                    {isLoading &&
                                        <div id="loading_spinner" className="active">
                                            <div >
                                                <img src={Vapor.asset('images/spinner.svg')} alt="" />
                                            </div>
                                        </div>
                                    }

                                    <PageStats
                                        isActive={tab === "page"}
                                        pageStats={pageStats}
                                        setPageStats={setPageStats}
                                        totals={pageTotals}
                                        setTotals={setPageTotals}
                                        pageStatsDate={pageStatsDate}
                                        setPageStatsDate={setPageStatsDate}
                                        pageDropdownValue={pageDropdownValue}
                                        setPageDropdownValue={setPageDropdownValue}
                                        isLoading={isLoading}
                                        setIsLoading={setIsLoading}
                                        tab={tab}
                                    />

                                    <LinkStats
                                        isActive={tab === "icon"}
                                        linkStats={linkStats}
                                        setLinkStats={setLinkStats}
                                        linkTotals={linkTotals}
                                        setLinkTotals={setLinkTotals}
                                        deletedStats={deletedStats}
                                        setDeletedStats={setDeletedStats}
                                        deletedTotals={deletedTotals}
                                        setDeletedTotals={setDeletedTotals}
                                        linkStatsDate={linkStatsDate}
                                        setLinkStatsDate={setLinkStatsDate}
                                        linkDropdownValue={linkDropdownValue}
                                        setLinkDropdownValue={setLinkDropdownValue}
                                        isLoading={isLoading}
                                        setIsLoading={setIsLoading}
                                        tab={tab}
                                    />

                                    <FolderStats
                                        isActive={tab === "folder"}
                                        folderStats={folderStats}
                                        setFolderStats={setFolderStats}
                                        folderStatsDate={folderStatsDate}
                                        setFolderStatsDate={setFolderStatsDate}
                                        folderDropdownValue={folderDropdownValue}
                                        setFolderDropdownValue={setFolderDropdownValue}
                                        isLoading={isLoading}
                                        setIsLoading={setIsLoading}
                                        tab={tab}
                                    />

                                    <AffiliateStats
                                        isActive={tab === "affiliate"}
                                        affiliateStats={affiliateStats}
                                        setAffiliateStats={setAffiliateStats}
                                        totals={affiliateTotals}
                                        setTotals={setAffiliateTotals}
                                        statsDate={affiliateStatsDate}
                                        setStatsDate={setAffiliateStatsDate}
                                        dropdownValue={affiliateDropdownValue}
                                        setDropdownValue={setAffiliateDropdownValue}
                                        filterByValue={filterByValue}
                                        setFilterByValue={setFilterByValue}
                                        isLoading={isLoading}
                                        setIsLoading={setIsLoading}
                                        tab={tab}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>

    )
}

export default Stats;
