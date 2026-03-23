import tw from "tailwind-styled-components";
import FunctionButton, { FunctionButtonProps } from "./FunctionButton";

interface StyledButtonProps extends FunctionButtonProps {
  loading?: boolean;
}

export default tw(FunctionButton)<StyledButtonProps>`
  bg-secondary-dark
  text-secondary-contrast-min
  border-secondary-darker
  ${(p) =>
    p.loading !== true
      ? `hover:bg-secondary-darkest
         hover:text-secondary-contrast-min`
      : ""}
`;
