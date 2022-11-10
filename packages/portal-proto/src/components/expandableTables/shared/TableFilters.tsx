import React, { useState } from "react";
import { MdSearch as SearchIcon } from "react-icons/md";
import { animated, useSpring } from "react-spring";
import DND from "./DND";

interface TableFiltersProps {
  search: string;
  handleSearch: (term: string) => void;
  columnListOrder: any;
  handleColumnChange: (columnListOrder: any) => void;
  showColumnMenu: boolean;
  setShowColumnMenu: (s: boolean) => void;
  defaultColumns: any;
}

export const TableFilters: React.FC<TableFiltersProps> = ({
  search,
  handleSearch,
  columnListOrder,
  handleColumnChange,
  showColumnMenu,
  setShowColumnMenu,
  defaultColumns,
}: TableFiltersProps) => {
  const [searchToggled, setSearchToggled] = useState(false);
  const inputWidth = 300;

  const searchSpring = useSpring({
    from: { opacity: 0, width: 0 },
    to: { opacity: 1, width: searchToggled ? inputWidth + 8 : 39 },
    immediate: false,
  });

  const inputSpring = useSpring({
    from: { opacity: 0, width: 0 },
    to: { opacity: 1, width: searchToggled ? inputWidth : 0, height: 25 },
    immediate: false,
  });

  return (
    <>
      <div className={`flex flex-row-reverse w-80 w-fit`}>
        <animated.div
          style={searchSpring}
          onMouseLeave={() =>
            setSearchToggled(search.length === 0 ? false : true)
          }
          className={`flex flex-row h-10 p-1 mt-3 border-1 border-black bg-white items-center rounded`}
        >
          {searchToggled && (
            <div className={`flex flex-row items-center`}>
              {search.length === 0 && (
                <span
                  className={`flex flex-row absolute ml-2 text-xs pointer-events-none italic`}
                >
                  <div className={`mt-0.5 ml-1 mr-1`}>
                    <SearchIcon />
                  </div>
                  Search...
                </span>
              )}
              <animated.input
                style={inputSpring}
                className={`p-1 border-none text-base focus:outline-none h-4 text-xs`}
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          )}
          {!searchToggled && (
            <button
              onMouseEnter={() => setSearchToggled(true)}
              onFocus={() => setSearchToggled(true)}
              className={`mt-0.5 ml-1 mr-1 p-0.5`}
            >
              <SearchIcon />
            </button>
          )}
        </animated.div>
      </div>
      <DND
        showColumnMenu={showColumnMenu}
        setShowColumnMenu={setShowColumnMenu}
        handleColumnChange={handleColumnChange}
        columnListOrder={columnListOrder}
        defaultColumns={defaultColumns}
      />
    </>
  );
};
