import * as core from "@gff/core";
import { render } from "test-utils";
import Cart from "./Cart";

describe("<Cart />", () => {
  beforeEach(() => {
    jest.spyOn(core, "useFetchUserDetailsQuery").mockReturnValue({} as any);
  });

  it("Displays empty state", () => {
    jest.spyOn(core, "useCartSummaryQuery").mockReturnValue({} as any);
    jest.spyOn(core, "useCoreSelector").mockReturnValue([]);

    const { getByText } = render(<Cart />);
    expect(getByText("Your cart is empty.")).toBeInTheDocument();
  });

  it("Displays cart summary", () => {
    jest.spyOn(core, "useCartSummaryQuery").mockReturnValue({
      data: {
        total_doc_count: 1,
        total_case_count: 30,
        total_file_size: 400,
        byProject: [],
      },
    } as any);
    jest.spyOn(core, "useCoreSelector").mockReturnValue([
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
    jest.spyOn(core, "useCoreDispatch").mockReturnValue(jest.fn());
    jest.spyOn(core, "useGetFilesQuery").mockReturnValue({} as any);

    const { getByTestId } = render(<Cart />);
    expect(getByTestId("cart-header").textContent).toContain("1 File");
    expect(getByTestId("cart-header").textContent).toContain("30 Cases");
  });
});
