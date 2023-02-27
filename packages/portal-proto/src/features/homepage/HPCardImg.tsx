import { LinkProps } from "next/link";
import { HomepageButton } from "./index";
import { Image } from "@/components/Image";

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
    <div className="bg-hero-pattern bg-cover px-7">
      <div className="max-w-screen-2xl m-auto flex gap-16">
        <div className="w-1/2 py-10">
          <h2 className="font-heading font-bold text-4xl pb-5 text-summarybar-text">
            {head}
          </h2>
          <div className="py-1 space-y-6 max-w-4xl text-2xl pb-4">{body}</div>
          <HomepageButton href={href}>{linkText}</HomepageButton>
        </div>
        <div className="w-1/2 relative h-[334px]">
          <Image
            alt={imgProps.alt}
            src={imgProps.src}
            height={imgProps.height}
            width={imgProps.width}
            objectPosition={imgProps.objectPosition}
          />
        </div>
      </div>
    </div>
  );
};

export default HPCardImg;
