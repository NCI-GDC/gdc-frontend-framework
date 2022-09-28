import Link from "next/link";

interface IExternalLink {
  href: string;
  title?: string;
  separator?: string | false;
  children: any;
}

export const ExternalLink: React.FC<IExternalLink> = (props: IExternalLink) => {
  const { title, href, children, separator = <span> | </span> } = props;

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
