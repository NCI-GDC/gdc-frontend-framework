import tw from "tailwind-styled-components";
import { Button } from "@mantine/core";

export default tw(Button)`
flex
flex-row
items-center
bg-base-lightest
text-base-contrast-max
border
border-solid
border-primary-darker
hover:bg-primary-darker
hover:text-primary-contrast-darker
`;
