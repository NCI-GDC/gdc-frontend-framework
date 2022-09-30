import Link from "next/link";
import { ReactNode } from "react";

interface IExternalLink {
  href: string;
  title?: string;
  separator?: ReactNode | string | false;
  children: any;
}

export const ExternalLink: React.FC<IExternalLink> = ({
  title,
  href,
  children,
  separator = <span> | </span>,
}: IExternalLink) => {
  return (
    <>
      <Link href={href} passHref title={title ? title : children}>
        <a target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      </Link>
      {separator ? separator : ""}
    </>
  );
};
