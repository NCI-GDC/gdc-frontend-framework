import { PropsWithChildren } from "react";
import { Text, Tooltip } from "@mantine/core";

interface ButtonTooltipPros {
  label: string;
  width?: number | "auto";
  comingSoon?: boolean;
}

/**
 * Styled Tooltip for use with buttons
 * @param children - child component to wrap tooltip with
 * @param label - the text label
 * @param width - width of the tooltip. Default: "auto"
 * @param comingSoon - temporary flag to indicate button's functionality is pending
 */
export const ButtonTooltip = ({
  children,
  label,
  width = "auto",
  comingSoon = false,
}: PropsWithChildren<ButtonTooltipPros>) => {
  return (
    <Tooltip
      label={
        <Text className="text-xs whitespace-pre-line">
          {comingSoon ? "Coming soon" : label}
        </Text>
      }
      position="top-start"
      arrowPosition="center"
      disabled={!label?.length}
      width={width}
      withArrow
      arrowSize={6}
      transitionProps={{ duration: 200, transition: "fade" }}
      multiline
    >
      {children}
    </Tooltip>
  );
};
