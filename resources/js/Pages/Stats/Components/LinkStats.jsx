import React, {useEffect, useState, useCallback, useMemo, useRef} from 'react';
import {
    getLinkStats
} from '@/Services/StatsRequests.jsx';

import "react-datepicker/dist/react-datepicker.css";
import Filters from './Filters';
import Table from './Table';

const LinkStats = ({
                       isActive,
                       linkStats,
                       setLinkStats,
                       linkTotals,
                       setLinkTotals,
                       deletedStats,
                       setDeletedStats,
                       deletedTotals,
                       setDeletedTotals,
                       linkStatsDate,
                       setLinkStatsDate,
                       linkDropdownValue,
                       setLinkDropdownValue,
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

    const deletedColumns = useMemo(
        () => [
            {
                id: 'past_icons',
                header: "Past Icons",
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
            setLinkStatsDate(prevState => ({
                ...prevState,
                startDate: date
            }));
            currentStartDate = date;
            currentEndDate = linkStatsDate.endDate ? linkStatsDate.endDate : null;
        } else {
            setLinkStatsDate(prevState => ({
                ...prevState,
                endDate: date
            }));
            currentEndDate = date;
            currentStartDate = linkStatsDate.startDate ? linkStatsDate.startDate : null;
        }

        if ( currentEndDate && currentStartDate && (currentStartDate <= currentEndDate) ) {

            setLinkDropdownValue(0);
            const packets = {
                startDate: Math.round(new Date(currentStartDate) / 1000),
                endDate: Math.round(new Date(currentEndDate) /1000),
            }

            linkStatsCall(packets)
        }
    }

    const handleDropdownChange = (e) => {

        const value = Number(e.target.value);
        setLinkDropdownValue(value);

        if (value === 0) {
            setLinkStatsDate({
                startDate: null,
                endDate: null
            });
            setLinkDropdownValue(value);
            return;
        }

        setLinkStatsDate({
            startDate: null,
            endDate: null
        })

        const packets = {
            dateValue: value
        }
        linkStatsCall(packets);
    }

    const linkStatsCall = useCallback((packets) => {

        setAnimate(true);
        setIsLoading(true);

        getLinkStats(packets)
        .then((data) => {
            if (data["success"]) {
                hasFetchedRef.current = true;
                setTimeout(() => {
                    setLinkStats(data["linkStats"])
                    setDeletedStats(data["deletedStats"]);
                    setLinkStats(data["linkStats"] ?? [])
                    setLinkTotals(data["linkTotals"] ?? null);
                    setDeletedStats(data["deletedStats"] ?? []);
                    setDeletedTotals(data["deletedTotals"] ?? null);
                }, 500)
            }

        }).finally(() => {
            setTimeout(() => {
                setAnimate(false)
                setIsLoading(false);
            }, 500)
        });
    }, [setDeletedStats, setDeletedTotals, setIsLoading, setLinkStats, setLinkTotals])

    useEffect(() => {
        if (isActive && !hasFetchedRef.current) {
            linkStatsCall({ currentDay: true });
        }

    },[isActive, linkStatsCall])

    return (
        <div className={`stats_wrap my_row ${isActive ? '' : '!hidden'}`}>
            <Filters
                handleDateChange={handleDateChange}
                startDate={linkStatsDate.startDate}
                endDate={linkStatsDate.endDate}
                handleDropdownChange={handleDropdownChange}
                dropdownValue={linkDropdownValue}
                getStats={linkStatsCall}
                tab={tab}
            />
            <div className="table_wrap my_row table-responsive">
                <Table
                    isLoading={isLoading}
                    animate={animate}
                    totals={linkTotals}
                    data={linkStats}
                    columns={columns}
                />
            </div>
            <div className="table_wrap my_row table-responsive">
                <Table
                    isLoading={isLoading}
                    animate={animate}
                    totals={deletedTotals}
                    data={deletedStats}
                    columns={deletedColumns}
                />
            </div>
        </div>
    )
}

export default LinkStats
