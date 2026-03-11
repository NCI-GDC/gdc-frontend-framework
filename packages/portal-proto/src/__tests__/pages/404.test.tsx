import Custom404Page from "src/pages/404";
import { render } from "test-utils";

it("matches snapshot", () => {
  const { container } = render(<Custom404Page />);
  expect(container).toMatchSnapshot();
});
