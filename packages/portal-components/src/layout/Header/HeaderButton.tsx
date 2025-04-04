import React from "react";
import { HeaderButtonItem } from "./types";

type HeaderButtonProps = Omit<HeaderButtonItem, "type">;

const HeaderButton: React.FC<HeaderButtonProps> = ({
  customDataTestID,
  image,
  text,
  onClick,
  children,
  variant = "default",
}) => {
  const buttonClasses = `flex items-center rounded-md gap-1 text-sm my-1 px-1 py-1 hover:bg-primary-lightest text-primary-darkest ${
    variant === "drawer" && "w-full !py-4"
  }`;

  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={customDataTestID}
      className={buttonClasses}
    >
      {image}
      {text}
      {children}
    </button>
  );
};

export default HeaderButton;
