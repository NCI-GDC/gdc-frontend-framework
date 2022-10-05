import React from "react";
import { Popover, Box } from "@mantine/core";
import { BsList } from "react-icons/bs";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DragDrop } from "../../../features/shared/DragDrop";

interface DNDProps {
  showColumnMenu: any;
  setShowColumnMenu: (s: boolean) => void;
  handleColumnChange: (colUpdate: any) => void; // todo add type
  columnListOrder: any[]; // todo add type
  defaultColumns: any;
}

const DND: React.VFC<DNDProps> = ({
  showColumnMenu,
  setShowColumnMenu,
  handleColumnChange,
  columnListOrder,
  defaultColumns,
}: DNDProps) => {
  return (
    <div className="flex flex-row items-center">
      <Popover
        opened={showColumnMenu}
        onClose={() => setShowColumnMenu(false)}
        width={320}
        position="bottom-end"
        transition="scale"
        withArrow
      >
        <Popover.Target>
          <Box
            className={`border-1 border-base p-2.5 rounded-md mx-2 mt-3`}
            onClick={() => setShowColumnMenu(!showColumnMenu)}
          >
            <BsList></BsList>
          </Box>
        </Popover.Target>
        <Popover.Dropdown>
          <div className={`w-fit bg-white rounded-md`}>
            {columnListOrder && (
              <div>
                <div
                  className={`flex flex-row w-72 mb-1 border-b-2 border-dotted`}
                >
                  <button
                    className={`text-xs mb-1`}
                    onClick={() => {
                      handleColumnChange(defaultColumns);
                      setShowColumnMenu(false);
                    }}
                  >
                    Restore Defaults
                  </button>
                </div>
                <DndProvider backend={HTML5Backend}>
                  <DragDrop
                    listOptions={columnListOrder}
                    handleColumnChange={handleColumnChange}
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
