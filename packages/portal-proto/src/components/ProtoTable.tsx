import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTable, useBlockLayout } from 'react-table';
import { FixedSizeList as List } from "react-window";
import _ from "lodash";
// import { ReactSortable } from "react-sortablejs";
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DragDrop from "./DragDrop";

const ProtoTable = ({ inputData, tableFunc, customCellKeys, customGridMapping, sortableOptions, selectableRow = false }) => {
    const [columnListOptions, setColumnListOptions] = useState([]);
    const tableData = useMemo(() => [...inputData], [inputData]);

    const rearrangeColumns = (columnChange) => {
        console.log('columnList', columnListOptions, 'column change', columnChange);
        setColumnListOptions(columnChange);
    }

    const generateColumnHeadings = (obj, customCellKeys) => {
        const columnHeadings = [];
        const columnList = [];
        const keysArr = Object.keys(obj);
        keysArr.forEach((key, i) => {
            columnList.push({id: i + 1, columnName: key});
            customCellKeys.includes(key) ?
                columnHeadings.push(customGridMapping(key)) :
                columnHeadings.push({
                    "Header": _.startCase(key),
                    "accessor": key,
                    "width": (obj[key].length < 10 || typeof obj[key] === 'number') ? 70 : 180,
                });
        });
        // setColumnListOptions(keysArr);
        setColumnListOptions(columnList);
        console.log('COLUMNLIST', columnList);
        return columnHeadings
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

    useEffect(() => {
        // tableFunc();
    }, [inputData]);

    useEffect(() => {

    }, [selectableRow])


    const tableColumns = useMemo(() => generateColumnHeadings(inputData[0], customCellKeys), [inputData]);

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
            <DndProvider backend={HTML5Backend}>
                <DragDrop listOptions={columnListOptions} />
            </DndProvider>
            <Table columns={tableColumns} data={tableData}></Table>
        </>
    )
}

export default ProtoTable;