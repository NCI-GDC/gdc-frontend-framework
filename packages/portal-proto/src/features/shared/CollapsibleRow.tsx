import React, { useState } from "react";
import {
  IoIosArrowDropdownCircle as DownIcon,
  IoIosArrowDropupCircle as UpIcon,
} from "react-icons/io";
import { createKeyboardAccessibleFunction } from "src/utils";
import { Row } from "react-table";
import { Divider } from "@mantine/core";

const CreateContent = (
  items: Record<string, ReadonlyArray<string>>,
): JSX.Element => {
  return (
    <div className="flex flex-col transition-transform transition-[height] px-3">
      {Object.entries(items).map(([x, values], index) => (
        <div className="flex flex-col" key={`${x}-${values.length}-${index}`}>
          {index > 0 ? <Divider /> : null}
          <p className={"text-header text-[0.95em] font-semibold"}>{x}</p>
          <div className="columns-4 h-max-96 text-content text-xs p-4">
            <ul className="list-disc">
              {[...values].sort().map((y) => (
                <span className="flex flex-row items-center" key={y}>
                  <li className="marker:text-primary text-[1.15em] text-primary-min">
                    {y}
                  </li>
                </span>
              ))}
            </ul>
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
    return <div className="text-right px-8 mr-6">---</div>;
  }

  if (value.length === 1) {
    return <div className="text-right mr-6">{value[0]}</div>;
  } else {
    return (
      <div className="flex flex-row nowrap justify-end items-center">
        {collapsed ? (
          <div
            onClick={() => handleExpand(row)}
            onKeyDown={createKeyboardAccessibleFunction(() =>
              handleExpand(row),
            )}
            role="button"
            tabIndex={0}
            className="flex flex-row whitespace-nowrap items-center justify-between text-primary cursor-pointer"
          >
            <span className="whitespace-nowrap">
              {value.length.toLocaleString()} {label}
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
            className="flex flex-row whitespace-nowrap items-center justify-between text-primary cursor-pointer"
          >
            <span className="whitespace-nowrap text-bold">
              <b>
                {value.length.toLocaleString()} {label}
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
