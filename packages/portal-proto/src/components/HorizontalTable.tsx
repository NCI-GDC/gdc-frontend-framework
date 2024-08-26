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
    "bg-base-lightest w-full text-left text-base-contrast-lightest font-content font-medium drop-shadow-sm border-1 border-base-lighter text-sm table-fixed";
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
                className={`w-2/5 align-top px-2 ${
                  !slideImageDetails && "py-2.5"
                } border-base-lighter border-1 whitespace-normal font-semibold font-heading`}
                key={`head-${obj.headerName}`}
                scope="row"
              >
                {obj.headerName}
              </th>
              <td className="w-3/5 border-1 border-base-lighter px-2 font-content-noto font-normal">
                <div className="flex flex-wrap gap-2">
                  {obj.values.map((value, index) =>
                    renderValue(value, obj.headerName, index),
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const renderValue = (
  value: any,
  headerName: string,
  index: number,
): JSX.Element => {
  switch (typeof value) {
    case "undefined":
      return <span key={`${headerName}-${index}`}></span>;
    case "object":
      if (Array.isArray(value) && value.length > 1) {
        return (
          <CollapsableTableItems
            key={`${headerName}-${index}`}
            expandBtnText={`${headerName}s`}
            keyId={`${headerName}-${index}`}
            values={value}
          />
        );
      }
      if (React.isValidElement(value)) {
        return (
          <React.Fragment key={`${headerName}-${index}`}>
            {value}
          </React.Fragment>
        );
      }
    default:
      return <span key={`${headerName}-${index}`}>{value.toString()}</span>;
  }
};
