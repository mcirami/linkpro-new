import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {getPageStats} from '@/Services/StatsRequests.jsx';
import Filters from './Filters';
import Table from './Table';

const PageStats = ({
                       isActive,
                       pageStats,
                       setPageStats,
                       totals,
                       setTotals,
                       pageStatsDate,
                       setPageStatsDate,
                       pageDropdownValue,
                       setPageDropdownValue,
                       isLoading,
                       setIsLoading,
                       tab
}) => {

    const [animate, setAnimate] = useState(true);
    const hasFetchedRef = useRef(false);

    const columns = useMemo(
        () => [
            {
                id: "page_name",
                header: "Page Name",
                accessorKey: "pageName",
                meta: { totalKey: "count", format: "count", countLabel: "Pages" },
            },
            {
                id: "page_loads",
                header: "Page Loads",
                accessorKey: "visits",
                meta: { totalKey: "visits" },
            },
            {
                id: "icon_clicks",
                header: "Icon Clicks",
                accessorKey: "linkVisits",
                meta: { totalKey: "linkVisits" },
            },
        ],[]
    )

    const handleDateChange = (date, type) => {
        let currentStartDate = null;
        let currentEndDate = null;

        if (type === "start") {
            setPageStatsDate(prevState => ({
                ...prevState,
                startDate: date
            }));
            currentStartDate = date;
            currentEndDate = pageStatsDate.endDate ? pageStatsDate.endDate : null;
        } else {
            setPageStatsDate(prevState => ({
                ...prevState,
                endDate: date
            }));
            currentEndDate = date;
            currentStartDate = pageStatsDate.startDate ? pageStatsDate.startDate : null;
        }

        if (currentStartDate && currentEndDate && (currentStartDate <= currentEndDate)) {

            setPageDropdownValue(0);
            const packets = {
                startDate: Math.round(new Date(currentStartDate) / 1000),
                endDate: Math.round(new Date(currentEndDate) /1000),
            }

            pageStatsCall(packets);
        }
    }

    const handleDropdownChange = (e) => {

        const value = Number(e.target.value);
        setPageDropdownValue(value);

        if (value === 0) {
            setPageStatsDate({
                startDate: null,
                endDate: null
            });
            return;
        }

        setPageStatsDate({
            startDate: null,
            endDate: null
        });

        const packets = {
            dateValue: value
        };

        pageStatsCall(packets);
    }

    const pageStatsCall = useCallback((packets) => {
        setAnimate(true);
        setIsLoading(true);
        getPageStats(packets)
        .then((data) => {
            if (data["success"]) {
                hasFetchedRef.current = true;
                setTimeout(() => {
                    setPageStats(data["stats"] ?? []);
                    setTotals(data["totals"] ?? null);
                }, 500);
            }
        })
        .finally(() => {
            setTimeout(() => {
                setIsLoading(false);
                setAnimate(false);
            }, 500);
        });

    }, [setIsLoading, setPageStats, setTotals]);

    useEffect(() => {

        if (isActive && !hasFetchedRef.current) {
            pageStatsCall({ currentDay: true });
        }
    }, [isActive, pageStatsCall]);

    return (
        <div className={`stats_wrap my_row ${isActive ? '' : '!hidden'}`}>
            <Filters
                handleDateChange={handleDateChange}
                startDate={pageStatsDate.startDate}
                endDate={pageStatsDate.endDate}
                handleDropdownChange={handleDropdownChange}
                dropdownValue={pageDropdownValue}
                getStats={pageStatsCall}
                tab={tab}
            />
            <div className="table_wrap my_row table-responsive">
                <Table
                    isLoading={isLoading}
                    animate={animate}
                    totals={totals}
                    data={pageStats}
                    columns={columns}
                />
            </div>
        </div>
    )
}

export default PageStats
