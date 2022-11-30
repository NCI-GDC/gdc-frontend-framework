import {
  fetchCases,
  selectCurrentCohortGqlFilters,
  selectCohortCountsByName,
  useCoreDispatch,
  selectCasesData,
  useCoreSelector,
  GqlOperation,
  useCases,
} from "@gff/core";
import Link from "next/link";
import {
  createStyles,
  Text,
  LoadingOverlay,
  Table,
  Pagination,
  Select,
  ScrollArea,
} from "@mantine/core";
import { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { VerticalTable } from "../shared/VerticalTable";
import useStandardPagination from "@/hooks/useStandardPagination";

export const CasesTableHeader = tw.th`
bg-primary-lighter
text-primary-contrast-lighter
px-2
`;

export interface Case {
  readonly id: string;
  readonly submitterId: string;
  readonly primarySite: string;
  readonly projectId: string;
  readonly gender: string;
  readonly primaryDiagnosis: string;
  readonly tissueOrOrganOfOrigin: string;
}

export interface CasesViewProps {
  readonly cases?: Record<string, any>[];
  readonly handleCaseSelected?: (patient: Case) => void;
  readonly caption?: string;
}

export interface ContextualCasesViewProps {
  readonly handleCaseSelected?: (patient: Case) => void;
  caseId?: string;
}

const useCohortFacetFilter = (): GqlOperation => {
  return useCoreSelector((state) => selectCurrentCohortGqlFilters(state));
};

/**
 * TODO: This needs to move to core
 * @param pageSize
 * @param offset
 */
const useCohortCases = (pageSize = 10, offset = 0) => {
  const coreDispatch = useCoreDispatch();
  const cohortFilters = useCohortFacetFilter();
  // const cases = useCoreSelector((state) => selectCasesData(state));
  const { data, error, pagination, isError, isFetching, isSuccess } = useCases({
    fields: [
      "case_id",
      "submitter_id",
      "primary_site",
      "project.project_id",
      "project.disease_type",
      "project.program.name",
      "diagnoses.primary_diagnosis",
      "diagnoses.tissue_or_organ_of_origin",
      "diagnoses.age_at_diagnosis",
      "demographic.race",
      "demographic.gender",
      "demographic.ethnicity",
      "demographic.vital_status",
      "demographic.days_to_death",
      "files.file_id",
      "summary.data_categories.file_count",
      "summary.data_categories.data_category",
      "summary.experimental_strategies.experimental_strategy",
      "summary.experimental_strategies.file_count",
      // annotation
    ],
    filters: cohortFilters, // TODO: move filter setting to core
    size: pageSize,
    from: offset * pageSize,
  });

  // cohortFilters is generated each time, use string representation
  // to control when useEffects are called

  // console.log({cohortFilters})
  const filters = JSON.stringify(cohortFilters);

  console.log({ cohortFilters });
  console.log({ casedata: data });

  // useEffect(() => {
  //   coreDispatch(
  //     fetchCases({
  //       fields: [
  //         "case_id",
  //         "submitter_id",
  //         "primary_site",
  //         "project.project_id",
  //         "demographic.gender",
  //         "diagnoses.primary_diagnosis",
  //         "diagnoses.tissue_or_organ_of_origin",
  //       ],
  //       filters: cohortFilters, // TODO: move filter setting to core
  //       size: pageSize,
  //       from: offset * pageSize,
  //     }),
  //   );
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [filters, pageSize, offset]);

  return {
    data: data,
    error: error,
    isUninitialized: false,
    isFetching,
    isSuccess,
    isError,
    pagination,
  };
};

export const ContextualCasesView: React.FC<ContextualCasesViewProps> = (
  props: ContextualCasesViewProps,
) => {
  // TODO useContextualCases() that filters based on the context
  const [pageSize, setPageSize] = useState(10);
  const [activePage, setPage] = useState(1);
  const { data } = useCohortCases(pageSize, activePage);
  const [pages, setPages] = useState(10);
  const caseCounts = useCoreSelector((state) =>
    selectCohortCountsByName(state, "caseCounts"),
  );

  useEffect(() => {
    setPages(Math.ceil(caseCounts / pageSize));
  }, [caseCounts, pageSize]);

  const handlePageSizeChange = (x: string) => {
    setPageSize(parseInt(x));
  };

  // this mapping logic should get moved to a selector.  and the
  // case model probably needs to be generalized or generated.

  console.log(data);
  const cases = data?.map((datum) => ({
    id: datum.case_id,
    submitterId: datum.submitter_id,
    primarySite: datum.primary_site,
    projectId: datum.project?.project_id,
    gender: datum.demographic?.gender,
    primaryDiagnosis: datum.diagnoses?.[0]?.primary_diagnosis,
    tissueOrOrganOfOrigin: datum.diagnoses?.[0]?.tissue_or_organ_of_origin,
  }));

  return (
    <div className="flex flex-col m-auto w-10/12">
      <div>
        <CasesView
          cases={cases}
          caption={`Showing ${pageSize} of ${caseCounts} Cases`}
          handleCaseSelected={props.handleCaseSelected}
        />
        <div className="flex flex-row items-center justify-start border-t border-base-light">
          <p className="px-2">Page Size:</p>
          <Select
            size="sm"
            radius="md"
            onChange={handlePageSizeChange}
            value={pageSize.toString()}
            data={[
              { value: "10", label: "10" },
              { value: "20", label: "20" },
              { value: "40", label: "40" },
              { value: "100", label: "100" },
            ]}
            aria-label="Select page size"
          />
          <Pagination
            size="sm"
            radius="md"
            color="accent"
            className="ml-auto"
            page={activePage}
            onChange={(x) => setPage(x)}
            total={pages}
          />
        </div>
      </div>
    </div>
  );
};

const useStyles = createStyles((theme) => ({
  header: {
    position: "sticky",
    top: 0,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

export const CasesView: React.FC<CasesViewProps> = (props: CasesViewProps) => {
  const { cases } = props;
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  const columnListOrder = [
    // cart (default)
    // slides (default)
    { id: "submitterId", columnName: "Case ID", visible: true },
    { id: "id", columnName: "Case UUID", visible: false },
    { id: "projectId", columnName: "Project", visible: true },
    { id: "programName", columnName: "Program", visible: false },
    { id: "primarySite", columnName: "Primary Site", visible: true },
    // Disease Type
    // Primary Diagnosis
    // Age at Diagnosis display as "X years Y days" in the same way as age_at_diagnosis
    // Vital Status
    // Days to Death display as "X years Y days" in the same way as age_at_diagnosis
    { id: "gender", columnName: "Gender", visible: true },
    // Race
    // Ethnicity
    // Files # files associated with the case (default)
    // Data Category (default) -> more details in the ticket
    // Experimental Strategy -> more details in the ticket
    // Annotations (Default) -> same as case summary logic
  ];

  console.log({ cases });

  return (
    <ScrollArea
      sx={{ height: 300 }}
      onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
    >
      <LoadingOverlay visible={cases === undefined} color="primary" />
      <VerticalTable
        tableData={cases || []}
        columns={columnListOrder}
        handleChange={() => {}}
        selectableRow={true}
      />
      {/* <Table verticalSpacing="xs" striped highlightOnHover>
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <tr className="bg-base-lighter ">
            <CasesTableHeader>Case</CasesTableHeader>
            <CasesTableHeader>Project</CasesTableHeader>
            <CasesTableHeader>Primary Site</CasesTableHeader>
            <CasesTableHeader>Gender</CasesTableHeader>
            <CasesTableHeader>Primary Diagnosis</CasesTableHeader>
            <CasesTableHeader className="whitespace-nowrap">
              Tissue/Organ of Origin
            </CasesTableHeader>
          </tr>
        </thead>
        <tbody>
          {cases?.map((c, i) => (
            <tr key={c.id} className={i % 2 == 0 ? "bg-base-lightest" : ""}>
              <td className="px-2 break-all">
                <Link
                  href={{
                    pathname: "/cases/[slug]",
                    query: { slug: c.id },
                  }}
                  passHref
                >
                  <Text variant="link" component="a">
                    {c.submitterId}
                  </Text>
                </Link>
              </td>
              <td className="px-2 whitespace-nowrap">{c.projectId}</td>
              <td className="px-2">{c.primarySite}</td>
              <td className="px-2">{c.gender}</td>
              <td className="px-2">{c.primaryDiagnosis}</td>
              <td className="px-2">{c.tissueOrOrganOfOrigin}</td>
            </tr>
          ))}
        </tbody>
      </Table> */}
    </ScrollArea>
  );
};
