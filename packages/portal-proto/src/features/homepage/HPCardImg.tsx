import Link, { LinkProps } from "next/link";
import { Image } from "@/components/Image";
import { homepageButtonClass } from ".";

interface HPCardImgProps {
  head: string;
  imgProps: {
    src: string;
    alt: string;
    width: number;
    height: number;
    objectPosition?: string;
  };
  body: JSX.Element;
  linkText: string;
  href: LinkProps["href"];
}

const HPCardImg = ({
  head,
  body,
  linkText,
  href,
  imgProps,
}: HPCardImgProps): JSX.Element => {
  return (
    <div className="max-w-screen-lg m-auto flex flex-col xl:flex-row gap-5 py-10 px-4">
      <div className="block xl:hidden self-center">
        <Image
          alt={imgProps.alt}
          src={imgProps.src}
          height={imgProps.height}
          width={imgProps.width}
          objectPosition={imgProps.objectPosition}
        />
      </div>
      <div className="xl:w-1/2 xl:py-10">
        <h2 className="font-heading font-bold text-4xl xl:text-2xl pb-5 text-summarybar-text tracking-tight">
          {head}
        </h2>
        <div className="py-1 space-y-6 max-w-4xl pb-4 text-2xl text-secondary-contrast-lighter xl:text-[1rem]">
          {body}
        </div>
        <Link href={href} className={homepageButtonClass}>
          {linkText}
        </Link>
      </div>
      <div className="hidden xl:block w-1/2 m-auto">
        <Image
          alt={imgProps.alt}
          src={imgProps.src}
          height={imgProps.height}
          width={imgProps.width}
          layout="fixed"
          objectPosition={imgProps.objectPosition}
        />
      </div>
    </div>
  );
};

export default HPCardImg;
