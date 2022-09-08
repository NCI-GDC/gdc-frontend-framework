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
}

const DND: React.VFC<DNDProps> = ({
  showColumnMenu,
  setShowColumnMenu,
  handleColumnChange,
  columnListOrder,
}: DNDProps) => {
  return (
    <div className="flex flex-row float-right mb-4">
      <Popover
        opened={showColumnMenu}
        onClose={() => setShowColumnMenu(false)}
        width={260}
        position="bottom"
        transition="scale"
        withArrow
      >
        <Popover.Target>
          <Box
            className={`mr-0 ml-auto border-1 border-base-lighter p-3`}
            onClick={() => setShowColumnMenu(!showColumnMenu)}
          >
            <BsList></BsList>
          </Box>
        </Popover.Target>
        <Popover.Dropdown>
          <div className={`w-fit`}>
            {columnListOrder.length > 0 && showColumnMenu && (
              <div className={`mr-0 ml-auto`}>
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
