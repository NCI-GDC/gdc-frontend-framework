import V1RetiredPage from "src/pages/v1/[[...v1]]";
import { render } from "test-utils";

it("matches snapshot", () => {
  const { container } = render(<V1RetiredPage />);
  expect(container).toMatchSnapshot();
});
