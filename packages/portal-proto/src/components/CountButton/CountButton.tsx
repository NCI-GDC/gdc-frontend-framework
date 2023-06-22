import { Badge, Loader, Tooltip } from "@mantine/core";
import React from "react";

export const CountButton = ({
  tooltipLabel,
  disabled,
  handleOnClick,
  count,
  loading = false,
}: {
  tooltipLabel: string;
  disabled: boolean;
  handleOnClick: () => void;
  count: number;
  loading?: boolean;
}): JSX.Element => {
  return (
    <Tooltip label={tooltipLabel} withArrow>
      <span>
        <button
          className="w-fit"
          disabled={disabled}
          onClick={handleOnClick}
          aria-label={tooltipLabel}
        >
          <Badge
            variant="outline"
            radius="xs"
            className={`${disabled ? "bg-base-lighter" : "bg-base-max"} w-20`}
            color={disabled ? "base" : "primary"}
          >
            {loading ? (
              <Loader size="xs" />
            ) : count !== undefined ? (
              count.toLocaleString()
            ) : undefined}
          </Badge>
        </button>
      </span>
    </Tooltip>
  );
};
