import { Badge, Tooltip } from "@mantine/core";

export const CountButton = ({
  tooltipLabel,
  disabled,
  handleOnClick,
  count,
}: {
  tooltipLabel: string;
  disabled: boolean;
  handleOnClick: () => void;
  count: number;
}): JSX.Element => {
  return (
    <Tooltip label={tooltipLabel} withArrow>
      <button className="w-fit" disabled={disabled} onClick={handleOnClick}>
        <Badge
          variant="outline"
          radius="xs"
          className={`${disabled ? "bg-base-lighter" : "bg-base-max"} w-20`}
          color={disabled ? "base" : "primary"}
        >
          {count !== undefined ? count.toLocaleString() : undefined}
        </Badge>
      </button>
    </Tooltip>
  );
};
