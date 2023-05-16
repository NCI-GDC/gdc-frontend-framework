import { ReactNode } from "react";
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
    <button className={customStyle} onClick={handleClick}>
      <span className="flex gap-2">
        <Image
          src="/user-flow/icons/OpenModal.svg"
          width={10}
          height={18}
          alt="pop up icon"
        />
        <span className="text-left">{label}</span>
      </span>
    </button>
  );
};
