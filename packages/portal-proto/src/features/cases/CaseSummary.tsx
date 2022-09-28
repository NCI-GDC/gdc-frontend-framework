import { useContext, useEffect } from "react";
import Link from "next/link";
import {
  useCaseSummary,
  useCoreDispatch,
  useCoreSelector,
  selectCart,
  useAnnotations,
  AnnotationDefaults,
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
import { URLContext } from "src/pages/_app";
import { Biospecimen } from "../biospecimen/Biospecimen";
import { addToCart, removeFromCart } from "../cart/updateCart";
import {
  formatDataForHorizontalTable,
  mapFilesFromCasesToCartFile,
} from "../files/utils";
import {
  allFilesInCart,
  calculatePercentage,
  humanify,
  sortByPropertyAsc,
} from "src/utils";
import { SummaryErrorHeader } from "@/components/Summary/SummaryErrorHeader";
import { CategoryTableSummary } from "@/components/Summary/CategoryTableSummary";
import { ClinicalSummary } from "./ClinicalSummary/ClinicalSummary";
import { Demographic } from "@gff/core/dist/features/cases/types";

export const CaseSummary = ({
  case_id,
  bio_id,
}: {
  case_id: string;
  bio_id: string;
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
      "files.state",
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
  } = data || {};

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
    ? allFilesInCart(currentCart, mapFilesFromCasesToCartFile(data?.files))
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
      mapFilesFromCasesToCartFile(imageFiles),
    );

    if (!!slideCount && imageFiles.length > 0) {
      const images = (
        <div className="flex">
          <Tooltip label="View Slide Image">
            <Link
              href={`/user-flow/workbench/MultipleImageViewerPage?caseId=${case_id}`}
            >
              <a className="flex gap-1 cursor-pointer text-primary">
                <FaMicroscope className="mt-0.5" />
                <span>({slideCount})</span>
              </a>
            </Link>
          </Tooltip>
          <Tooltip
            label={!isAllImagesFilesInCart ? "Add to Cart" : "Remove from Cart"}
          >
            <FaShoppingCart
              onClick={() => {
                isAllImagesFilesInCart
                  ? removeFromCart(
                      mapFilesFromCasesToCartFile(imageFiles),
                      currentCart,
                      dispatch,
                    )
                  : addToCart(
                      mapFilesFromCasesToCartFile(imageFiles),
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

    const rows = sortedDataCategories.map((data_c) => ({
      data_category: data_c.data_category,
      // TODO: Need to change it to Link after the href has been finalized
      file_count: `${data_c.file_count.toLocaleString()} (${calculatePercentage(
        data_c.file_count,
        filesCountTotal,
      )}%)`,
    }));

    return {
      headers: [
        "Data Category",
        `Files (n=${filesCountTotal.toLocaleString()})`,
      ],
      tableRows: rows,
    };
  };

  const formatDataForExpCateogryTable = () => {
    const sortedExpCategories = sortByPropertyAsc(
      data.summary.experimental_strategies,
      "experimental_strategy",
    );

    const rows = sortedExpCategories.map((exp_c) => ({
      experimental_strategy: exp_c.experimental_strategy,
      // TODO: Need to change it to Link after the href has been finalized
      file_count: `${exp_c.file_count.toLocaleString()} (${calculatePercentage(
        exp_c.file_count,
        filesCountTotal,
      )}%)`,
    }));

    return {
      headers: [
        "Experimental Strategy",
        `Files (n=${filesCountTotal.toLocaleString()})`,
      ],
      tableRows: rows,
    };
  };

  return (
    <>
      {isFetching || isAnnotationCallFetching ? (
        <LoadingOverlay visible data-testid="loading" />
      ) : data && Object.keys(data).length > 0 && annotationCountData ? (
        <>
          <SummaryHeader iconText="CA" headerTitle={headerTitle} />
          <div className="flex flex-col mx-auto mt-20 w-10/12">
            <div className="flex flex-col gap-5">
              <Button
                leftIcon={<FaShoppingCart />}
                className="self-end text-primary-contrast bg-primary hover:bg-primary-darker"
                onClick={() =>
                  isAllFilesInCart
                    ? removeFromCart(
                        mapFilesFromCasesToCartFile(data.files),
                        currentCart,
                        dispatch,
                      )
                    : addToCart(
                        mapFilesFromCasesToCartFile(data.files),
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
                  title=" File Counts by Data Category"
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
            <div ref={targetRef} id="biospecimen">
              <Biospecimen caseId={case_id} bioId={bio_id} />
            </div>
          </div>
        </>
      ) : (
        <SummaryErrorHeader label="Case Not Found" />
      )}
    </>
  );
};
