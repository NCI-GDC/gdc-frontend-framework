import { Badge, Loader, Tooltip } from "@mantine/core";
import React from "react";

/**
 * A Button component that displays a count in a badge,
 * has a tooltip, and can be disabled.
 * If loading is true, the badge will be replaced with a loader.
 * @param tooltipLabel - The label for the tooltip.
 * @param disabled - Whether the button is disabled.
 * @param handleOnClick  - The function to call when the button is clicked.
 * @param count - The count to display in the badge.
 * @param loading - Whether to show the loading icon.
 * @category Buttons
 */
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
