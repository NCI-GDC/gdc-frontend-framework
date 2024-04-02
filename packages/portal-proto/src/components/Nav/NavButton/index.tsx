import IconWrapper from "@/components/IconWrapper";
import { UnstyledButton } from "@mantine/core";

interface NavButtonProps {
  icon: React.ReactElement;
  text: string;
  onClick: () => void;
  className?: string;
  needFullWidth?: boolean;
  [key: string]: any;
}

const NavButton = ({
  icon,
  text,
  onClick,
  className = "",
  needFullWidth = false,
  ...props
}: NavButtonProps) => (
  <UnstyledButton
    onClick={onClick}
    className={`rounded-md hover:bg-primary-lightest font-medium font-heading ${
      needFullWidth && "w-full"
    } flex py-4 px-1 ${className}`}
    {...props}
  >
    <IconWrapper icon={icon} text={text} />
  </UnstyledButton>
);

export default NavButton;
