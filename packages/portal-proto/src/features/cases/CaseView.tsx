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
import {
  allFilesInCart,
  calculatePercentageAsNumber,
  fileInCart,
  humanify,
  sortByPropertyAsc,
} from "src/utils";
import { CategoryTableSummary } from "@/components/Summary/CategoryTableSummary";
import { ClinicalSummary } from "./ClinicalSummary/ClinicalSummary";
import fileSize from "filesize";
import { FileAccessBadge } from "@/components/FileAccessBadge";
import { TableActionButtons } from "@/components/TableActionButtons";
import {
  PercentBar,
  PercentBarComplete,
  PercentBarLabel,
  HeaderTitle,
} from "../shared/tailwindComponents";
import { ImageSlideCount } from "@/components/ImageSlideCount";
import {
  getAnnotationsLinkParams,
  getSlideCountFromCaseSummary,
} from "./utils";
import { BasicTable } from "@/components/Tables/BasicTable";

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

    // maybe type it properly
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
          <Tooltip label="View Slide Image">
            <div>
              <Link
                href={`/image-viewer/MultipleImageViewerPage?caseId=${case_id}`}
              >
                <ImageSlideCount slideCount={slideCount} />
              </Link>
            </div>
          </Tooltip>
          <Tooltip
            label={!isAllImagesFilesInCart ? "Add to Cart" : "Remove from Cart"}
          >
            <ActionIcon variant="outline" size="sm">
              <FaShoppingCart
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
                className={`cursor-pointer ${
                  isAllImagesFilesInCart
                    ? "text-utility-category4"
                    : "text-primary"
                }`}
                size={12}
              />
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

  const formatDataForDataCateogryTable = () => {
    const sortedDataCategories = sortByPropertyAsc(
      data.summary.data_categories,
      "data_category",
    );

    const rows = sortedDataCategories.map((data_c) => {
      const fileCountPercentage = calculatePercentageAsNumber(
        data_c.file_count,
        filesCountTotal,
      );

      return {
        data_category: data_c.data_category,
        // TODO: Need to change it to Link after the href has been finalized
        file_count: (
          <div className="flex">
            <div className="basis-1/3 text-right">
              {data_c.file_count.toLocaleString()}
            </div>
            <div className="basis-2/3 pl-1">
              <PercentBar>
                <PercentBarLabel>{`${fileCountPercentage.toFixed(
                  2,
                )}%`}</PercentBarLabel>
                <PercentBarComplete
                  style={{ width: `${fileCountPercentage}%` }}
                />
              </PercentBar>
            </div>
          </div>
        ),
      };
    });

    return {
      headers: [
        <div
          key="case_summary_data_table_data_category"
          className="text-sm leading-[18px]"
        >
          Data Category
        </div>,
        <div key="case_summary_data_table_file_header" className="flex">
          <div className="basis-1/3 text-right font-bold text-sm leading-[18px]">
            Files
          </div>
          <div className="basis-2/3 pl-1 font-normal text-sm leading-[18px]">
            (n={filesCountTotal.toLocaleString()})
          </div>
        </div>,
      ],
      tableRows: rows,
    };
  };

  const formatDataForExpCateogryTable = () => {
    const sortedExpCategories = sortByPropertyAsc(
      data.summary.experimental_strategies,
      "experimental_strategy",
    );

    const rows = sortedExpCategories.map((exp_c) => {
      const fileCountPercentage = calculatePercentageAsNumber(
        exp_c.file_count,
        filesCountTotal,
      );

      return {
        experimental_strategy: exp_c.experimental_strategy,
        // TODO: Need to change it to Link after the href has been finalized
        file_count: (
          <div className="flex">
            <div className="basis-1/3 text-right">
              {exp_c.file_count.toLocaleString()}
            </div>
            <div className="basis-2/3 pl-1">
              <PercentBar>
                <PercentBarLabel>{`${fileCountPercentage.toFixed(
                  2,
                )}%`}</PercentBarLabel>
                <PercentBarComplete
                  style={{ width: `${fileCountPercentage}%` }}
                />
              </PercentBar>
            </div>
          </div>
        ),
      };
    });

    return {
      headers: [
        <div
          key="case_summary_data_exp_table_exp_title"
          className="text-sm leading-[18px]"
        >
          Experimental Strategy
        </div>,
        <div key="case_summary_data_exp_table_file_header" className="flex">
          <div className="basis-1/3 text-right font-bold text-sm leading-[18px]">
            Files
          </div>
          <div className="basis-2/3 pl-1 font-normal text-sm leading-[18px]">
            (n={filesCountTotal.toLocaleString()})
          </div>
        </div>,
      ],
      tableRows: rows,
    };
  };

  const supplementFilesRender = (files: caseFileType[]) => {
    const rows = files.map((file) => {
      const isOutputFileInCart = fileInCart(currentCart, file.file_id);
      return {
        access: <FileAccessBadge access={file.access} />,
        file_name: (
          <Link href={`/files/${file.file_id}`}>
            <a className="text-utility-link underline">{file.file_name}</a>
          </Link>
        ),
        data_format: file.data_format,
        file_size: fileSize(file.file_size),
        action: (
          <TableActionButtons
            isOutputFileInCart={isOutputFileInCart}
            file={mapGdcFileToCartFile([file])}
            downloadFile={mapFileData([file])[0]}
          />
        ),
      };
    });

    return {
      headers: ["Access", "File Name", "Data Format", "File Size", "Action"],
      tableRows: rows,
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
      <span>{filesCountTotal?.toLocaleString()} Files</span>
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

  return (
    <>
      {!isModal && (
        <SummaryHeader
          iconText="ca"
          headerTitle={headerTitle}
          leftElement={
            <Button
              leftIcon={<FaShoppingCart />}
              className="text-primary bg-base-lightest hover:bg-primary-darkest hover:text-primary-content-lightest"
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
        />
      )}

      <div className={`flex flex-col ${isModal ? "mt-5" : "mt-36"} mx-4`}>
        <div className="flex flex-col gap-5 mt-8">
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

          <div className="flex gap-4 mt-4 mb-14">
            <CategoryTableSummary
              title="File Counts by Data Category"
              dataObject={data.summary.data_categories}
              tableData={formatDataForDataCateogryTable()}
            />

            <CategoryTableSummary
              title="File Counts by Experimental Strategy"
              dataObject={data.summary.experimental_strategies}
              tableData={formatDataForExpCateogryTable()}
            />
          </div>
        </div>

        <ClinicalSummary
          diagnoses={diagnoses}
          follow_ups={follow_ups}
          demographic={demographic}
          family_histories={family_histories}
          exposures={exposures}
        />

        {clinicalFilteredFiles?.length > 0 && (
          <div className="mt-8">
            <div className="flex gap-2 bg-nci-violet-lightest text-primary-content p-2 border border-b-0 border-base-lighter">
              <HeaderTitle>Clinical Supplement File</HeaderTitle>
            </div>
            <BasicTable tableData={formatDataForClinicalFiles()} />
          </div>
        )}

        <div
          ref={targetRef}
          id="biospecimen"
          className={
            biospecimenFilteredFiles?.length === 0 ? "mb-16" : undefined
          }
        >
          <Biospecimen caseId={case_id} bioId={bio_id} isModal={isModal} />
        </div>
        {biospecimenFilteredFiles?.length > 0 && (
          <div className="mt-8 mb-16">
            <div className="flex gap-2 bg-nci-violet-lightest text-primary-content p-2 border border-b-0 border-base-lighter">
              <HeaderTitle>Biospecimen Supplement File</HeaderTitle>
            </div>
            <BasicTable tableData={formatDataForBioSpecimenFiles()} />
          </div>
        )}
      </div>
    </>
  );
};
