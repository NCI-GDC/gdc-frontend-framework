import tw from "tailwind-styled-components";

const BtnWithHoverCalloutTopArrow = tw.button`
  relative
  flex items-center w-full text-left
  hover:bg-primary-lightest
  hover:after:content-['']
  hover:after:absolute
  hover:after:top-[-8px]
  hover:after:left-1/2
  hover:after:transform
  hover:after:translate-x-[-50%]
  hover:after:border-l-[8px]
  hover:after:border-l-transparent
  hover:after:border-r-[8px]
  hover:after:border-r-transparent
  hover:after:border-b-[8px]
  hover:after:border-b-primary-lightest
  ${(p: { $focus?: boolean }) =>
    p.$focus &&
    `
    bg-primary-lightest
    after:content-['']
    after:absolute
    after:top-[-8px]
    after:left-1/2
    after:transform
    after:translate-x-[-50%]
    after:border-l-[8px]
    after:border-l-transparent
    after:border-r-[8px]
    after:border-r-transparent
    after:border-b-[8px]
    after:border-b-primary-lightest
  `}
`;

const BtnWithHoverCalloutLeftArrow = tw.button`
  flex
  items-center
  w-full
  text-left
  hover:bg-primary-lightest
  hover:before:w-0
  hover:before:h-0
  hover:before:absolute
  hover:before:left-2
  hover:before:border-t-[10px]
  hover:before:border-t-transparent
  hover:before:border-b-[10px]
  hover:before:border-b-transparent
  hover:before:border-r-[10px]
  hover:before:border-r-primary-lightest
  ${(p: { $focus?: boolean }) =>
    p.$focus &&
    `
    bg-primary-lightest
    before:w-0
    before:h-0
    before:absolute
    before:left-2
    before:border-t-[10px]
    before:border-t-transparent
    before:border-b-[10px]
    before:border-b-transparent
    before:border-r-[10px]
    before:border-r-primary-lightest
  `}
`;

export { BtnWithHoverCalloutLeftArrow, BtnWithHoverCalloutTopArrow };
