import { FC, useRef } from "react";

export interface SortProps {
  field: string;
  order: string;
  index: number;
  toggleSort: (fieldName: string, parity: string) => void;
}

export const SortOption: FC<SortProps> = ({
  field,
  order,
  toggleSort,
}: SortProps) => {
  const formatFieldName = (field) => {
    //TODO
    return field;
  };
  return (
    <div className={``}>
      <span className={`text-xs`}>{formatFieldName(field)}</span>
      <input
        className={`mr-2 ml-2`}
        type="checkbox"
        checked={order === "desc"}
        onChange={() => toggleSort(field, order)}
      />
      <input
        className={`mr-2 ml-2`}
        type="checkbox"
        checked={order === "asc"}
        onChange={() => toggleSort(field, order)}
      />
    </div>
  );
};
