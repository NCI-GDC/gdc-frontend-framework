import React, { useState, useEffect, useMemo, useCallback } from "react";
import { VariableSizeList as List } from "react-window";
import { useTable, useBlockLayout} from 'react-table'; //useSortBy, useColumnOrder 
import { Button } from "../layout/UserFlowVariedPages";
import _ from "lodash";
import { Select } from "../../components/Select";
import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd';
import { 
    getAscendingOrderArray, 
    getDescendingOrderArray, 
    getAllColumnHeaderOptions, 
    convertArrayToString,
    getDisplayEntryOptions
 } from "./common_utils";

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
    const actualColumns = [
        { id: "1", value: "primarySite", label: "Primary Site" },
        { id: "2", value: "diseaseType", label: "Disease Type" },
        { id: "3", value: "cases", label: "Cases" }
    ];
    const [typeDisplay, setTypeDisplay] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [primarySites, setPrimarySites] = useState(sites["sites"]);
    const [sorted, setSorted] = useState("asc");
    const [displayedSites, setDisplayedSites] = useState(_(sites["sites"]).slice(0).take(5).value());
    const [filteredSites, setFilteredSites] = useState(sites["sites"]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState([]);
    const [rowHeights, setRowHeights] = useState([]);
    const [numOfEntries, setNumOfEntries] = useState({ value: 5, label: "5" });
    const [scrollItem, setScrollItem] = useState(1);
    const [allColumns, setAllColumns] = useState(actualColumns);
    const [invisibleColumns, setInvisibleColumns] = useState([]);
    const [visibleColumns, setVisibleColumns] = useState([]);
    const [displayOptions, setDisplayOptions] = useState(() => getDisplayEntryOptions(sites["sites"].length));

    const fetchPrimarySites = async () => {
        // get response from a fetch catch error
        // if response set primary sites to response
    }

    // const displayOptions = [
    //     { value: 5, label: "5" },
    //     { value: 10, label: "10" },
    //     { value: 20, label: "20" },
    //     { value: 40, label: "40" },
    //     { value: primarySites.length, label: "All" }
    // ];

    const getColumnOptions = () => {
        // console.log('sites', sites);
        return [
            { id: 1, value: "primarySite", label: "Primary Site" },
            { id: 2, value: "diseaseType", label: "Disease Type" },
            { id: 3, value: "cases", label: "Cases" }
        ]
    };

    // const toggleColumns = (values) => {
    //     console.log('inside toggle columns', values);
    //     setVisibleColumns(values);
    // }

    const handleColumnChange = (visCols) => {
        const filteredColumns = visCols.slice(0, visCols.length - 2);
        console.log('visible columns', visCols.slice(0, visCols.length - 2));
        console.log('filteredColumns', filteredColumns);
        // setColumnOrder(filteredColumns.map(d => d.id));
        setInvisibleColumns(['cases']);
    }

    const handleDisplayChange = (num) => {
        setNumOfEntries(displayOptions.filter(op => op.value === num)[0])
        // setDisplayedSites(_(filteredSites).slice(0).take(num).value());
        // console.log(primarySites.slice(0).take(num).value());
        // setDisplayedSites(primarySites.slice(0).take(num).value());
        // const newHeights = rowHeights.slice();

        const displayChange = _(filteredSites).slice(0).take(num).value()
        displayChange.length > 1 ? setDisplayedSites(displayChange) : setDisplayedSites(filteredSites);

        const pageCount = filteredSites ? Math.ceil(filteredSites.length / num) : 0;
        const pageNums = _.range(1, pageCount + 1);
        setPages(pageNums);
        setCurrentPage(1);
        setScrollItem(1);
    }

    const handleSort = (param) => {
        if (sorted === "asc") {
            setDisplayedSites(_(getAscendingOrderArray(param, filteredSites)).slice(0).take(numOfEntries.value).value())
            setSorted("desc");
            setCurrentPage(1);
            setScrollItem(1);
        } else if (sorted === "desc") {
            setDisplayedSites(_(getDescendingOrderArray(param, filteredSites)).slice(0).take(numOfEntries.value).value())
            setSorted("asc");
            setCurrentPage(1);
            setScrollItem(1);
        }
    }

    const handlePageChange = (page) => {
        console.log('page', page);
        console.log('filteredSites', filteredSites);
        console.log('pre display sites', displayedSites);
        setDisplayedSites(_(filteredSites).slice(((page - 1) * numOfEntries.value)).take(numOfEntries.value).value()); // inside slice() -> (page - 1) * numOfEntries.value
        // filteredSites.length - (page * numOfEntries.value)
        console.log('post display sites', displayedSites);
        setCurrentPage(page);
        initializeTypeDisplay();
        setRowHeights(Array.from({ length: sites["sites"].length }, (_, i) => 80));
    }

    const handleFocus = (param) => {
        // console.log('param', param);
        // console.log(document.getElementById(param).focus());
        setTimeout(() => document.getElementById(param).focus());
    }

    const displayFilter = (
        <Select
            label="Number of Displayed Entries"
            inputId="primary-sites-displayed"
            options={displayOptions}
            value={numOfEntries}
            isMulti={false}
            onChange={(e) => {
                handleDisplayChange(e.value)
            }}
        />
    );

    // const columnFilter = (
    //     <Select
    //         label="Displayed Columns"
    //         inputId="columns-displayed"
    //         options={getColumnOptions()}
    //         value={visibleColumns}
    //         isMulti={true}
    //         onChange={(e) => {
    //             toggleColumns(e);
    //         }}
    //     />
    // );

    // const handleRowHeightChange = (rowIdx) => {
    //     console.log('currentPage', currentPage);
    //     console.log('currPg * pageSize', 5 * currentPage);
    //     console.log('rowHeights', rowHeights);
    // }
    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(allColumns);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setAllColumns(items);
    }


    useEffect(() => {
        initializeTypeDisplay();
        setPrimarySites(sites["sites"]);
        getAllColumnHeaderOptions(sites["sites"][0]);
        setRowHeights(Array.from({ length: sites["sites"].length }, (_, i) => 80));

        // const pageSize = 5;
        const pageCount = primarySites ? Math.ceil(primarySites.length / numOfEntries.value) : 0;
        const pageNums = _.range(1, pageCount + 1);
        setPages(pageNums);
        const paginated = _(primarySites).slice(0).take(numOfEntries.value).value();
        setDisplayedSites(paginated);
        resetServerContext();
    }, [sites]);

    const handleFilter = (term) => {
        const filtered = sites["sites"].filter(elem => elem.primarySite.toLowerCase().includes(term.toLowerCase()));
        setSearchTerm(term);
        // console.log(sites["sites"].filter(element => element.diseaseArr.includes(e.target.value.toLowerCase()) || element.primarySite.toLowerCase().includes(e.target.value.toLowerCase())))
        // console.log(sites["sites"][0].primarySite.toLowerCase().includes(e.target.value.toLowerCase()));
        // console.log(sites["sites"].filter(elem => elem.primarySite.toLowerCase().includes(e.target.value.toLowerCase())));
        // setPrimarySites(filtered);
        setFilteredSites(filtered);
        setDisplayedSites(_(filtered).slice(0).take(numOfEntries.value).value());
        const pageCount = filtered ? Math.ceil(filtered.length / numOfEntries.value) : 0;
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

    const toggleDisplay = (idx, value, expand, row) => {
        const space = value.length > 4 ? (10 * value.length) : 10
        // console.log('inside toggle display', rowHeights);
        // console.log('index', idx);
        const updateHeights = rowHeights.slice();
        if (expand) {
            updateHeights[idx] = updateHeights[idx] + space + 10;
            console.log('updateHeights expand', updateHeights);
            setRowHeights(updateHeights);
            // console.log('test', rowHeights.slice(idx));
            // rowHeights[idx] = rowHeights[idx] + space + 10;
            // setRowHeights()
        } else {
            updateHeights[idx] = updateHeights[idx] - space - 10;
            setRowHeights(updateHeights);
        }
        // console.log('after toggle conditional:', rowHeights )

        const updateDisplay = [...typeDisplay];
        updateDisplay[idx] = !updateDisplay[idx];
        setTypeDisplay(updateDisplay);
        const elementNum = row.id;
        console.log('elementNum:', elementNum, 'currentPage:', currentPage, "numOfEntries.value:", numOfEntries.value, 'newScrollResult:', elementNum - ((currentPage - 1) * numOfEntries.value), 'potentialScroll:', (filteredSites.length - elementNum + 1) - ((currentPage - 1) * numOfEntries.value));
        console.log('filteredSites', filteredSites.length);
        setScrollItem(Number(elementNum) + 1); // - ((currentPage - 1) * numOfEntries.value)
    }

    const defaultColumns = [
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
                {typeDisplay[row.index] && <><button onClick={() => toggleDisplay(row.index, value, false, row)}><div className="flex flex-row">{convertArrayToString(value)}</div><div className="flex flex-row justify-center">&#9650;</div></button></>}
                {!typeDisplay[row.index] && <><button onClick={() => toggleDisplay(row.index, value, true, row)}><div className="flex flex-row"> {value.length} Disease Types <span>&#9660;</span></div></button></>}
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
    ];

    const generateColumns = () => {
        return defaultColumns
    }

    const columns = useMemo(
        () => generateColumns(),
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


    const handleExplore = (row) => {
        console.log('explore row', row);
    }

    const tableAction = (action) => {
        action.visibleColumns.push((columns) => [
            ...columns,
            {
                id: "Explore",
                Header: "",
                Cell: ({ row }) => (
                    <Button className="mt-1" onClick={() => handleExplore(row)}>
                        Explore
                    </Button>
                ),
            },
        ]);
    }


    const Table = ({ columns, data, handleSort, handlePageChange, currPg, rowHeightArr, handleDisplayChange, scrollItem, invisibleColumns, handleColumnChange }) => {

        const [currentPage, setCurrentPage] = useState(currPg);

        const defaultColumn = useMemo(
            () => ({
                width: 150,
            }),
            []
        );

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            page,
            totalColumnsWidth,
            prepareRow,
            // setColumnOrder,
            visibleColumns
        } = useTable(
            {
                columns,
                data,
                defaultColumn,
                initialState: {
                    hiddenColumns: invisibleColumns
                }
            },
            useBlockLayout,
            // useColumnOrder,
            tableAction
        );

        const RenderRow = useCallback(
            ({ index, style }) => {
                const row = rows[index]
                // console.log('ROW', row, 'INDEX', index, 'ROWS', rows);
                // console.log('row original ID??', row.original.id);
                prepareRow(row)


                return (
                    <div
                        {...row.getRowProps({
                            style,
                        })}
                        key={`row-id-${row.original.id}`}
                        className={`tr ${index % 2 === 1 ? 'bg-indigo-200' : 'bg-purple-100'}`}
                    >
                        {row.cells.map((cell, idx) => {
                            return (
                                <div {...cell.getCellProps()} className={`td rounded-sm p-1.5 text-center h-7`}>
                                    {cell.render('Cell')}
                                </div>
                            )
                        })}
                    </div>
                )
            },
            [prepareRow, rows]
        )



        const getItemSize = (index) => {
            return rowHeightArr[index];
        }

        let listRef: any = React.createRef();

        useEffect(() => {
            listRef.current.scrollToItem(scrollItem, "smart");
            // console.log('scrollItem', scrollItem);
        }, [scrollItem, invisibleColumns])

        return (
            <div className="p-2">
                {/* <div className="flex flex-row">
                <div className="w-20">{displayFilter}</div>
                {pages.length > 1 && (<><button className="ml-2 mb-8 p-1" id="first-page-button" disabled={currentPage === 1} onClick={() => {
                    setCurrentPage(1);
                    handlePageChange(1);
                    handleFocus("first-page-button");
                }}><span className="text-sm p-2 border-2 bg-white text-nci-blue">{"<<"}</span></button>
                <button className="ml-2 mb-8 p-1" disabled={currentPage === 1} id="previous-page-button" onClick={() => {
                    setCurrentPage(currentPage - 1);
                    handlePageChange(currentPage - 1);
                    handleFocus("previous-page-button");
                }}><span className="text-sm p-2 border-2 bg-white text-nci-blue">{"<"}</span></button></>)}
                <ul className="pagination ml-2 mb-8">
                    {pages.length === 1 ? <ul className="ml-2 mb-10"></ul> :
                            pages.map((page, idx) => (
                            <button id={`page-button-${idx}`} key={`page-key-${idx}`} className="page-link p-2" onClick={() => {
                                setCurrentPage(page);
                                handlePageChange(page);
                                handleFocus(`page-button-${idx}`);
                            }}><span className={`${page === currentPage ? `p-2 border-2 bg-nci-blue text-white` : `p-2 border-2 bg-white text-nci-blue`}`}>{page}</span></button>
                        ))
                    }
                </ul>
                {pages.length > 1 && (<><button id="next-page-button" className="ml-2 mb-8 p-1" disabled={currentPage === pages.length} onClick={() => {
                    setCurrentPage(currentPage + 1);
                    handlePageChange(currentPage + 1);
                    handleFocus("next-page-button");
                }}><span className="text-sm p-2 border-2 bg-white text-nci-blue">{">"}</span></button>
                <button id="last-page-button" className="ml-2 mb-8 p-1" disabled={currentPage === pages.length} onClick={() => {
                    setCurrentPage(pages.length);
                    handlePageChange(pages.length);
                    handleFocus("last-page-button");
                }}><span className="text-sm p-2 border-2 bg-white text-nci-blue">{">>"}</span></button></>)}
                </div> */}
                {/* <button onClick={() => handleColumnChange(visibleColumns)}>Change Column Order</button> */}
                <div {...getTableProps()} className="table inline-block">
                    <div className="bg-white rounded-md">
                        {headerGroups.map((headerGroup, idx) => (
                            <div {...headerGroup.getHeaderGroupProps()} key={`header-${idx}`} className="tr">
                                {headerGroup.headers.map((column, idx) => (
                                    <div {...column.getHeaderProps()} id={column.id} className="th text-black text-center">
                                        {!column.id.includes('placeholder') && <button type="button" id={`sort-button-${column.id}`} key={`button-${column.id}`} onClick={() => {
                                            handleSort(column.id);
                                            handleFocus(`sort-button-${column.id}`);
                                        }
                                        }>{column.render('Header')}</button>}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div id="list-container" {...getTableBodyProps()}>
                        <List
                            height={500}
                            itemCount={rows.length}
                            itemSize={getItemSize}
                            width={totalColumnsWidth}
                            ref={listRef}
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
            <div className="flex flex-row w-max">
                {/* <div className="p-2"></div> */}
                {/* <div className="w-max"> */}
                    <div className="flex flex-row">
                    <input type="text" className="ml-8 mr-8 p-2 w-max h-10 float-left" placeholder="Search By Primary Site or Disease Type" value={searchTerm} onChange={(e) => handleFilter(e.target.value)}></input>
                    <div className="w-30">{displayFilter}</div>
                    {/* <div className="w-30">{columnFilter}</div> */}
                    <div className="flex flex-row">
                        {pages.length > 1 && (<><button className="ml-2 mb-8 p-1" id="first-page-button" disabled={currentPage === 1} onClick={() => {
                            setCurrentPage(1);
                            handlePageChange(1);
                            handleFocus("first-page-button");
                        }}><span className="text-sm p-2 border-2 bg-white text-nci-blue">{"<<"}</span></button>
                            <button className="ml-2 mb-8 p-1" disabled={currentPage === 1} id="previous-page-button" onClick={() => {
                                setCurrentPage(currentPage - 1);
                                handlePageChange(currentPage - 1);
                                handleFocus("previous-page-button");
                            }}><span className="p-2 border-2 bg-white text-nci-blue">{"<"}</span></button></>)}
                        <ul className="w-max ml-2 mb-8">
                            {pages.length === 1 ? <ul className="ml-2 mb-10"></ul> :
                                pages.map((page, idx) => (
                                    <button id={`page-button-${idx}`} key={`page-key-${idx}`} className="page-link p-1" onClick={() => {
                                        setCurrentPage(page);
                                        handlePageChange(page);
                                        handleFocus(`page-button-${idx}`);
                                    }}><span className={`${page === currentPage ? `p-2 border-2 bg-nci-blue text-white` : `p-2 border-2 bg-white text-nci-blue`}`}>{page}</span></button>
                                ))
                            }
                        </ul>
                        {pages.length > 1 && (<><button id="next-page-button" className="ml-2 mb-8 p-1" disabled={currentPage === pages.length} onClick={() => {
                            setCurrentPage(currentPage + 1);
                            handlePageChange(currentPage + 1);
                            handleFocus("next-page-button");
                        }}><span className="text-sm p-2 border-2 bg-white text-nci-blue">{">"}</span></button>
                            <button id="last-page-button" className="ml-2 mb-8 p-1" disabled={currentPage === pages.length} onClick={() => {
                                setCurrentPage(pages.length);
                                handlePageChange(pages.length);
                                handleFocus("last-page-button");
                            }}><span className="p-2 border-2 bg-white text-nci-blue">{">>"}</span></button></>)}
                    </div>
                    {/* </div> */}
                </div>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="column-filter">
                            {(provided) => (
                                <ul className="column-filter" {...provided.droppableProps} ref={provided.innerRef}>
                                    {allColumns.map(({ id, label, value }, index) => {
                                        return (
                                            <Draggable key={id} draggableId={id} index={index}>
                                                {(provided) => (
                                                    <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        {label}
                                                    </li>
                                                )}
                                            </Draggable>
                                        )
                                    })}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>
            </div>
            <Table columns={columns} data={displayedSites} handleSort={handleSort} handlePageChange={handlePageChange} currPg={currentPage} rowHeightArr={rowHeights} handleDisplayChange={handleDisplayChange} scrollItem={scrollItem} invisibleColumns={invisibleColumns} handleColumnChange={handleColumnChange}></Table>
        </>
    )
    // handleRowHeightChange={handleRowHeightChange} 
}

export default PrimarySiteTable;