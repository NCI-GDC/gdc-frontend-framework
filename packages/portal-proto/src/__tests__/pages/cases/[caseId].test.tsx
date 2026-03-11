import CaseSummaryPage from "src/pages/cases/[caseId]";
import { render } from "test-utils";

it("matches snapshot", () => {
  const { container } = render(<CaseSummaryPage />);
  expect(container).toMatchSnapshot();
});
