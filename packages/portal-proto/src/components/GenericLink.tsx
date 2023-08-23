import Link from "next/link";

const GenericLink = ({
  path,
  query,
  text,
}: {
  path: string;
  query?: Record<string, string>;
  text: string;
}): JSX.Element => {
  const hrefObj: { pathname: string; query?: Record<string, string> } = {
    pathname: path,
  };
  if (query) {
    hrefObj.query = query;
  }
  return (
    <Link href={hrefObj}>
      <a className="text-utility-link underline text-sm">{text}</a>
    </Link>
  );
};

export default GenericLink;
