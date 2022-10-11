import Link from "next/link";
import { ReactNode } from "react";

interface ExternalLinkProps {
  href: string;
  title?: string;
  separator?: ReactNode | string | false;
  children: any;
  dataTestId?: string;
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({
  title,
  href,
  children,
  dataTestId,
  separator = <span> | </span>,
}: ExternalLinkProps) => {
  return (
    <>
      <Link href={href} passHref>
        <a
          data-testid={dataTestId ? dataTestId : ""}
          title={title ? title : href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      </Link>
      {separator ? separator : ""}
    </>
  );
};
