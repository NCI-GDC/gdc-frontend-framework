import React, { useState } from "react";
import {
  IoIosArrowDropdownCircle as DownIcon,
  IoIosArrowDropupCircle as UpIcon,
} from "react-icons/io";
import { FaCircle as Circle } from "react-icons/fa";
import { createKeyboardAccessibleFunction } from "src/utils";
import { Row } from "react-table";
import { Divider } from "@mantine/core";

const CreateContent = (
  items: Record<string, ReadonlyArray<string>>,
): JSX.Element => {
  return (
    <div className="flex flex-col px-3">
      {Object.entries(items).map(([x, values], index) => (
        <div
          className="flex flex-col p-2"
          key={`${x}-${values.length}-${index}`}
        >
          {index > 0 ? <Divider /> : null}
          <p className="text-[1rem] font-heading font-semibold mb-2">{x}</p>
          <div className="columns-4 font-content text-sm">
            {[...values].sort().map((y) => (
              <div className="flex flex-row items-center" key={y}>
                <Circle size="0.65em" className="text-primary shrink-0" />
                <p className="pl-2">{y}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const CollapsibleRow = ({
  value,
  label,
  row,
}: {
  value: string[];
  label: string;
  row: Row;
}): JSX.Element => {
  const [collapsed, setCollapsed] = useState(true);

  const handleExpand = (row: Row) => {
    const update = {
      ...(row.state.values as Record<string, string[]>),
      [label]: value,
    };
    setCollapsed(false);
    row.setState((old) => ({
      // add the expanded cell data to the row's state
      ...old,
      expanded: old.expanded + 1,
      values: update,
      content: CreateContent(update), // content to add to the expanded row
    }));
  };

  const handleCollapse = (row: Row): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [label]: _, ...update } = row.state.values as Record<
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

  if (value?.length === 0 || !value) {
    return <div className="text-left mr-6 w-48">--</div>;
  }

  if (value?.length === 1) {
    return <div className="flex justify-start mr-6  w-48">{value[0]}</div>;
  } else {
    return (
      <div className="flex nowrap justify-between items-center w-full">
        {collapsed ? (
          <div
            onClick={() => handleExpand(row)}
            onKeyDown={createKeyboardAccessibleFunction(() =>
              handleExpand(row),
            )}
            role="button"
            tabIndex={0}
            aria-label="Expand section"
            className="flex items-center text-primary cursor-pointer gap-2"
          >
            <DownIcon size="1.25em" className="text-accent" />
            <span className="whitespace-nowrap">
              {value?.length.toLocaleString().padStart(6)} {label}
            </span>
          </div>
        ) : (
          <div
            onClick={() => handleCollapse(row)}
            onKeyDown={createKeyboardAccessibleFunction(() =>
              handleCollapse(row),
            )}
            role="button"
            tabIndex={0}
            aria-label="Collapse section"
            className="flex flex-row items-center justify-right text-primary cursor-pointer w-full"
          >
            <UpIcon size="1.25em" className="text-accent mr-1" />
            <span className="whitespace-nowrap text-bold">
              <b>
                {value.length.toLocaleString().padStart(6)} {label}
              </b>
            </span>
          </div>
        )}
      </div>
    );
  }
};

export default CollapsibleRow;
