import { Menu } from "@mantine/core";
import tw from "tailwind-styled-components";

export const DropdownMenu = tw(Menu.Dropdown)`
border-primary-darker
`;

export const DropdownMenuItem = tw(Menu.Item)`
text-base-darker
hover:bg-[#FFD2C6]
`;
