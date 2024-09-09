import tw from "tailwind-styled-components";
import { Button, ButtonProps } from "@mantine/core";

interface DarkFunctionButtonProps extends ButtonProps {
  onClick?: () => void;
}

export default tw(Button)<DarkFunctionButtonProps>`
flex
flex-row
items-center
bg-secondary
text-secondary-contrast
border
border-solid
font-heading
disabled:opacity-60
disabled:border-opacity-60
disabled:text-opacity-60
`;
