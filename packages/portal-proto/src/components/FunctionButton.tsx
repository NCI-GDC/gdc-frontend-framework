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
bg-white
text-primary
border
border-solid
border-primary
hover:bg-primary
font-heading
hover:text-white
`;
