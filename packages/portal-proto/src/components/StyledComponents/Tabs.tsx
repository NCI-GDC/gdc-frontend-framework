import { Tabs } from "@mantine/core";
import tw from "tailwind-styled-components";

export const StyledTab = tw(Tabs.Tab)`
text-base-content
font-heading
data-[active]:font-bold
data-[active]:border-4
data-[active]:border-accent
data-[active]:text-base-content-darkest
[&_div]:flex
[&_div]:items-center
`;

export const StyledTabsList = tw(Tabs.List)`
border-b-1
`;
