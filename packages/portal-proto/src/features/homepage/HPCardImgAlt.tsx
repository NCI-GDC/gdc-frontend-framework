import Link from "next/link";
import { Image } from "@/components/Image";
import {
  homepageButtonAltStyles,
  HPCardImgAltProps,
  imageSizes,
  imageWrapperStyle,
} from "./utils";

const HPCardImgAlt = ({
  head,
  body,
  linkText,
  href,
  imgSrc,
  imgAlt,
}: HPCardImgAltProps): JSX.Element => {
  return (
    <div className="bg-gradient-to-r from-[#1673A3] to-[#833689] px-4 xl:px-0">
      <div className="py-10 xl:max-w-screen-lg mx-auto text-base-max lg:flex gap-16 items-center">
        <div className="flex gap-6 mb-9 xl:mb-0">
          <div className={imageWrapperStyle}>
            <Image
              alt={imgAlt}
              src={imgSrc}
              className={`
                rounded-lg z-10
                w-[${imageSizes.small}px] h-[${imageSizes.small}px]
                md:w-[${imageSizes.medium}px] md:h-[${imageSizes.medium}px]
                lg:w-[${imageSizes.large}px] lg:h-[${imageSizes.large}px]
                xl:w-[${imageSizes.extraLarge}px] xl:h-[${imageSizes.extraLarge}px]
              `}
              layout="fill"
            />
          </div>
          <h2 className="basis-2/3 font-heading font-bold text-4xl md:text-[2rem] self-center lg:hidden">
            {head}
          </h2>
        </div>
        <div className="w-full xl:w-2/3">
          <h2 className="hidden lg:block font-heading font-bold text-3xl xl:text-2xl pb-8 tracking-tight">
            {head}
          </h2>
          <div className="py-1 space-y-5 max-w-4xl pb-4 text-2xl md:text-xl lg:text-[1rem]">
            {body}
          </div>
          {typeof href === "string" ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className={homepageButtonAltStyles}
            >
              {linkText}
            </a>
          ) : (
            <Link href={href} className={homepageButtonAltStyles}>
              {linkText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HPCardImgAlt;
