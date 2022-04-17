import { useState } from "react";
import { AppShell, Navbar, Header, Text } from '@mantine/core';
import dynamic from "next/dynamic";

const ActiveStyleCard = dynamic(() => import("./ActiveStyleCard"), {
  ssr: false,
});

const StyleGuideApp = () => {

  const [activeStyleCard, setActiveStyleCart] = useState("Introduction")

  return (
    <AppShell
      padding="md"
      navbar={<Navbar width={{ base: 300 }} p="md">
        <Navbar.Section>
          <button onClick={ () => setActiveStyleCart('Introduction')}>
            Introduction
          </button>
        </Navbar.Section>
        <Navbar.Section>
          <button onClick={ () => setActiveStyleCart('Typefaces')}>
            Typefaces
          </button>
        </Navbar.Section>
        <Navbar.Section>
          <button onClick={ () => setActiveStyleCart('Colors')}>
            Colors
          </button>
        </Navbar.Section>
        <Navbar.Section>
          <button onClick={ () => setActiveStyleCart('Icons')}>
            Icons
          </button>
        </Navbar.Section>
        <Navbar.Section>
          <button onClick={ () => setActiveStyleCart('Charts')}>
            Charts
          </button>
        </Navbar.Section>
        <Navbar.Section>
          <button onClick={ () => setActiveStyleCart('Components')}>
            Components
          </button>
        </Navbar.Section>
      </Navbar>}
      header={<Header height={60} p="xs">{/* Header content */}</Header>}
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      <ActiveStyleCard cardId={activeStyleCard} />
    </AppShell>
  );
}

export default StyleGuideApp;
