import React, {useEffect, useMemo, useRef, useState} from 'react';

import PageStats from './Components/PageStats';
import LinkStats from './Components/LinkStats';
import FolderStats from './Components/FolderStats';
import AffiliateStats from './Components/AffiliateStats';

function App() {

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

    const handleClick = e => {
        e.preventDefault();
        setTab(e.target.dataset.tab);
    }

    return (

        <div className="tabs_wrap">
            <div className="my_row tab_nav">
                <a href="#" className={`tab_link ${tab === "page" ? "active" : "" }` } data-tab="page" onClick={(e) => { handleClick(e) } }>
                    Page Stats
                </a>
                <a href="#" className={`tab_link ${tab === "icon" ? "active" : "" }` } data-tab="icon" onClick={(e) => { handleClick(e) } }>
                    Icon Stats
                </a>
                <a href="#" className={`tab_link ${tab === "folder" ? "active" : "" }` } data-tab="folder" onClick={(e) => { handleClick(e) } }>
                    Folder Stats
                </a>
                <a href="#" className={`tab_link ${tab === "affiliate" ? "active" : "" }` } data-tab="affiliate" onClick={(e) => { handleClick(e) } }>
                    Affiliate Stats
                </a>
            </div>

            {tab === "page" &&
                <PageStats
                    pageStats={pageStats}
                    setPageStats={setPageStats}
                    pageStatsDate={pageStatsDate}
                    setPageStatsDate={setPageStatsDate}
                    pageDropdownValue={pageDropdownValue}
                    setPageDropdownValue={setPageDropdownValue}
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
                    tab={tab}
                />
            }

        </div>

    )
}

export default App;
