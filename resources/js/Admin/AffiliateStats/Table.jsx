import React from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import {FaSort, FaSortDown, FaSortUp} from 'react-icons/fa';
import {isEmpty} from 'lodash';

export const Table = ({
                   isLoading,
                   animate,
                   data,
                   columns,
                   totals
}) => {

    const tableInstance = useReactTable(
        {
            columns,
            data: data ? data : null,
            getCoreRowModel: getCoreRowModel(),
            getSortedRowModel: getSortedRowModel(),

        }
    );

    const { getHeaderGroups, getRowModel } = tableInstance;

    return (
        <table className="table table-borderless">
            <thead>
            {getHeaderGroups().map(headerGroup => (
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
                                {/* Sorting logic */}
                                {header.column.getCanSort() && (
                                    <span
                                        {...header.column.getToggleSortingProps()}
                                        className="sorting-icon">
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
            {isEmpty(data) ?
                <tr>
                    <td className={ isLoading ? "hidden no_stats" : "no_stats"} colSpan="5"><h3>No Stats Available</h3></td>
                </tr>
                :
                <>
                    {getRowModel().rows?.map((row) => {
                        return (
                            <React.Fragment key={row.id}>
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <td key={cell.id}>
                                                {['Offer', 'Current Icons'].includes(
                                                    cell.column.columnDef.header
                                                ) ? (
                                                    <img src={cell.getValue()} alt="" />
                                                ) : (
                                                    <p
                                                        className={`${animate ? 'animate hide' : 'animate'}`}
                                                    >
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </p>
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
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
