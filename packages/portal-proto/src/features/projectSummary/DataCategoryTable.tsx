import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { useMeasure } from "react-use";
import { useTable, useBlockLayout } from 'react-table';
import BarStack from "./BarStack";
import { FixedSizeList as List } from "react-window";

const DataCategoryTable = (dataCategories) => {
    // const [ref, { width }] = useMeasure();
    const [categories, setCategories] = useState(dataCategories.dataCategories.categories);
    const [totalCases, setTotalCases] = useState(dataCategories.dataCategories.totalCases);
    const [totalFiles, setTotalFiles] = useState(dataCategories.dataCategories.totalFiles);

    const randomColors = [
        "green",
        "pink",
        "blue",
        "gray",
        "cyan",
        "yellow",
        "seagreen"
    ]

    useEffect(() => {
        setCategories(dataCategories.dataCategories.categories);
        setTotalCases(dataCategories.dataCategories.totalCases);
    }, []);

    const categoryData = useMemo(() => [...categories], [categories]);

    const columns = useMemo(() => [
        {
            Header: "Data Category",
            accessor: "name",
            width: 250
        },
        {
            Header: "Cases",
            accessor: "numCases",
            width: 100
        },
        {
            Header: "Case %",
            accessor: "caseRatio",
            Cell: ({ value, row }) => (<BarStack numFill={value * totalCases} numSpace={(1 - value) * totalCases} color={randomColors[row.index]}></BarStack>)
        },
        {
            Header: "Files",
            accessor: "numFiles",
            width: 100
        },
        {
            Header: "File %",
            accessor: "fileRatio",
            Cell: ({ value, row }) => (<BarStack numFill={value * totalFiles} numSpace={(1 - value) * totalFiles} color={randomColors[row.index]}></BarStack>)
        },
    ], []);

    const Table = ({ columns, data }) => {

        const defaultColumn = useMemo(
            () => ({
                width: 150,
            }),
            []
        )

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            page,
            totalColumnsWidth,
            prepareRow,
            // canPreviousPage,
            // canNextPage,
            // pageOptions,
            // pageCount,
            // gotoPage,
            // nextPage,
            // previousPage,
            // setPageSize,
            // state: { pageIndex, pageSize },
        } = useTable(
            {
                columns,
                data,
                defaultColumn,
            },
            useBlockLayout,
            // useGlobalFilter,
            // useSortBy,
            // usePagination
        );

        const RenderRow = useCallback(
            ({ index, style }) => {
                const row = rows[index]
                prepareRow(row)

                return (
                    <div
                        {...row.getRowProps({
                            style,
                        })}
                        className={`tr ${index % 2 === 1 ? 'bg-indigo-200' : 'bg-purple-100'}`}
                    >
                        {row.cells.map(cell => {
                            return (
                                <div {...cell.getCellProps()} className="td rounded-sm p-1.5 text-center h-7">
                                    {cell.render('Cell')}
                                </div>
                            )
                        })}
                    </div>
                )
            },
            [prepareRow, rows]
        )

        return (
            <div className="p-2">
                <div {...getTableProps()} className="table inline-block">
                    <div className="bg-white rounded-md">
                        {headerGroups.map(headerGroup => (
                            <div {...headerGroup.getHeaderGroupProps()} className="tr">
                                {headerGroup.headers.map(column => (
                                    <div {...column.getHeaderProps()} className="th text-black text-center">
                                        {column.render('Header')}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div {...getTableBodyProps()}>
                        <List
                            height={350}
                            itemCount={rows.length}
                            itemSize={50}
                            width={totalColumnsWidth}
                        >
                            {RenderRow}
                        </List>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <Table columns={columns} data={categoryData}></Table>
        </>
    )
}

export default DataCategoryTable;