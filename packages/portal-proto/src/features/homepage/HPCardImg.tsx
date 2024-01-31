import Link, { LinkProps } from "next/link";
import { HomepageButton } from "./index";
import { Image } from "@/components/Image";

interface HPCardImgProps {
  head: string;
  imgProps: {
    src: string;
    alt: string;
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
    <div className="max-w-screen-lg m-auto flex gap-5">
      <div className="w-1/2 py-10">
        <h2 className="font-heading font-bold text-2xl pb-5 text-summarybar-text tracking-tight">
          {head}
        </h2>
        <div className="py-1 space-y-6 max-w-4xl pb-4">{body}</div>
        <Link href={href} passHref>
          <HomepageButton>{linkText}</HomepageButton>
        </Link>
      </div>
      <div className="w-1/2 relative h-[290px] m-auto">
        <Image
          alt={imgProps.alt}
          src={imgProps.src}
          layout="fill"
          objectPosition={imgProps.objectPosition}
        />
      </div>
    </div>
  );
};

export default HPCardImg;
