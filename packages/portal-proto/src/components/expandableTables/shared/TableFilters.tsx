import React, { useEffect, useRef, useState } from "react";
import { MdClose as CloseIcon, MdSearch as SearchIcon } from "react-icons/md";
import DND from "./DND";
import { Column } from "./types";
import { TextInput } from "@mantine/core";

interface TableFiltersProps {
  searchTerm: string;
  ariaTextOverwrite?: string;
  handleSearch: (term: string) => void;
  columnListOrder: Column[];
  handleColumnChange: (columnListOrder: any) => void;
  showColumnMenu: boolean;
  setShowColumnMenu: (s: boolean) => void;
  defaultColumns: Column[];
}

const TableFilters: React.FC<TableFiltersProps> = ({
  searchTerm,
  ariaTextOverwrite,
  handleSearch,
  columnListOrder,
  handleColumnChange,
  showColumnMenu,
  setShowColumnMenu,
  defaultColumns,
}: TableFiltersProps) => {
  const inputRef = useRef(null);
  const [ariaText, setAriaText] = useState(
    ariaTextOverwrite ?? "Table Search Input",
  );

  useEffect(() => {
    // only during mount
    if (searchTerm?.length > 0) {
      inputRef?.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center gap-2">
      <TextInput
        icon={<SearchIcon size={24} />}
        data-testid="textbox-table-search-bar"
        placeholder="Search"
        aria-label={ariaText}
        classNames={{
          input:
            "focus:border-primary focus:border-2 focus:border-primary border-base-lighter",
          wrapper: "w-72",
        }}
        size="sm"
        rightSection={
          searchTerm?.length > 0 && (
            <CloseIcon
              onClick={() => {
                handleSearch("");
                if (ariaText !== "Table Search Input")
                  setAriaText("Table Search Input");
              }}
              className="cursor-pointer"
              aria-label="clear text"
            />
          )
        }
        ref={inputRef}
        value={searchTerm}
        onChange={(e) => {
          handleSearch(e.target.value);
          if (ariaText !== "Table Search Input")
            setAriaText("Table Search Input");
        }}
      />
      <DND
        showColumnMenu={showColumnMenu}
        setShowColumnMenu={setShowColumnMenu}
        handleColumnChange={handleColumnChange}
        columnListOrder={columnListOrder}
        defaultColumns={defaultColumns}
      />
    </div>
  );
};

export default TableFilters;
