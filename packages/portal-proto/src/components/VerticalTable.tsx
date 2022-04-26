import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTable, useBlockLayout } from 'react-table';
import { FixedSizeList as List } from "react-window";
import _ from "lodash";
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DragDrop from "./DragDrop";

const VerticalTable = ({ tableData, tableFunc, customCellKeys, customGridMapping, sortableOptions, selectableRow = false }) => {
    const [allColumnListOptions, setAllColumnListOptions] = useState([]);
    const [columnListOptions, setColumnListOptions] = useState([]);
    const [headings, setHeadings] = useState([]);

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
                columnName: k
            }
        });
        setHeadings(columnHeadings);
        setColumnListOptions(columnOpts);
        setAllColumnListOptions(columnOpts);
    }

    useEffect(() => {
        initializeColumns();
    }, []);

    const updateColumnHeadings = () => {
        const headingOrder = columnListOptions.map((item) => {
            return headings[headings.findIndex((find) => find.accessor === item.columnName)]
        });
        return headingOrder
    }
    const tableColumns = useMemo(() => updateColumnHeadings(), [columnListOptions]);

    const handleColumnChange = (update) => {
        const droppedColumn = columnListOptions.filter(item => item.id === update.id)[0];
        const prevColIdx = columnListOptions.map(c => c.id).indexOf(update.id);
        const cl = columnListOptions.slice();

        if (prevColIdx === update.index) {
            return
        } else {
            if (prevColIdx < update.index) {
                const p1 = cl.slice(0, prevColIdx);
                const p2 = cl.slice(prevColIdx + 1, update.index + 1);
                const p3 = [droppedColumn];
                const p4 = cl.slice(update.index + 1, cl.length);
                setColumnListOptions([...p1, ...p2, ...p3, ...p4]);
            } else {
                const p1 = cl.slice(0, update.index);
                const p2 = [droppedColumn];
                const p3 = cl.slice(update.index, prevColIdx);
                const p4 = cl.slice(prevColIdx + 1, cl.length);
                setColumnListOptions([...p1, ...p2, ...p3, ...p4]);
            }
        }
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
            {allColumnListOptions.length > 0 && (<DndProvider backend={HTML5Backend}>
                <DragDrop listOptions={allColumnListOptions} handleColumnChange={handleColumnChange} />
            </DndProvider>)}
            {columnListOptions.length > 0 && (<Table columns={tableColumns} data={tableData}></Table>)}
        </>
    )
}

export default VerticalTable;