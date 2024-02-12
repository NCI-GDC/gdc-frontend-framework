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
      // Keeping passHref since ExternalLink is a custom component so children can be anything (maybe <a> tag)
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
