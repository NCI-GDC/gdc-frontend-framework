import tw from "tailwind-styled-components";

export const FacetIconButton = tw.button`
text-base-max
font-bold
py-2
px-1
rounded
inline-flex
items-center
hover:text-primary-lightest
`;

export const controlsIconStyle =
  "text-accent-contrast-vivid hover:text-primary-darker";

export const FacetText = tw.div`
text-accent-contrast-vivid font-heading font-semibold text-[1.25em] break-words py-2
`;

export const FacetHeader = tw.div`
flex items-start justify-between flex-nowrap bg-accent-vivid shadow-md px-1.5
`;
