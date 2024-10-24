import EnclavePortalApp from "./_app";
import { render } from "@testing-library/react";

describe("app test", () => {
  test("renders hello world", () => {
    const { getByText } = render(<EnclavePortalApp />);

    expect(getByText("Hello, world")).toBeInTheDocument();
  });
});
