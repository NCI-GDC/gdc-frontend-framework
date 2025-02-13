import IconWrapper from "@/components/IconWrapper";
import { UnstyledButton } from "@mantine/core";

interface NavButtonProps {
  icon: React.ReactElement;
  text: string;
  onClick: () => void;
  className?: string;
  variant?: "default" | "drawer";
  customDataTestID: string;
}

const NavButton = ({
  icon,
  text,
  onClick,
  customDataTestID,
  className = "",
  variant = "default",
  ...props
}: NavButtonProps) => (
  <UnstyledButton
    onClick={onClick}
    className={`rounded-md hover:bg-primary-lightest text-primary-darkest text-sm font-heading ${
      variant === "drawer" && "w-full"
    } flex py-4 px-1 ${className}`}
    data-testid={customDataTestID}
    {...props}
  >
    <IconWrapper icon={icon} text={text} />
  </UnstyledButton>
);

export default NavButton;
