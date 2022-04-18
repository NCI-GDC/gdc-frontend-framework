import { FC, useState, useCallback, useEffect } from 'react'
import { Column } from './ColumnOption';
import update from 'immutability-helper';

const style = {
  width: 400,
}

export interface ColumnProps {
  id: any
  columnName: string
  index: number
  moveColumn: (dragIndex: number, hoverIndex: number) => void
}


const DragDrop = ({ listOptions }) => {
  
    const [columns, setColumns] = useState([]);

    useEffect(() => {
      console.log('list', listOptions);
      setColumns(listOptions);
    }, [])

    const moveColumn = useCallback((dragIndex: number, hoverIndex: number) => {
      setColumns((prevColumns) =>
        update(prevColumns, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevColumns[dragIndex]],
          ],
        }),
      )
    }, [])

    const renderColumn = useCallback(
      (column:  { id: number, columnName: string }, index: number) => {
        return (
          <Column
            key={column.id}
            index={index}
            id={column.id}
            columnName={column.columnName}
            moveColumn={moveColumn}
          />
        )
      },
      [],
    )

    return (
      <>
        <div style={style}>{columns.map((column, i) => renderColumn(column, i))}</div>
      </>
    )
  }

export default DragDrop;