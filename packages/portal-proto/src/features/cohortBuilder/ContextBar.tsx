import React, { useEffect, useState } from "react";
import { CollapsibleContainer } from "@/components/CollapsibleContainer";
import { Loader, Tabs } from "@mantine/core";
import { ContextualCasesView } from "../cases/CasesView/CasesView";
import CohortCountButton from "./CohortCountButton";
import CohortManager from "./CohortManager";
import {
  useCoreDispatch,
  useCoreSelector,
  selectAvailableCohorts,
  selectCurrentCohortId,
  setActiveCohort,
  Modals,
  showModal,
  setCurrentCohortId,
  selectCurrentCohortFilters,
  buildCohortGqlOperator,
  useGetAllFilesMutation,
  GdcFile,
  selectCart,
} from "@gff/core";
import { MdFilterAlt as CohortFilterIcon } from "react-icons/md";
import {
  MdDownload as DownloadIcon,
  MdInsertChartOutlined as SummaryChartIcon,
  MdOutlineViewComfy as TableIcon,
} from "react-icons/md";
import download from "src/utils/download";
import SummaryFacets, { SummaryFacetInfo } from "./SummaryFacets";
import { SecondaryTabStyle } from "@/features/cohortBuilder/style";
import { mapGdcFileToCartFile } from "@/features/files/utils";
import { addToCart } from "@/features/cart/updateCart";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import { useSetupInitialCohorts } from "./hooks";

const ContextBar: React.FC = () => {
  const coreDispatch = useCoreDispatch();
  const cohorts = useCoreSelector((state) => selectAvailableCohorts(state));

  useSetupInitialCohorts();

  const [isGroupCollapsed, setIsGroupCollapsed] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(
    cohorts.length > 0 ? cohorts[0].id : undefined,
  );
  const [downloadManifestActive, setDownloadManifestActive] = useState(false);
  const [downloadMetadataActive, setDownloadMetadataActive] = useState(false);
  const [downloadSampleSheetActive, setDownloadSampleSheetActive] =
    useState(false);

  useEffect(() => {
    if (currentIndex === undefined && cohorts.length > 0) {
      setCurrentIndex(cohorts[0].id);
      coreDispatch(setCurrentCohortId(cohorts[0].id));
    }
  }, [cohorts, currentIndex, coreDispatch]);

  const setCohort = (id: string) => {
    coreDispatch(setActiveCohort(id));
  };
  const handleCohortSelection = (idx: string) => {
    setCohort(idx);
  };

  const currentCohortId = useCoreSelector((state) =>
    selectCurrentCohortId(state),
  );

  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );

  const currentCart = useCoreSelector((state) => selectCart(state));
  const [getFileSizeSliceData, { isLoading: fetchingFilesForCohort }] =
    useGetAllFilesMutation();

  const getAllCohortFiles = (callback, filters) => {
    getFileSizeSliceData(filters)
      .unwrap()
      .then((data: GdcFile[]) => {
        return mapGdcFileToCartFile(data);
      })
      .then((cartFiles) => {
        callback(cartFiles, currentCart, coreDispatch);
      });
  };

  useEffect(() => {
    setCurrentIndex(currentCohortId);
  }, [currentCohortId]);

  // TODO: move this to a configuration files or slice
  const [summaryFields] = useState([
    {
      field: "cases.primary_site",
      name: "Primary Site",
      docType: "cases",
      indexType: "repository",
    },
    {
      field: "cases.disease_type",
      name: "Disease Type",
      docType: "cases",
      indexType: "repository",
    },
    {
      field: "cases.project.project_id",
      name: "Project",
      docType: "cases",
      indexType: "repository",
    },
    {
      field: "cases.project.program.name",
      name: "Program",
      docType: "cases",
      indexType: "repository",
    },
    {
      field: "cases.demographic.gender",
      name: "Gender",
      docType: "cases",
      indexType: "repository",
    },
  ] as ReadonlyArray<SummaryFacetInfo>);

  const [activeTab, setActiveTab] = useState<string | null>("summary");

  return (
    <CollapsibleContainer
      Top={() => (
        <CohortManager
          cohorts={cohorts}
          onSelectionChanged={handleCohortSelection}
          startingId={currentIndex}
        />
      )}
      isCollapsed={isGroupCollapsed}
      toggle={() => setIsGroupCollapsed(!isGroupCollapsed)}
      onlyIcon={false}
      isContextBar={true}
      tooltipText={
        isGroupCollapsed
          ? "Access additional cases details and features"
          : "Collapse additional cases details and features"
      }
      tooltipPosition="left"
      TargetElement={
        <CohortCountButton countName="casesMax" label="CASES" bold />
      }
    >
      <div className="flex flex-col bg-nci-violet-lightest">
        <div className="relative p-2">
          <div className="flex flex-row absolute ml-2 gap-4">
            <DropdownWithIcon
              dropdownElements={[
                {
                  title: "Add to Cart",
                  onClick: () =>
                    getAllCohortFiles(
                      addToCart,
                      buildCohortGqlOperator(cohortFilters),
                    ),
                  icon: fetchingFilesForCohort ? (
                    <Loader size={14} />
                  ) : undefined,
                },
                {
                  title: "Download Manifest",
                  onClick: () => {
                    setDownloadManifestActive(true);
                    download({
                      endpoint: "files",
                      method: "POST",
                      options: {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                      },
                      dispatch: coreDispatch,
                      params: {
                        filters: buildCohortGqlOperator(cohortFilters),
                        return_type: "manifest",
                        size: 10000,
                      },
                      done: () => setDownloadManifestActive(false),
                    });
                  },
                  icon: downloadManifestActive ? (
                    <Loader size={14} />
                  ) : undefined,
                },
                {
                  title: "Metadata",
                  onClick: () => {
                    setDownloadMetadataActive(true);
                    download({
                      endpoint: "files",
                      method: "POST",
                      options: {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                      },
                      dispatch: coreDispatch,
                      params: {
                        filters: buildCohortGqlOperator(cohortFilters),
                        fields: [
                          "state",
                          "access",
                          "md5sum",
                          "data_format",
                          "data_type",
                          "data_category",
                          "file_name",
                          "file_size",
                          "file_id",
                          "platform",
                          "experimental_strategy",
                          "center.short_name",
                          "annotations.annotation_id",
                          "annotations.entity_id",
                          "tags",
                          "submitter_id",
                          "archive.archive_id",
                          "archive.submitter_id",
                          "archive.revision",
                          "associated_entities.entity_id",
                          "associated_entities.entity_type",
                          "associated_entities.case_id",
                          "analysis.analysis_id",
                          "analysis.workflow_type",
                          "analysis.updated_datetime",
                          "analysis.input_files.file_id",
                          "analysis.metadata.read_groups.read_group_id",
                          "analysis.metadata.read_groups.is_paired_end",
                          "analysis.metadata.read_groups.read_length",
                          "analysis.metadata.read_groups.library_name",
                          "analysis.metadata.read_groups.sequencing_center",
                          "analysis.metadata.read_groups.sequencing_date",
                          "downstream_analyses.output_files.access",
                          "downstream_analyses.output_files.file_id",
                          "downstream_analyses.output_files.file_name",
                          "downstream_analyses.output_files.data_category",
                          "downstream_analyses.output_files.data_type",
                          "downstream_analyses.output_files.data_format",
                          "downstream_analyses.workflow_type",
                          "downstream_analyses.output_files.file_size",
                          "index_files.file_id",
                        ].join(","),
                        format: "JSON",
                        pretty: "True",
                        attachment: "True",
                        expand: [
                          "metadata_files",
                          "annotations",
                          "archive",
                          "associated_entities",
                          "center",
                          "analysis",
                          "analysis.input_files",
                          "analysis.metadata",
                          "analysis.metadata_files",
                          "analysis.downstream_analyses",
                          "analysis.downstream_analyses.output_files",
                          "reference_genome",
                          "index_file",
                        ].join(","),
                        filename: `metadata.cohort.${new Date()
                          .toISOString()
                          .slice(0, 10)}.json`,
                      },
                      done: () => setDownloadMetadataActive(false),
                    });
                  },
                  icon: downloadMetadataActive ? (
                    <Loader size={14} />
                  ) : undefined,
                },
                {
                  title: "Sample Sheet",
                  onClick: () => {
                    setDownloadSampleSheetActive(true);
                    download({
                      endpoint: "files",
                      method: "POST",
                      options: {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                      },
                      dispatch: coreDispatch,
                      params: {
                        filters: buildCohortGqlOperator(cohortFilters),
                        tsv_format: "sample-sheet",
                        fields: [
                          "file_id",
                          "file_name",
                          "data_category",
                          "data_type",
                          "cases.project.project_id",
                          "cases.submitter_id",
                          "cases.samples.submitter_id",
                          "cases.samples.sample_type",
                        ].join(","),
                        format: "tsv",
                        pretty: "True",
                        attachment: "True",
                        filename: `gdc_sample_sheet.${new Date()
                          .toISOString()
                          .slice(0, 10)}.tsv`,
                      },
                      done: () => setDownloadSampleSheetActive(false),
                    });
                  },
                  icon: downloadSampleSheetActive ? (
                    <Loader size={14} />
                  ) : undefined,
                },
              ]}
              TargetButtonChildren={
                <CohortCountButton countName="fileCount" label="Files" />
              }
              LeftIcon={
                <DownloadIcon size="1rem" aria-label="Files dropdown" />
              }
            />

            <DropdownWithIcon
              dropdownElements={[
                {
                  title: "Cases",
                  onClick: () =>
                    coreDispatch(
                      showModal({ modal: Modals.GlobalCaseSetModal }),
                    ),
                },
                {
                  title: "Genes",
                  onClick: () =>
                    coreDispatch(
                      showModal({ modal: Modals.GlobalGeneSetModal }),
                    ),
                },
                {
                  title: "Mutations",
                  onClick: () =>
                    coreDispatch(
                      showModal({ modal: Modals.GlobalMutationSetModal }),
                    ),
                },
              ]}
              TargetButtonChildren="Custom Filters"
              LeftIcon={
                <CohortFilterIcon
                  size="1rem"
                  aria-label="Custom cohort filters"
                />
              }
              menuLabelText="Filter your cohort by:"
              menuLabelCustomClass="font-bold text-primary"
            />

            {activeTab === "summary" && (
              <>
                <DropdownWithIcon
                  dropdownElements={[
                    { title: "JSON (Coming Soon)" },
                    { title: "TSV (Coming Soon)" },
                  ]}
                  TargetButtonChildren="Biospecimen"
                />

                <DropdownWithIcon
                  dropdownElements={[
                    { title: "JSON (Coming Soon)" },
                    { title: "TSV (Coming Soon)" },
                  ]}
                  TargetButtonChildren="Clinical"
                />
              </>
            )}
          </div>
          <Tabs
            classNames={{
              tab: SecondaryTabStyle,
              tabsList: "px-2 mb-4 border-0",
              root: "border-0",
            }}
            data-tour="cohort_summary"
            defaultValue="summary"
            keepMounted={false}
            value={activeTab}
            onTabChange={setActiveTab}
          >
            <Tabs.List position="right">
              <Tabs.Tab
                data-tour="cohort_summary_charts"
                value="summary"
                icon={<SummaryChartIcon />}
              >
                Summary View
              </Tabs.Tab>

              <Tabs.Tab
                data-tour="cohort_summary_table"
                value="table"
                icon={<TableIcon />}
              >
                Table View
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="summary">
              <SummaryFacets fields={summaryFields} />
            </Tabs.Panel>
            <Tabs.Panel value="table">
              <ContextualCasesView />
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>
    </CollapsibleContainer>
  );
};

export default ContextBar;
