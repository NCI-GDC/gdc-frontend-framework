import MultipleImageViewerPage from "src/pages/image-viewer/MultipleImageViewerPage";
import { render } from "test-utils";

it("matches snapshot", () => {
  const { container } = render(<MultipleImageViewerPage />);
  expect(container).toMatchSnapshot();
});
