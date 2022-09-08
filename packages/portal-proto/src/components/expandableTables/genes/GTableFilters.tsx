import React from "react";
import {
  MdArrowDropDown as DropDownIcon,
  MdSearch as SearchIcon,
} from "react-icons/md";
import DND from "../shared/DND";

interface GTableFiltersProps {
  search: string;
  handleSearch: (term: string) => void;
  columnListOrder: string[];
  handleColumnChange: (newColumnOrder: string[]) => void;
  showColumnMenu: boolean;
  setShowColumnMenu: (s: boolean) => void;
}

export const GTableFilters: React.VFC<GTableFiltersProps> = ({
  search,
  handleSearch,
  columnListOrder,
  handleColumnChange,
  showColumnMenu,
  setShowColumnMenu,
}: GTableFiltersProps) => {
  return (
    <div
      className={`flex flex-row h-12 p-2 mt-2 border-1 border-black bg-white items-center rounded`}
    >
      <div className={`flex flex-row items-center`}>
        <SearchIcon />
        <input
          className={`p-2 w-11/12 border-none italic text-base focus:outline-none`}
          type="text"
          placeholder={`Search...`}
          value={search}
          onChange={() => handleSearch}
        />
      </div>
      <DND
        showColumnMenu={showColumnMenu}
        setShowColumnMenu={setShowColumnMenu}
        handleColumnChange={handleColumnChange}
        columnListOrder={columnListOrder}
      />
    </div>
  );
};
