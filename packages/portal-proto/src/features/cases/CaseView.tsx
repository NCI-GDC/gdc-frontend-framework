import { useEffect } from "react";
import Link from "next/link";
import {
  useCoreDispatch,
  useCoreSelector,
  selectCart,
  Demographic,
  FilterSet,
  CaseDefaults,
} from "@gff/core";
import { SummaryCard } from "@/components/Summary/SummaryCard";
import { SummaryHeader } from "@/components/Summary/SummaryHeader";
import { ActionIcon, Button, Tooltip } from "@mantine/core";
import { useScrollIntoView, useViewportSize } from "@mantine/hooks";
import { FaFile, FaShoppingCart, FaEdit } from "react-icons/fa";
import { Biospecimen } from "../biospecimen/Biospecimen";
import { addToCart, removeFromCart } from "../cart/updateCart";
import {
  formatDataForHorizontalTable,
  mapGdcFileToCartFile,
} from "../files/utils";
import { allFilesInCart, focusStyles, humanify } from "src/utils";
import CategoryTableSummary from "@/components/Summary/CategoryTableSummary";
import { ClinicalSummary } from "./ClinicalSummary/ClinicalSummary";
import { ImageSlideCount } from "@/components/ImageSlideCount";
import {
  formatDataForDataCateogryTable,
  formatDataForExpCateogryTable,
  getSlideCountFromCaseSummary,
  ITEMS_PER_COLUMN,
  LG_BREAKPOINT,
} from "./utils";
import SMTableContainer from "../GenomicTables/SomaticMutationsTable/SMTableContainer";
import FilesTable from "./FilesTable";
import UsersIcon from "public/user-flow/icons/summary/users.svg";
import AnnotationsTable from "./AnnotationsTable";
import useScrollToHash from "@/hooks/useScrollToHash";

export interface CaseViewProps {
  readonly data: CaseDefaults;
  readonly isModal: boolean;
  readonly annotationCountData: number;
  readonly bio_id: string;
  readonly case_id: string;
  readonly shouldScrollToBio: boolean;
}

export const CaseView: React.FC<CaseViewProps> = ({
  data,
  isModal,
  annotationCountData,
  bio_id,
  case_id,
  shouldScrollToBio,
}: CaseViewProps) => {
  const filesCountTotal = data?.files?.length ?? 0;
  const headerTitle = `${data?.project?.project_id} / ${data?.submitter_id}`;
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });
  const isAllFilesInCart = data?.files
    ? allFilesInCart(currentCart, mapGdcFileToCartFile(data?.files))
    : false;
  const { width } = useViewportSize();
  useScrollToHash(["files", "annotations"]);

  const {
    diagnoses = [],
    demographic = {} as Demographic,
    family_histories = [],
    follow_ups = [],
    exposures = [],
  } = data || {};

  useEffect(() => {
    if (shouldScrollToBio) {
      scrollIntoView();
    }
  }, [scrollIntoView, shouldScrollToBio]);

  const formatDataForCaseSummary = () => {
    const {
      case_id,
      submitter_id,
      project: {
        project_id,
        name: project_name,
        program: { name: program_name },
      },
      disease_type,
      primary_site,
      files,
      summary: { experimental_strategies },
    } = data;

    const slideCount = getSlideCountFromCaseSummary(experimental_strategies);

    const imageFiles = files?.filter(
      (file) => file.data_type === "Slide Image",
    );

    // TODO: type it properly
    let caseSummaryObject: Record<string, any> = {
      case_uuid: case_id,
      case_id: submitter_id,
      project: (
        <Link
          href={`/projects/${project_id}`}
          className="underline text-utility-link"
        >
          {project_id}
        </Link>
      ),
      project_name,
      disease_type,
      program: program_name,
      primary_site,
    };

    const isAllImagesFilesInCart = allFilesInCart(
      currentCart,
      mapGdcFileToCartFile(imageFiles),
    );

    if (!!slideCount && imageFiles.length > 0) {
      const images = (
        <div className="flex items-center gap-2">
          <Tooltip
            label="View Slide Image"
            withinPortal={true}
            withArrow
            offset={-2}
          >
            <div className="pt-0.5">
              {/* This needs both passHref and legacyBehavior: https://nextjs.org/docs/pages/api-reference/components/link#if-the-child-is-a-functional-component */}
              <Link
                href={`/image-viewer/MultipleImageViewerPage?caseId=${case_id}`}
                passHref
                legacyBehavior
              >
                <ImageSlideCount slideCount={slideCount} />
              </Link>
            </div>
          </Tooltip>

          <Tooltip
            label={!isAllImagesFilesInCart ? "Add to Cart" : "Remove from Cart"}
            withinPortal={true}
            withArrow
          >
            <ActionIcon
              data-testid="button-add-remove-files-case-summary"
              variant="outline"
              size="sm"
              className={`hover:bg-primary hover:text-base-max border-primary ${
                isAllImagesFilesInCart
                  ? "bg-primary text-base-max"
                  : "text-primary bg-base-max"
              }`}
              onClick={() => {
                isAllImagesFilesInCart
                  ? removeFromCart(
                      mapGdcFileToCartFile(imageFiles),
                      currentCart,
                      dispatch,
                    )
                  : addToCart(
                      mapGdcFileToCartFile(imageFiles),
                      currentCart,
                      dispatch,
                    );
              }}
            >
              <FaShoppingCart size={12} aria-label="Cart" />
            </ActionIcon>
          </Tooltip>
        </div>
      );

      caseSummaryObject = {
        ...caseSummaryObject,
        images,
      };
    }
    const headersConfig = Object.keys(caseSummaryObject).map((key) => ({
      field: key,
      name: humanify({ term: key }),
    }));

    return formatDataForHorizontalTable(caseSummaryObject, headersConfig);
  };

  const Files = (
    <span className="flex items-center gap-1">
      {/* 16 and 24 */}
      <FaFile size={16} />
      {filesCountTotal > 0 ? (
        <a
          data-testid="text-file-count-case-summary"
          href="#files"
          className="underline font-bold"
        >
          {filesCountTotal.toLocaleString()}
        </a>
      ) : (
        <span className="font-bold">{filesCountTotal.toLocaleString()}</span>
      )}
      {filesCountTotal > 1 ? "Files" : "File"}
    </span>
  );

  const Annotations = (
    <span className="flex items-center gap-1">
      <FaEdit size={16} />
      {annotationCountData > 0 ? (
        <a
          data-testid="text-annotation-count-case-summary"
          href="#annotations"
          className="underline font-bold"
        >
          {annotationCountData.toLocaleString()}
        </a>
      ) : (
        <span
          data-testid="text-annotation-count-case-summary"
          className="font-bold"
        >
          {annotationCountData.toLocaleString()}
        </span>
      )}
      {annotationCountData == 1 ? "Annotation" : "Annotations"}
    </span>
  );

  const projectFilter: FilterSet = {
    mode: "and",
    root: {
      "cases.project.project_id": {
        operator: "includes",
        field: "cases.project.project_id",
        operands: [data.project.project_id],
      },
    },
  };

  const caseFilter: FilterSet = {
    mode: "and",
    root: {
      "cases.project.project_id": {
        operator: "includes",
        field: "cases.case_id",
        operands: [data.case_id],
      },
    },
  };

  const summaryData = formatDataForCaseSummary();
  const [leftColumnData, rightColumnData] = [
    summaryData.slice(0, ITEMS_PER_COLUMN),
    summaryData.slice(ITEMS_PER_COLUMN),
  ];

  return (
    <>
      <SummaryHeader
        Icon={UsersIcon}
        headerTitleLeft="Case"
        headerTitle={headerTitle}
        leftElement={
          <Button
            data-testid="button-add-all-remove-all-files-case-summary"
            leftSection={<FaShoppingCart />}
            className={`text-primary bg-base-max hover:bg-primary-darkest hover:text-base-max ${focusStyles}`}
            onClick={() =>
              isAllFilesInCart
                ? removeFromCart(
                    mapGdcFileToCartFile(data.files),
                    currentCart,
                    dispatch,
                  )
                : addToCart(
                    mapGdcFileToCartFile(data.files),
                    currentCart,
                    dispatch,
                  )
            }
            disabled={filesCountTotal === 0}
            classNames={{ label: "font-medium text-sm" }}
          >
            {!isAllFilesInCart
              ? "Add all files to the cart"
              : "Remove all files from the cart"}
          </Button>
        }
        rightElement={
          <div className="flex items-center gap-4 text-xl text-base-lightest font-medium leading-6 font-montserrat uppercase">
            Total of {Files} {Annotations}
          </div>
        }
        isModal={isModal}
      />

      <div className={`${!isModal ? "mt-6" : "mt-4"} mx-4`}>
        <div data-testid="table-summary-case-summary" className="flex">
          <div className="basis-full lg:basis-1/2">
            <SummaryCard
              tableData={width >= LG_BREAKPOINT ? leftColumnData : summaryData}
            />
          </div>
          {width >= LG_BREAKPOINT && (
            <div className="basis-1/2 h-full">
              <SummaryCard tableData={rightColumnData} title="" />
            </div>
          )}
        </div>

        {(data.summary.data_categories ||
          data.summary.experimental_strategies) && (
          <div className="flex flex-col lg:flex-row gap-8 mt-8">
            {data.summary.data_categories && (
              <div className="basis-1/2">
                <CategoryTableSummary
                  customDataTestID="table-data-category-case-summary"
                  title="File Counts by Data Category"
                  {...formatDataForDataCateogryTable(
                    data.summary.data_categories,
                    filesCountTotal,
                  )}
                  tooltip={
                    "A detailed list of the files is located in the Files section of this page."
                  }
                />
              </div>
            )}
            {data.summary.experimental_strategies && (
              <div className="basis-1/2">
                <CategoryTableSummary
                  customDataTestID="table-experimental-strategy-case-summary"
                  title="File Counts by Experimental Strategy"
                  {...formatDataForExpCateogryTable(
                    data.summary.experimental_strategies,
                    filesCountTotal,
                  )}
                  tooltip={
                    "A detailed list of the files is located in the Files section of this page."
                  }
                />
              </div>
            )}
          </div>
        )}

        <div data-testid="table-clinical-case-summary" className="mt-8">
          <ClinicalSummary
            diagnoses={diagnoses}
            follow_ups={follow_ups}
            demographic={demographic}
            family_histories={family_histories}
            exposures={exposures}
            case_id={case_id}
            submitter_id={data?.submitter_id}
            project_id={data?.project?.project_id}
          />
        </div>

        <div
          data-testid="table-biospecimen-case-summary"
          ref={targetRef}
          id="biospecimen"
          className="mt-8"
        >
          <Biospecimen
            caseId={case_id}
            bioId={bio_id}
            isModal={isModal}
            submitter_id={data?.submitter_id}
            project_id={data?.project?.project_id}
          />
        </div>
        <div
          className={`mt-8 ${isModal ? "scroll-mt-36" : "scroll-mt-72"}`}
          id="files"
        >
          <FilesTable caseId={case_id} />
        </div>

        <div className={`mt-8 ${annotationCountData === 0 ? "mb-16" : ""}`}>
          <SMTableContainer
            projectId={data.project.project_id}
            case_id={case_id}
            cohortFilters={projectFilter}
            caseFilter={caseFilter}
            tableTitle="Most Frequent Somatic Mutations"
            inModal={isModal}
          />
        </div>
        {annotationCountData > 0 && (
          <div
            className={`mt-8 mb-16 ${
              isModal ? "scroll-mt-36" : "scroll-mt-72"
            }`}
            id="annotations"
          >
            <AnnotationsTable case_id={case_id} />
          </div>
        )}
      </div>
    </>
  );
};
