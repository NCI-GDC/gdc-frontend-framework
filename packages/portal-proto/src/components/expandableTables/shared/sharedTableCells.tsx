import { animated } from "react-spring";
import { Text, Tooltip } from "@mantine/core";

export const TableHeader = ({
  title,
  tooltip,
  className,
}: {
  title: string;
  tooltip: string;
  className?: string;
}): JSX.Element => {
  return (
    <div className={className}>
      <Tooltip
        label={<Text className="text-xs whitespace-pre-line">{tooltip}</Text>}
        disabled={!tooltip?.length}
        width={300}
        withArrow
        arrowSize={6}
        transition="fade"
        transitionDuration={200}
        multiline
        classNames={{
          tooltip:
            "bg-base-lightest text-base-contrast-lightest font-heading text-left",
        }}
      >
        <div className="font-heading text-left text-xs whitespace-pre-line">
          {title}
        </div>
      </Tooltip>
    </div>
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
