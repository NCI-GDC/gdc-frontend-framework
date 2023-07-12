import React, { useState } from "react";
import { Box } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { BsList, BsX } from "react-icons/bs";
import { MdSearch as SearchIcon } from "react-icons/md";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DragDrop } from "@/features/shared/DragDrop";
import { ButtonTooltip } from ".";
import { Column } from "./types";

interface DNDProps {
  showColumnMenu: any;
  setShowColumnMenu: (s: boolean) => void;
  handleColumnChange: (columnUpdate: Column[]) => void;
  columnListOrder: Column[];
  defaultColumns: any;
}

const DND: React.FC<DNDProps> = ({
  showColumnMenu,
  setShowColumnMenu,
  handleColumnChange,
  columnListOrder,
  defaultColumns,
}: DNDProps) => {
  const [columnSearchTerm, setColumnSearchTerm] = useState("");
  const ref = useClickOutside(() => setShowColumnMenu(false));

  useClickOutside;
  return (
    <div
      data-testid="button-column-selector-box"
      className="flex relative"
      aria-label="column change button"
      ref={ref}
    >
      <ButtonTooltip label={!showColumnMenu && "Customize Columns"}>
        <button
          onClick={() => {
            setShowColumnMenu(!showColumnMenu);
            setColumnSearchTerm("");
          }}
          aria-label="show table menu"
        >
          <Box className="border border-primary p-2 rounded-md cursor-pointer text-primary hover:bg-primary hover:text-base-max">
            {!showColumnMenu ? <BsList /> : <BsX size={17} />}
          </Box>
        </button>
      </ButtonTooltip>
      {showColumnMenu && (
        <div
          data-testid="column-selector-popover-modal"
          className="w-fit absolute bg-base-max z-10 py-3 px-4 right-3 top-10 border-1 border-solid border-base-lighter rounded"
        >
          {columnListOrder.length > 0 && (
            <div className="p-1 bg-base-max items-center">
              <div className="flex h-10 items-center border-1 border-black rounded-md">
                {columnSearchTerm.length === 0 && (
                  <span className="flex absolute ml-2 text-xs pointer-events-none font-content">
                    <SearchIcon className="text-[1rem] mr-2" />
                    Search...
                  </span>
                )}
                <input
                  data-testid="textbox-column-selector"
                  className="p-1 w-11/12 border-none text-base focus:outline-none h-4 text-sm"
                  type="search"
                  value={columnSearchTerm}
                  onChange={(e) => setColumnSearchTerm(e.target.value)}
                  aria-label="search table columns"
                />
                {columnSearchTerm.length > 0 && (
                  <button onClick={() => setColumnSearchTerm("")}>
                    <BsX size={"16px"} />
                  </button>
                )}
              </div>
              <div className="flex w-80 mb-1 border-b-2 border-dotted">
                <button
                  className="text-xs my-1"
                  onClick={() => {
                    handleColumnChange(defaultColumns);
                    setShowColumnMenu(false);
                    setColumnSearchTerm("");
                  }}
                >
                  Restore Defaults
                </button>
              </div>
              <DndProvider backend={HTML5Backend}>
                <DragDrop
                  listOptions={columnListOrder}
                  handleColumnChange={handleColumnChange}
                  columnSearchTerm={columnSearchTerm.trim()}
                />
              </DndProvider>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DND;
