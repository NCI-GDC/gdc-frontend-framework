import React, { useEffect, useRef, useState } from "react";
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
  const inputRef = useRef(null);
  const [ariaText, setAriaText] = useState("Table Search Input");

  useEffect(() => {
    if (search.length > 0) {
      inputRef?.current.focus();
      setAriaText("You are now viewing the Mutations table filtered by TP53.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex items-center gap-2">
        <TextInput
          icon={<SearchIcon size={24} />}
          placeholder="Search"
          aria-label={ariaText}
          classNames={{
            input:
              "focus:border-primary focus:border-2 focus:drop-shadow-xl border-base-lighter",
            wrapper: "w-72",
          }}
          size="sm"
          rightSection={
            search.length > 0 && (
              <CloseIcon
                onClick={() => handleSearch("")}
                className="cursor-pointer"
                aria-label="clear text"
              />
            )
          }
          ref={inputRef}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <DND
          showColumnMenu={showColumnMenu}
          setShowColumnMenu={setShowColumnMenu}
          handleColumnChange={handleColumnChange}
          columnListOrder={columnListOrder}
          defaultColumns={defaultColumns}
        />
      </div>
    </>
  );
};

export default TableFiltersMantine;
