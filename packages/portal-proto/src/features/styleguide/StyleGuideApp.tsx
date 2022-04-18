import { ReactNode, useState } from "react";
import { AppShell, Navbar, Header } from '@mantine/core';
import dynamic from "next/dynamic";

const ActiveStyleCard = dynamic(() => import("./ActiveStyleCard"), {
  ssr: false,
});

const sections = [
  "Introduction",
  "Typefaces",
  "Colors",
  "Icons",
  "Charts",
  "Components"
];

/**
 * Builds side navigation for the style guide.
 * @param sections - sections to create, the section name is passed to setActiveStyleCard
 * @param setActiveStyleCard - function that loads the component.
 */
const SideBar = (sections: ReadonlyArray<string>, setActiveStyleCard: (string) => void)  => {
  // default styling
  const navbar_items = "prose font-montserrat text-xl text-nci-gray-darker p-4 shadow-md hover:bg-nci-gray-light transition-colors";
  return (
    <Navbar width={{ base: 200 }} p="md">
      {sections.map((sectionName) =>
        <Navbar.Section key={`styleguide_section_${sectionName}`} className={navbar_items} >
          <button onClick={ () => setActiveStyleCard(sectionName)}>
            {sectionName}
          </button>
        </Navbar.Section>
      )}
    </Navbar>
  )
}

const StyleGuideApp : ReactNode = () => {

  const [activeStyleCard, setActiveStyleCard] = useState("Introduction")
  const header =  <Header height={60} p="xs"> <p className="prose font-medium text-2xl">GDC Portal Style guide</p></Header>

  return (
    <AppShell
      padding="md"
      navbar={SideBar(sections, setActiveStyleCard)}
      header={header}
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      <ActiveStyleCard cardId={activeStyleCard} />
    </AppShell>
  );
}

export default StyleGuideApp;
