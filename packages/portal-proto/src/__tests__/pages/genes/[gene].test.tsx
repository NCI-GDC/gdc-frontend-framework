import GenesPage from "src/pages/genes/[gene]";
import { render } from "test-utils";

it("matches snapshot", () => {
  const { container } = render(<GenesPage />);
  expect(container).toMatchSnapshot();
});
