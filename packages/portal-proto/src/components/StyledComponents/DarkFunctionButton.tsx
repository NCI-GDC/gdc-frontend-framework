import tw from "tailwind-styled-components";
import { Button } from "@mantine/core";

export default tw(Button)`
flex
flex-row
items-center
bg-primary-darkest
text-primary-contrast-darkest
border
border-solid
font-heading
disabled:opacity-60
disabled:border-opacity-60
disabled:text-opacity-60
`;
