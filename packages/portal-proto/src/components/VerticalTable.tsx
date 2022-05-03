import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useTable, useBlockLayout } from 'react-table';
import { FixedSizeList as List } from "react-window";
import _ from "lodash";
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DragDrop from "./DragDrop";
import { useMeasure } from "react-use";
import { BsList } from "react-icons/bs";

const VerticalTable = ({ tableData, tableFunc, customCellKeys, customGridMapping, selectableRow = false }) => {
    const [columnListOptions, setColumnListOptions] = useState([]);
    const [headings, setHeadings] = useState([]);
    const [ref, { width }] = useMeasure();
    const [showColumnMenu, setShowColumnMenu] = useState(false);

    const updateColumnHeadings = () => {
        const filteredColumnList = columnListOptions.filter((item) => item.visible);
        const headingOrder = filteredColumnList.map((item) => {
            return headings[headings.findIndex((find) => find.accessor === item.columnName)]
        });
        headingOrder.forEach((heading) => {
            heading.width = width / headingOrder.length > 100 ? width / headingOrder.length : 100
        });
        return headingOrder
    }

    const tableColumns = useMemo(() => updateColumnHeadings(), [columnListOptions, width]);

    const initializeColumns = () => {
        const keysArr = Object.keys(tableData[0]);
        const columnHeadings = keysArr.map((key) => {
            return customCellKeys.includes(key) ? customGridMapping(key) : {
                "Header": _.startCase(key),
                "accessor": key,
                "width": width / keysArr.length > 100 ? width / keysArr.length : 100
            }
        });
        const columnOpts = keysArr.map((key, idx) => {
            return {
                id: idx,
                columnName: key,
                visible: true
            }
        });
        setHeadings(columnHeadings);
        setColumnListOptions(columnOpts);
    }

    useEffect(() => {
        if (tableData && tableData.length > 0) initializeColumns();
    }, [width, tableData]);

    const handleColumnChange = (update) => {
        setColumnListOptions(update);
    }

    const tableAction = (action) => {
        action.visibleColumns.push((columns) => [
            {
                id: "Checkbox",
                Header: "",
                Cell: ({ row }) => (
                    <input type="checkbox" />
                ),
                "width": 30
            },
            ...columns
        ])
    };

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
            useBlockLayout,
            selectableRow ? tableAction : null
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
                        className={`tr ${index % 2 === 1 ? "bg-gray-300" : 'bg-white'}`}
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
                    <div className="bg-gray-200">
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
        <div ref={ref}>
            <div className={`w-max float-right`}>{columnListOptions.length > 0 && showColumnMenu && (
                <div className={`mr-0 ml-auto`}>
                    <DndProvider backend={HTML5Backend}>
                        <DragDrop listOptions={columnListOptions} handleColumnChange={handleColumnChange} />
                    </DndProvider></div>)}
                    <div className={`flex flex-row w-max float-right mb-4`}>
                    <input className={`mr-2 rounded-sm border-1 border-gray-300`} type="search" placeholder="Search"/>
                    <div className={`mt-px`}>
                    <button className={`mr-0 ml-auto border-1 border-gray-300 p-3`} onClick={() => setShowColumnMenu(!showColumnMenu)}><BsList></BsList></button>
                    </div>
                    </div>
                </div>
            {columnListOptions.length > 0 && (<Table columns={tableColumns} data={tableData}></Table>)}
        </div>
    )
}

export default VerticalTable;