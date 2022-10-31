import React, { useState } from "react";
import { Popover, Box } from "@mantine/core";
import { BsList, BsX } from "react-icons/bs";
import { MdSearch as SearchIcon } from "react-icons/md";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DragDrop } from "../../../features/shared/DragDrop";

interface Column {
  visible: boolean;
  columnName: string;
  id: string;
}

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

  return (
    <div className="flex flex-row items-center">
      <Popover
        opened={showColumnMenu}
        onClose={() => setShowColumnMenu(false)}
        width={360}
        position="bottom-end"
        transition="scale"
        withArrow
      >
        <Popover.Target>
          <button
            onClick={() => {
              setShowColumnMenu(!showColumnMenu);
              setColumnSearchTerm("");
            }}
          >
            <Box
              className={`border-1 border-base p-2.5 rounded-md mx-2 mt-3 hover:cursor-pointer`}
            >
              {!showColumnMenu ? <BsList /> : <BsX size={"17px"} />}
            </Box>
          </button>
        </Popover.Target>
        <Popover.Dropdown>
          <div className={`w-fit bg-white rounded-md`}>
            {columnListOrder.length > 0 && (
              <div className={`p-1 bg-white items-center`}>
                <div
                  className={`flex flex-row h-10 items-center border-1 border-black rounded-md`}
                >
                  {columnSearchTerm.length === 0 && (
                    <span
                      className={`flex flex-row absolute ml-2 text-xs pointer-events-none italic`}
                    >
                      <div className={`mt-0.5 ml-2 mr-2`}>
                        <SearchIcon />
                      </div>
                      Search...
                    </span>
                  )}
                  <input
                    className={`p-1 w-11/12 border-none text-base focus:outline-none h-4 text-sm`}
                    type="text"
                    value={columnSearchTerm}
                    onChange={(e) => setColumnSearchTerm(e.target.value)}
                  />
                  {columnSearchTerm.length > 0 && (
                    <button onClick={() => setColumnSearchTerm("")}>
                      <BsX size={"16px"} />
                    </button>
                  )}
                </div>
                <div
                  className={`flex flex-row w-80 mb-1 border-b-2 border-dotted`}
                >
                  <button
                    className={`text-xs my-1`}
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
                    columnSearchTerm={columnSearchTerm}
                  />
                </DndProvider>
              </div>
            )}
          </div>
        </Popover.Dropdown>
      </Popover>
    </div>
  );
};

export default DND;
