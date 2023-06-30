import tw from "tailwind-styled-components";
import { Button } from "@mantine/core";

interface FunctionButtonProps {
  disabled: boolean;
}

export default tw(Button)<FunctionButtonProps>`
 ${(p) =>
   p.disabled
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
font-heading
hover:bg-primary
hover:text-base-max
`;
