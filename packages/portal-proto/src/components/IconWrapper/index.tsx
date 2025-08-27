import React from "react";
import { Center } from "@mantine/core";

interface IconProps {
  children: React.ReactElement;
  size?: number;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ children, size = 24, className = "" }) => {
  return React.cloneElement(children, {
    size,
    className: `${className} text-primary-darkest`,
    "aria-hidden": "true",
  });
};

interface IconWrapperProps {
  icon: React.ReactElement;
  text: string;
  customDataTestID?: string;
  iconSize?: number;
  iconStyle?: string;
}

const IconWrapper: React.FC<IconWrapperProps> = ({
  icon,
  text,
  customDataTestID,
  iconSize = 24,
  iconStyle = "",
}) => (
  <Center data-testid={customDataTestID} className="gap-1">
    <Icon size={iconSize} className={`${iconStyle} text-inherit`}>
      {icon}
    </Icon>
    {text}
  </Center>
);

export default IconWrapper;
