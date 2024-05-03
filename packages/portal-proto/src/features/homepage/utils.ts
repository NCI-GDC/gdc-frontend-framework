import { LinkProps } from "next/link";

export const homepageButtonAltStyles = `
  bg-primary-max
  text-xl
  md:text-lg
  lg:text-sm
  text-summarybar-link-text
  border-base-light
  border-1
  hover:bg-primary-lightest
  hover:text-primary-min
  font-medium
  font-heading
  rounded
  mt-4
  px-4
  py-3
  inline-block
  xl:text-sm
`;

export const imageWrapperStyles =
  "w-36 h-36 md:w-32 md:h-32 lg:w-56 lg:h-56 xl:w-64 xl:h-64 block absolute rounded-lg";
export interface HPCardImgAltProps {
  head: string | JSX.Element;
  imgSrc: string;
  imgAlt: string;
  body: JSX.Element;
  linkText: string;
  href: LinkProps["href"] | string;
}
