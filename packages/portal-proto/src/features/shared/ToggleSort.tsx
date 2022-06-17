import { FC, useState, useCallback, useEffect } from "react";
import { SortOption } from "./SortOption";

interface ToggleSortProps {
  sortListOptions: any;
  handleSortChange: (sorts: any) => void;
}

export const ToggleSort: FC<ToggleSortProps> = ({
  sortListOptions,
  handleSortChange,
}: ToggleSortProps) => {
  const [sorts, setSorts] = useState(sortListOptions);

  const toggleSort = (fieldName: string, parity: string) => {
    // TODO
    //  parity => desc or asc
    // fieldName => field in obj of sortListOptions array
    // setSorts(updated sorts)
  };
  useEffect(() => {
    handleSortChange(sorts);
  }, [sorts]);

  const renderSort = useCallback(
    (sort: { field: string; order: string }, index: number) => {
      return (
        <SortOption
          field={sort.field}
          index={index}
          order={sort.order}
          toggleSort={toggleSort}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sorts],
  );

  return (
    <>
      <div className={`w-70`}>
        {sorts.map((sort, i) => renderSort(sort, i))}
      </div>
    </>
  );
};
