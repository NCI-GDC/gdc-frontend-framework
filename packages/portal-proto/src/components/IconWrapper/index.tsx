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
  });
};

interface IconWrapperProps {
  icon: React.ReactElement;
  text: string;
  iconSize?: number;
  isActive?: boolean;
}

const IconWrapper: React.FC<IconWrapperProps> = ({
  icon,
  text,
  iconSize = 24,
  isActive = false,
}) => (
  <Center className="gap-2">
    <Icon size={iconSize} className={isActive && "text-white"}>
      {icon}
    </Icon>
    {text}
  </Center>
);

export default IconWrapper;
