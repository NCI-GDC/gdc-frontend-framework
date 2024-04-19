import Link, { LinkProps } from "next/link";
import { Image } from "@/components/Image";

const homepageButtonAltStyles = `bg-primary-max text-xl md:text-lg lg:text-sm text-summarybar-link-text border-base-light border-1 hover:bg-primary-lightest hover:text-primary-min font-medium font-heading rounded mt-4 px-4 py-3 inline-block xl:text-sm`;

const imageWrapperStyle = `relative w-[208px] h-[208px] md:w-[165px] md:h-[165px] lg:w-[324px] lg:h-[324px] xl:w-[340px] xl:h-[340px]
before:w-[152px] before:h-[152px] md:before:w-[121px] md:before:h-[121px] lg:before:w-[237px] lg:before:h-[237px] xl:before:w-[248px] xl:before:h-[248px] before:block before:absolute before:-inset-1 before:rounded-lg before:bg-summarybar-border
after:w-[152px] after:h-[152px] md:after:w-[121px] md:after:h-[121px] lg:after:w-[237px] lg:after:h-[237px] xl:after:w-[248px] xl:after:h-[248px] after:block after:absolute after:-bottom-1 after:-right-1 after:rounded-lg after:bg-summarybar-borderAlt`;
interface HPCardImgAltProps {
  head: string | JSX.Element;
  imgSrc: string;
  imgAlt: string;
  body: JSX.Element;
  linkText: string;
  href: LinkProps["href"] | string;
}

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
              className="rounded-lg z-10 w-[208px] h-[208px] md:w-[165px] md:h-[165px] lg:w-[324px] lg:h-[324px] xl:w-[340px] xl:h-[340px]"
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
