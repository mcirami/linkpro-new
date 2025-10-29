import React, {useCallback, useEffect, useState, useMemo, useRef} from 'react';
import {
    getFolderStats,
} from '@/Services/StatsRequests.jsx';

import "react-datepicker/dist/react-datepicker.css";
import Filters from './Filters';
import Table from './Table';

const FolderStats = ({
                         isActive,
                         folderStats,
                         setFolderStats,
                         folderStatsDate,
                         setFolderStatsDate,
                         folderDropdownValue,
                         setFolderDropdownValue,
                         isLoading,
                         setIsLoading,
                         tab
}) => {

    const [animate, setAnimate] = useState(true);
    const hasFetchedRef = useRef(false);

    const columns = useMemo(
        () => [
            {
                id: 'current_icons',
                header: "Current Icons",
                accessorKey: "icon",
            },
            {
                id: 'icon_name',
                header: "Icon Name",
                accessorKey: "iconName",
                meta: { totalKey: 'count', format: 'count', countLabel: 'Icons' },
            },
            {
                id: 'icon_clicks',
                header: "Icon Clicks",
                accessorKey: "visits",
                meta: { totalKey: 'visits' },
            },
        ],[]
    )
    const handleDateChange = (date, type) => {

        let currentStartDate = null;
        let currentEndDate =  null;

        if (type === "start") {
            setFolderStatsDate(prevState => ({
                ...prevState,
                startDate: date
            }));
            currentStartDate = date;
            currentEndDate = folderStatsDate.endDate ? folderStatsDate.endDate : null;
        } else {
            setFolderStatsDate(prevState => ({
                ...prevState,
                endDate: date
            }));
            currentEndDate = date;
            currentStartDate = folderStatsDate.startDate ? folderStatsDate.startDate : null;
        }

        if ( currentEndDate && currentStartDate && (currentStartDate <= currentEndDate) ) {
            setFolderDropdownValue(0);

            const packets = {
                startDate: Math.round(new Date(currentStartDate) / 1000),
                endDate: Math.round(new Date(currentEndDate) /1000),
            }

            folderStatsCall(packets);
        }
    }

    const handleDropdownChange = (e) => {

        const value = Number(e.target.value);
        setFolderDropdownValue(value);

        if (value === 0) {
            setFolderStatsDate({
                startDate: null,
                endDate: null
            });
            return;
        }

        setFolderStatsDate({
            startDate: null,
            endDate: null
        })

        const packets = {
            dateValue: value
        }

        folderStatsCall(packets);
    }

    const folderStatsCall = useCallback((packets) => {

        setAnimate(true);
        setIsLoading(true);
        getFolderStats(packets)
        .then((data) => {
            if (data["success"]) {
                hasFetchedRef.current = true;
                setTimeout(() => {
                    setFolderStats(data["currentData"]);
                }, 500)
            }
        })
        .finally(() => {
            setTimeout(() => {
                setAnimate(false)
                setIsLoading(false);
            }, 500)
        });

    }, [setFolderStats, setIsLoading])

    useEffect(() => {
        if (isActive && !hasFetchedRef.current) {
            folderStatsCall({ currentDay: true });
        }

    },[isActive, folderStatsCall])

    return (
        <div className={`stats_wrap my_row relative ${isActive ? '' : '!hidden'}`}>
            <Filters handleDateChange={handleDateChange}
                     startDate={folderStatsDate.startDate}
                     endDate={folderStatsDate.endDate}
                     handleDropdownChange={handleDropdownChange}
                     dropdownValue={folderDropdownValue}
                     getStats={folderStatsCall}
                     tab={tab}
            />
            {folderStats.length < 1 ?
                <div className="my_row">
                    <div className="my_row labels">
                        <h5>Folder Name</h5>
                        <h5>Folder Clicks</h5>
                    </div>
                    <div className="content_wrap">
                        <h3>No Stats Available</h3>
                    </div>
                </div>
                :
                folderStats.map((item) => {

                    const {id, name, clickCount, links, linksTotals } = item;

                    return (
                        <div className="my_row" key={id}>
                            <div className="my_row labels">
                                <h5>Folder Name</h5>
                                <h5>Folder Clicks</h5>
                            </div>
                            <div className="content_wrap">
                                <div className="my_row title">
                                    <p> {name} </p>
                                    <p className="animate">{clickCount}</p>
                                </div>

                                <div className="table_wrap my_row table-responsive mb-4">
                                    {links?.length > 0 &&
                                        <Table
                                            isLoading={isLoading}
                                            animate={animate}
                                            totals={linksTotals}
                                            data={links}
                                            columns={columns}
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default FolderStats
