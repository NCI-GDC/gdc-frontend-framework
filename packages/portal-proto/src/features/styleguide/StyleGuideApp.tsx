import { ReactNode, useState } from "react";
import { AppShell, Navbar, Header } from '@mantine/core';
import dynamic from "next/dynamic";

const ActiveStyleCard = dynamic(() => import("./ActiveStyleCard"), {
  ssr: false,
});


const navbar_items = "prose font-montserrat text-xl text-nci-gray-darker p-4 shadow-md hover:bg-nci-gray-light transition-colors";
const StyleGuideApp : ReactNode = () => {

  const [activeStyleCard, setActiveStyleCart] = useState("Introduction")

  return (
    <AppShell
      padding="md"
      navbar={<Navbar width={{ base: 200 }} p="md">
        <Navbar.Section className={navbar_items} >
          <button onClick={ () => setActiveStyleCart('Introduction')}>
            Introduction
          </button>
        </Navbar.Section>
        <Navbar.Section className={navbar_items} >
          <button onClick={ () => setActiveStyleCart('Typefaces')}>
            Typefaces
          </button>
        </Navbar.Section>
        <Navbar.Section className={navbar_items} >
          <button onClick={ () => setActiveStyleCart('Colors')}>
            Colors
          </button>
        </Navbar.Section>
        <Navbar.Section className={navbar_items} >
          <button onClick={ () => setActiveStyleCart('Icons')}>
            Icons
          </button>
        </Navbar.Section>
        <Navbar.Section className={navbar_items} >
          <button onClick={ () => setActiveStyleCart('Charts')}>
            Charts
          </button>
        </Navbar.Section>
        <Navbar.Section className={navbar_items} >
          <button onClick={ () => setActiveStyleCart('Components')}>
            Components
          </button>
        </Navbar.Section>
      </Navbar>}
      header={<Header height={60} p="xs"> <p className="prose font-medium text-2xl">GDC Portal Style guide</p></Header>}
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      <ActiveStyleCard cardId={activeStyleCard} />
    </AppShell>
  );
}

export default StyleGuideApp;
