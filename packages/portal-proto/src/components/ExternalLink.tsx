import Link from "next/link";

interface ExternalLinkProps {
  href: string;
  title?: string;
  children: any;
  dataTestId?: string;
  className?: string;
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({
  title,
  href,
  children,
  dataTestId,
  className,
}: ExternalLinkProps) => {
  return (
    <Link
      href={href}
      passHref
      data-testid={dataTestId ? dataTestId : ""}
      title={title ? title : href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </Link>
  );
};
