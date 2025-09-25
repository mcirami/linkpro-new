import React, {useState} from 'react';
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

    const tableInstance = useReactTable({
            data,
            columns,
            getCoreRowModel: getCoreRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            getSortedRowModel: getSortedRowModel(),
    });

    const { headerGroups, rows } = tableInstance.getHeaderGroups();

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
                <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
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
                                        {...header.column.getSortByToggleProps()}
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

            {data.length < 1 ?
                <tr>
                    <td className={ isLoading ? "hidden no_stats" : "no_stats"} colSpan="5"><h3>No Stats Available</h3></td>
                </tr>
                :
                <>
                    {rows?.map((row, index) => {
                        //prepareRow(row);
                        console.log("row", row);
                        //const {icon, rawClicks, uniqueClicks, conversions, payout, userStats} = row;
                        /**/
                        return (
                            <React.Fragment key={index}>
                                <tr {...row.getRowProps()} className={row.original.userStats?.length > 0 ? 'no_border' : ''}>
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
                                {row.original.userStats?.length > 0 && (
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
                                                {row.original.userStats.map((user, userIndex) => {
                                                    const {
                                                        name,
                                                        rawCount,
                                                        uniqueCount,
                                                        conversionCount,
                                                        payout,
                                                    } = user;

                                                    return (
                                                        <tr key={userIndex}>
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

                    {totals && (
                        <tr className="totals">
                            <td>
                                <h3>Totals</h3>
                            </td>
                            <td>
                                <h3 className={`${animate ? 'animate hide' : 'animate'}`}>
                                    {totals['totalRaw']}
                                </h3>
                            </td>
                            <td>
                                <h3 className={`${animate ? 'animate hide' : 'animate'}`}>
                                    {totals['totalUnique']}
                                </h3>
                            </td>
                            <td>
                                <h3 className={`${animate ? 'animate hide' : 'animate'}`}>
                                    {totals['totalConversions']}
                                </h3>
                            </td>
                            <td>
                                <h3 className={`${animate ? 'animate hide' : 'animate'}`}>
                                    ${totals['totalPayout']}
                                </h3>
                            </td>
                        </tr>
                    )}
                </>
            }
            </tbody>
        </table>
    );
};

export default Table;
