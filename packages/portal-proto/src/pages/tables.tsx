import { NextPage } from "next";
import React from "react";
import { FixedSizeList } from "react-window";
import { useTable, useBlockLayout } from 'react-table'


const TablesPage: NextPage = () => {

    const columns = React.useMemo(
        () => [
            {
                Header: 'Index',
                accessor: (row, i) => i,
            },
            {
                Header: 'Case',
                columns: [
                    {
                        Header: 'Type',
                        accessor: 'type',
                    },
                    {
                        Header: 'Level',
                        accessor: 'level',
                    },
                ],
            },
            {
                Header: 'Data',
                columns: [
                    {
                        Header: 'Age',
                        accessor: 'age',
                        width: 80,
                    },
                    {
                        Header: 'Visits',
                        accessor: 'visits',
                        width: 80,
                    },
                    {
                        Header: 'Status',
                        accessor: 'status',
                        width: 200
                    },
                    {
                        Header: 'Random',
                        accessor: 'random',
                    },
                ],
            },
        ],
        []
    );
    const getData = (n) => {
        const dataArr = [];
        for (let i = 0; i < n; i++) {
            let statusChance = Math.random();
            dataArr.push(
                {
                    type: "asdf",
                    level: "fghj",
                    age: Math.round(Math.random() * 1000),
                    visits: Math.round(Math.random() * 1000),
                    random: Math.round(Math.random() * 1000),
                    status: statusChance >= 0.50 ? 'Primary' : 'Secondary'
                }
            )
        }
        return dataArr
    }

    const fakeData = React.useMemo(() => getData(10000), []);

    const Table = ({ columns, data }) => {

        const defaultColumn = React.useMemo(
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
            totalColumnsWidth,
            prepareRow,
        } = useTable(
            {
                columns,
                data,
                defaultColumn,
            },
            useBlockLayout
        );

        const RenderRow = React.useCallback(
            ({ index, style }) => {
                const row = rows[index]
                prepareRow(row)
                return (
                    <div
                        {...row.getRowProps({
                            style,
                        })}
                        className="tr"
                    >
                        {row.cells.map(cell => {
                            return (
                                <div {...cell.getCellProps()} className="td rounded-sm">
                                    {cell.render('Cell')}
                                </div>
                            )
                        })}
                    </div>
                )
            },
            [prepareRow, rows]
        )
        // border-separate border-bottom-2 border-blue-200 rounded-sm
        return (
            <div className="p-10">
                <div {...getTableProps()} className="table inline-block">
                    <div>
                        {headerGroups.map(headerGroup => (
                            <div {...headerGroup.getHeaderGroupProps()} className="tr"> 
                                {headerGroup.headers.map(column => (
                                    <div {...column.getHeaderProps()} className="th">
                                        {column.render('Header')}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div {...getTableBodyProps()}>
                        <FixedSizeList
                            height={500}
                            itemCount={rows.length}
                            itemSize={40}
                            width={totalColumnsWidth}
                        >
                            {RenderRow}
                        </FixedSizeList>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <>
            <Table columns={columns} data={fakeData}></Table>
        </>
    )
}

export default TablesPage;