import tw from "tailwind-styled-components";
import { Button, ButtonProps, Loader, Tooltip } from "@mantine/core";
import { forwardRef } from "react";
import { DownloadIcon } from "@/utils/icons";
import { ADDITIONAL_DOWNLOAD_MESSAGE } from "@/utils/constants";

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
  multilineTooltip?: boolean;
  isActive?: boolean;
  isDownload?: boolean;
  disableResponsiveIcon?: boolean;
  showDownloadIcon?: boolean;
  loaderSize?: number;
  downloadIconSize?: number;
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
  !p.disabled && !p.loading
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
 * @param tooltip - tooltip text to show / for downloads it shows toolip only when isActive is true
 * @param multilineTooltip - show tooltip in multiline
 * @param isActive - shows loader when true
 * @param isDownload - if it should behave as download button
 * @param showDownloadIcon - shows download icon when true (ignored if isActive is true)
 * @param loaderSize - size of the loader (defaults to 16)
 * @param downloadIconSize - size of the download icon (defaults to 16)
 * @category Buttons
 */
const FunctionButton = forwardRef<HTMLButtonElement, FunctionButtonProps>(
  (
    {
      tooltip,
      multilineTooltip = false,
      isActive = false,
      isDownload = false,
      disableResponsiveIcon = false,
      showDownloadIcon = false,
      loaderSize = 16,
      downloadIconSize = 16,
      leftSection,
      ...props
    },
    ref,
  ) => {
    const tooltipLabel = tooltip
      ? tooltip
      : isDownload && isActive
        ? ADDITIONAL_DOWNLOAD_MESSAGE
        : undefined;

    const getLeftSection = () => {
      if (leftSection !== undefined) {
        return leftSection;
      }

      if (isActive) {
        return <Loader size={loaderSize} color="currentColor" />;
      }

      if (showDownloadIcon) {
        return (
          <DownloadIcon
            size={downloadIconSize}
            aria-label="download"
            className={`${
              !disableResponsiveIcon ? "hidden xl:block" : "block"
            }`}
          />
        );
      }

      return null;
    };
    const button = (
      <StyledButton
        ref={ref}
        leftSection={getLeftSection()}
        classNames={{
          section: `mr-0 ${
            isActive || disableResponsiveIcon ? "mr-2" : "xl:mr-2"
          }`,
          ...props.classNames,
        }}
        {...props}
      />
    );

    if (tooltipLabel) {
      return (
        <Tooltip
          label={tooltipLabel}
          multiline={multilineTooltip}
          w={multilineTooltip ? "400" : "auto"}
        >
          {button}
        </Tooltip>
      );
    }
    return button;
  },
);

export default FunctionButton;
