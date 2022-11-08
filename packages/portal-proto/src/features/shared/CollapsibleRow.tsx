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
        <div className="flex flex-col" key={`${x}-${values.length}-${index}`}>
          {index > 0 ? <Divider /> : null}
          <p className={"text-header text-[0.95em] font-heading font-semibold"}>
            {x}
          </p>
          <div className="columns-4 font-content text-sm  p-4">
            {[...values].sort().map((y) => (
              <div className="flex flex-row items-center" key={y}>
                <Circle
                  size="0.65em"
                  className="text-primary shrink-0 "
                ></Circle>
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

  if (value.length === 0) {
    return <div className="text-left mr-6 w-48">--</div>;
  }

  if (value.length === 1) {
    return (
      <div className="flex flex-row justify-start mr-6  w-48 mr-6">
        {value[0]}
      </div>
    );
  } else {
    return (
      <div className="flex flex-row nowrap justify-between items-center">
        {collapsed ? (
          <div
            onClick={() => handleExpand(row)}
            onKeyDown={createKeyboardAccessibleFunction(() =>
              handleExpand(row),
            )}
            role="button"
            tabIndex={0}
            aria-label="Expand section"
            className="flex flex-row items-center justify-between text-primary cursor-pointer w-full mr-6"
          >
            <span className="whitespace-nowrap">
              {value.length.toLocaleString().padStart(6)} {label}
            </span>
            <DownIcon size="1.25em" className="text-secondary-light mx-2" />
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
            className="flex flex-row items-center justify-between text-primary cursor-pointer w-full mr-6"
          >
            <span className="whitespace-nowrap text-bold">
              <b>
                {value.length.toLocaleString().padStart(6)} {label}
              </b>
            </span>
            <UpIcon size="1.25em" className="text-secondary-light mx-2" />
          </div>
        )}
      </div>
    );
  }
};

export default CollapsibleRow;
