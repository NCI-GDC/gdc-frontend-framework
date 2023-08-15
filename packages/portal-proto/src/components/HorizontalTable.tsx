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
        className="text-primary-content px-4"
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
  customContainerStyles?: string;
  slideImageDetails?: boolean;
  customDataTestID?: string;
}
export const HorizontalTable = ({
  tableData,
  customContainerStyles,
  slideImageDetails = false,
  customDataTestID,
}: HorizontalTableProps): JSX.Element => {
  const containerClassName =
    "bg-base-lightest w-full text-left text-base-contrast-lightest font-content font-medium drop-shadow-sm border-1 border-base-lighter text-sm";
  const updatedContainerClassName = customContainerStyles
    ? containerClassName + ` ${customContainerStyles}`
    : containerClassName;

  return (
    <table data-testid={customDataTestID} className={updatedContainerClassName}>
      <tbody>
        {tableData.map((obj, rowIndex: number): JSX.Element => {
          return (
            <tr
              key={`row-${obj.headerName}`}
              className={
                rowIndex % 2
                  ? "bg-primary-content-max"
                  : "bg-primary-content-lightest"
              }
            >
              <th
                className={`w-4/12 align-top px-2 ${
                  !slideImageDetails && "py-2.5"
                } border-base-lighter border-1 whitespace-nowrap font-semibold font-heading`}
                key={`head-${obj.headerName}`}
              >
                {obj.headerName}
              </th>
              {obj.values.map((value, index): JSX.Element => {
                const tdObject = (item: string | JSX.Element): JSX.Element => {
                  return (
                    <td
                      key={`${obj.headerName}-${index}`}
                      className="border-1 border-base-lighter px-2 font-content-noto font-normal"
                    >
                      {item}
                    </td>
                  );
                };
                switch (typeof value) {
                  case "undefined":
                    return tdObject("");
                  case "object":
                    if (Array.isArray(value) && value.length > 1) {
                      //collapsible list
                      return tdObject(
                        <CollapsableTableItems
                          expandBtnText={`${obj.headerName}s`}
                          keyId={`${obj.headerName}-${index}`}
                          values={value}
                        />,
                      );
                    }
                    if (React.isValidElement(value)) {
                      return tdObject(value);
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
