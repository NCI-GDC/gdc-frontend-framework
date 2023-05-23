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
        <div className="font-heading whitespace-pre-line text-left text-sm">
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
      className={`font-content flex justify-start ${
        anchor
          ? `text-activeColor font-bold underline hover:cursor-pointer`
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
