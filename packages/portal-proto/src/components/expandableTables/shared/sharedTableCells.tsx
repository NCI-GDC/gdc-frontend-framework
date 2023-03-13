import { Text, Tooltip } from "@mantine/core";
import { animated } from "@react-spring/web";

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
        <div className="font-heading text-left text-sm whitespace-pre-line">
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
    <animated.div
      className={`flex justify-start font-content ${
        anchor
          ? `text-activeColor underline hover:cursor-pointer font-bold`
          : ``
      }`}
    >
      <Tooltip label={`${tooltip}`} disabled={!tooltip?.length}>
        <span>
          {row.original[`${accessor}`] ? row.original[`${accessor}`] : ""}
        </span>
      </Tooltip>
    </animated.div>
  );
};
