import React from "react";
import { MdClose as CloseIcon, MdSearch as SearchIcon } from "react-icons/md";
import DND from "./DND";
import { Column } from "./types";
import { TextInput } from "@mantine/core";

interface TableFiltersProps {
  search: string;
  handleSearch: (term: string) => void;
  columnListOrder: Column[];
  handleColumnChange: (columnListOrder: any) => void;
  showColumnMenu: boolean;
  setShowColumnMenu: (s: boolean) => void;
  defaultColumns: Column[];
}

const TableFiltersMantine: React.FC<TableFiltersProps> = ({
  search,
  handleSearch,
  columnListOrder,
  handleColumnChange,
  showColumnMenu,
  setShowColumnMenu,
  defaultColumns,
}: TableFiltersProps) => {
  return (
    <>
      <div className="flex flex-row-reverse items-center">
        <TextInput
          icon={<SearchIcon size={24} />}
          placeholder="Search"
          aria-label="Table Search Input"
          classNames={{
            input: "focus:border-2 focus:drop-shadow-xl",
            wrapper: "w-72",
          }}
          size="sm"
          rightSection={
            search.length > 0 && (
              <CloseIcon
                onClick={() => {
                  handleSearch("");
                }}
                className="cursor-pointer"
              ></CloseIcon>
            )
          }
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
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

export default TableFiltersMantine;
