import tw from "tailwind-styled-components";

export const HeaderTitle = tw.h2`
text-lg text-primary-content-darkest uppercase tracking-wide font-medium
`;

export const SummaryHeaderTitle = tw.h2`
text-[28px] leading-[34px] text-base-lightest uppercase tracking-wide font-medium
`;

export const PercentBar = tw.div`
relative

border border-accent-cool-lighter
rounded-sm
px-1
w-16
h-full`;

export const PercentBarLabel = tw.div`
absolute
z-10
left-0
top-0
w-full
h-full
text-percentage-bar-label
text-center`;

export const PercentBarComplete = tw.div`
absolute
left-0
top-0
h-full
bg-accent-cool-lighter
rounded-sm`;
