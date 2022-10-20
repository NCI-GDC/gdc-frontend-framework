import React, { useState } from "react";
import {
  MdKeyboardArrowDown as DownIcon,
  MdKeyboardArrowUp as UpIcon,
} from "react-icons/md";
import { createKeyboardAccessibleFunction } from "src/utils";
import { Stack, Divider, Text } from "@mantine/core";

const CreateContent = (items: Record<string, ReadonlyArray<string>>) => {
  return (
    <Stack>
      {Object.entries(items).map(([x, values], index) => {
        return (
          <div className="flex flex-col" key={`${x}-${values.length}-${index}`}>
            {index > 0 ? <Divider /> : null}
            <p className={"text-header text-sm font-bold"}>{x}</p>
            <div className="columns-4 h-max-96 text-content text-xs p-4">
              <ul className="list-disc">
                {[...values].sort().map((y) => (
                  <span className="flex flex-row items-center" key={y}>
                    <li>{y}</li>
                  </span>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </Stack>
  );
};

const CollapsibleRow = ({
  value,
  label,
  row,
}: {
  value: string[];
  label: string;
  row: any;
}): JSX.Element => {
  const [collapsed, setCollapsed] = useState(true);

  if (value.length === 1) {
    return <>{value[0]}</>;
  } else {
    return (
      <>
        {collapsed ? (
          <span
            onClick={() => {
              const update = {
                ...row.state.values,
                [label]: value,
              };
              setCollapsed(false);
              row.setState((old) => ({
                ...old,
                expanded: old.expanded + 1,
                values: update,
                content: CreateContent(update),
              }));
            }}
            onKeyDown={createKeyboardAccessibleFunction(() => {
              setCollapsed(false);
              row.setState((old) => ({
                ...old,
                expanded: old.expanded + 1,
                contents: value,
              }));
            })}
            role="button"
            tabIndex={0}
            className="flex flex-row nowrap text-primary cursor-pointer flex items-center"
          >
            {value.length} {label} <DownIcon />
          </span>
        ) : (
          <>
            <span
              onClick={() => {
                const { [label]: _, ...update } = row.state.values;

                setCollapsed(true);
                row.setState((old) => ({
                  ...old,
                  expanded: old.expanded - 1,
                  values: update,
                  content: CreateContent(update),
                }));
              }}
              onKeyDown={createKeyboardAccessibleFunction(() => {
                setCollapsed(true);
                row.setState((old) => ({
                  ...old,
                  expanded: old.expanded - 1,
                  content: undefined,
                }));
              })}
              role="button"
              tabIndex={0}
              className="flex flex-row nowrap text-primary cursor-pointer flex items-center"
            >
              {value.length} {label} <UpIcon />
            </span>
          </>
        )}
      </>
    );
  }
};

export default CollapsibleRow;
