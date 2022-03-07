import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTable, useBlockLayout } from 'react-table';
import { FixedSizeList as List } from "react-window";
import _ from "lodash";
import { ReactSortable, Sortable } from "react-sortablejs";


const HorizontalTable = ({ inputData, tableFunc, customCellKeys, customGridMapping, sortableOptions, selectableRow = false }) => {
    const [columnListOptions, setColumnListOptions] = useState([]);
    const tableData = useMemo(() => [...inputData], [inputData]);

    const rearrangeColumns = (columnChange) => {
        setColumnListOptions(columnChange);
    }

    const generateColumnHeadings = (obj, customCellKeys) => {
        const columnHeadings = [];
        const keysArr = Object.keys(obj);
        keysArr.forEach(key => {
            customCellKeys.includes(key) ? 
            columnHeadings.push(customGridMapping(key)) : 
            columnHeadings.push({
                "Header": _.startCase(key),
                "accessor": key,
                "width": (obj[key].length < 10 || typeof obj[key] === 'number') ? 70 : 180,
            });
        });
        setColumnListOptions(keysArr);
        return columnHeadings
    }

    const tableAction = (action) => {
        action.visibleColumns.push((columns) => [
            {
                id: "Checkbox",
                Header: "",
                Cell: ({ row }) => (
                    <input type="checkbox"/>
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
              <ReactSortable list={columnListOptions} setList={rearrangeColumns} {...sortableOptions}>
              {columnListOptions.map((option, idx) => (
                <div key={idx}>{option}</div>
                ))}
              </ReactSortable>
            <Table columns={tableColumns} data={tableData}></Table>
        </>
    )
}

export default HorizontalTable;