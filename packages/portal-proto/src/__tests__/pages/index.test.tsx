import IndexPage from "src/pages";
import { render } from "test-utils";

jest.mock("@nci-gdc/sapien", () => ({
  __esModule: true,
  createHumanBody: jest.fn(),

  colorCodes: new Proxy(
    {},
    {
      get: () => "#000000",
    },
  ),
}));

it("matches snapshot", () => {
  const { container } = render(<IndexPage />);
  expect(container).toMatchSnapshot();
});
