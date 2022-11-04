import _ from "lodash";
import { animated } from "react-spring";
import { Tooltip } from "@mantine/core";

export const TableHeader = ({
  title,
  tooltip,
}: {
  title: string;
  tooltip: string;
}): JSX.Element => {
  return (
    <>
      <Tooltip label={tooltip} disabled={!tooltip?.length}>
        <div>{_.startCase(title)}</div>
      </Tooltip>
    </>
  );
};

export const TableCell = ({
  row,
  accessor,
  anchor,
  tooltip,
}: {
  row: any;
  accessor: string;
  anchor: boolean;
  tooltip: string;
}): JSX.Element => {
  return (
    <div>
      <>
        <animated.div
          className={`text-center text-xs ${
            anchor
              ? `text-activeColor underline hover:cursor-pointer font-bold`
              : ``
          }`}
        >
          <Tooltip label={`${tooltip}`} disabled={!tooltip?.length}>
            <div>
              {row.original[`${accessor}`] ? row.original[`${accessor}`] : ""}
            </div>
          </Tooltip>
        </animated.div>
      </>
    </div>
  );
};

export const AffectedCases = ({ ratio }: { ratio }): JSX.Element => {
  const anchorStyles = `font-medium underline hover:cursor-pointer`;
  const textStyles = `text-xs text-activeColor mx-0.5`;
  return (
    <>
      {
        <div className={`flex flex-row w-max m-auto`}>
          <div className={`${textStyles} ${anchorStyles}`}>{ratio[0]}</div>
          <div className={`text-xs mx-0.5`}>{ratio[1]}</div>
          <div className={`${textStyles} ${anchorStyles}`}>{ratio[2]}</div>
        </div>
      }
      <div className={`flex flex-row mx-auto content-center w-max`}>
        {<div className={`text-xs`}>{ratio[3]}</div>}
      </div>
    </>
  );
};
