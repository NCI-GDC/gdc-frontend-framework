import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useTable, useBlockLayout } from 'react-table';
import { FixedSizeList as List } from "react-window";
import _ from "lodash";
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DragDrop from "./DragDrop";
import { useMeasure } from "react-use";

const VerticalTable = ({ tableData, tableFunc, customCellKeys, customGridMapping, selectableRow = false }) => {
    const [columnListOptions, setColumnListOptions] = useState([]);
    const [headings, setHeadings] = useState([]);
    const [ref, { width }] = useMeasure();

    const updateColumnHeadings = () => {
        const filteredColumnList = columnListOptions.filter((item) => item.visible);
        const headingOrder = filteredColumnList.map((item) => {
            return headings[headings.findIndex((find) => find.accessor === item.columnName)]
        });
        headingOrder.forEach((heading) => {
            heading.width =  width / headingOrder.length > 100 ? width / headingOrder.length : 100
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
        initializeColumns();
    }, [width]);

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
        <div ref={ref}>
            {columnListOptions.length > 0 && (<DndProvider backend={HTML5Backend}>
                <DragDrop listOptions={columnListOptions} handleColumnChange={handleColumnChange} />
            </DndProvider>)}
            {columnListOptions.length > 0 && (<Table columns={tableColumns} data={tableData}></Table>)}
        </div>
    )
}

export default VerticalTable;