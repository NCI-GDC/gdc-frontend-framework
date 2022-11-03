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
font-heading
hover:text-primary-contrast-darker
disabled:opacity-60
disabled:border-opacity-60
disabled:text-opacity-60
`;
