import { coreStore } from "../../store";
import { endpointSlice } from "../gdcapi";
import { casesApiSlice } from "./casesSlice";

const caseHit = {
  id: "case-uuid-1",
  case_id: "case-uuid-1",
  submitter_id: "TCGA-01",
  primary_site: "Breast",
  disease_type: "Ductal and Lobular Neoplasms",
  project: { project_id: "TCGA-BRCA", program: { name: "TCGA" } },
  demographic: {
    vital_status: "Alive",
    days_to_death: null,
    sex_at_birth: "female",
    race: "white",
    ethnicity: "not hispanic or latino",
  },
  diagnoses: [
    {
      primary_diagnosis: "Infiltrating duct carcinoma, NOS",
      age_at_diagnosis: 20000,
    },
  ],
  summary: {
    file_count: 3,
    data_categories: [{ data_category: "Clinical", file_count: 1 }],
    experimental_strategies: [{ experimental_strategy: "WXS", file_count: 2 }],
  },
  files: [
    {
      file_id: "file-1",
      file_name: "sample.bam",
      file_size: 10,
      access: "controlled",
      state: "released",
      acl: ["phs000178"],
      data_type: "Aligned Reads",
      md5sum: "not-mapped",
    },
  ],
};

const pagination = {
  count: 1,
  total: 1,
  size: 10,
  from: 0,
  sort: "",
  page: 1,
  pages: 1,
};

const annotation = {
  annotation_id: "annotation-1",
  case_id: "case-uuid-1",
  category: "Item flagged DNU",
};

const casesResponse = (hits: unknown[]) => ({
  data: { hits, pagination },
  warnings: {},
});

describe("all cases endpoint", () => {
  let respondTo: { cases: () => unknown; annotations: () => unknown };
  const fetchSpy: jest.SpyInstance = jest
    .spyOn(global, "fetch")
    .mockImplementation(
      jest.fn((url: string) => {
        const response = url.endsWith("/cases")
          ? respondTo.cases()
          : respondTo.annotations();
        return Promise.resolve(response);
      }) as jest.Mock,
    );

  const ok = (body: unknown) => ({ ok: true, json: () => body });

  const requestBodiesTo = (path: string) =>
    fetchSpy.mock.calls
      .filter(([url]) => url.endsWith(path))
      .map(([, init]) => JSON.parse(init.body));

  const fetchAllCases = () =>
    coreStore.dispatch(
      casesApiSlice.endpoints.allCases.initiate(
        { size: 10, from: 0 },
        { subscribe: false },
      ),
    );

  afterAll(() => {
    coreStore.dispatch(endpointSlice.util.resetApiState());
  });

  beforeEach(() => {
    jest.clearAllMocks();
    coreStore.dispatch(endpointSlice.util.resetApiState());
    respondTo = {
      cases: () => ok(casesResponse([caseHit])),
      annotations: () => ok(casesResponse([annotation])),
    };
  });

  test("returns the cases with their annotations and the pagination", async () => {
    const { data } = await fetchAllCases();

    expect(data).toEqual({
      pagination,
      cases: [
        {
          case_id: "TCGA-01",
          case_uuid: "case-uuid-1",
          submitter_id: "TCGA-01",
          project_id: "TCGA-BRCA",
          program: "TCGA",
          primary_site: "Breast",
          disease_type: "Ductal and Lobular Neoplasms",
          primary_diagnosis: "Infiltrating duct carcinoma, NOS",
          age_at_diagnosis: 20000,
          vital_status: "Alive",
          days_to_death: null,
          sex_at_birth: "female",
          race: "white",
          ethnicity: "not hispanic or latino",
          filesCount: 3,
          data_categories: [{ data_category: "Clinical", file_count: 1 }],
          experimental_strategies: [
            { experimental_strategy: "WXS", file_count: 2 },
          ],
          annotations: [annotation],
          files: [
            {
              file_id: "file-1",
              file_name: "sample.bam",
              file_size: 10,
              access: "controlled",
              state: "released",
              acl: ["phs000178"],
              data_type: "Aligned Reads",
            },
          ],
        },
      ],
    });
    expect(requestBodiesTo("/annotations")[0].filters).toEqual({
      op: "in",
      content: { field: "annotations.case_id", value: ["case-uuid-1"] },
    });
  });

  test("does not request annotations when no cases match", async () => {
    respondTo.cases = () => ok(casesResponse([]));

    const { data } = await fetchAllCases();

    expect(data).toEqual({ cases: [], pagination });
    expect(requestBodiesTo("/annotations")).toHaveLength(0);
  });

  test("fails when the cases request fails", async () => {
    respondTo.cases = () => ({
      ok: false,
      status: 500,
      statusText: "Server Error",
      text: () => Promise.resolve("boom"),
    });

    const { isError } = await fetchAllCases();

    expect(isError).toBe(true);
  });
});
