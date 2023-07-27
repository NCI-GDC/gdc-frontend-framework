import { PropsWithChildren } from "react";
import { Text, Tooltip } from "@mantine/core";

interface ButtonTooltipPros {
  label: string;
  width?: number | "auto";
  comingSoon?: boolean;
}

/**
 * Styled Tooltip to for buttons
 * @param children - child component to wrap tooltip with
 * @param label - the text label
 * @param width - width of the tooltip. Default: "auto"
 * @param comingSoon - temporary flag to indicate button's functionality is pending
 */
export const ButtonTooltip: React.FC<ButtonTooltipPros> = ({
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
      transition="fade"
      transitionDuration={200}
      multiline
    >
      {children}
    </Tooltip>
  );
};
