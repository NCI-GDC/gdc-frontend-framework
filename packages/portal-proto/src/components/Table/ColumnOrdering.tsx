import {
  Switch,
  Popover,
  ActionIcon,
  Tooltip,
  TextInput,
  Divider,
} from "@mantine/core";
import { Column, ColumnOrderState, Table } from "@tanstack/react-table";
import { Dispatch, SetStateAction, useState } from "react";
import {
  MdDragIndicator as DragIcon,
  MdOutlineReplay as RevertIcon,
} from "react-icons/md";
import { BsList, BsX } from "react-icons/bs";
import { MdSearch as SearchIcon } from "react-icons/md";
import { isEqual } from "lodash";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function ColumnOrdering<TData>({
  table,
  handleColumnOrderingReset,
  columnOrder,
  setColumnOrder,
}: {
  table: Table<TData>;
  handleColumnOrderingReset: () => void;
  columnOrder: ColumnOrderState;
  setColumnOrder: Dispatch<SetStateAction<ColumnOrderState>>;
}): JSX.Element {
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const disabled =
    isEqual(table.initialState.columnOrder, columnOrder) &&
    isEqual(
      table.initialState.columnVisibility,
      Object.fromEntries(
        Object.entries(table.getState().columnVisibility).filter(
          ([, value]) => !value,
        ),
      ),
    );

  return (
    <DndProvider backend={HTML5Backend}>
      <Popover
        opened={showColumnMenu}
        onChange={setShowColumnMenu}
        data-testid="button-column-selector-box"
        zIndex={10}
        classNames={{
          dropdown: "p-2",
        }}
        position="bottom-end"
      >
        <Popover.Target>
          <Tooltip label="Customize Columns" disabled={showColumnMenu}>
            <span>
              <ActionIcon
                variant="outline"
                size="lg"
                onClick={() => setShowColumnMenu((o) => !o)}
                aria-label="show table menu"
                color="primary"
              >
                {!showColumnMenu ? (
                  <BsList size="1.5rem" />
                ) : (
                  <BsX size="2rem" />
                )}
              </ActionIcon>
            </span>
          </Tooltip>
        </Popover.Target>
        <Popover.Dropdown>
          <div>
            <div className="flex justify-between">
              <span className="font-bold text-primary-darkest tracking-normal">
                Customize Columns
              </span>
              <Tooltip label="Restore defaults" disabled={disabled}>
                <ActionIcon
                  onClick={handleColumnOrderingReset}
                  disabled={disabled}
                >
                  <RevertIcon
                    className={disabled ? "text-base" : "text-primary"}
                    size="1rem"
                  />
                </ActionIcon>
              </Tooltip>
            </div>
            <Divider />
            <TextInput
              value={searchValue}
              onChange={(event) =>
                setSearchValue(event.currentTarget.value.trim())
              }
              placeholder="Filter Columns"
              aria-label="Search input for columns"
              icon={<SearchIcon />}
              className="mb-2 mt-4"
            />

            <List
              columns={table.getAllLeafColumns()}
              searchValue={searchValue}
              columnOrder={columnOrder}
              setColumnOrder={setColumnOrder}
            />
          </div>
        </Popover.Dropdown>
      </Popover>
    </DndProvider>
  );
}

function List<TData>({
  columns,
  searchValue,
  columnOrder,
  setColumnOrder,
}: {
  columns: Column<TData, unknown>[];
  searchValue: string;
  columnOrder: string[];
  setColumnOrder: Dispatch<SetStateAction<ColumnOrderState>>;
}) {
  const moveColumn = (dragIndex: number, hoverIndex: number) => {
    const reorderedColumnOrder = [...columnOrder];
    reorderedColumnOrder.splice(
      hoverIndex,
      0,
      reorderedColumnOrder.splice(dragIndex, 1)[0],
    );
    setColumnOrder(reorderedColumnOrder);
  };

  return (
    <ul>
      {columns
        .filter((column) => {
          // select has something else
          // better way to do it?
          if (typeof column.columnDef.header === "string") {
            return column.columnDef.header
              .toLowerCase()
              .includes(searchValue.toLowerCase());
          } else {
            return column.columnDef.header;
          }
        })
        .map((column, index) => {
          // need to standardize select for all select rows
          return column.id !== "select" ? (
            <ColumnItem
              key={column.id}
              column={column}
              index={index}
              moveColumn={moveColumn}
              isNotLast={index < columns.length - 1}
            />
          ) : (
            <div className="hide" key={column.id} />
          );
        })}
    </ul>
  );
}

function ColumnItem<TData>({
  column,
  index,
  moveColumn,
  isNotLast,
}: {
  column: Column<TData, unknown>;
  index: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  isNotLast: boolean;
}) {
  const [{ isDragging }, drag] = useDrag({
    type: "COLUMN",
    item: { id: column.id, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "COLUMN",
    hover: (item: { id: string; index: number }) => {
      if (item.index !== index) {
        moveColumn(item.index, index);
        item.index = index;
      }
    },
  });

  const o = isDragging ? 0.25 : 1;
  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex justify-between bg-nci-violet-lightest ${
        isNotLast ? "mb-2" : ""
      } p-1 gap-3 h-6 opacity-${o} cursor-move`}
    >
      <div className="flex gap-2 items-center">
        <DragIcon size="1rem" className="text-primary" />
        <span className="text-xs">{column.columnDef.header}</span>
      </div>

      <Switch
        color="accent"
        {...{
          checked: column.getIsVisible(),
          onChange: column.getToggleVisibilityHandler(),
        }}
        aria-label=""
      />
    </div>
  );
}

export default ColumnOrdering;
