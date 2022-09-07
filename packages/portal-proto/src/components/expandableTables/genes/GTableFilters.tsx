import React from "react";
import {
  MdArrowDropDown as DropDownIcon,
  MdSearch as SearchIcon,
} from "react-icons/md";

interface GTableFiltersProps {
  search: string;
  handleSearch: (term: string) => void;
  columnOrder: string[];
  handleColumnChange: (newColumnOrder: string[]) => void;
}

export const GTableFilters: React.VFC<GTableFiltersProps> = ({
  search,
  handleSearch,
  columnOrder,
  handleColumnChange,
}: GTableFiltersProps) => {
  return (
    <div
      className={`flex flex-row w-full h-12 p-2 mt-2 border-1 border-black bg-white items-center rounded`}
    >
      <div>
        <SearchIcon />
        <input
          className={`p-2 w-11/12 border-none italic text-base`}
          type="text"
          placeholder={`Search...`}
          value={search}
          onChange={() => handleSearch}
        />
      </div>
    </div>
  );
};
