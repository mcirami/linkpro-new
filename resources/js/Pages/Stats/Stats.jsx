import React, {useEffect, useState} from 'react';

import PageStats from './Components/PageStats';
import LinkStats from './Components/LinkStats';
import FolderStats from './Components/FolderStats';
import AffiliateStats from './Components/AffiliateStats';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {Head} from '@inertiajs/react';
import PageHeader from "@/Components/PageHeader.jsx";
import LivePageButton from "@/Components/LivePageButton.jsx";
import PageTabs from "@/Components/PageTabs.jsx";

function Stats() {

    const [isLoading, setIsLoading] = useState(true);
    const [tab, setTab] = useState("page");
    const [pageStats, setPageStats] = useState([])
    const [linkStats, setLinkStats] = useState([])
    const [deletedStats, setDeletedStats] = useState([]);
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

    const handleClick = e => {
        e.preventDefault();
        setTab(e.target.dataset.tab);
    }

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
                    <div className="card flex relative">
                        {isLoading &&
                            <div id="loading_spinner" className="active">
                                <div >
                                    <img src={Vapor.asset('images/spinner.svg')} alt="" />
                                </div>
                            </div>
                        }
                        <div id="stats" className="my_row">
                            <div className="tabs_wrap shadow-md">
                                <div className="page_tabs w-full">
                                    <PageTabs
                                        tabs={[
                                            { value: "page", label: "Page Stats"},
                                            { value: "icon", label: "Icon Stats"},
                                            { value: "folder", label: "Folder Stats"},
                                            { value: "affiliate", label: "Affiliate Stats"}
                                        ]}
                                        pageTab={tab}
                                        setPageTab={setTab}
                                    />
                                </div>
                                <>
                                    {tab === "page" &&
                                        <PageStats
                                            pageStats={pageStats}
                                            setPageStats={setPageStats}
                                            pageStatsDate={pageStatsDate}
                                            setPageStatsDate={setPageStatsDate}
                                            pageDropdownValue={pageDropdownValue}
                                            setPageDropdownValue={setPageDropdownValue}
                                            isLoading={isLoading}
                                            setIsLoading={setIsLoading}
                                            tab={tab}
                                        />
                                    }
                                    {tab ==="icon" &&
                                        <LinkStats
                                            linkStats={linkStats}
                                            setLinkStats={setLinkStats}
                                            deletedStats={deletedStats}
                                            setDeletedStats={setDeletedStats}
                                            linkStatsDate={linkStatsDate}
                                            setLinkStatsDate={setLinkStatsDate}
                                            linkDropdownValue={linkDropdownValue}
                                            setLinkDropdownValue={setLinkDropdownValue}
                                            isLoading={isLoading}
                                            setIsLoading={setIsLoading}
                                            tab={tab}
                                        />
                                    }

                                    {tab === "folder" &&
                                        <FolderStats
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
                                    }

                                    {tab === "affiliate" &&
                                        <AffiliateStats
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
                                    }
                                </>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>

    )
}

export default Stats;
