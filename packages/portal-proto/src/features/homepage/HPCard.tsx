import { homepageButtonClass } from "./index";
import Link, { LinkProps } from "next/link";

interface HPCardProps {
  head: string;
  subhead?: string;
  body: JSX.Element;
  linkText: string;
  href: LinkProps["href"];
  mainClassName?: string;
}

const HPCard = ({
  head,
  subhead,
  body,
  linkText,
  href,
  mainClassName = "",
}: HPCardProps): JSX.Element => {
  return (
    <div className={`px-7 ${mainClassName}`}>
      <div className="text-center py-12 max-w-screen-lg m-auto">
        <h2 className="font-heading font-bold text-2xl pb-5 text-summarybar-text tracking-tight">
          {head}
          {subhead && <span className="block font-medium">{subhead}</span>}
        </h2>
        <p className="py-1 font-content">{body}</p>
        {typeof href === "string" ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={homepageButtonClass}
          >
            {linkText}
          </a>
        ) : (
          <Link href={href} className={homepageButtonClass}>
            {linkText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default HPCard;
