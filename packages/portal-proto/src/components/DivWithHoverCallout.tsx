import tw from "tailwind-styled-components";

const DivWithHoverCallout = tw.div`
  flex
  items-center
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
  focus:bg-primary-lightest
  focus:before:w-0
  focus:before:h-0
  focus:before:absolute
  focus:before:left-2
  focus:before:border-t-[10px]
  focus:before:border-t-solid
  focus:before:border-t-transparent
  focus:before:border-b-[10px]
  focus:before:border-b-solid
  focus:before:border-b-transparent
  focus:before:border-r-[10px]
  focus:before:border-r-solid
  focus:before:border-r-primary-lightest
`;

export default DivWithHoverCallout;
