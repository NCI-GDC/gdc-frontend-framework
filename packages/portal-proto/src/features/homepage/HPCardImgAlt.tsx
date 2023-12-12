import Link, { LinkProps } from "next/link";
import tw from "tailwind-styled-components";
import { Image } from "@/components/Image";

export const HomepageButtonAlt = tw.a`bg-primary-max text-sm text-summarybar-text border-base-light border-1
hover:bg-primary-lightest hover:text-primary-min
font-medium font-heading rounded mt-4 px-4 py-3 w-fit inline-block`;
// TODO eliminate duplicate styles
const homepageButtonAltStyles = `bg-primary-max text-sm text-summarybar-text border-base-light border-1
hover:bg-primary-lightest hover:text-primary-min
font-medium font-heading rounded mt-4 px-4 py-3 w-fit inline-block`;

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
    <div className="bg-gradient-to-r from-[#1673A3] to-[#833689] px-7">
      <div className="py-10 max-w-screen-lg m-auto text-base-max flex gap-16 items-center">
        <div>
          <div
            className="relative
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
        </div>
        <div className="w-2/3">
          <h2 className="font-heading font-bold text-2xl pb-8 tracking-tight">
            {head}
          </h2>
          <div className="py-1 space-y-5 max-w-4xl pb-4">{body}</div>
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
            <Link href={href} passHref>
              <HomepageButtonAlt>{linkText}</HomepageButtonAlt>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HPCardImgAlt;
