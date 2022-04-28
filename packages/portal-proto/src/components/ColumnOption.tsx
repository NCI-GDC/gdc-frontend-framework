import { FC, useEffect, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from './ItemTypes'
import type { XYCoord, Identifier } from 'dnd-core';

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}

export interface ColumnProps {
  id: any
  columnName: string
  index: number,
  visible: boolean,
  moveColumn: (dragIndex: number, hoverIndex: number) => void,
  toggleColumn: (update: any) => void
}

interface DragItem {
  index: number
  id: string
  type: string
}

export const ColumnOption: FC<ColumnProps> = ({ id, columnName, visible, index, moveColumn, toggleColumn }) => {

  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { 
      handlerId: Identifier | null
    }
  >({
    accept: ItemTypes.COLUMN,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      const clientOffset = monitor.getClientOffset()

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      moveColumn(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  })
  

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.COLUMN,
    item: () => {
      return { id, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))
  return (
    <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
       <input
        type="checkbox"
        checked={visible}
        onChange={() => toggleColumn(id)}
      />{columnName}
    </div>
  )
}
