import { ReactNode } from "react";

export const PopupIconButton = ({
  label,
  handleClick,
  customStyle,
}: {
  label: ReactNode;
  handleClick: () => void;
  customStyle?: string;
}) => {
  return (
    <button className={customStyle} onClick={handleClick}>
      {label}
    </button>
  );
};
