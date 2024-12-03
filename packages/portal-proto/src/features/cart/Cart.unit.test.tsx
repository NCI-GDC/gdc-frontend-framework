import { render } from "test-utils";
import Cart from "./Cart";
import {
  useCartSummaryQuery,
  useCoreSelector,
  useFetchUserDetailsQuery,
  useGetFilesQuery,
} from "@gff/core";

jest.mock("@gff/core", () => ({
  ...jest.requireActual("@gff/core"),
  useCoreDispatch: jest.fn(),
  useCoreSelector: jest.fn(),
  useCartSummaryQuery: jest.fn(),
  useFetchUserDetailsQuery: jest.fn(),
  useGetFilesQuery: jest.fn(),
}));

describe("<Cart />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Displays empty state", () => {
    jest.mocked(useCoreSelector).mockImplementation(() => []);
    jest.mocked(useCartSummaryQuery).mockImplementation(() => ({} as any));
    jest.mocked(useFetchUserDetailsQuery).mockImplementation(() => ({} as any));

    const { getByText } = render(<Cart />);
    expect(getByText("Your cart is empty.")).toBeInTheDocument();
  });

  it("Displays cart summary", () => {
    jest.mocked(useCoreSelector).mockImplementation(() => [
      {
        access: "open",
        acl: [],
        file_id: "1",
        file_size: 400,
        state: "released",
        project_id: "TCGA",
        file_name: "filo",
      },
    ]);
    jest.mocked(useCartSummaryQuery).mockImplementation(
      () =>
        ({
          data: {
            total_doc_count: 1,
            total_case_count: 30,
            total_file_size: 400,
            byProject: [],
          },
        } as any),
    );
    jest.mocked(useFetchUserDetailsQuery).mockImplementation(() => ({} as any));
    jest.mocked(useGetFilesQuery).mockImplementation(() => ({} as any));

    const { getByTestId } = render(<Cart />);
    expect(getByTestId("cart-header").textContent).toContain("1 File");
    expect(getByTestId("cart-header").textContent).toContain("30 Cases");
  });
});
