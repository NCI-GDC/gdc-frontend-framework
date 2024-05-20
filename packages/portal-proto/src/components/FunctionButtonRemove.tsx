import tw from "tailwind-styled-components";
import FunctionButton from "./FunctionButton";

export default tw(FunctionButton)`
bg-secondary-dark
text-secondary-contrast-min
border-secondary-darker
${(p) =>
  p.loading !== true
    ? `hover:bg-secondary-darkest
    hover:text-secondary-contrast-min`
    : ""}
`;
