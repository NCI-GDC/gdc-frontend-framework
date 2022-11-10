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
