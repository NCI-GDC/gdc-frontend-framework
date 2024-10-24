import { render } from "test-utils";
import { Biospecimen } from "./Biospecimen";
import * as func from "@gff/core";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

const mockResponse = {
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
  shortest_dimension: null,
  submitter_id: "TCGA-BH-A0EA-01Z",
  time_between_clamping_and_freezing: null,
  time_between_excision_and_freezing: null,
  tissue_type: "Not Reported",
  tumor_code: null,
  tumor_code_id: null,
  tumor_descriptor: "Not Applicable",
  specimen_type: "Peripheral Blood NOS",
};

describe("<Biospecimen />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(func, "useCoreSelector").mockImplementation(jest.fn());
    jest.spyOn(func, "useCoreDispatch").mockImplementation(jest.fn());
  });

  it("should show Loading Overlay when fetching", () => {
    jest.spyOn(func, "useBiospecimenDataQuery").mockReturnValue({
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
    } as any);
    const { getByTestId } = render(
      <Biospecimen
        caseId="testId"
        bioId=""
        project_id="test_project_id"
        submitter_id="test_submitter_id"
      />,
    );

    expect(getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should not show error text when the results are NOT empty and should render a Biotree comp with given data", () => {
    jest.spyOn(func, "useBiospecimenDataQuery").mockReturnValue({
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
    } as any);
    jest.spyOn(func, "useCoreSelector").mockReturnValue(["test1id", "test2id"]);
    const { queryByLabelText, getAllByRole, getByText } = render(
      <Biospecimen
        caseId="testId"
        bioId=""
        project_id="test_project_id"
        submitter_id="test_submitter_id"
      />,
    );

    expect(queryByLabelText("Case ID not found")).toBeNull();
    expect(getAllByRole("button")).toBeDefined();
    expect(getByText("Peripheral Blood NOS")).toBeInTheDocument();
  });
});
