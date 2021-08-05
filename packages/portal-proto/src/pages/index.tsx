import { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
import Link from "next/link";
import { PropsWithChildren } from "react";

interface HoverLinkProps {
  readonly href: string;
}

const HoverLink: React.FC<HoverLinkProps> = ({
  href,
  children,
}: PropsWithChildren<HoverLinkProps>) => {
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
            <li>
              <HoverLink href="/user-flow/many-pages/studies">
                Many Pages
              </HoverLink>
            </li>
            <li>
              <HoverLink href="/user-flow/all-apps/exploration">
                All Apps
              </HoverLink>
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
            <li>
              <HoverLink href="/charts">Charts</HoverLink>
            </li>
            <li>
              <HoverLink href="/molecular">Molecular</HoverLink>
            </li>
          </ul>
        </div>
      </div>
    </SimpleLayout>
  );
};

export default IndexPage;
