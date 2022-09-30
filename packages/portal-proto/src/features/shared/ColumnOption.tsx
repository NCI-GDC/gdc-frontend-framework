import { FC, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import type { XYCoord, Identifier } from "dnd-core";
import _ from "lodash";
import { MdDragIndicator } from "react-icons/md";

export interface ColumnProps {
  id: any;
  columnName: string;
  index: number;
  visible: boolean;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  toggleColumn: (update: any) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const ColumnOption: FC<ColumnProps> = ({
  id,
  columnName,
  visible,
  index,
  moveColumn,
  toggleColumn,
}: ColumnProps) => {
  const formatColumnName = (colName: string) => {
    return _.startCase(colName);
  };

  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    {
      handlerId: Identifier | null;
    }
  >({
    accept: ItemTypes.COLUMN,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveColumn(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.COLUMN,
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const o = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div
      ref={ref}
      className={`cursor-move bg-base-lightest mb-2 p-1 border-1 opacity-${o}`}
      data-handler-id={handlerId}
    >
      <div className={`flex flex-row text-xs justify-between`}>
        <div className={`flex flex-row w-fit`}>
          <div className={`flex flex-row`}>
            <div className={`my-auto mr-1`}>
              <MdDragIndicator />
            </div>
            {formatColumnName(columnName)}
          </div>
        </div>
        <input
          className={`mr-2 ml-2`}
          type="checkbox"
          checked={visible}
          onChange={() => toggleColumn(columnName)}
        />
      </div>
    </div>
  );
};
