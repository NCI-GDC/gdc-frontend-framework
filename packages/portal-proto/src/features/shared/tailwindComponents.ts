import tw from "tailwind-styled-components";

export const HeaderTitle = tw.h2`
text-lg text-secondary uppercase tracking-wide font-medium
`;

export const PercentBar = tw.div`
relative
bg-percentage-bar-base
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
bg-percentage-bar-complete
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
`;
