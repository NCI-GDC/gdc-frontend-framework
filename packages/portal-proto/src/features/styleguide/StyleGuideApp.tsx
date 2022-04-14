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
        <Navbar.Section>Typography</Navbar.Section>
        <Navbar.Section>Colors</Navbar.Section>
        <Navbar.Section>Icons</Navbar.Section>
        <Navbar.Section>Charts</Navbar.Section>
        <Navbar.Section>Components</Navbar.Section>
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
