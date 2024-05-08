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

export const imageSizes = {
  small: 208,
  medium: 165,
  large: 324,
  extraLarge: 340,
};

export const innerSizes = {
  small: 152,
  medium: 121,
  large: 237,
  extraLarge: 248,
};

export const imageWrapperStyle = `
  relative
  w-[${imageSizes.small}px] h-[${imageSizes.small}px]
  md:w-[${imageSizes.medium}px] md:h-[${imageSizes.medium}px]
  lg:w-[${imageSizes.large}px] lg:h-[${imageSizes.large}px]
  xl:w-[${imageSizes.extraLarge}px] xl:h-[${imageSizes.extraLarge}px]
  before:w-[${innerSizes.small}px] before:h-[${innerSizes.small}px]
  md:before:w-[${innerSizes.medium}px] md:before:h-[${innerSizes.medium}px]
  lg:before:w-[${innerSizes.large}px] lg:before:h-[${innerSizes.large}px]
  xl:before:w-[${innerSizes.extraLarge}px] xl:before:h-[${innerSizes.extraLarge}px]
  before:block before:absolute before:-inset-1 before:rounded-lg before:bg-summarybar-border
  after:w-[${innerSizes.small}px] after:h-[${innerSizes.small}px]
  md:after:w-[${innerSizes.medium}px] md:after:h-[${innerSizes.medium}px]
  lg:after:w-[${innerSizes.large}px] lg:after:h-[${innerSizes.large}px]
  xl:after:w-[${innerSizes.extraLarge}px] xl:after:h-[${innerSizes.extraLarge}px]
  after:block after:absolute after:-bottom-1 after:-right-1 after:rounded-lg after:bg-summarybar-borderAlt
`;

export interface HPCardImgAltProps {
  head: string | JSX.Element;
  imgSrc: string;
  imgAlt: string;
  body: JSX.Element;
  linkText: string;
  href: LinkProps["href"] | string;
}
