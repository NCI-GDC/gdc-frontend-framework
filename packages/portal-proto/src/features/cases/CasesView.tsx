import {
  selectCurrentCohortFilterSet,
  useCoreSelector,
  selectCart,
  useCoreDispatch,
  selectSelectedCases,
  useAllCases,
  SortBy,
  buildCohortGqlOperator,
  joinFilters,
  AnnotationDefaults,
} from "@gff/core";
import { Button, createStyles, Menu } from "@mantine/core";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import tw from "tailwind-styled-components";
import {
  VerticalTable,
  PaginationOptions,
  HandleChangeInput,
} from "../shared/VerticalTable";
import { ageDisplay, allFilesInCart, extractToArray } from "src/utils";
import { Row, TableInstance } from "react-table";
import CollapsibleRow from "../shared/CollapsibleRow";
import { IoMdArrowDropdown as Dropdown } from "react-icons/io";
import Link from "next/link";
import { SelectAlCasesButton, SelectCaseButton } from "./SelectCasesButton";
import { CasesCohortButton, CountsIcon } from "./CasesCohortButton";
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
  root: {
    "&[data-disabled]": {
      border: "1px solid gray",
      margin: "2px 0",
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
  status: {
    isFetching: boolean;
    isSuccess: boolean;
    isError: boolean;
  };
  setPageSize: Dispatch<SetStateAction<number>>;
  setPage: Dispatch<SetStateAction<number>>;
}

interface CellProps {
  value: string[];
  row: Row;
}

const useCohortFacetFilter = () => {
  return useCoreSelector((state) => selectCurrentCohortFilterSet(state));
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

const getAnnotationsLinkParams = (
  annotations: AnnotationDefaults[],
  case_id: string,
) => {
  if (annotations.length === 0) return null;

  if (annotations.length === 1) {
    return `https://portal.gdc.cancer.gov/annotations/${annotations[0].annotation_id}`;
  }
  return `https://portal.gdc.cancer.gov/annotations?filters={"content":[{"content":{"field":"annotations.case_id","value":["${case_id}"]},"op":"in"}],"op":"and"}`;
};

export const SlideCountsIcon = tw.div<{
  $count?: number;
}>`
${(p: { $count?: number }) =>
  p.$count !== undefined && p.$count > 0 ? "bg-primary" : "bg-base-dark"}
  ${(p: { $count?: number }) =>
    p.$count !== undefined && p.$count > 0
      ? "text-primary-contrast"
      : "text-base-contrast-lighter"}
  inline-flex
  items-center
  w-5
  h-4
  justify-center
  font-heading
  rounded-md

`;

export const ContextualCasesView: React.FC = () => {
  const [pageSize, setPageSize] = useState(10);
  const [offset, setOffset] = useState(0);
  const dispatch = useCoreDispatch();
  const currentCart = useCoreSelector((state) => selectCart(state));
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { classes } = useStyles();
  const cohortFilters = useCohortFacetFilter();
  const [sortBy, setSortBy] = useState<SortBy[]>([]);

  const { data, isFetching, isSuccess, isError, pagination } = useAllCases({
    fields: [
      "case_id",
      "submitter_id",
      "primary_site",
      "disease_type",
      "project.project_id",
      "project.program.name",
      "demographic.gender",
      "demographic.race",
      "demographic.ethnicity",
      "demographic.days_to_death",
      "demographic.vital_status",
      "diagnoses.primary_diagnosis",
      "diagnoses.age_at_diagnosis",
      "summary.file_count",
      "summary.data_categories.data_category",
      "summary.data_categories.file_count",
      "summary.experimental_strategies.experimental_strategy",
      "summary.experimental_strategies.file_count",
      "files.file_id",
      "files.access",
      "files.acl",
      "files.file_name",
      "files.file_size",
      "files.state",
      "files.data_type",
    ],
    size: pageSize,
    filters:
      searchTerm.length > 0
        ? buildCohortGqlOperator(
            joinFilters(cohortFilters, {
              mode: "or",
              root: {
                submitter_id: {
                  operator: "includes",
                  field: "submitter_id",
                  operands: [`*${searchTerm}*`],
                },
                case_id: {
                  operator: "includes",
                  field: "case_id",
                  operands: [`*${searchTerm}*`],
                },
              },
            }),
          )
        : buildCohortGqlOperator(cohortFilters),
    from: offset * pageSize,
    sortBy: sortBy,
  });

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
        const slideCount = getSlideCountFromCaseSummary(
          datum.experimental_strategies,
        );
        const isPlural = datum.filesCount > 1;
        return {
          selected: datum.case_uuid,
          slides: (
            <Link
              href={`/user-flow/workbench/MultipleImageViewerPage?caseId=${datum.case_uuid}`}
            >
              <Button
                compact
                disabled={slideCount === 0}
                leftIcon={
                  <GiMicroscope
                    className={`mt-0.5 ${
                      slideCount === 0 && "text-base-contrast-lightest"
                    }`}
                    size="1.25em"
                  />
                }
                size="xs"
                variant="outline"
                classNames={classes}
                className="my-2"
              >
                <SlideCountsIcon $count={slideCount}>
                  {slideCount === 0 ? "--" : slideCount}
                </SlideCountsIcon>
              </Button>
            </Link>
          ),
          cart: (
            <Menu position="bottom-start" classNames={classes}>
              <Menu.Target>
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
                  size="xs"
                  className={`${isAllFilesInCart && "bg-primary-darkest"}`}
                />
              </Menu.Target>
              <Menu.Dropdown>
                {numberOfFilesToRemove < datum.filesCount && (
                  <Menu.Item
                    icon={<BiAddToQueue />}
                    onClick={() => {
                      addToCart(datum.files, currentCart, dispatch);
                    }}
                  >
                    Add {datum.filesCount} Case {isPlural ? "files" : "file"} to
                    the Cart
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
                    Case {isPlural ? "files" : "file"} from the Cart
                  </Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
          ),
          case_id: datum.case_id,
          case_uuid: datum.case_uuid,
          project_id: datum.project_id,
          program: datum.program,
          primary_site: datum.primary_site,
          disease_type: datum.disease_type ?? "--",
          primary_diagnosis: datum?.primary_diagnosis ?? "--",
          age_at_diagnosis: ageDisplay(datum?.age_at_diagnosis),
          vital_status: datum?.vital_status ?? "--",
          days_to_death: ageDisplay(datum?.days_to_death),
          gender: datum?.gender ?? "--",
          race: datum?.race ?? "--",
          ethnicity: datum?.ethnicity ?? "--",
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
                {datum.annotations.length}
              </a>
            </Link>
          ) : (
            0
          ),
        };
      }),
    [data, currentCart, classes, dispatch],
  );

  const pickedCases: ReadonlyArray<string> = useCoreSelector((state) =>
    selectSelectedCases(state),
  );

  const sortByActions = (sortByObj) => {
    const COLUMN_ID_TO_FIELD = {
      case_id: "submitter_id",
      case_uuid: "case_id",
      project_id: "project.project_id",
      program: "project.program.name",
      primary_site: "primary_site",
      disease_type: "disease_type",
      vital_status: "demographic.vital_status",
      days_to_death: "demographic.days_to_death",
      gender: "demographic.gender",
      race: "demographic.race",
      ethnicity: "demographic.ethnicity",
      files: "summary.file_count",
      // annotations: "summary.case_count",
    };
    const tempSortBy = sortByObj.map((sortObj) => {
      ///const tempSortId = COLUMN_ID_TO_FIELD[sortObj.id];
      // map sort ids to api ids
      return {
        field: COLUMN_ID_TO_FIELD[sortObj.id],
        direction: sortObj.desc ? "desc" : "asc",
      };
    });
    setSortBy(tempSortBy);
  };

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
    { id: "project_id", columnName: "Project", visible: true },
    { id: "program", columnName: "Program", visible: false },
    { id: "primary_site", columnName: "Primary Site", visible: true },
    { id: "disease_type", columnName: "Disease Type", visible: false },
    {
      id: "primary_diagnosis",
      columnName: "Primary Diagnosis",
      visible: false,
      disableSortBy: true,
    },
    {
      id: "age_at_diagnosis",
      columnName: "Age at Diagnosis",
      visible: false,
      disableSortBy: true,
    },
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
    {
      id: "annotations",
      columnName: "Annotations",
      visible: true,
      disableSortBy: true,
    },
  ];

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "sortBy":
        sortByActions(obj.sortBy);
        break;
      case "newPageSize":
        setOffset(0);
        setPageSize(parseInt(obj.newPageSize));
        break;
      case "newPageNumber":
        setOffset(obj.newPageNumber - 1);
        break;
      case "newSearch":
        setOffset(0);
        setSearchTerm(obj.newSearch.toLowerCase());
        break;
    }
  };

  return (
    <div className="flex flex-col m-auto w-10/12">
      <VerticalTable
        tableData={cases || []}
        columns={columnListOrder}
        pagination={{ ...pagination, label: "cases" }}
        handleChange={handleChange}
        additionalControls={
          <div className="flex gap-2">
            <CasesCohortButton />
            <Menu width="target" classNames={classes}>
              <Menu.Target>
                <Button
                  variant="outline"
                  color="primary"
                  leftIcon={
                    pickedCases.length ? (
                      <CountsIcon $count={pickedCases.length}>
                        {pickedCases.length}{" "}
                      </CountsIcon>
                    ) : null
                  }
                  rightIcon={<Dropdown size="1.25rem" />}
                >
                  Biospecimen
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>JSON</Menu.Item>
                <Menu.Item>TSV</Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Menu width="target" classNames={classes}>
              <Menu.Target>
                <Button
                  variant="outline"
                  color="primary"
                  leftIcon={
                    pickedCases.length ? (
                      <CountsIcon $count={pickedCases.length}>
                        {pickedCases.length}{" "}
                      </CountsIcon>
                    ) : null
                  }
                  rightIcon={<Dropdown size="1.25rem" />}
                >
                  Clinical
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>JSON</Menu.Item>
                <Menu.Item>TSV</Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Button variant="outline" color="primary">
              JSON
            </Button>
            <Button variant="outline" color="primary">
              TSV
            </Button>
          </div>
        }
        tableTitle={`Total of ${pagination?.total} cases`}
        showControls={true}
        columnSorting={"manual"}
        selectableRow={false}
        search={{
          enabled: true,
        }}
        status={
          isFetching
            ? "pending"
            : isSuccess
            ? "fulfilled"
            : isError
            ? "rejected"
            : "uninitialized"
        }
      />
    </div>
  );
};
