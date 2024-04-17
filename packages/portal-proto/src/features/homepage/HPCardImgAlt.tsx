import Link, { LinkProps } from "next/link";
import { Image } from "@/components/Image";

// TODO eliminate duplicate styles
const homepageButtonAltStyles = `bg-primary-max text-xl text-summarybar-link-text border-base-light border-1
hover:bg-primary-lightest hover:text-primary-min font-medium font-heading rounded
mt-4 px-4 py-3 inline-block xl:text-sm`;

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
    <div className="py-10 max-w-screen-lg m-auto text-base-max xl:flex gap-16 items-center bg-gradient-to-r from-[#1673A3] to-[#833689] px-7">
      <div
        className="relative
            hidden xl:block
          w-[340px]
          h-[340px]
          before:w-[248px]
          before:h-[248px]
          before:block
          before:absolute
          before:-inset-2
          before:rounded-lg
          before:bg-summarybar-border

          after:w-[248px]
          after:h-[248px]
          after:block
          after:absolute
          after:-bottom-2
          after:-right-2
          after:rounded-lg
          after:bg-summarybar-borderAlt"
      >
        <Image
          alt={imgAlt}
          src={imgSrc}
          width={340}
          height={340}
          className="rounded-lg z-10"
        />
      </div>

      <div className="flex xl:hidden gap-6 mb-9">
        <div
          className="relative
          w-[208px]
          h-[208px]
          before:w-[152px]
          before:h-[152px]
          before:block
          before:absolute
          before:-inset-1
          before:rounded-lg
          before:bg-summarybar-border

          after:w-[152px]
          after:h-[152px]
          after:block
          after:absolute
          after:bottom-2.5
          after:-right-1
          after:rounded-lg
          after:bg-summarybar-borderAlt"
        >
          <Image
            alt={imgAlt}
            src={imgSrc}
            width={208}
            height={208}
            className="rounded-lg z-10"
          />
        </div>
        <h2 className="basis-2/3 font-heading font-bold text-4xl self-center">
          {head}
        </h2>
      </div>

      <div className="w-full xl:w-2/3">
        <h2 className="hidden xl:block font-heading font-bold text-2xl pb-8 tracking-tight">
          {head}
        </h2>
        <div className="py-1 space-y-5 max-w-4xl pb-4 text-2xl">{body}</div>
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
  );
};

export default HPCardImgAlt;
