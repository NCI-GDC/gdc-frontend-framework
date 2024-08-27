import { Tooltip, Text, TextInput, ActionIcon } from "@mantine/core";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import ColumnOrdering from "./ColumnOrdering";
import { MdClose, MdSearch } from "react-icons/md";
import { Table } from "@tanstack/react-table";

interface TableHeaderProps<TData> {
  additionalControls?: React.ReactNode;
  tableTitle?: React.ReactNode;
  search?: {
    enabled: boolean;
    placeholder?: string;
    defaultSearchTerm?: string;
    tooltip?: string;
  };
  showControls?: boolean;
  handleChange: (params: {
    newSearch?: string;
    newPageSize?: string;
    newPageNumber?: number;
  }) => void;
  table: Table<TData>;
  columnOrder: string[];
  setColumnOrder: (order: string[]) => void;
  baseZIndex?: number;
}

function TableHeader<TData>({
  additionalControls,
  tableTitle,
  search,
  showControls,
  handleChange,
  table,
  columnOrder,
  setColumnOrder,
  baseZIndex,
}: TableHeaderProps<TData>) {
  const [searchTerm, setSearchTerm] = useState(search?.defaultSearchTerm ?? "");
  const [searchFocused, setSearchFocused] = useState(false);
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (search?.defaultSearchTerm) {
      inputRef?.current?.focus();
    }
  }, [search?.defaultSearchTerm]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      handleChange({ newSearch: newSearchTerm.trim() });
    }, 400);
  };

  const handleClearClick = () => {
    setSearchTerm("");
    clearTimeout(timeoutRef.current);
    handleChange({ newSearch: "" });
  };

  const TooltipContainer = search?.tooltip
    ? (children) => (
        <Tooltip
          multiline
          label={search.tooltip}
          position="bottom-start"
          opened={searchFocused}
          zIndex={baseZIndex + 1} // needs to be higher z-index when in a modal
          offset={0}
          classNames={{
            tooltip:
              "w-72 border border-base-lighter absolute bg-white p-2 text-nci-gray text-sm  overflow-wrap break-all rounded-b rounded-t-none font-content",
          }}
        >
          {children}
        </Tooltip>
      )
    : undefined;

  return (
    <div
      className={`flex flex-wrap mb-2 ${
        !additionalControls ? "justify-end" : "justify-between"
      }`}
    >
      {additionalControls && <>{additionalControls}</>}
      <div className="flex flex-wrap gap-y-2 gap-x-4 items-center">
        {tableTitle && (
          <Text className="self-center uppercase text-lg text-left ml-0 lg:ml-auto">
            {tableTitle}
          </Text>
        )}

        {(search?.enabled || showControls) && (
          <div
            className="flex items-center gap-2"
            data-testid="table-options-menu"
          >
            <div className="flex gap-2">
              {search?.enabled && (
                <TextInput
                  leftSection={<MdSearch size={24} aria-hidden="true" />}
                  data-testid="textbox-table-search-bar"
                  placeholder={search.placeholder ?? "Search"}
                  aria-label="Table Search Input"
                  classNames={{
                    input: `border-base-lighter focus:border-2 focus:border-primary${
                      TooltipContainer ? " focus:rounded-b-none" : ""
                    }`,
                    wrapper: "xl:w-72",
                  }}
                  size="sm"
                  rightSection={
                    searchTerm.length > 0 && (
                      <ActionIcon
                        onClick={handleClearClick}
                        className="border-0"
                      >
                        <MdClose aria-label="clear search" />
                      </ActionIcon>
                    )
                  }
                  value={searchTerm}
                  onChange={handleInputChange}
                  ref={inputRef}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  inputContainer={TooltipContainer}
                />
              )}
              {showControls && (
                <ColumnOrdering
                  table={table}
                  handleColumnOrderingReset={() => {
                    table.resetColumnVisibility();
                    table.resetColumnOrder();
                  }}
                  columnOrder={columnOrder}
                  setColumnOrder={setColumnOrder}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TableHeader;
