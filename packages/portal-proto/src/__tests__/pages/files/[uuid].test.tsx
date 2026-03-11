import FilePage from "src/pages/files/[uuid]";
import { render } from "test-utils";

it("matches snapshot", () => {
  const { container } = render(<FilePage />);
  expect(container).toMatchSnapshot();
});
