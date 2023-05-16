import { ReactNode } from "react";
import { Button } from "@mantine/core";
import { Image } from "@/components/Image";

export const PopupIconButton = ({
  label,
  handleClick,
  customStyle = "text-utility-link underline font-content",
}: {
  label: ReactNode;
  handleClick: () => void;
  customStyle?: string;
}) => {
  return (
    <Button
      className={customStyle}
      classNames={{
        label: "font-normal",
        root: "hover:bg-inherit px-0",
      }}
      onClick={handleClick}
      variant="subtle"
      leftIcon={
        <Image
          src="/user-flow/icons/OpenModal.svg"
          width={10}
          height={14}
          alt="pop up icon"
        />
      }
    >
      {label}
    </Button>
  );
};
