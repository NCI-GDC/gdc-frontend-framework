import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  useCoreSelector,
  selectCart,
  useCoreDispatch,
  selectSelectedCases,
  useAllCases,
  SortBy,
  selectCurrentCohortFilters,
} from "@gff/core";
import { Button, createStyles, Divider, Menu } from "@mantine/core";
import { SummaryModalContext } from "src/utils/contexts";
import { ageDisplay, allFilesInCart, extractToArray } from "src/utils";
import { IoMdArrowDropdown as Dropdown } from "react-icons/io";
import Link from "next/link";
import { CasesCohortButton } from "./CasesCohortButton";
import { FaShoppingCart as CartIcon } from "react-icons/fa";
import { BiAddToQueue } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { addToCart, removeFromCart } from "../../cart/updateCart";
import { columnListOrder, getCasesTableAnnotationsLinkParams } from "./utils";
import OverflowTooltippedLabel from "@/components/OverflowTooltippedLabel";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import { ImageSlideCount } from "@/components/ImageSlideCount";
import { CountsIcon } from "@/features/shared/tailwindComponents";
import { ButtonTooltip } from "@/components/expandableTables/shared";
import { PopupIconButton } from "@/components/PopupIconButton/PopupIconButton";
import {
  HandleChangeInput,
  VerticalTable,
} from "@/features/shared/VerticalTable";
import saveAs from "file-saver";
import { convertDateToString } from "@/utils/date";

const useStyles = createStyles((theme) => ({
  item: {
    "&[data-hovered]": {
      // TODO: remove with theme color other than blue
      backgroundColor: theme.colors.blue[3],
      color: theme.white,
    },
  },
  root: {
    "&[data-disabled]": {
      border: "1px solid gray",
      margin: "2px 0",
      cursor: "not-allowed",
    },
  },
}));

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

export const ContextualCasesView: React.FC = () => {
  const dispatch = useCoreDispatch();
  const { classes } = useStyles();
  const [pageSize, setPageSize] = useState(10);
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortBy[]>([]);
  const [columns, setColumns] = useState(columnListOrder);
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );
  const pickedCases = useCoreSelector((state) => selectSelectedCases(state));
  const currentCart = useCoreSelector((state) => selectCart(state));

  const { data, isFetching, isSuccess, isError, pagination } = useAllCases({
    fields: [
      "case_id",
      "submitter_id",
      "submitter_slide_ids",
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
    filters: cohortFilters,
    from: offset * pageSize,
    sortBy: sortBy,
    searchTerm,
  });

  useEffect(() => {
    setOffset(0);
  }, [cohortFilters]);

  const { setEntityMetadata } = useContext(SummaryModalContext);

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
              href={{
                pathname: "/image-viewer/MultipleImageViewerPage",
                query: { caseId: datum.case_uuid },
              }}
              passHref
              legacyBehavior
            >
              <ImageSlideCount slideCount={slideCount} />
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
          case_id: (
            <OverflowTooltippedLabel label={datum.case_id}>
              <PopupIconButton
                handleClick={() =>
                  setEntityMetadata({
                    entity_type: "case",
                    entity_id: datum.case_uuid,
                  })
                }
                label={datum.case_id}
              />
            </OverflowTooltippedLabel>
          ),
          case_uuid: datum.case_uuid,
          project_id: (
            <OverflowTooltippedLabel label={datum.project_id}>
              <PopupIconButton
                handleClick={() =>
                  setEntityMetadata({
                    entity_type: "project",
                    entity_id: datum.project_id,
                  })
                }
                label={datum.project_id}
              />
            </OverflowTooltippedLabel>
          ),
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
          experimental_strategies: extractToArray(
            datum?.experimental_strategies,
            "experimental_strategy",
          ),
          annotations: getCasesTableAnnotationsLinkParams(
            datum.annotations,
            datum.case_uuid,
          ) ? (
            <Link
              href={getCasesTableAnnotationsLinkParams(
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
    [data, currentCart, classes, dispatch, setEntityMetadata],
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
    };
    const tempSortBy = sortByObj.map((sortObj) => {
      return {
        field: COLUMN_ID_TO_FIELD[sortObj.id],
        direction: sortObj.desc ? "desc" : "asc",
      };
    });
    setSortBy(tempSortBy);
  };

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
        setSearchTerm(obj.newSearch);
        break;
      case "newHeadings":
        setColumns(obj.newHeadings);
        break;
    }
  };

  const handleJSONDownload = () => {
    const json = data.map(
      ({
        filesCount,
        experimental_strategies,
        primary_site,
        submitter_slide_ids,
        disease_type,
        case_id,
        project_id,
        program,
        submitter_id,
        age_at_diagnosis,
        race,
        gender,
        ethnicity,
        vital_status,
      }) => {
        return {
          summary: {
            file_count: filesCount,
            experimental_strategies: experimental_strategies.map(
              ({ experimental_strategy }) => {
                return { experimental_strategy };
              },
            ),
            primary_site,
            submitter_slide_ids: submitter_slide_ids,
            disease_type,
            case_id,
            project: {
              project_id,
              program: {
                name: program,
              },
            },
            submitter_id,
            diagnoses: [{ age_at_diagnosis }],
            demographic: {
              race,
              gender,
              ethnicity,
              vital_status,
            },
          },
        };
      },
    );
    const blob = new Blob([JSON.stringify(json, null, 2)], {
      type: "text/json",
    });
    saveAs(blob, `cohort.${convertDateToString(new Date())}.json`);
  };

  return (
    <div className="flex flex-col mx-1" data-testid="cases-table">
      <Divider color="#C5C5C5" className="mb-3 mr-4" />

      <VerticalTable
        tableData={cases || []}
        columns={columns}
        pagination={{ ...pagination, label: "cases" }}
        handleChange={handleChange}
        additionalControls={
          <div className="flex gap-2">
            <CasesCohortButton />

            <DropdownWithIcon
              dropdownElements={[
                { title: "JSON (Coming Soon)" },
                { title: "TSV (Coming Soon)" },
              ]}
              TargetButtonChildren="Biospecimen"
              LeftIcon={
                pickedCases.length ? (
                  <CountsIcon $count={pickedCases.length}>
                    {pickedCases.length}
                  </CountsIcon>
                ) : null
              }
            />

            <DropdownWithIcon
              dropdownElements={[
                { title: "JSON (Coming Soon)" },
                { title: "TSV (Coming Soon)" },
              ]}
              TargetButtonChildren="Clinical"
              LeftIcon={
                pickedCases.length ? (
                  <CountsIcon $count={pickedCases.length}>
                    {pickedCases.length}
                  </CountsIcon>
                ) : null
              }
            />

            <ButtonTooltip label=" " comingSoon={true}>
              <Button
                onClick={handleJSONDownload}
                variant="outline"
                color="primary"
                className="bg-base-max"
              >
                JSON
              </Button>
            </ButtonTooltip>
            <ButtonTooltip label=" " comingSoon={true}>
              <Button variant="outline" color="primary" className="bg-base-max">
                TSV
              </Button>
            </ButtonTooltip>
          </div>
        }
        tableTitle={`Total of ${pagination?.total?.toLocaleString() ?? "..."} ${
          pagination?.total > 1 ? "Cases" : "Case"
        }`}
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
