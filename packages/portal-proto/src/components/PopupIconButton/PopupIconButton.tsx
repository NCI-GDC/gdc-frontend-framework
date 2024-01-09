import { ReactNode, forwardRef } from "react";
import { Image } from "@/components/Image";
import { Button } from "@mantine/core";

interface PopupIconButtonProps {
  label: ReactNode;
  handleClick: () => void;
  customAriaLabel?: string;
  customStyle?: string;
  ariaId?: string;
}

export const PopupIconButton = forwardRef<
  HTMLButtonElement,
  PopupIconButtonProps
>(
  (
    {
      label,
      handleClick,
      customAriaLabel = undefined,
      customStyle = "text-utility-link underline font-content",
      ariaId,
    }: PopupIconButtonProps,
    ref,
  ): JSX.Element => {
    return (
      <Button
        className={customStyle}
        onClick={handleClick}
        aria-label={customAriaLabel ?? `Open ${label} information in modal`}
        leftIcon={
          <Image
            src="/user-flow/icons/OpenModal.svg"
            width={10}
            height={18}
            layout="fixed"
            aria-hidden="true"
          />
        }
        ref={ref}
        classNames={{
          label: "font-normal",
          root: "hover:bg-inherit px-0 h-4 w-auto border-0 flex items-center",
          leftIcon: "mr-1.5 mt-0.5",
        }}
        variant="subtle"
        compact
      >
        {ariaId ? <span id={ariaId}>{label}</span> : <>{label}</>}
      </Button>
    );
  },
);
