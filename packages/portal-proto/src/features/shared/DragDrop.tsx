import { FC, useState, useCallback, useEffect } from "react";
import { ColumnOption } from "./ColumnOption";
import update from "immutability-helper";

interface DragDropProps {
  listOptions: any;
  handleColumnChange: (columns: any) => void;
  columnSearchTerm: string;
}

export const DragDrop: FC<DragDropProps> = ({
  listOptions,
  handleColumnChange,
  columnSearchTerm,
}: DragDropProps) => {
  const [columns, setColumns] = useState(listOptions);

  useEffect(() => {
    handleColumnChange(columns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      column: {
        id: number;
        columnName: string;
        visible: boolean;
        arrangeable?: boolean;
      },
      index: number,
    ) => {
      return (
        column["columnName"] &&
        typeof column["columnName"] === "string" &&
        column["columnName"]
          .toLowerCase()
          .includes(columnSearchTerm.toLowerCase()) && (
          <ColumnOption
            key={column.id}
            index={index}
            id={column.id}
            columnName={column.columnName}
            moveColumn={moveColumn}
            visible={column.visible}
            toggleColumn={toggleColumn}
            arrangeable={column.arrangeable}
          />
        )
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columns, columnSearchTerm],
  );

  return (
    <>
      <div className="w-full">
        {columns.map((column, i) => renderColumn(column, i))}
      </div>
    </>
  );
};
