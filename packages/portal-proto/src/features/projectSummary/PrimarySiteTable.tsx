import React, { useState, useEffect, useMemo, useCallback } from "react";
import { VariableSizeList as List } from "react-window";
import { useTable, useBlockLayout } from 'react-table'; //useSortBy, 
import { Button } from "../layout/UserFlowVariedPages";
import _ from "lodash";

interface DiseaseType {
    readonly diseaseType: string
}

interface CasesPerCategory {
    readonly dataCategory: string
    readonly cases: number
}

interface PrimarySiteTableProps {
    readonly sites: Array<{
        readonly primarySite: string,
        readonly diseaseTypeArr: Array<DiseaseType>,
        readonly cases: number,
        readonly casesArr: Array<CasesPerCategory>,
        readonly fileCount: number
    }>
}
// const PrimarySiteTable : React.FC<PrimarySiteTableProps> 
// { sites }: PrimarySiteTableProps

const PrimarySiteTable = (sites) => {

    const [typeDisplay, setTypeDisplay] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [primarySites, setPrimarySites] = useState(sites["sites"]);
    const [sorted, setSorted] = useState("asc");
    const [displayedSites, setDisplayedSites] = useState(_(sites["sites"]).slice(0).take(5).value());
    const [filteredSites, setFilteredSites] = useState(sites["sites"]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState([]);
    const [rowHeights, setRowHeights] = useState([]);

    const fetchPrimarySites = async () => {
        // get response from a fetch catch error
        // if response set primary sites to response
    }

    const descendingOrd = (param) => {
        return filteredSites.sort((a, b) => {
            if (a[param] < b[param]) {
                return -1
            } else if (a[param] > b[param]) {
                return 1
            } else {
                return 0
            }
        })
    }

    const ascendingOrd = (param) => {
        return filteredSites.sort((a, b) => {
            if (b[param] < a[param]) {
                return -1
            } else if (b[param] > a[param]) {
                return 1
            } else {
                return 0
            }
        })
    }

    const handleSort = (param) => {
        if (sorted === 'asc') {
            setDisplayedSites(_(ascendingOrd(param)).slice(0).take(5).value())
            setSorted('desc');
            setCurrentPage(1);
        } else if (sorted === 'desc') {
            setDisplayedSites(_(descendingOrd(param)).slice(0).take(5).value())
            setSorted('asc');
            setCurrentPage(1);
        }
    }

    const handlePageChange = (page) => {
        const pageSize = 5;
        setDisplayedSites(_(filteredSites).slice((page - 1) * pageSize).take(pageSize).value());
        setCurrentPage(page);
        initializeTypeDisplay();
        setRowHeights(Array.from({ length: sites["sites"].length }, (_, i) => 80));
    }

    // const handleRowHeightChange = (rowIdx) => {
    //     console.log('currentPage', currentPage);
    //     console.log('currPg * pageSize', 5 * currentPage);
    //     console.log('rowHeights', rowHeights);

    // }

    useEffect(() => {
        initializeTypeDisplay();
        setPrimarySites(sites["sites"]);
        setRowHeights(Array.from({ length: sites["sites"].length }, (_, i) => 80));

        const pageSize = 5;
        const pageCount = primarySites ? Math.ceil(primarySites.length / pageSize) : 0;
        const pageNums = _.range(1, pageCount + 1);
        setPages(pageNums);
        const paginated = _(primarySites).slice(0).take(pageSize).value();
        setDisplayedSites(paginated);
    }, [sites]);

    const handleFilter = (term) => {
        const filtered = sites["sites"].filter(elem => elem.primarySite.toLowerCase().includes(term.toLowerCase()));
        setSearchTerm(term);
        // console.log(sites["sites"].filter(element => element.diseaseArr.includes(e.target.value.toLowerCase()) || element.primarySite.toLowerCase().includes(e.target.value.toLowerCase())))
        // console.log(sites["sites"][0].primarySite.toLowerCase().includes(e.target.value.toLowerCase()));
        // console.log(sites["sites"].filter(elem => elem.primarySite.toLowerCase().includes(e.target.value.toLowerCase())));
        // setPrimarySites(filtered);
        setFilteredSites(filtered);
        setDisplayedSites(_(filtered).slice(0).take(5).value());
        const pageSize = 5;
        const pageCount = filtered ? Math.ceil(filtered.length / pageSize) : 0;
        // if (pageCount === 1) return null;
        const pageNums = _.range(1, pageCount + 1);
        setPages(pageNums);
        setCurrentPage(1);
    }

    // const primaryData = useMemo(() => [...primarySites], [primarySites]);

    const initializeTypeDisplay = () => {
        const bools = new Array(sites["sites"].length).fill(false);
        setTypeDisplay(bools);
    }

    const toggleDisplay = (idx, value, expand) => {
        const space = value.length > 4 ? (10 * value.length) : 10
        if (expand) {
            rowHeights[idx] = rowHeights[idx] + space + 10;
        } else {
            rowHeights[idx] = rowHeights[idx] - space - 10;
        }

        const updateDisplay = [...typeDisplay];
        updateDisplay[idx] = !updateDisplay[idx];
        setTypeDisplay(updateDisplay);
    }

    const iterateDiseaseType = (diseaseArr, idx) => {
        let tableStr = "";
        diseaseArr.forEach(disease => {
            tableStr += disease + ", "
        });
        return tableStr.substring(0, tableStr.length - 2)
    }

    const columns = useMemo(
        () => [
            // {
            //     Header: 'id',
            //     accessor: 'id'
            // },
            {
                Header: 'Primary Site',
                accessor: 'primarySite',
                width: 200
            },
            {
                Header: "Disease Type",
                accessor: 'diseaseType',
                // <span>{iterateDiseaseType(value, i)}</span>
                Cell: ({ value, row }) => (<>
                    {typeDisplay[row.index] && <><button onClick={() => toggleDisplay(row.index, value, false)}><div className="flex flex-row">{iterateDiseaseType(value, row.index)}</div><div className="flex flex-row justify-center">&#9650;</div></button></>}
                    {!typeDisplay[row.index] && <><button onClick={() => toggleDisplay(row.index, value, true)}><div> {value.length} Disease Types <span>&#9660;</span></div></button></>}
                </>),
                width: 425
            },
            {
                Header: 'Cases',
                accessor: 'cases',
                width: 50
            },
            {
                Header: 'Available Data Cases Per Category',
                columns: [
                    {
                        Header: 'Seq',
                        accessor: 'seq',
                        width: 45,
                    },
                    {
                        Header: 'Exp',
                        accessor: 'exp',
                        width: 45,
                    },
                    {
                        Header: 'SNV',
                        accessor: 'snv',
                        width: 45
                    },
                    {
                        Header: 'CNV',
                        accessor: 'cnv',
                        width: 45
                    },
                    {
                        Header: 'Meth',
                        accessor: 'meth',
                        width: 50
                    },
                    {
                        Header: 'Clinical',
                        accessor: 'clinical',
                        width: 70
                    },
                    {
                        Header: 'Bio',
                        accessor: 'bio',
                        width: 45
                    }
                ],
            },
            {
                Header: 'Files',
                accessor: 'files'
            },
            // {
            //     Header: 'Explore',
            //     accessor: 'explore'
            // }
        ],
        [typeDisplay]
    );
    // const [primarySites, setPrimarySites] = useState(sites["sites"]);

    // const fetchPrimarySites = async () => {
    //     // get response from a fetch catch error
    //     // if response set primary sites to response
    // }

    // useEffect(() => {
    //     console.log('sites', sites);
    //     // fetchPrimarySites()
    //     initializeTypeDisplay();
    //     setPrimarySites(sites["sites"]);
    // }, []);



    // const primaryData = useMemo(() => [...primarySites], [primarySites]);


    const handleExplore = (id) => {
        console.log('explore id', id);
    }

    const tableAction = (action) => {
        action.visibleColumns.push((columns) => [
            ...columns,
            {
                id: "Explore",
                Header: "",
                Cell: ({ row }) => (
                    <Button className="mt-1" onClick={() => handleExplore(row.value)}>
                        Explore
                    </Button>
                ),
            },
        ]);
    }


    const Table = ({ columns, data, handleSort, handlePageChange, currPg, rowHeightArr }) => {

        const [currentPage, setCurrentPage] = useState(currPg);

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
            prepareRow
        } = useTable(
            {
                columns,
                data,
                defaultColumn,
            },
            useBlockLayout,
            tableAction
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
                        {row.cells.map((cell, idx) => {
                            return (
                                <div {...cell.getCellProps()} key={`cell-${idx}`} className="td rounded-sm p-1.5 text-center h-7">
                                    {cell.render('Cell')}
                                </div>
                            )
                        })}
                    </div>
                )
            },
            [prepareRow, rows]
        )

        const handleFocus = (param) => {
            setTimeout(() => document.getElementById(param).focus());
        }

        const getItemSize = (index) => {
            return rowHeightArr[index];
        }

        return (
            <div className="p-4">
                <ul className="pagination ml-2 mb-10">
                    {pages.length === 1 ? null :
                        pages.map((page, idx) => (
                            <button key={`page-button-${idx}`} className="page-link p-2" onClick={() => {
                                setCurrentPage(page);
                                handlePageChange(page);
                            }}><span className={`${page === currentPage ? `p-2 border-2 bg-nci-blue text-white` : `p-2 border-2 bg-white text-nci-blue`}`}>{page}</span></button>
                        ))
                    }
                </ul>
                <div {...getTableProps()} className="table inline-block">
                    <div className="bg-white rounded-md">
                        {headerGroups.map((headerGroup, idx) => (
                            <div {...headerGroup.getHeaderGroupProps()} key={`header-${idx}`} className="tr">
                                {headerGroup.headers.map((column, idx) => (
                                    <div {...column.getHeaderProps()} id={column.id} className="th text-black text-center">
                                        {!column.id.includes('placeholder') && <button type="button" key={`button-${column.id}`} onClick={() => {
                                            handleSort(column.id);
                                            handleFocus(column.id);
                                        }
                                        }>{column.render('Header')}</button>}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div {...getTableBodyProps()}>
                        <List
                            height={500}
                            itemCount={rows.length}
                            itemSize={getItemSize}
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
            <div className="mt-8 w-full">
                <input type="text" className="mr-16 p-2 w-1/3 float-right" placeholder="Search By Primary Site or Disease Type" value={searchTerm} onChange={(e) => handleFilter(e.target.value)}></input>
            </div>
            <Table columns={columns} data={displayedSites} handleSort={handleSort} handlePageChange={handlePageChange} currPg={currentPage} rowHeightArr={rowHeights}></Table>
        </>
    )
    // handleRowHeightChange={handleRowHeightChange} 
}

export default PrimarySiteTable;