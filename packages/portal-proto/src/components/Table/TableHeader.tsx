import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Tooltip, TextInput, ActionIcon } from "@mantine/core";
import { MdClose, MdSearch } from "react-icons/md";
import { Table } from "@tanstack/react-table";
import ColumnOrdering from "./ColumnOrdering";
import { useViewportSize } from "@mantine/hooks";
import { XL_BREAKPOINT } from "src/utils";

interface TableHeaderProps<TData> {
  additionalControls?: React.ReactNode;
  tableTotalDetail?: React.ReactNode;
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
  customBreakpoint?: number;
}

const TitleWrapper: React.FC<{ title: React.ReactNode }> = ({ title }) => (
  <div className="uppercase text-lg text-left ml-0 lg:ml-auto gap-x-2">
    {title}
  </div>
);

const TotalDetailWrapper: React.FC<{
  detail: React.ReactNode;
  className?: string;
}> = ({ detail, className = "" }) => (
  <div
    className={`self-center uppercase text-lg text-left ml-0 lg:ml-auto ${className}`}
  >
    {detail}
  </div>
);

const TooltipWrapper: React.FC<{
  children: React.ReactNode;
  tooltip: string;
  searchFocused: boolean;
  baseZIndex: number;
}> = ({ children, tooltip, searchFocused, baseZIndex }) => (
  <Tooltip
    multiline
    label={tooltip}
    position="bottom-start"
    offset={0}
    opened={searchFocused}
    zIndex={baseZIndex + 1} // needs to be higher z-index when in a modal
    classNames={{
      tooltip:
        "w-72 border border-base-lighter absolute bg-white p-2 text-nci-gray text-sm overflow-wrap break-all rounded-b rounded-t-none font-content",
    }}
  >
    {children}
  </Tooltip>
);

const SearchInput: React.FC<{
  searchTerm: string;
  searchFocused: boolean;
  onClear: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  placeholder?: string;
  tooltip?: string;
  baseZIndex?: number;
}> = ({
  searchTerm,
  placeholder,
  tooltip,
  searchFocused,
  baseZIndex,
  onClear,
  onChange,
  onFocus,
  onBlur,
}) => {
  const TooltipContainer = tooltip ? TooltipWrapper : React.Fragment;

  return (
    <TooltipContainer
      tooltip={tooltip}
      baseZIndex={baseZIndex}
      searchFocused={searchFocused}
    >
      <TextInput
        leftSection={<MdSearch size={24} aria-hidden="true" />}
        data-testid="textbox-table-search-bar"
        placeholder={placeholder ?? "Search"}
        aria-label="Table Search Input"
        size="sm"
        rightSection={
          searchTerm.length > 0 && (
            <ActionIcon onClick={onClear} className="border-0">
              <MdClose aria-label="clear search" />
            </ActionIcon>
          )
        }
        value={searchTerm}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        classNames={{
          input: `border-base-lighter focus:border-2 focus:border-primary${
            tooltip ? " focus:rounded-b-none" : ""
          }`,
          wrapper: "xl:w-72",
        }}
      />
    </TooltipContainer>
  );
};

function TableHeader<TData>({
  additionalControls,
  tableTotalDetail,
  tableTitle,
  search,
  showControls,
  handleChange,
  table,
  columnOrder,
  setColumnOrder,
  baseZIndex,
  customBreakpoint,
}: TableHeaderProps<TData>) {
  const [searchTerm, setSearchTerm] = useState(search?.defaultSearchTerm ?? "");
  const [searchFocused, setSearchFocused] = useState(false);
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);
  const shouldShowControls = search?.enabled || showControls;
  const { width } = useViewportSize();

  useEffect(() => {
    if (search?.defaultSearchTerm) {
      inputRef.current?.focus();
    }
  }, [search?.defaultSearchTerm]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      handleChange({ newSearch: newSearchTerm.trim() });
    }, 400);
  };

  const handleClearClick = () => {
    setSearchTerm("");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    handleChange({ newSearch: "" });
  };

  const renderSearchAndControls = () => (
    <div className="flex items-center gap-2" data-testid="table-options-menu">
      {search?.enabled && (
        <SearchInput
          searchTerm={searchTerm}
          placeholder={search?.placeholder}
          tooltip={search?.tooltip}
          searchFocused={searchFocused}
          baseZIndex={baseZIndex}
          onClear={handleClearClick}
          onChange={handleInputChange}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
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
  );

  const breakpoint = customBreakpoint ?? XL_BREAKPOINT;
  let detailClass = "";

  if (tableTitle !== undefined) {
    if (width >= breakpoint && shouldShowControls) {
      detailClass = "ml-auto";
    }
  } else {
    if (width >= breakpoint && additionalControls) {
      detailClass = "ml-auto";
    } else {
      detailClass = "order-first basis-full grow-0 shrink-0 -mb-2";
    }
  }

  return (
    <div
      className={`flex flex-wrap gap-4 items-center mb-2 ${
        !additionalControls && !tableTitle ? "justify-end" : "justify-between"
      }`}
    >
      {tableTitle && (
        <div
          className={
            additionalControls || (shouldShowControls && width < breakpoint)
              ? "basis-full grow-0 shrink-0 -mb-2"
              : ""
          }
        >
          <TitleWrapper title={tableTitle} />
        </div>
      )}
      {additionalControls && additionalControls}
      {tableTotalDetail && (
        <div className={detailClass}>
          <TotalDetailWrapper detail={tableTotalDetail} />
        </div>
      )}
      {shouldShowControls && renderSearchAndControls()}
    </div>
  );
}

export default TableHeader;
