import { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
import Link from "next/link";
import { Button, Card, Chip, Badge, Grid } from "@mantine/core";
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
              <HoverLink href="/user-flow/many-pages/">Many Pages</HoverLink>
            </li>
            <li>
              <HoverLink href="/user-flow/many-pages-v2/">
                Many Pages Variant
              </HoverLink>
            </li>
            <li>
              <HoverLink href="/user-flow/all-apps/">All Apps</HoverLink>
            </li>
            <li>
              <HoverLink href="/user-flow/all-apps-v2/">
                All Apps Variant
              </HoverLink>
            </li>
            <li>
              <HoverLink href="/user-flow/workbench/">Workbench</HoverLink>
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
          </ul>
        </Section>
      </div>
    </SimpleLayout>
  );
};

export default IndexPage;
