import tw from "tailwind-styled-components";
import { Button } from "@mantine/core";

interface FunctionButtonProps {
  $disabled: boolean;
}

export default tw(Button)<FunctionButtonProps>`
 ${(p) =>
   p.$disabled
     ? "opacity-60 border-opacity-60 text-opacity-60 aria-disabled"
     : null}
flex
flex-row
items-center
bg-base-lightest
text-base-contrast-max
border
border-solid
border-primary-darker
hover:bg-primary-darker
font-heading
hover:text-primary-contrast-darker
`;
