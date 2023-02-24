import { HomepageButton } from "./index";
import { LinkProps } from "next/link";

// TODO eliminate duplicate styles
const homepageButtonStyles = `
bg-primary text-base-max border-base-light border-1
hover:bg-primary-darker hover:text-primary-darker-contrast
font-medium font-heading rounded mt-4 px-4 py-3 w-fit inline-block
`;

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
    <div className={mainClassName}>
      <div className="text-center py-12 max-w-screen-2xl m-auto">
        <h2 className="font-heading font-bold text-4xl pb-5 text-summarybar-text">
          {head}
          {subhead && <span className="block font-medium">{subhead}</span>}
        </h2>
        <p className="py-1 text-2xl">{body}</p>
        {typeof href === "string" ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={homepageButtonStyles}
          >
            {linkText}
          </a>
        ) : (
          <HomepageButton href={href}>{linkText}</HomepageButton>
        )}
      </div>
    </div>
  );
};

export default HPCard;
