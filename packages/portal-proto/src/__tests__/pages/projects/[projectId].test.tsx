import ProjectSummaryPage from "src/pages/projects/[projectId]";
import { render } from "test-utils";

it("matches snapshot", () => {
  const { container } = render(<ProjectSummaryPage />);
  expect(container).toMatchSnapshot();
});
