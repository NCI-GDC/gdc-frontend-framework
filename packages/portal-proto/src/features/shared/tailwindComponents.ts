import tw from "tailwind-styled-components";

export const HeaderTitle = tw.h2`
text-lg text-primary-content-darkest uppercase tracking-wide font-medium mb-1
`;

export const SummaryHeaderTitle = tw.h2<{ $isFileSummary: boolean }>`
${(p: { $isFileSummary: boolean }) =>
  p.$isFileSummary ? "text-lg" : "text-[28px]"}
leading-[34px]
text-base-lightest
uppercase
tracking-wide
font-medium
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

export const DownloadButton = tw.button`
    px-1.5
    min-h-[28px]
    min-w-10
    border-primary
    text-primary
    border
    rounded-[4px]
    transition-colors
    hover:bg-primary
    hover:text-base-max
`;

export const CountSpan = tw.span`font-bold p-0 m-0`;

interface CountsIconProps {
  $count?: number;
}

export const CountsIcon = tw.div<CountsIconProps>`
  ${(p: CountsIconProps) =>
    p.$count !== undefined && p.$count > 0 ? "bg-accent" : "bg-transparent"}
  inline-flex
  items-center
  justify-center
  w-8
  h-5
  text-accent-contrast
  font-heading
  rounded-md
  `;

export const DemoText = tw.span`
font-content
italic
px-2
py-4
mt-4
`;
