import { Divider, Title } from '@mantine/core';

const Typefaces = () => {
  return (
    <div className="flex flex-col justify-center prose font-montserrat">
      <h1>Typefaces</h1>
      <Title className="font-bold font-lg" order={1}>This is h1 title</Title>
      <Divider />
      <Title order={2}>This is h2 title</Title>
      <Divider />
      <Title order={3}>This is h3 title</Title>
      <Divider />
      <Title order={4}>This is h4 title</Title>
      <Divider />
      <Title order={5}>This is h5 title</Title>
      <Divider />
      <Title order={6}>This is h6 title</Title>
      <Divider />
    </div>
  );
}

export default Typefaces;
