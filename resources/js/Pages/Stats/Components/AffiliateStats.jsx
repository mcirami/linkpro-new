import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useRef
} from 'react';
import {
    getAffiliateStats,
} from '@/Services/StatsRequests.jsx';
import Filters from './Filters';
import Table from './Table';

const AffiliateStats = ({
                            isActive,
                            affiliateStats,
                            setAffiliateStats,
                            totals,
                            setTotals,
                            statsDate,
                            setStatsDate,
                            dropdownValue,
                            setDropdownValue,
                            filterByValue,
                            setFilterByValue,
                            isLoading,
                            setIsLoading,
                            tab
}) => {

    const [animate, setAnimate] = useState(true);
    const hasFetchedRef = useRef(false);

    const statsUrl = useMemo(() => (
        filterByValue === "offer" ? '/stats/get/offer' : '/stats/get/publisher'
    ), [filterByValue]);

    const offerColumns = useMemo(
        () => [
            {
                id: "offer",
                header: "Offer",
                accessorKey: "icon",
            },
            {
                id: "offer_name",
                header: "Raw Clicks",
                accessorKey: "rawCount",
                meta: { totalKey: "rawCount" },
            },
            {
                id: "unique_clicks",
                header: "Unique Clicks",
                accessorKey: "uniqueCount",
                meta: { totalKey: "uniqueCount" },
            },
            {
                id: "conversions",
                header: "Conversions",
                accessorKey: "conversionCount",
                meta: { totalKey: "conversionCount" },
            },
            {
                id: "payout",
                header: "Payout",
                accessorKey: "payout",
                meta: { totalKey: "payout", format: "currency" },
            },
        ],[]
    )

    const publisherColumns = useMemo(
        () => [
            {
                header: "Publisher",
                accessorKey: "name",
            },
            {
                header: "Raw Clicks",
                accessorKey: "rawCount",
                meta: { totalKey: "rawCount" },
            },
            {
                header: "Unique Clicks",
                accessorKey: "uniqueCount",
                meta: { totalKey: "uniqueCount" },
            },
            {
                header: "Conversions",
                accessorKey: "conversionCount",
                meta: { totalKey: "conversionCount" },
            },
            {
                header: "Payout",
                accessorKey: "payout",
                meta: { totalKey: "payout", format: "currency" },
            },
        ],[]
    )

    const tableTotals = useMemo(() => {
        if (!totals || !affiliateStats?.length) {
            return null;
        }

        return {
            rawCount: totals.totalRaw ?? 0,
            uniqueCount: totals.totalUnique ?? 0,
            conversionCount: totals.totalConversions ?? 0,
            payout: totals.totalPayout ?? 0,
        };
    }, [totals, affiliateStats]);

    const handleDateChange = (date, type) => {

        let currentStartDate;
        let currentEndDate;

        if (type === "start") {
            setStatsDate(prevState => ({
                ...prevState,
                startDate: date
            }));
            currentStartDate = date;
            currentEndDate = statsDate.endDate ? statsDate.endDate : null;

        } else {
            setStatsDate(prevState => ({
                ...prevState,
                endDate: date
            }));
            currentEndDate = date;
            currentStartDate = statsDate.startDate ? statsDate.startDate : null;
        }

        if ( currentEndDate && currentStartDate && (currentStartDate <= currentEndDate) ) {

            setDropdownValue(0);
            const packets = {
                startDate: Math.round(new Date(currentStartDate) / 1000),
                endDate: Math.round(new Date(currentEndDate) /1000),
            }

            getStatsCall(packets, statsUrl)
        }
    }

    const handleDropdownChange = (e) => {
        const value = Number(e.target.value);
        setDropdownValue(value);
        if (value === 0) {
            setStatsDate({
                startDate: null,
                endDate: null
            })

            return;
        }

        setStatsDate({
            startDate: null,
            endDate: null
        })

        const packets = {
            dateValue: value
        }

        getStatsCall(packets, statsUrl);
    }

    const getStatsCall = useCallback((packets, url) => {
        setAnimate(true);
        setIsLoading(true);

        const endpoint = url ?? statsUrl;

        getAffiliateStats(endpoint, packets)
        .then((data) => {
            if (data["success"]) {
                hasFetchedRef.current = true;
                setTimeout(() => {
                    setAffiliateStats(data["affiliateData"])
                    setTotals(data["totals"]);
                }, 500)
            }
        }).finally(() => {
            setTimeout(() => {
                setAnimate(false)
                setIsLoading(false);
            }, 500)
        });

    },[setAffiliateStats, setTotals, setIsLoading, statsUrl]);

    useEffect(() => {

        if (isActive && !hasFetchedRef.current) {
            getStatsCall({ currentDay: true }, statsUrl);
        }

    },[isActive, getStatsCall, statsUrl]);

    return (

        <div className={`stats_wrap my_row ${tab} ${isActive ? '' : '!hidden'}`}>
            <Filters
                handleDateChange={handleDateChange}
                startDate={statsDate.startDate}
                endDate={statsDate.endDate}
                handleDropdownChange={handleDropdownChange}
                dropdownValue={dropdownValue}
                getStats={getStatsCall}
                tab={tab}
                filterByValue={filterByValue}
                setFilterByValue={setFilterByValue}
            />

            <div className="table_wrap my_row table-responsive">

                <Table
                    isLoading={isLoading}
                    animate={animate}
                    totals={tableTotals}
                    data={affiliateStats}
                    columns={filterByValue === "offer" ? offerColumns : publisherColumns}
                />

            </div>
        </div>
    )
};

export default AffiliateStats;
