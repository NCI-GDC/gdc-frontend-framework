import CartPage from "src/pages/cart";
import { render } from "test-utils";

it("matches snapshot", () => {
  const { container } = render(<CartPage />);
  expect(container).toMatchSnapshot();
});
