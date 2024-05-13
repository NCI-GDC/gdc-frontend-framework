import { Tabs } from "@mantine/core";
import tw from "tailwind-styled-components";

export const StyledTab = tw(Tabs.Tab)`
text-base-content
font-heading
data-[active]:font-bold
data-[active]:border-b-4
data-[active]:border-accent
data-[active]:text-base-content-darkest
[&_span]:flex
[&_span]:items-center
`;
