import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  IoIosArrowDropdownCircle as DownIcon,
  IoIosArrowDropupCircle as UpIcon,
} from "react-icons/io";
import { FaCircle as Circle } from "react-icons/fa";
import { createKeyboardAccessibleFunction } from "src/utils";
import { Row } from "react-table";
import { Divider } from "@mantine/core";
import {
  TableSubrowData,
  useLazyGetSomaticMutationTableSubrowQuery,
} from "@gff/core";
import { RatioSpring } from "@/components/expandableTables/shared";

const CreateContent = (
  items: Record<string, ReadonlyArray<string> | JSX.Element[]>,
): JSX.Element => {
  console.log({ items });
  return (
    <div className="flex flex-col px-3">
      {Object.entries(items).map(([x, values], index) => {
        console.log({ x, values });
        return (
          <div
            className="flex flex-col p-2"
            key={`${x}-${values.length}-${index}`}
          >
            {index > 0 ? <Divider /> : null}
            <p className="text-[1rem] font-heading font-semibold mb-2">{x}</p>
            <div className="columns-4 font-content text-sm">
              {[...values].sort().map((y, i) => (
                <div className="flex flex-row items-center" key={i}>
                  <Circle size="0.65em" className="text-primary shrink-0" />
                  <p className="pl-2">{y}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const itemRatio = (item: TableSubrowData): number | undefined => {
  const { numerator, denominator } = item;
  const [n, d] = [
    denominator === 0 ? 0 : numerator,
    denominator === 0 ? 1 : denominator,
  ];

  if (denominator === 0) return undefined;
  return n / d;
};

interface TableSubrowDataWithRatio extends TableSubrowData {
  readonly ratio?: number;
}

const SMTableRowExpandableRow = ({
  label,
  row,
  expandedRowTitle,
  mutationId,
}: {
  label: ReactNode;
  row?: Row;
  expandedRowTitle?: string;
  mutationId: string;
}): JSX.Element => {
  const [collapsed, setCollapsed] = useState(true);
  const [trigger, { data }] = useLazyGetSomaticMutationTableSubrowQuery();
  console.log(data);

  const handleExpand = () => {
    const update = {
      ...(row.state.values as Record<string, string[]>),
      [expandedRowTitle]: ["data"],
    };
    setCollapsed(false);
    console.log({ update });
    console.log({ row });
    row.setState((old) => ({
      // add the expanded cell data to the row's state
      ...old,
      expanded: old.expanded + 1,
      values: update,
      content: CreateContent(update), // content to add to the expanded row
    }));
  };

  const handleCollapse = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [expandedRowTitle]: _, ...update } = row.state.values as Record<
      string,
      string[]
    >; // remove value from state

    setCollapsed(true);
    row.setState((old) => ({
      ...old,
      expanded: old.expanded - 1,
      values: update,
      content: CreateContent(update), // update the content
    }));
  };

  return (
    <div className="flex nowrap justify-between items-center w-full">
      {collapsed ? (
        <div
          onClick={handleExpand}
          onKeyDown={createKeyboardAccessibleFunction(handleExpand)}
          role="button"
          tabIndex={0}
          aria-label="Expand section"
          className="flex items-center text-primary cursor-pointer gap-2"
        >
          <DownIcon size="1.25em" className="text-accent" />
          <span className="whitespace-nowrap">{label}</span>
        </div>
      ) : (
        <div
          onClick={handleCollapse}
          onKeyDown={createKeyboardAccessibleFunction(handleCollapse)}
          role="button"
          tabIndex={0}
          aria-label="Collapse section"
          className="flex flex-row items-center justify-right text-primary cursor-pointer w-full"
        >
          <UpIcon size="1.25em" className="text-accent mr-1" />
          <span className="whitespace-nowrap text-bold">
            <b>{label}</b>
          </span>
        </div>
      )}
    </div>
  );
};

export default SMTableRowExpandableRow;
