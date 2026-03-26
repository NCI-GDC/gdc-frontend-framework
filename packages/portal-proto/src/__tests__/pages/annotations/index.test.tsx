import AnnotationsPage from "src/pages/annotations";
import { render } from "test-utils";

it("matches snapshot", async () => {
  const { container } = await render(<AnnotationsPage />);
  expect(container).toMatchSnapshot();
});
