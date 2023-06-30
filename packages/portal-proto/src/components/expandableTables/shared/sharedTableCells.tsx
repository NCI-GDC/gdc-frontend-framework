import { Text, Tooltip } from "@mantine/core";
import { animated } from "@react-spring/web";

export const TableHeader = ({
  title,
  tooltip,
  className,
}: {
  title: string;
  tooltip?: string;
  className?: string;
}): JSX.Element => {
  return (
    <div className={className}>
      <Tooltip
        disabled={!tooltip}
        label={<Text className="whitespace-pre-line text-left">{tooltip}</Text>}
        width={200}
        multiline
        withArrow
        transition="fade"
        transitionDuration={200}
        position="bottom-start"
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
  tooltip?: string;
}): JSX.Element => {
  return (
    <animated.div
      className={`flex justify-start font-content ${
        anchor
          ? `text-activeColor underline hover:cursor-pointer font-bold`
          : ``
      }`}
    >
      <Tooltip label={tooltip} disabled={!tooltip}>
        <span>
          {row.original[`${accessor}`] ? row.original[`${accessor}`] : ""}
        </span>
      </Tooltip>
    </animated.div>
  );
};
