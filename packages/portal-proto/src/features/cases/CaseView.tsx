import { useEffect } from "react";
import Link from "next/link";
import {
  useCoreDispatch,
  useCoreSelector,
  selectCart,
  AnnotationDefaults,
  mapFileData,
  caseFileType,
  Demographic,
  caseSummaryDefaults,
  FilterSet,
  DataFormat,
  AccessType,
} from "@gff/core";
import { SummaryCard } from "@/components/Summary/SummaryCard";
import { SummaryHeader } from "@/components/Summary/SummaryHeader";
import { ActionIcon, Button, Tooltip } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { FaFile, FaShoppingCart, FaEdit } from "react-icons/fa";
import { Biospecimen } from "../biospecimen/Biospecimen";
import { addToCart, removeFromCart } from "../cart/updateCart";
import {
  formatDataForHorizontalTable,
  mapGdcFileToCartFile,
} from "../files/utils";
import { allFilesInCart, fileInCart, humanify } from "src/utils";
import CategoryTableSummary from "@/components/Summary/CategoryTableSummary";
import { ClinicalSummary } from "./ClinicalSummary/ClinicalSummary";
import fileSize from "filesize";
import { FileAccessBadge } from "@/components/FileAccessBadge";
import { TableActionButtons } from "@/components/TableActionButtons";
import { ImageSlideCount } from "@/components/ImageSlideCount";
import {
  formatDataForDataCateogryTable,
  formatDataForExpCateogryTable,
  getAnnotationsLinkParams,
  getSlideCountFromCaseSummary,
} from "./utils";
import { SingularOrPluralSpan } from "@/components/SingularOrPluralSpan/SingularOrPluralSpan";
import SMTableContainer from "../GenomicTables/SomaticMutationsTable/SMTableContainer";
import { createColumnHelper } from "@tanstack/react-table";
import VerticalTable from "@/components/Table/VerticalTable";

export interface CaseViewProps {
  readonly data: caseSummaryDefaults;
  readonly isModal: boolean;
  readonly annotationCountData: {
    list: AnnotationDefaults[];
    count: number;
  };
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
  const annotationsCountTotal = annotationCountData?.count;
  const headerTitle = `${data?.project?.project_id} / ${data?.submitter_id}`;
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });
  const isAllFilesInCart = data?.files
    ? allFilesInCart(currentCart, mapGdcFileToCartFile(data?.files))
    : false;

  const {
    diagnoses = [],
    demographic = {} as Demographic,
    family_histories = [],
    follow_ups = [],
    exposures = [],
    files = [],
  } = data || {};

  useEffect(() => {
    if (shouldScrollToBio) {
      scrollIntoView();
    }
  }, [scrollIntoView, shouldScrollToBio]);

  const clinicalFilteredFiles = files?.filter(
    (file) => file.data_type === "Clinical Supplement",
  );

  const biospecimenFilteredFiles = files?.filter(
    (file) => file.data_type === "Biospecimen Supplement",
  );

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
        <Link href={`/projects/${project_id}`}>
          <a className="underline text-utility-link"> {project_id}</a>
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
              variant="outline"
              size="sm"
              className={`hover:bg-primary hover:text-base-max border-primary ${
                isAllImagesFilesInCart
                  ? "bg-primary text-base-max"
                  : "text-primary bg-base-max"
              }`}
              aria-label="cart icon button"
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
              <FaShoppingCart size={12} aria-label="cart icon" />
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

  const supplementFilesRender = (files: caseFileType[]) => {
    type SupplementFilesDataType = {
      access: AccessType;
      file_id: string;
      file_name: string;
      data_format: DataFormat;
      file_size: string;
      file: caseFileType;
    };

    const supplementFilesTableData: SupplementFilesDataType[] = files.map(
      (file) => ({
        access: file.access,
        file_id: file.file_id,
        file_name: file.file_name,
        data_format: file.data_format,
        file_size: fileSize(file.file_size),
        file: file,
      }),
    );

    const supplementFilesTableColumnHelper =
      createColumnHelper<SupplementFilesDataType>();

    const supplementFilesTableColumns = [
      supplementFilesTableColumnHelper.display({
        id: "access",
        header: "Access",
        cell: ({ row }) => <FileAccessBadge access={row.original.access} />,
      }),
      supplementFilesTableColumnHelper.display({
        id: "file_name",
        header: "File Name",
        cell: ({ row }) => (
          <Link href={`/files/${row.original.file_id}`}>
            <a className="text-utility-link underline">
              {row.original.file_name}
            </a>
          </Link>
        ),
      }),
      supplementFilesTableColumnHelper.accessor("data_format", {
        id: "data_format",
        header: "Data Format",
      }),
      supplementFilesTableColumnHelper.accessor("file_size", {
        id: "file_size",
        header: "File Size",
      }),
      supplementFilesTableColumnHelper.display({
        id: "action",
        header: "Action",
        cell: ({ row }) => {
          const isOutputFileInCart = fileInCart(
            currentCart,
            row.original.file_id,
          );
          return (
            <TableActionButtons
              isOutputFileInCart={isOutputFileInCart}
              file={mapGdcFileToCartFile([row.original.file])}
              downloadFile={mapFileData([row.original.file])[0]}
            />
          );
        },
      }),
    ];

    return {
      data: supplementFilesTableData,
      columns: supplementFilesTableColumns,
    };
  };

  const formatDataForClinicalFiles = () => {
    const { files } = data;

    const filteredFiles = files.filter(
      (file) => file.data_type === "Clinical Supplement",
    );

    return supplementFilesRender(filteredFiles);
  };

  const formatDataForBioSpecimenFiles = () => {
    const { files } = data;

    const filteredFiles = files.filter(
      (file) => file.data_type === "Biospecimen Supplement",
    );

    return supplementFilesRender(filteredFiles);
  };

  const addLinkValue = () => (
    <span className="text-base-lightest">
      {getAnnotationsLinkParams(annotationCountData, case_id) ? (
        <Link
          href={getAnnotationsLinkParams(annotationCountData, case_id)}
          passHref
        >
          <a className="underline" target="_blank">
            {annotationsCountTotal.toLocaleString()}
          </a>
        </Link>
      ) : (
        annotationsCountTotal.toLocaleString()
      )}
    </span>
  );

  const Files = (
    <span className="flex items-center gap-1">
      <FaFile size={24} />
      <SingularOrPluralSpan count={filesCountTotal} title="File" />
    </span>
  );

  const Annotations = (
    <span className="flex items-center gap-1">
      <FaEdit size={24} />
      <span>
        {addLinkValue()}{" "}
        {annotationsCountTotal > 1 ? "Annotations" : "Annotation"}
      </span>
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

  return (
    <>
      <SummaryHeader
        iconText="ca"
        headerTitle={headerTitle}
        leftElement={
          <Button
            leftIcon={<FaShoppingCart />}
            className="text-primary bg-base-max hover:bg-primary-darkest hover:text-base-max"
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
          <div className="flex items-center gap-2 text-2xl text-base-lightest leading-4 font-montserrat uppercase">
            Total of {Files} {Annotations}
          </div>
        }
        isModal={isModal}
      />

      <div className={`${!isModal && "mt-32"} mx-4`}>
        <div className="mt-8">
          <div className="flex">
            <div className="basis-1/2">
              <SummaryCard tableData={formatDataForCaseSummary().slice(0, 4)} />
            </div>
            <div className="basis-1/2">
              <SummaryCard
                tableData={formatDataForCaseSummary().slice(
                  4,
                  formatDataForCaseSummary().length,
                )}
                title=""
              />
            </div>
          </div>

          {(data.summary.data_categories ||
            data.summary.experimental_strategies) && (
            <div className="flex gap-4 mt-8 mb-14">
              {data.summary.data_categories && (
                <CategoryTableSummary
                  title="File Counts by Data Category"
                  {...formatDataForDataCateogryTable(
                    data.summary.data_categories,
                    filesCountTotal,
                  )}
                />
              )}
              {data.summary.experimental_strategies && (
                <CategoryTableSummary
                  title="File Counts by Experimental Strategy"
                  {...formatDataForExpCateogryTable(
                    data.summary.experimental_strategies,
                    filesCountTotal,
                  )}
                />
              )}
            </div>
          )}
        </div>

        <div
          className={`${
            !(
              data.summary.data_categories ||
              data.summary.experimental_strategies
            ) && "mt-14"
          }`}
        >
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

        {clinicalFilteredFiles?.length > 0 && (
          <div className="mt-8">
            <div className="flex gap-2 bg-nci-violet-lightest text-primary-content p-2 border border-b-0 border-base-lighter">
              <h2 className="text-xl text-primary-content-darkest font-medium">
                Clinical Supplement File
              </h2>
            </div>
            <VerticalTable {...formatDataForClinicalFiles()} />
          </div>
        )}

        <div ref={targetRef} id="biospecimen" className="mb-8">
          <Biospecimen
            caseId={case_id}
            bioId={bio_id}
            isModal={isModal}
            submitter_id={data?.submitter_id}
            project_id={data?.project?.project_id}
          />
        </div>
        {biospecimenFilteredFiles?.length > 0 && (
          <div className="mb-16">
            <div className="flex gap-2 bg-nci-violet-lightest text-primary-content p-2 border border-b-0 border-base-lighter">
              <h2 className="text-xl text-primary-content-darkest font-medium">
                Biospecimen Supplement File
              </h2>
            </div>
            <VerticalTable {...formatDataForBioSpecimenFiles()} />
          </div>
        )}

        <div className="mb-16">
          <SMTableContainer
            projectId={data.project.project_id}
            cohortFilters={projectFilter}
            caseFilter={caseFilter}
            tableTitle="Most Frequent Somatic Mutations"
          />
        </div>
      </div>
    </>
  );
};
