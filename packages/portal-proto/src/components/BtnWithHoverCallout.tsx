import tw from "tailwind-styled-components";

const BtnWithHoverCallout = tw.button`
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
  hover:before:border-t-solid
  hover:before:border-t-transparent
  hover:before:border-b-[10px]
  hover:before:border-b-solid
  hover:before:border-b-transparent
  hover:before:border-r-[10px]
  hover:before:border-r-solid
  hover:before:border-r-primary-lightest
  ${(p) =>
    p.$focus &&
    `
    bg-primary-lightest
    before:w-0
    before:h-0
    before:absolute
    before:left-2
    before:border-t-[10px]
    before:border-t-solid
    before:border-t-transparent
    before:border-b-[10px]
    before:border-b-solid
    before:border-b-transparent
    before:border-r-[10px]
    before:border-r-solid
    before:border-r-primary-lightest
  `}
`;

export default BtnWithHoverCallout;
