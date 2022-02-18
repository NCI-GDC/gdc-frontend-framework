import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTable, useBlockLayout } from 'react-table';
import { FixedSizeList as List } from "react-window";
import _ from "lodash";

const HorizontalTable = (inputData) => {
    const [arrayData, setArrayData] = useState(inputData.inputData);

    const tableData = useMemo(() => [...arrayData], [arrayData]);

    const generateColumnHeadings = (obj) => {
        const columnHeadings = [];
        const keysArr = Object.keys(obj);
        keysArr.forEach(key => {
            columnHeadings.push({
                "Header": _.startCase(key),
                "accessor": key,
                "width": (obj[key].length < 10 || typeof obj[key] === 'number') ? 100 : 210
            })
        });
        return columnHeadings
    }

    useEffect(() => {
    }, [inputData])

    const tableColumns = useMemo(() => generateColumnHeadings(inputData.inputData[0]), [inputData]);

    const Table = ({ columns, data }) => {

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            page,
            totalColumnsWidth,
            prepareRow
        } = useTable(
            {
                columns,
                data,
            },
            useBlockLayout
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
                        className={`tr ${index % 2 === 1 ? "bg-nci-cyan-lighter" : 'bg-purple-100'}`}
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
                            height={360}
                            itemCount={rows.length}
                            itemSize={60}
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
            <Table columns={tableColumns} data={arrayData}></Table>
        </>
    )
}

export default HorizontalTable;