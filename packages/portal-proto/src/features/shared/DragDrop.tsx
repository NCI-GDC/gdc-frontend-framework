import { FC, useState, useCallback, useEffect } from "react";
import { ColumnOption } from "./ColumnOption";
import update from "immutability-helper";

interface DragDropProps {
  listOptions: any;
  handleColumnChange: (columns: any) => void;
}

export const DragDrop: FC<DragDropProps> = ({
  listOptions,
  handleColumnChange,
}: DragDropProps) => {
  const [columns, setColumns] = useState(listOptions);

  useEffect(() => {
    handleColumnChange(columns);
  }, [columns]);

  const toggleColumn = (colName: string) => {
    const visibleColumns = columns.map((c) =>
      c.columnName === colName ? { ...c, visible: !c.visible } : c,
    );
    setColumns(visibleColumns);
  };

  const moveColumn = useCallback((dragIndex: number, hoverIndex: number) => {
    setColumns((prevColumns) =>
      update(prevColumns, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevColumns[dragIndex]],
        ],
      }),
    );
  }, []);

  const renderColumn = useCallback(
    (
      column: { id: number; columnName: string; visible: boolean },
      index: number,
    ) => {
      return (
        <ColumnOption
          key={column.id}
          index={index}
          id={column.id}
          columnName={column.columnName}
          moveColumn={moveColumn}
          visible={column.visible}
          toggleColumn={toggleColumn}
        />
      );
    },
    [columns],
  );

  return (
    <>
      <div className="w-70">
        {columns.map((column, i) => renderColumn(column, i))}
      </div>
    </>
  );
};
