import MutationsPage from "src/pages/ssms/[ssms]";
import { render } from "test-utils";

it("matches snapshot", () => {
  const { container } = render(<MutationsPage />);
  expect(container).toMatchSnapshot();
});
