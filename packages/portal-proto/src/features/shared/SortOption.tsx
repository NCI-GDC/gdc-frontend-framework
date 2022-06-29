import { FC, useRef } from "react";
import _ from "lodash";
import { useToggle } from "@mantine/hooks";
import { BsArrowUpShort, BsArrowDownShort } from "react-icons/bs";

export interface SortProps {
  field: string;
  order: string;
  index: number;
  sortActive: boolean;
  toggleSort: (fieldName: string, parity: string) => void;
}

export interface ToggleProps {
  activated: boolean;
  parity: string;
  field: string;
  toggleSort: (fieldName: string, parity: string) => void;
}

export const ParityToggle: FC<ToggleProps> = ({
  activated,
  field,
  parity,
  toggleSort,
}: ToggleProps) => {
  const [order, toggle] = useToggle(parity, ["desc", "asc"]);

  //${activated ? '' : 'disabled'}
  return (
    <div className={`transition-all`}>
      {order === "desc" ? (
        <button onClick={() => toggleSort(field, parity)}>
          <BsArrowDownShort></BsArrowDownShort>
        </button>
      ) : (
        <button onClick={() => toggleSort(field, parity)}>
          <BsArrowUpShort></BsArrowUpShort>
        </button>
      )}
    </div>
  );
};

export const SortOption: FC<SortProps> = ({
  field,
  order,
  sortActive,
  toggleSort,
}: SortProps) => {
  const formatFieldName = (fieldName) => {
    return _.startCase(fieldName);
  };
  return (
    <div className={`bg-white mb-2 p-1 border-1`}>
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
      <ParityToggle
        field={field}
        activated={sortActive}
        parity={order}
        toggleSort={toggleSort}
      ></ParityToggle>
      <span className={`text-xs`}>{formatFieldName(field)}</span>
    </div>
  );
};
