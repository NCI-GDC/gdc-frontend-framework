import tw from "tailwind-styled-components";
import { Button } from "@mantine/core";

export type FunctionButtonVariants = "filled" | "subtle" | "header" | "icon";

interface FunctionButtonProps {
  disabled: boolean;
  $variant: FunctionButtonVariants;
}

/**
 * Function button component
 * @param variant - display variant
 * @param disabled - whether the button is disabled
 * @category Buttons
 */
export default tw(Button)<FunctionButtonProps>`
 ${(p: FunctionButtonProps) =>
   p.disabled
     ? "opacity-60 border-opacity-60 text-opacity-60 aria-disabled"
     : null}
${(p: FunctionButtonProps) =>
  p.$variant !== "icon" ? "flex flex-row items-center" : undefined}
${(p: FunctionButtonProps) =>
  p.$variant === "filled" ? "bg-primary text-white" : "bg-white text-primary"}
${(p: FunctionButtonProps) =>
  p.$variant === "header" ? "font-medium text-sm" : "font-heading"}
${(p: FunctionButtonProps) =>
  p.$variant === "subtle"
    ? "border-none"
    : "border border-solid border-primary"}
${(p: FunctionButtonProps) =>
  p.$variant === "filled"
    ? "hover:bg-primary-darker"
    : p.$variant === "header"
    ? "hover:bg-primary-darkest"
    : "hover:bg-primary"}
hover:text-base-max
px-3
md:px-4
${(p: FunctionButtonProps) =>
  p.$variant === "icon" ? "w-8 p-0 h-6" : undefined}
`;
