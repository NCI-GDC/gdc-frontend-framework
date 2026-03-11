import ManageSetsPage from "src/pages/manage_sets";
import { render } from "test-utils";

it("matches snapshot", () => {
  const { container } = render(<ManageSetsPage />);
  expect(container).toMatchSnapshot();
});
