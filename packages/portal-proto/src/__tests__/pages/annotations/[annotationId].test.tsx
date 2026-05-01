import AnnotationsSummaryPage from "src/pages/annotations/[annotationId]";
import { render } from "test-utils";

it("matches snapshot", async () => {
  const { container } = await render(<AnnotationsSummaryPage />);
  expect(container).toMatchSnapshot();
});
