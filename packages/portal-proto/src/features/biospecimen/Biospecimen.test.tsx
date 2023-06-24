import { render } from "@testing-library/react";
import { Biospecimen } from "./Biospecimen";
import * as func from "@gff/core";

const mockResponse = {
  composition: null,
  current_weight: null,
  days_to_collection: null,
  days_to_sample_procurement: 0,
  freezing_method: null,
  initial_weight: null,
  intermediate_dimension: null,
  is_ffpe: "true",
  longest_dimension: null,
  oct_embedded: "No",
  pathology_report_uuid: null,
  portions: {
    hits: { edges: [{ node: { portion_id: "afadfkldjls" } }], total: 1 },
  },
  preservation_method: "FFPE",
  sample_id: "55864d86-dab8-47bb-a3e3-8cfb198b06c1",
  sample_type: "Primary Tumor",
  sample_type_id: "01",
  shortest_dimension: null,
  submitter_id: "TCGA-BH-A0EA-01Z",
  time_between_clamping_and_freezing: null,
  time_between_excision_and_freezing: null,
  tissue_type: "Not Reported",
  tumor_code: null,
  tumor_code_id: null,
  tumor_descriptor: null,
};

describe("<Biospecimen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(func, "useCoreSelector").mockImplementation(jest.fn());
    jest.spyOn(func, "useCoreDispatch").mockImplementation(jest.fn());
  });

  it("should show Loading Overlay when fetching", () => {
    jest.spyOn(func, "useBiospecimenData").mockReturnValue({
      data: {
        files: { hits: { edges: [] } },
        samples: {
          hits: {
            edges: [],
          },
        },
      },
      isError: false,
      isFetching: true,
      isSuccess: true,
      isUninitialized: false,
    });
    const { getByTestId } = render(<Biospecimen caseId="testId" bioId="" />);

    expect(getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should not show error text when the results are NOT empty and should render a Biotree comp with given data", () => {
    jest.spyOn(func, "useBiospecimenData").mockReturnValue({
      data: {
        files: { hits: { edges: [] } },
        samples: {
          hits: {
            edges: [{ node: mockResponse }],
          },
        },
      },
      isError: false,
      isFetching: false,
      isSuccess: true,
      isUninitialized: false,
    });
    jest.spyOn(func, "useCoreSelector").mockReturnValue(["test1id", "test2id"]);
    const { queryByLabelText, getAllByRole, getByText } = render(
      <Biospecimen caseId="testId" bioId="" />,
    );

    expect(queryByLabelText("Case ID not found")).toBeNull();
    expect(getAllByRole("button")).toBeDefined();
    expect(getByText("Primary Tumor")).toBeInTheDocument();
  });
});
