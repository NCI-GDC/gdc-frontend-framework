import Link from "next/link";
import { ReactNode } from "react";

interface ExternalLinkProps {
  href: string;
  title?: string;
  separator?: ReactNode | string | false;
  children: any;
  dataTestId?: string;
  className?: string;
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({
  title,
  href,
  children,
  dataTestId,
  separator = <span> | </span>, //TODO should be css
  className,
}: ExternalLinkProps) => {
  return (
    <>
      <Link href={href} passHref>
        <a
          data-testid={dataTestId ? dataTestId : ""}
          title={title ? title : href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${className}`}
        >
          {children}
        </a>
      </Link>
      {separator ? separator : ""}
    </>
  );
};
