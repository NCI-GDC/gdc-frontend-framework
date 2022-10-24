import React, { useState } from "react";
import {
  MdKeyboardArrowDown as DownIcon,
  MdKeyboardArrowUp as UpIcon,
} from "react-icons/md";
import { createKeyboardAccessibleFunction } from "src/utils";
import { Row } from "react-table";
import { Divider } from "@mantine/core";

const CreateContent = (
  items: Record<string, ReadonlyArray<string>>,
): JSX.Element => {
  return (
    <div className="flex flex-col transition-transform">
      {Object.entries(items).map(([x, values], index) => (
        <div className="flex flex-col" key={`${x}-${values.length}-${index}`}>
          {index > 0 ? <Divider /> : null}
          <p className={"text-header text-[0.75em] font-semibold"}>{x}</p>
          <div className="columns-4 h-max-96 text-content text-xs p-4">
            <ul className="list-disc">
              {[...values].sort().map((y) => (
                <span className="flex flex-row items-center" key={y}>
                  <li className="marker:text-primary marker:w-2 marker:h-2 text-primary-min">
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
    console.log(row);
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

  if (value.length === 1) {
    return (
      <p className="flex flex-row nowrap justify-start mr-6">{value[0]}</p>
    );
  } else {
    return (
      <div className="flex flex-row nowrap justify-start items-center">
        {collapsed ? (
          <span
            onClick={() => handleExpand(row)}
            onKeyDown={createKeyboardAccessibleFunction(() =>
              handleExpand(row),
            )}
            role="button"
            tabIndex={0}
            className="flex flex-row nowrap justify-end items-center text-primary cursor-pointer "
          >
            {value.length} {label}{" "}
            <DownIcon className="bg-secondary-light rounded mx-2" />
          </span>
        ) : (
          <>
            <span
              onClick={() => handleCollapse(row)}
              onKeyDown={createKeyboardAccessibleFunction(() =>
                handleCollapse(row),
              )}
              role="button"
              tabIndex={0}
              className="flex flex-row nowrap justify-end items-center text-primary cursor-pointer flex justify-end"
            >
              {value.length} {label}{" "}
              <UpIcon className="bg-secondary-light rounded mx-2" />
            </span>
          </>
        )}
      </div>
    );
  }
};

export default CollapsibleRow;
