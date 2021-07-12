import { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
import Link from "next/link";

interface HoverLinkProps {
  readonly href: string;
}

const HoverLink: React.FC<HoverLinkProps> = ({ href, children }) => {
  return (
    <span className="hover:text-blue-600">
      <Link href={href}>{children}</Link>
    </span>
  );
};

const IndexPage: NextPage = () => {
  return (
    <SimpleLayout>
      <div className="flex flex-col">
        <div className="border border-gray-200 p-4">
          User Flow Prototypes:
          <ul className="list-disc list-inside">
            <li className="text-gray-400">Most Pages</li>
            <li className="text-gray-400">More Pages</li>
            <li>
              <HoverLink href="/user-flow-fewer-pages">Fewer Pages</HoverLink>
            </li>
            <li>
              <HoverLink href="/user-flow-fewest-pages">Fewest Pages</HoverLink>
            </li>
          </ul>
        </div>
        <div className="border border-gray-200 p-4">
          Misc Prototypes:
          <ul className="list-disc list-inside">
            <li>
              <HoverLink href="/apps">Apps</HoverLink>
            </li>
            <li>
              <HoverLink href="/facets">Facets</HoverLink>
            </li>
          </ul>
        </div>
      </div>
    </SimpleLayout>
  );
};

export default IndexPage;
