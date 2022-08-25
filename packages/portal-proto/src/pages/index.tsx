import { NextPage } from "next";
import { SimpleLayout } from "@/features/layout/Simple";
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
    <span className="hover:text-nci-blue">
      <Link href={href}>{children}</Link>
    </span>
  );
};

const Section: React.FC<unknown> = ({
  children,
}: PropsWithChildren<unknown>) => {
  return <div className="border border-nci-gray-lighter p-4">{children}</div>;
};

const IndexPage: NextPage = () => {
  return (
    <SimpleLayout>
      <div className="flex flex-col">
        <Section>
          User Flow Prototypes:
          <ul className="list-disc list-inside">
            <li>
              <HoverLink href="/user-flow/workbench/">V2 Prototype</HoverLink>
            </li>
          </ul>
        </Section>
        <Section>
          Documentation:
          <ul className="list-disc list-inside">
            <li>
              <HoverLink href="/styleguide">Style Guide</HoverLink>
            </li>
          </ul>
        </Section>
        <Section>
          Misc Prototypes:
          <ul className="list-disc list-inside">
            <li>
              <HoverLink href="/cohort-builder">Cohort Builder</HoverLink>
            </li>
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
            <li>
              <HoverLink href="/colors">Colors</HoverLink>
            </li>
            <li>
              <HoverLink href="/ssmsTable">Molecular Table</HoverLink>
            </li>
            <li>
              <HoverLink href="/genesTable">Genes Table</HoverLink>
            </li>
            <li>
              <HoverLink href="/set-operation">Set Operation Demo</HoverLink>
            </li>
            <li>
              <HoverLink href="/scrna-seq-viz">scRNA-Seq</HoverLink>
            </li>
          </ul>
        </Section>
      </div>
    </SimpleLayout>
  );
};

export default IndexPage;
