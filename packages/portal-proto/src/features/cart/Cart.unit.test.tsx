import * as core from "@gff/core";
import { render } from "test-utils";
import Cart from "./Cart";
import userEvent from "@testing-library/user-event";

describe("<Cart />", () => {
  beforeEach(() => {
    jest.spyOn(core, "useUserDetails").mockReturnValue({} as any);
  });

  it("Displays empty state", () => {
    jest.spyOn(core, "useCartSummary").mockReturnValue({} as any);
    jest.spyOn(core, "useCoreSelector").mockReturnValue([]);

    const { getByText } = render(<Cart />);
    expect(getByText("Your cart is empty.")).toBeInTheDocument();
  });

  it("Displays cart summary", () => {
    jest.spyOn(core, "useCartSummary").mockReturnValue({
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

  it("should only display download info header initially", () => {
    jest.spyOn(core, "useCartSummary").mockReturnValue({
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

    const { getByText, queryByTestId } = render(<Cart />);
    expect(getByText("How to download files in my cart?")).toBeInTheDocument();
    expect(queryByTestId("download-info")).toBeNull();
  });

  it("should show download details when expanded", async () => {
    jest.spyOn(core, "useCartSummary").mockReturnValue({
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

    const {
      getByText,
      getByTestId,
      queryByTestId,
      queryByText,
      getByLabelText,
    } = render(<Cart />);
    expect(getByText("How to download files in my cart?")).toBeInTheDocument();
    expect(queryByTestId("download-info")).toBeNull();

    // expand
    await userEvent.click(getByLabelText("expand more button"));
    expect(getByTestId("download-info")).toBeDefined();
    expect(getByText("Download Manifest:")).toBeInTheDocument();

    // collapse
    await userEvent.click(getByLabelText("collapse button"));
    expect(queryByTestId("download-info")).toBeNull();
    expect(queryByText("Download Manifest:")).toBeNull();
  });
});
