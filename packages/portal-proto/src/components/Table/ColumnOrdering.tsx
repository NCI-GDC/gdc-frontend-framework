import { Switch, ActionIcon, Tooltip, TextInput, Divider } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { Column, ColumnOrderState, Table } from "@tanstack/react-table";
import { Dispatch, SetStateAction, useState } from "react";
import { MdDragIndicator as DragIcon } from "react-icons/md";
import { BsList, BsX } from "react-icons/bs";
import { MdSearch as SearchIcon } from "react-icons/md";
import { isEqual } from "lodash";
import { FaUndo as RevertIcon } from "react-icons/fa";
import { humanify } from "@/utils/index";
import { NO_COLUMN_ORDERING_IDS } from "./utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  const ref = useClickOutside(() => setShowColumnMenu(false));

  const isBackToDefaults =
    isEqual(table.initialState.columnOrder, columnOrder) &&
    isEqual(
      table.initialState.columnVisibility,
      Object.fromEntries(
        Object.entries(table.getState().columnVisibility).filter(
          ([, value]) => !value,
        ),
      ),
    );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    console.log({ active, over });

    if (active.id !== over.id) {
      setColumnOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div ref={ref}>
      <Tooltip label="Customize Columns" disabled={showColumnMenu}>
        <span>
          <ActionIcon
            variant="outline"
            size="lg"
            onClick={() => setShowColumnMenu((o) => !o)}
            aria-label="show column change menu button"
            color="primary"
            data-testid="button-column-selector-box"
            className={`${
              showColumnMenu && "border-2 border-primary"
            } hover:bg-primary hover:text-base-max`}
          >
            {!showColumnMenu ? <BsList size="1.5rem" /> : <BsX size="2rem" />}
          </ActionIcon>
        </span>
      </Tooltip>

      {showColumnMenu && (
        <div
          className="w-max absolute bg-base-max z-10 right-3 border-2 border-primary p-2 rounded-md"
          data-testid="column-selector-popover-modal"
        >
          <div className="flex justify-between items-center">
            <span className="font-bold text-primary-darkest tracking-normal">
              Customize Columns
            </span>

            <Tooltip label="Restore defaults" disabled={isBackToDefaults}>
              <span>
                <ActionIcon
                  onClick={handleColumnOrderingReset}
                  className={isBackToDefaults && "invisible"}
                  data-testid="restore-default-icon"
                >
                  <RevertIcon className="text-primary" size="1rem" />
                </ActionIcon>
              </span>
            </Tooltip>
          </div>
          <Divider color="base.2" className="mt-1" />
          <TextInput
            value={searchValue}
            onChange={(event) =>
              setSearchValue(event.currentTarget.value.trim())
            }
            placeholder="Filter Columns"
            aria-label="Search input for columns"
            icon={<SearchIcon />}
            className="mb-2 mt-4"
            data-testid="textbox-column-selector"
          />
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={table.getAllLeafColumns()}
              strategy={verticalListSortingStrategy}
            >
              <List
                columns={table.getAllLeafColumns()}
                searchValue={searchValue}
              />
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}

function List<TData>({
  columns,
  searchValue,
}: {
  columns: Column<TData, unknown>[];
  searchValue: string;
}) {
  console.log({ columns });
  return (
    <ul>
      {columns
        .filter((column) => {
          if (!NO_COLUMN_ORDERING_IDS.includes(column.id)) {
            return humanify({ term: column.id })
              .toLowerCase()
              .includes(searchValue.toLowerCase());
          } else {
            return column.id;
          }
        })
        .map((column, index) => {
          return !NO_COLUMN_ORDERING_IDS.includes(column.id) ? (
            <DraggableColumnItem
              key={column.id}
              column={column}
              isNotLast={index < columns.length - 1}
            />
          ) : (
            <div className="hide" key={column.id} />
          );
        })}
    </ul>
  );
}

function DraggableColumnItem<TData>({
  column,
  isNotLast,
}: {
  column: Column<TData, unknown>;
  isNotLast: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex justify-between items-center bg-nci-violet-lightest ${
        isNotLast ? "mb-2" : ""
      } px-1 py-1.5 gap-4 h-6  cursor-move`}
      data-testid={`column-selector-row-${column.id}`}
    >
      <div className="flex gap-2 items-center">
        <DragIcon size="1rem" className="text-primary" />
        <span className="text-xs text-secondary-contrast-lighter font-medium tracking-normal">
          {humanify({ term: column.id })}
        </span>
      </div>

      <Switch
        color="accent"
        {...{
          checked: column.getIsVisible(),
          onChange: column.getToggleVisibilityHandler(),
        }}
        size="xs"
        aria-label={`toggle column visibility switch button for ${humanify({
          term: column.id,
        })} column`}
        data-testid="switch-toggle"
      />
    </div>
  );
}

export default ColumnOrdering;
