import {
  selectCurrentCohortGqlFilters,
  selectCohortCountsByName,
  useCoreSelector,
  GqlOperation,
  selectCart,
  useQlCases,
  useCoreDispatch,
} from "@gff/core";
import { Button, createStyles, LoadingOverlay, Menu } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import tw from "tailwind-styled-components";
import {
  VerticalTable,
  PaginationOptions,
  HandleChangeInput,
} from "../shared/VerticalTable";
import useStandardPagination from "@/hooks/useStandardPagination";
import { ageDisplay, allFilesInCart, extractToArray } from "src/utils";
import { Row, TableInstance } from "react-table";
import CollapsibleRow from "../shared/CollapsibleRow";
import FunctionButton from "@/components/FunctionButton";
import { IoMdArrowDropdown as Dropdown } from "react-icons/io";
import Link from "next/link";
import { SelectAlCasesButton, SelectCaseButton } from "./SelectCasesButton";
import CasesCohortButton from "./CasesCohortButton";
import { GiMicroscope } from "react-icons/gi";
import { FaShoppingCart as CartIcon } from "react-icons/fa";
import { BiAddToQueue } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { addToCart, removeFromCart } from "../cart/updateCart";

export const CasesTableHeader = tw.th`
bg-primary-lighter
text-primary-contrast-lighter
px-2
`;

const useStyles = createStyles((theme) => ({
  item: {
    "&[data-hovered]": {
      backgroundColor:
        theme.colors[theme.primaryColor][theme.fn.primaryShade()],
      color: theme.white,
    },
  },
}));

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
  pagination?: PaginationOptions;
}

interface CellProps {
  value: string[];
  row: Row;
}

export interface ContextualCasesViewProps {
  readonly handleCaseSelected?: (patient: Case) => void;
  caseId?: string;
}

const useCohortFacetFilter = (): GqlOperation => {
  return useCoreSelector((state) => selectCurrentCohortGqlFilters(state));
};

const getSlideCountFromCaseSummary = (
  experimental_strategies: Array<{
    experimental_strategy: string;
    file_count: number;
  }>,
): number => {
  const slideTypes = ["Diagnostic Slide", "Tissue Slide"];
  return (experimental_strategies || []).reduce(
    (slideCount, { file_count, experimental_strategy }) =>
      slideTypes.includes(experimental_strategy)
        ? slideCount + file_count
        : slideCount,
    0,
  );
};

export const SlideCountsIcon = tw.div<{
  $count?: number;
}>`
${(p: { $count?: number }) =>
  p.$count !== undefined && p.$count > 0 ? "bg-primary" : "bg-base"}
inline-flex
items-center
w-5
h-4
justify-center
text-primary-contrast
font-heading
rounded-md

`;

export const ContextualCasesView: React.FC<ContextualCasesViewProps> = (
  props: ContextualCasesViewProps,
) => {
  // TODO useContextualCases() that filters based on the context
  const [pageSize, setPageSize] = useState(10);
  const [activePage, setPage] = useState(1);
  const cohortFilters = useCohortFacetFilter();
  const dispatch = useCoreDispatch();
  const currentCart = useCoreSelector((state) => selectCart(state));
  const { data } = useQlCases({
    filters: cohortFilters,
    cases_size: pageSize,
    cases_offset: (activePage - 1) * pageSize,
    score: "annotations.annotation_id",
  });

  console.log({ data });
  const caseCounts = useCoreSelector((state) =>
    selectCohortCountsByName(state, "caseCounts"),
  );

  const getAnnotationsLinkParams = (
    annotations: {
      annotation_id: string;
      total: number;
    },
    case_id: string,
  ) => {
    if (annotations.total === 0) return null;

    if (annotations.total === 1) {
      return `https://portal.gdc.cancer.gov/annotations/${annotations.annotation_id}`;
    }
    return `https://portal.gdc.cancer.gov/annotations?filters={"content":[{"content":{"field":"annotations.case_id","value":["${case_id}"]},"op":"in"}],"op":"and"}`;
  };
  const { classes } = useStyles();
  console.log("Current cart: ", currentCart);
  const cases = useMemo(
    () =>
      data?.map((datum) => {
        const isAllFilesInCart = datum?.files
          ? allFilesInCart(currentCart, datum.files)
          : false;
        const numberOfFilesToRemove = datum.files
          ?.map((file) =>
            currentCart.filter(
              (data_file) => data_file.file_id === file.file_id,
            ),
          )
          .filter((item) => item.length > 0).length;
        console.log({ numberOfFilesToRemove });
        const slideCount = getSlideCountFromCaseSummary(
          datum.experimental_strategies,
        );
        return {
          selected: datum.case_uuid,
          slides: (
            <div>
              <Link
                href={`/user-flow/workbench/MultipleImageViewerPage?caseId=${datum.case_uuid}`}
              >
                <Button
                  compact
                  disabled={slideCount === 0}
                  leftIcon={<GiMicroscope className="mt-0.5" size="1.25em" />}
                  size="xs"
                  variant="outline"
                >
                  <SlideCountsIcon $count={slideCount}>
                    {slideCount === 0 ? "--" : slideCount}
                  </SlideCountsIcon>
                </Button>
              </Link>
            </div>
          ),
          cart: (
            <Menu position="bottom-start" classNames={classes}>
              <Menu.Target>
                {/* // height and width should be same as the slides button */}
                <Button
                  leftIcon={
                    <CartIcon
                      className={
                        isAllFilesInCart && "text-primary-contrast-darkest"
                      }
                    />
                  }
                  rightIcon={
                    <Dropdown
                      size="1.25rem"
                      className={
                        isAllFilesInCart && "text-primary-contrast-darkest"
                      }
                    />
                  }
                  variant="outline"
                  compact
                  classNames={{
                    leftIcon: "m-0",
                  }}
                  className={isAllFilesInCart && "bg-primary-darkest"}
                />
              </Menu.Target>
              {/* // singular / plural */}
              <Menu.Dropdown>
                {numberOfFilesToRemove < datum.filesCount && (
                  <Menu.Item
                    icon={<BiAddToQueue />}
                    onClick={() => {
                      addToCart(datum.files, currentCart, dispatch);
                    }}
                  >
                    Add {datum.filesCount} Case files to the Cart
                  </Menu.Item>
                )}

                {numberOfFilesToRemove > 0 && (
                  <Menu.Item
                    icon={<BsTrash />}
                    onClick={() => {
                      removeFromCart(datum.files, currentCart, dispatch);
                    }}
                  >
                    Remove{" "}
                    {numberOfFilesToRemove === 0
                      ? datum.filesCount
                      : numberOfFilesToRemove}{" "}
                    Case files from the Cart
                  </Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
          ),
          case_id: datum.case_id,
          case_uuid: datum.case_uuid,
          projectId: datum.project_id,
          program: datum.program,
          primarySite: datum.primary_site,
          disease_type: datum.disease_type,
          primary_diagnosis: datum?.primary_diagnosis,
          age_at_diagnosis: ageDisplay(datum?.age_at_diagnosis),
          vital_status: datum?.vital_status,
          days_to_death: ageDisplay(datum?.days_to_death),
          gender: datum?.gender,
          race: datum?.race,
          ethnicity: datum?.ethnicity,
          files: datum?.filesCount?.toLocaleString(),
          data_categories: extractToArray(
            datum?.data_categories,
            "data_category",
          ),
          experimental_strategies: extractToArray(
            datum?.experimental_strategies,
            "experimental_strategy",
          ),
          annotations: getAnnotationsLinkParams(
            datum.annotations,
            datum.case_uuid,
          ) ? (
            <Link
              href={getAnnotationsLinkParams(
                datum.annotations,
                datum.case_uuid,
              )}
              passHref
            >
              <a className="text-utility-link underline" target={"_blank"}>
                {datum.annotations.total}
              </a>
            </Link>
          ) : (
            0
          ),
        };
      }),
    [data, currentCart],
  );

  return (
    <div className="flex flex-col m-auto w-10/12">
      <div>
        <CasesView
          cases={cases}
          caption={`Showing ${pageSize} of ${caseCounts} Cases`}
          handleCaseSelected={props.handleCaseSelected}
          // pagination={{ ...pagination, label: "cases" }}
        />
      </div>
    </div>
  );
};

export const CasesView: React.FC<CasesViewProps> = ({
  cases,
  pagination,
}: CasesViewProps) => {
  const columnListOrder = [
    {
      id: "selected",
      visible: true,
      columnName: ({ data }: TableInstance) => {
        const caseIds = data.map((x) => x.selected);
        return <SelectAlCasesButton caseIds={caseIds} />;
      },
      Cell: ({ value }: { value: string }) => {
        return <SelectCaseButton caseId={value} />;
      },
      disableSortBy: true,
    },
    {
      id: "cart",
      columnName: "Cart",
      visible: true,
      disableSortBy: true,
    },
    {
      id: "slides",
      columnName: "Slides",
      visible: true,
      disableSortBy: true,
    },

    { id: "case_id", columnName: "Case ID", visible: true },
    { id: "case_uuid", columnName: "Case UUID", visible: false },
    { id: "projectId", columnName: "Project", visible: true },
    { id: "program", columnName: "Program", visible: false },
    { id: "primarySite", columnName: "Primary Site", visible: true },
    { id: "disease_type", columnName: "Disease Type", visible: false },
    {
      id: "primary_diagnosis",
      columnName: "Primary Diagnosis",
      visible: false,
    },
    { id: "age_at_diagnosis", columnName: "Age at Diagnosis", visible: false },
    { id: "vital_status", columnName: "Vital Status", visible: false },
    { id: "days_to_death", columnName: "Days to Death", visible: false },
    { id: "gender", columnName: "Gender", visible: true },
    { id: "race", columnName: "Race", visible: false },
    { id: "ethnicity", columnName: "Ethnicity", visible: false },
    { id: "files", columnName: "Files", visible: true },
    {
      id: "data_categories",
      columnName: "Data Category",
      visible: true,
      Cell: ({ value, row }: CellProps) => (
        <CollapsibleRow value={value} row={row} label="Data Categories" />
      ),
      disableSortBy: true,
    },
    {
      id: "experimental_strategies",
      columnName: "Experimental Strategy",
      visible: false,
      Cell: ({ value, row }: CellProps) => (
        <CollapsibleRow
          value={value}
          row={row}
          label="Experimental Strategies"
        />
      ),
      disableSortBy: true,
    },
    { id: "annotations", columnName: "Annotations", visible: true },
  ];

  // const {
  //   handlePageChange,
  //   handlePageSizeChange,
  //   page,
  //   pages,
  //   size,
  //   from,
  //   total,
  //   displayedData,
  // } = useStandardPagination(cases || []);

  // const handleChange = (obj: HandleChangeInput) => {
  //   switch (Object.keys(obj)?.[0]) {
  //     case "newPageSize":
  //       handlePageSizeChange(obj.newPageSize);
  //       break;
  //     case "newPageNumber":
  //       handlePageChange(obj.newPageNumber);
  //       break;
  //   }
  // };

  return (
    <>
      <LoadingOverlay visible={cases === undefined} color="primary" />
      <VerticalTable
        tableData={cases || []}
        columns={columnListOrder}
        // pagination={{
        //   page,
        //   pages,
        //   size,
        //   from,
        //   total,
        // }}
        // handleChange={handleChange}
        additionalControls={
          <div className="flex gap-2">
            {/* need to be diff */}
            <CasesCohortButton />
            <Menu width="target">
              <Menu.Target>
                <FunctionButton
                  className="ml-2"
                  rightIcon={<Dropdown size="1.25rem" />}
                >
                  Biospecimen
                </FunctionButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>JSON</Menu.Item>
                <Menu.Item>TSV</Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Menu width="target">
              <Menu.Target>
                <FunctionButton
                  className="ml-2"
                  rightIcon={<Dropdown size="1.25rem" />}
                >
                  Clinical
                </FunctionButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>JSON</Menu.Item>
                <Menu.Item>TSV</Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <FunctionButton>JSON</FunctionButton>
            <FunctionButton>TSV</FunctionButton>
          </div>
        }
        showControls={true}
        columnSorting={"manual"}
        selectableRow={false}
        search={{
          enabled: true,
        }}
      />
    </>
  );
};
