import React, { FC, useState } from "react";
import { AppShell, Navbar, Header } from "@mantine/core";
import dynamic from "next/dynamic";
import { useTotalCounts } from "@gff/core";

const ActiveStyleCard = dynamic(() => import("./ActiveStyleCard"), {
  ssr: false,
});

const sections = [
  "Introduction",
  "Typefaces",
  "Colors",
  "Icons",
  "Charts",
  "Components",
];

/**
 * Builds side navigation for the style guide.
 * @param sections - sections to create, the section name is passed to setActiveStyleCard
 * @param setActiveStyleCard - function that loads the component.
 */
const SideBar = (
  sections: ReadonlyArray<string>,
  setActiveStyleCard: (string) => void,
) => {
  // default styling
  const navbar_items =
    "prose font-montserrat text-xl text-primary-content-darker p-4 shadow-md hover:bg-base-light transition-colors";

  useTotalCounts();
  return (
    <Navbar width={{ base: 200 }} p="md">
      {sections.map((sectionName) => (
        <Navbar.Section
          key={`styleguide_section_${sectionName}`}
          className={navbar_items}
        >
          <button onClick={() => setActiveStyleCard(sectionName)}>
            {sectionName}
          </button>
        </Navbar.Section>
      ))}
    </Navbar>
  );
};

const StyleGuideApp: FC = () => {
  const [activeStyleCard, setActiveStyleCard] = useState("Introduction");
  const header = (
    <Header height={60} p="xs">
      {" "}
      <p className="prose font-medium text-2xl">GDC Portal Style guide</p>
    </Header>
  );

  return (
    <AppShell
      padding="md"
      navbar={SideBar(sections, setActiveStyleCard)}
      header={header}
      styles={() => ({
        main: { backgroundColor: "gdc-grey-lightest" },
      })}
    >
      <ActiveStyleCard cardId={activeStyleCard} />
    </AppShell>
  );
};

export default StyleGuideApp;
