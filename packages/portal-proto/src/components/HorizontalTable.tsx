import React, { useState } from "react";

export interface CollapsableTableItemsProps {
  readonly expandBtnText: string;
  readonly keyId: string;
  readonly values: ReadonlyArray<string>;
}
export const CollapsableTableItems = (
  props: CollapsableTableItemsProps,
): JSX.Element => {
  const [toggle, setToggle] = useState(true);

  return (
    <>
      <button
        className="text-nci-blue px-4"
        onClick={() => setToggle(!toggle)}
        aria-expanded={!toggle}
      >
        {`${toggle ? "▸" : "▴"} ${props.values.length} ${props.expandBtnText}`}
      </button>
      <ul hidden={toggle} className="w-fit list-disc list-inside">
        {props.values.map((listItem, listIndex: number): JSX.Element => {
          return <li key={`${props.keyId}-${listIndex}`}>{listItem}</li>;
        })}
      </ul>
    </>
  );
};

/**
 * Table that displays headers in left column and data flowing to the right
 */
export interface HorizontalTableProps {
  readonly tableData: {
    readonly headerName: string;
    readonly values: ReadonlyArray<
      string | ReadonlyArray<string> | boolean | number | JSX.Element
    >;
  }[];
  customContainerStyles?: string
}
export const HorizontalTable = ({ tableData, customContainerStyles }: HorizontalTableProps): JSX.Element => {

  const containerClassName = 'bg-white w-full text-left text-nci-gray-darker'

  const updatedContainerClassName = customContainerStyles ? containerClassName + ` ${customContainerStyles}` : containerClassName

  return (
    <table className={updatedContainerClassName}>
      <tbody>
        {tableData.map((obj, rowIndex: number): JSX.Element => {
          return (
            <tr
              key={`row-${obj.headerName}`}
              className={rowIndex % 2 ? "" : "bg-gdc-blue-warm-lightest"}
            >
              <th
                className="w-4/12 align-top pl-1 pr-8 whitespace-nowrap"
                key={`head-${obj.headerName}`}
              >
                {obj.headerName}
              </th>
              {obj.values.map((value, index): JSX.Element => {
                const tdObject = (item: string | JSX.Element): JSX.Element => {
                  return <td key={`${obj.headerName}-${index}`}>{item}</td>;
                };
                switch (typeof value) {
                  case "undefined":
                    return tdObject("");
                  case "object":
                    if (Array.isArray(value) && value.length > 1) {
                      //colapsible list
                      return tdObject(
                        <CollapsableTableItems
                          expandBtnText={`${obj.headerName}s`}
                          keyId={`${obj.headerName}-${index}`}
                          values={value}
                        />,
                      );
                    }
                }
                // if not caught by switch statement
                return tdObject(value.toString());
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
