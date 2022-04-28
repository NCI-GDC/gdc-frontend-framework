import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useTable, useBlockLayout } from 'react-table';
import { FixedSizeList as List } from "react-window";
import _ from "lodash";
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DragDrop from "./DragDrop";

const VerticalTable = ({ tableData, tableFunc, customCellKeys, customGridMapping, sortableOptions, selectableRow = false }) => {
    const [columnListOptions, setColumnListOptions] = useState([]);

    const [headings, setHeadings] = useState([]);

    const updateColumnHeadings = () => {
        const filteredColumnList = columnListOptions.filter((item) => item.visible);
        const headingOrder = filteredColumnList.map((item) => {
            return headings[headings.findIndex((find) => find.accessor === item.columnName)]
        });
        return headingOrder
    }

    const tableColumns = useMemo(() => updateColumnHeadings(), [columnListOptions]);

    const initializeColumns = () => {
        const keysArr = Object.keys(tableData[0]);
        const columnHeadings = keysArr.map(k => {
            return customCellKeys.includes(k) ? customGridMapping(k) : {
                "Header": _.startCase(k),
                "accessor": k,
                "width": (tableData[0][k].length < 10 || typeof tableData[0][k] === 'number') ? 70 : 180,
            }
        });
        const columnOpts = keysArr.map((k, idx) => {
            return {
                id: idx,
                columnName: k,
                visible: true
            }
        });
        
        setHeadings(columnHeadings);
        setColumnListOptions(columnOpts);
    }

    useEffect(() => {
        initializeColumns();
    }, []);

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
        <>
            {columnListOptions.length > 0 && (<DndProvider backend={HTML5Backend}>
                <DragDrop listOptions={columnListOptions} handleColumnChange={handleColumnChange} />
            </DndProvider>)}
            {columnListOptions.length > 0 && (<Table columns={tableColumns} data={tableData}></Table>)}
        </>
    )
}

export default VerticalTable;