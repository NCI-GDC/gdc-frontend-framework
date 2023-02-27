import { useContext, useEffect } from "react";
import Link from "next/link";
import {
  useCaseSummary,
  useCoreDispatch,
  useCoreSelector,
  selectCart,
  useAnnotations,
  AnnotationDefaults,
  mapFileData,
  caseFileType,
  Demographic,
} from "@gff/core";
import { SummaryCard } from "@/components/Summary/SummaryCard";
import SummaryCount from "@/components/Summary/SummaryCount";
import { SummaryHeader } from "@/components/Summary/SummaryHeader";
import { Button, LoadingOverlay, Tooltip } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import {
  FaFile,
  FaMicroscope,
  FaShoppingCart,
  FaEdit,
  FaTable,
} from "react-icons/fa";
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
import { SummaryErrorHeader } from "@/components/Summary/SummaryErrorHeader";
import { CategoryTableSummary } from "@/components/Summary/CategoryTableSummary";
import { ClinicalSummary } from "./ClinicalSummary/ClinicalSummary";
import fileSize from "filesize";
import { TempTable } from "../files/FileView";
import { FileAccessBadge } from "@/components/FileAccessBadge";
import { TableActionButtons } from "@/components/TableActionButtons";
import {
  PercentBar,
  PercentBarComplete,
  PercentBarLabel,
  HeaderTitle,
} from "../shared/tailwindComponents";
import { URLContext } from "src/utils/contexts";

// TODO: break it down

export const CaseSummary = ({
  case_id,
  bio_id,
  isModal = false,
}: {
  case_id: string;
  bio_id: string;
  isModal?: boolean;
}): JSX.Element => {
  const { data, isFetching } = useCaseSummary({
    filters: {
      content: {
        field: "case_id",
        value: case_id,
      },
      op: "=",
    },
    fields: [
      "files.access",
      "files.acl",
      "files.data_type",
      "files.file_name",
      "files.file_size",
      "files.file_id",
      "files.data_format",
      "files.state",
      "files.created_datetime",
      "files.updated_datetime",
      "files.submitter_id",
      "files.data_category",
      "files.type",
      "files.md5sum",
      "case_id",
      "submitter_id",
      "project.name",
      "disease_type",
      "project.project_id",
      "primary_site",
      "project.program.name",
      "summary.file_count",
      "summary.data_categories.file_count",
      "summary.data_categories.data_category",
      "summary.experimental_strategies.experimental_strategy",
      "summary.experimental_strategies.file_count",
      "demographic.ethnicity",
      "demographic.demographic_id",
      "demographic.gender",
      "demographic.race",
      "demographic.submitter_id",
      "demographic.days_to_birth",
      "demographic.days_to_death",
      "demographic.vital_status",
      "diagnoses.submitter_id",
      "diagnoses.diagnosis_id",
      "diagnoses.classification_of_tumor",
      "diagnoses.age_at_diagnosis",
      "diagnoses.days_to_last_follow_up",
      "diagnoses.days_to_last_known_disease_status",
      "diagnoses.days_to_recurrence",
      "diagnoses.last_known_disease_status",
      "diagnoses.morphology",
      "diagnoses.primary_diagnosis",
      "diagnoses.prior_malignancy",
      "diagnoses.synchronous_malignancy",
      "diagnoses.progression_or_recurrence",
      "diagnoses.site_of_resection_or_biopsy",
      "diagnoses.tissue_or_organ_of_origin",
      "diagnoses.tumor_grade",
      "diagnoses.treatments.days_to_treatment_start",
      "diagnoses.treatments.submitter_id",
      "diagnoses.treatments.therapeutic_agents",
      "diagnoses.treatments.treatment_id",
      "diagnoses.treatments.treatment_intent_type",
      "diagnoses.treatments.treatment_or_therapy",
      "exposures.alcohol_history",
      "exposures.alcohol_intensity",
      "exposures.exposure_id",
      "exposures.tobacco_smoking_status",
      "exposures.submitter_id",
      "exposures.pack_years_smoked",
      "family_histories.family_history_id",
      "family_histories.relationship_age_at_diagnosis",
      "family_histories.relationship_gender",
      "family_histories.relationship_primary_diagnosis",
      "family_histories.relationship_type",
      "family_histories.relative_with_cancer_history",
      "family_histories.submitter_id",
      "follow_ups.follow_up_id",
      "follow_ups.submitter_id",
      "follow_ups.days_to_follow_up",
      "follow_ups.comorbidity",
      "follow_ups.risk_factor",
      "follow_ups.progression_or_recurrence_type",
      "follow_ups.progression_or_recurrence",
      "follow_ups.disease_response",
      "follow_ups.bmi",
      "follow_ups.height",
      "follow_ups.weight",
      "follow_ups.ecog_performance_status",
      "follow_ups.karnofsky_performance_status",
      "follow_ups.progression_or_recurrence_anatomic_site",
      "follow_ups.reflux_treatment_type",
      "follow_ups.molecular_tests.aa_change",
      "follow_ups.molecular_tests.antigen",
      "follow_ups.molecular_tests.biospecimen_type",
      "follow_ups.molecular_tests.chromosome",
      "follow_ups.molecular_tests.gene_symbol",
      "follow_ups.molecular_tests.molecular_test_id",
      "follow_ups.molecular_tests.submitter_id",
      "follow_ups.molecular_tests.laboratory_test",
      "follow_ups.molecular_tests.mismatch_repair_mutation",
      "follow_ups.molecular_tests.molecular_analysis_method",
      "follow_ups.molecular_tests.molecular_test_id",
      "follow_ups.molecular_tests.second_gene_symbol",
      "follow_ups.molecular_tests.test_result",
      "follow_ups.molecular_tests.test_units",
      "follow_ups.molecular_tests.test_value",
      "follow_ups.molecular_tests.variant_type",
    ],
  });

  const {
    diagnoses = [],
    demographic = {} as Demographic,
    family_histories = [],
    follow_ups = [],
    exposures = [],
    files = [],
  } = data || {};

  const clinicalFilteredFiles = files?.filter(
    (file) => file.data_type === "Clinical Supplement",
  );

  const biospecimenFilteredFiles = files?.filter(
    (file) => file.data_type === "Biospecimen Supplement",
  );

  const { data: annotationCountData, isFetching: isAnnotationCallFetching } =
    useAnnotations({
      filters: {
        op: "=",
        content: {
          field: "annotations.case_id",
          value: case_id,
        },
      },
    });

  const prevPathValue = useContext(URLContext);
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });

  useEffect(() => {
    if (
      prevPathValue !== undefined &&
      ["MultipleImageViewerPage", "selectedId"].every((term) =>
        prevPathValue.prevPath?.includes(term),
      )
    ) {
      scrollIntoView();
    }
  }, [prevPathValue, scrollIntoView]);

  const getAnnotationsLinkParams = (
    annotations: {
      list: AnnotationDefaults[];
      count: number;
    },
    case_id: string,
  ) => {
    if (annotations.count === 0) return null;

    if (annotations.count === 1) {
      return `https://portal.gdc.cancer.gov/annotations/${annotations.list[0].annotation_id}`;
    }
    return `https://portal.gdc.cancer.gov/annotations?filters={"content":[{"content":{"field":"annotations.case_id","value":["${case_id}"]},"op":"in"}],"op":"and"}`;
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

  const filesCountTotal = data?.files?.length ?? 0;
  const annotationsCountTotal = annotationCountData?.count;
  const headerTitle = `${data?.project?.project_id} / ${data?.submitter_id}`;

  const isAllFilesInCart = data?.files
    ? allFilesInCart(currentCart, mapGdcFileToCartFile(data?.files))
    : false;

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
        <div className="flex">
          <Tooltip label="View Slide Image">
            <div>
              <Link
                href={`/image-viewer/MultipleImageViewerPage?caseId=${case_id}`}
              >
                <a className="flex gap-1 cursor-pointer text-primary bg-white">
                  <FaMicroscope className="mt-0.5" />
                  <span className="bg-accent text-white">({slideCount})</span>
                </a>
              </Link>
            </div>
          </Tooltip>
          <Tooltip
            label={!isAllImagesFilesInCart ? "Add to Cart" : "Remove from Cart"}
          >
            <div>
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
                className={`cursor-pointer mt-0.5 ${
                  isAllImagesFilesInCart
                    ? "text-utility-category4"
                    : "text-primary"
                }`}
              />
            </div>
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
        <div key="case_summary_data_table_data_category">Data Category</div>,
        <div key="case_summary_data_table_file_header" className="flex">
          <div className="basis-1/3 text-right">Files</div>
          <div className="basis-2/3 pl-1">
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
        <div key="case_summary_data_exp_table_exp_title">
          Experimental Strategy
        </div>,
        <div key="case_summary_data_exp_table_file_header" className="flex">
          <div className="basis-1/3 text-right">Files</div>
          <div className="basis-2/3 pl-1">
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
  return (
    <>
      {isFetching ||
      isAnnotationCallFetching ||
      (data && data.case_id !== case_id) ? (
        <LoadingOverlay visible data-testid="loading" />
      ) : data && Object.keys(data).length > 0 && annotationCountData ? (
        <>
          {!isModal && (
            <SummaryHeader iconText="ca" headerTitle={headerTitle} />
          )}

          <div
            className={`flex flex-col mx-auto ${
              isModal ? "mt-5" : "mt-20"
            } w-10/12`}
          >
            <div className="flex flex-col gap-5">
              <Button
                leftIcon={<FaShoppingCart />}
                className="self-end text-primary-contrast bg-primary hover:bg-primary-darker"
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
              >
                {!isAllFilesInCart
                  ? "Add all files to the cart"
                  : "Remove all files from the cart"}
              </Button>
              <div className="flex gap-4">
                <div className="w-10/12">
                  <SummaryCard
                    tableData={formatDataForCaseSummary()}
                    Icon={FaTable}
                  />
                </div>
                <div className="w-2/12">
                  <SummaryCount
                    title="files"
                    count={filesCountTotal?.toLocaleString()}
                    Icon={FaFile}
                  />
                  <SummaryCount
                    title="annotations"
                    count={annotationsCountTotal.toLocaleString()}
                    Icon={FaEdit}
                    href={getAnnotationsLinkParams(
                      annotationCountData,
                      case_id,
                    )}
                    shouldOpenInNewTab
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-4">
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

            <div>
              <ClinicalSummary
                diagnoses={diagnoses}
                follow_ups={follow_ups}
                demographic={demographic}
                family_histories={family_histories}
                exposures={exposures}
              />
            </div>
            {clinicalFilteredFiles?.length > 0 && (
              <div className="my-5">
                <div className="flex gap-2 bg-base-lightest text-primary-content p-2">
                  <HeaderTitle>Clinical Supplement File</HeaderTitle>
                </div>
                <TempTable tableData={formatDataForClinicalFiles()} />
              </div>
            )}

            <div ref={targetRef} id="biospecimen">
              <Biospecimen caseId={case_id} bioId={bio_id} isModal={isModal} />
            </div>
            {biospecimenFilteredFiles?.length > 0 && (
              <div className="my-5">
                <div className="flex gap-2 bg-base-lightest text-primary-content p-2">
                  <HeaderTitle>Biospecimen Supplement File</HeaderTitle>
                </div>
                <TempTable tableData={formatDataForBioSpecimenFiles()} />
              </div>
            )}
          </div>
        </>
      ) : (
        <SummaryErrorHeader label="Case Not Found" />
      )}
    </>
  );
};
