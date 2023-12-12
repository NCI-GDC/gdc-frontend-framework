import { Divider } from "@mantine/core";

const Typefaces = () => {
  return (
    <article className="prose font-montserrat text-primary-content-dark prose-xs">
      <p className="prose font-medium text-2xl">Typefaces</p>
      <div className="text-primary-content-dark font-montserrat font-medium">
        <h1 className="text-primary-content-dark">This is H1</h1>
        <Divider />
        <h2 className="text-primary-content-dark">This is h2 title</h2>
        <Divider />
        <h3 className="text-primary-content-dark">This is h3 title</h3>
        <Divider />
        <h4 className="text-primary-content-dark">This is h4 title</h4>
        <Divider />
        <h5 className="text-primary-content-dark">This is h5 title</h5>
        <Divider />
      </div>
    </article>
  );
};

export default Typefaces;
