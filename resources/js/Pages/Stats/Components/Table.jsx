import React, {useMemo, useState} from 'react';
import {HiMinusSm, HiOutlinePlusSm} from 'react-icons/hi';
import {FaSort, FaSortDown, FaSortUp} from 'react-icons/fa';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender
} from '@tanstack/react-table';

const Table = ({
                   totals = null,
                   isLoading,
                   animate,
                   data,
                   columns
}) => {

    const [openIndex, setOpenIndex] = useState([]);

    const defaultColumn = useMemo(
        () => ({
            cell: info => info.getValue(),
        }),
        []
    );

    const tableInstance = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        defaultColumn,
    });

    const headerGroups = tableInstance.getHeaderGroups();
    const rows = tableInstance.getRowModel().rows;
    const leafColumns = tableInstance.getVisibleLeafColumns();

    const getTotalForColumn = (column, columnIndex) => {
        if (columnIndex === 0) {
            return column.columnDef.meta?.totalLabel ?? 'Totals';
        }

        const totalKey = column.columnDef.meta?.totalKey;

        if (!totals || !totalKey) {
            return null;
        }

        if (!Object.prototype.hasOwnProperty.call(totals, totalKey)) {
            return null;
        }

        const format = column.columnDef.meta?.format;
        let value = totals[totalKey];

        if (value === null || value === undefined) {
            return null;
        }

        if (format === 'currency') {
            const normalizedValue = typeof value === 'number' ? value.toString() : String(value ?? '').trim();
            value = normalizedValue.startsWith('$') ? normalizedValue : `$${normalizedValue}`;
        }

        if (format === 'count') {
            const countLabel = column.columnDef.meta?.countLabel ?? '';
            value = `${value}${countLabel ? ` ${countLabel}` : ''}`;
        }

        return value;
    };
    const handleRowClick = (rowIndex) => {

        if(openIndex.includes(rowIndex)) {
            const newArrayIndex = openIndex.filter(element => element !== rowIndex)
            setOpenIndex(newArrayIndex)
        } else {
            const newArrayIndex = openIndex.concat(rowIndex);
            setOpenIndex(newArrayIndex);
        }
    }

    return (
        <table className="w-full table rounded-t-sm table-borderless">
            <thead>
            {headerGroups?.map(headerGroup => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                        <th key={header.id}>
                            <h5>
                                <span>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </span>
                                {header.column.getCanSort() && (
                                    <span
                                        onClick={header.column.getToggleSortingHandler()}
                                        className="sorting-icon"
                                    >
                                      {header.column.getIsSorted()
                                          ? header.column.getIsSorted() === 'desc'
                                              ? <FaSortDown />
                                              : <FaSortUp />
                                          : <FaSort />}
                                    </span>
                                )}
                            </h5>
                        </th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody>

            {data?.length < 1 ?
                <tr>
                    <td className={ isLoading ? "hidden no_stats" : "no_stats"} colSpan="5"><h3>No Stats Available</h3></td>
                </tr>
                :
                <>
                    {rows?.map((row, index) => {
                        return (
                            <React.Fragment key={row.id}>
                                <tr className={row.original?.length > 0 ? 'no_border' : ''}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id}>
                                            {['Offer', 'Current Icons', 'Past Icons'].includes(cell.column.columnDef.header) ? (
                                                <img src={cell.getValue()} alt="" />
                                            ) : (
                                                <p
                                                    className={`
                                                    ${animate ? 'animate hide' : 'animate'}
                                                  `}
                                                >
                                                    {cell.column.columnDef.header === 'Payout' && '$'}
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </p>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                {row.original?.length > 0 && (
                                    <tr>
                                        <td colSpan="5">
                                            <table className="table table-borderless user_stats w-full">
                                                <thead>
                                                <tr onClick={() => handleRowClick(index)}>
                                                    <th scope="col">
                                                        <h5>Stats By Publisher</h5>
                                                    </th>
                                                    <th scope="col"></th>
                                                    <th scope="col"></th>
                                                    <th scope="col"></th>
                                                    <th scope="col">
                                                        {openIndex.includes(index) ? <HiMinusSm /> : <HiOutlinePlusSm />}
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody className={openIndex.includes(index) ? 'open' : ''}>
                                                {row.original.map((user, userIndex) => {
                                                    const {
                                                        name,
                                                        rawCount,
                                                        uniqueCount,
                                                        conversionCount,
                                                        payout,
                                                    } = user;

                                                    return (
                                                        <tr key={`${row.id}-${userIndex}`}>
                                                            <td>
                                                                <p
                                                                    className={`
                                      ${animate ? 'animate hide' : 'animate'}
                                    `}
                                                                >
                                                                    {name}
                                                                </p>
                                                            </td>
                                                            <td>
                                                                <p
                                                                    className={`
                                      ${animate ? 'animate hide' : 'animate'}
                                    `}
                                                                >
                                                                    {rawCount}
                                                                </p>
                                                            </td>
                                                            <td>
                                                                <p
                                                                    className={`
                                      ${animate ? 'animate hide' : 'animate'}
                                    `}
                                                                >
                                                                    {uniqueCount}
                                                                </p>
                                                            </td>
                                                            <td>
                                                                <p
                                                                    className={`
                                      ${animate ? 'animate hide' : 'animate'}
                                    `}
                                                                >
                                                                    {conversionCount}
                                                                </p>
                                                            </td>
                                                            <td>
                                                                <p
                                                                    className={`
                                      ${animate ? 'animate hide' : 'animate'}
                                    `}
                                                                >
                                                                    ${payout}
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        )
                    })}

                    {totals && leafColumns.length > 0 && (
                        <tr className="totals">
                            {leafColumns.map((column, columnIndex) => {
                                const totalValue = getTotalForColumn(column, columnIndex);

                                return (
                                    <td key={`total-${columnIndex}`}>
                                        {totalValue !== null && totalValue !== undefined && totalValue !== '' ? (
                                            <h3 className={`${animate ? 'animate hide' : 'animate'}`}>
                                                {totalValue}
                                            </h3>
                                        ) : columnIndex === 0 ? (
                                            <h3 className={`${animate ? 'animate hide' : 'animate'}`}>
                                                {getTotalForColumn(column, columnIndex)}
                                            </h3>
                                        ) : null}
                                    </td>
                                );
                            })}
                        </tr>
                    )}
                </>
            }
            </tbody>
        </table>
    );
};

export default Table;
