import tw from "tailwind-styled-components";
import { Button, ButtonProps, Tooltip } from "@mantine/core";
import { forwardRef } from "react";

export type FunctionButtonVariants =
  | "filled"
  | "subtle"
  | "header"
  | "header-subtle"
  | "icon";

interface FunctionButtonProps extends ButtonProps {
  disabled?: boolean;
  $variant?: FunctionButtonVariants;
  ref?: any;
  onClick?: () => void;
  tooltip?: string;
  showTooltip?: boolean;
}

const StyledButton = tw(Button)<FunctionButtonProps>`
 ${(p: FunctionButtonProps) =>
   p.disabled
     ? "opacity-60 border-opacity-60 text-opacity-60 aria-disabled"
     : null}
${(p: FunctionButtonProps) =>
  p.$variant !== "icon" ? "flex flex-row items-center px-3 md:px-4" : undefined}
${(p: FunctionButtonProps) =>
  p.$variant === "filled" ? "bg-primary text-white" : "bg-white text-primary"}
${(p: FunctionButtonProps) =>
  p.$variant === "header-subtle" ? "font-medium text-sm" : "font-heading"}
${(p: FunctionButtonProps) =>
  p.$variant === "subtle"
    ? "border-none"
    : "border border-solid border-primary"}
${(p: FunctionButtonProps) =>
  p.loading !== true
    ? (p.$variant === "filled"
        ? "hover:bg-primary-darker"
        : p.$variant === "header" || p.$variant === "header-subtle"
        ? "hover:bg-primary-darkest"
        : "hover:bg-primary") + " hover:text-base-max"
    : ""}

${(p: FunctionButtonProps) =>
  p.$variant === "icon" ? "w-8 p-0 h-6" : undefined}
`;

/**
 * Function button component
 * @param variant - display variant
 * @param disabled - whether the button is disabled
 * @param tooltip = tooltip text to show
 * @param showTooltip - whether to show the tooltip (defaults to true if tooltip is provided)
 * @category Buttons
 */
const FunctionButton = forwardRef<HTMLButtonElement, FunctionButtonProps>(
  ({ tooltip, showTooltip, ...props }, ref) => {
    const button = <StyledButton ref={ref} {...props} />;

    if (tooltip && (showTooltip ?? true)) {
      return <Tooltip label={tooltip}>{button}</Tooltip>;
    }
    return button;
  },
);

export default FunctionButton;
