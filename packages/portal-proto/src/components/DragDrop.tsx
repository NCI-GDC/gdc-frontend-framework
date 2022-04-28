import { FC, useState, useCallback, useEffect } from 'react'
import { ColumnOption } from './ColumnOption';
import update from 'immutability-helper';

const style = {
  width: 400,
}

export interface ColumnProps {
  id: any
  columnName: string
  index: number
  moveColumn: (dragIndex: number, hoverIndex: number) => void
  handleColumnChange: (update: any) => void
}


const DragDrop = ({ listOptions, handleColumnChange }) => {
  
    const [columns, setColumns] = useState([]);
    const [test, setTest] = useState([]);

    useEffect(() => {
      setColumns(listOptions);
    }, []);

    useEffect(() => {
      if (columns.length > 0) {
        handleColumnChange(columns)
      }
    }, [columns]);

    const moveColumn = useCallback((dragIndex: number, hoverIndex: number) => {
      setColumns((prevColumns) =>
        update(prevColumns, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevColumns[dragIndex]],
          ],
        }),
      )
    }, []);

    const renderColumn = useCallback(
      (column:  { id: number, columnName: string }, index: number) => {
        return (
          <ColumnOption
            key={column.id}
            index={index}
            id={column.id}
            columnName={column.columnName}
            moveColumn={moveColumn}
            // handleColumnChange={handleColumnChange}
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