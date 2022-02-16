import React, { useState, useEffect, useMemo, useCallback } from "react";
import { VariableSizeList as List } from "react-window";
import { useTable, useBlockLayout } from 'react-table';
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


    const getColumnOptions = () => {
        return [
            { id: 1, value: "primarySite", label: "Primary Site" },
            { id: 2, value: "diseaseType", label: "Disease Type" },
            { id: 3, value: "cases", label: "Cases" }
        ]
    };

    // const toggleColumns = (values) => {
    //     setVisibleColumns(values);
    // }

    const handleColumnChange = (visCols) => {
        const filteredColumns = visCols.slice(0, visCols.length - 2);
        // setColumnOrder(filteredColumns.map(d => d.id));
        setInvisibleColumns(['cases']);
    }

    const handleDisplayChange = (num) => {
        setNumOfEntries(displayOptions.filter(op => op.value === num)[0])
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
        setDisplayedSites(_(filteredSites).slice(((page - 1) * numOfEntries.value)).take(numOfEntries.value).value());
        setCurrentPage(page);
        initializeTypeDisplay();
        setRowHeights(Array.from({ length: sites["sites"].length }, (_, i) => 80));
    }

    const handleFocus = (param) => {
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
        setRowHeights(Array.from({ length: sites["sites"].length }, (_, i) => 80));
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
        setFilteredSites(filtered);
        setDisplayedSites(_(filtered).slice(0).take(numOfEntries.value).value());
        const pageCount = filtered ? Math.ceil(filtered.length / numOfEntries.value) : 0;
        const pageNums = _.range(1, pageCount + 1);
        setPages(pageNums);
        setCurrentPage(1);
    }

    const initializeTypeDisplay = () => {
        const bools = new Array(sites["sites"].length).fill(false);
        setTypeDisplay(bools);
    }

    const toggleDisplay = (idx, value, expand, row) => {
        const space = value.length > 4 ? (10 * value.length) : 10
        const updateHeights = rowHeights.slice();
        if (expand) {
            updateHeights[idx] = updateHeights[idx] + space + 10;
            setRowHeights(updateHeights);
        } else {
            updateHeights[idx] = updateHeights[idx] - space - 10;
            setRowHeights(updateHeights);
        }

        const updateDisplay = [...typeDisplay];
        updateDisplay[idx] = !updateDisplay[idx];
        setTypeDisplay(updateDisplay);
        const elementNum = row.id;
        setScrollItem(Number(elementNum) + 1);
    }

    const defaultColumns = [
        {
            Header: 'Primary Site',
            accessor: 'primarySite',
            width: 200
        },
        {
            Header: "Disease Type",
            accessor: 'diseaseType',
            Cell: ({ value, row }) => (<>
                {typeDisplay[row.index] && (<>
                    <button onClick={() => toggleDisplay(row.index, value, false, row)}>
                        <div className="flex flex-row">{convertArrayToString(value)}</div>
                        <div className="flex flex-row justify-center">&#9650;</div>
                    </button></>)}
                {!typeDisplay[row.index] && (<>
                    <button onClick={() => toggleDisplay(row.index, value, true, row)}>
                        <div className="flex flex-row"> {value.length} Disease Types <span>&#9660;</span></div>
                    </button>
                </>)}
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
        }
    ];

    const generateColumns = () => {
        return defaultColumns
    }

    const columns = useMemo(
        () => generateColumns(),
        [typeDisplay]
    );

    const handleExplore = (row) => {
        // console.log(row);
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


    const Table = ({
        columns,
        data,
        handleSort,
        handlePageChange,
        handleDisplayChange,
        currPg,
        rowHeightArr,
        scrollItem,
        invisibleColumns,
        handleColumnChange }) => {

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
        }, [scrollItem, invisibleColumns])

        return (
            <div className="p-2">
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
                <div className="flex flex-row">
                    <input type="text" className="ml-8 mr-8 p-2 w-max h-10 float-left" placeholder="Search By Primary Site or Disease Type" value={searchTerm} onChange={(e) => handleFilter(e.target.value)}></input>
                    <div className="w-30">{displayFilter}</div>
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
}

export default PrimarySiteTable;