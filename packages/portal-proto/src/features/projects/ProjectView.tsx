import React, { useState } from "react";
import {
  AnnotationDefaults,
  ProjectDefaults,
  useCoreDispatch,
} from "@gff/core";
import { FaUser, FaFile, FaEdit } from "react-icons/fa";
import { FiDownload as DownloadIcon } from "react-icons/fi";
import { SummaryHeader } from "@/components/Summary/SummaryHeader";
import { Button, Loader, Tooltip } from "@mantine/core";
import Link from "next/link";
import CategoryTableSummary from "@/components/Summary/CategoryTableSummary";
import { HeaderTitle } from "@/components/tailwindComponents";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import { HorizontalTable } from "@/components/HorizontalTable";
import { SingularOrPluralSpan } from "@/components/SingularOrPluralSpan/SingularOrPluralSpan";
import download from "src/utils/download";
import PrimarySiteTable from "./PrimarySiteTable";
import {
  formatDataForDataCategoryTable,
  formatDataForExpCategoryTable,
  formatDataForSummary,
  getAnnotationsLinkParams,
} from "./utils";
import SaveCohortModal from "@/components/Modals/SaveCohortModal";
import { focusStyles } from "@/utils/index";

export interface ProjectViewProps extends ProjectDefaults {
  readonly annotation: {
    list: AnnotationDefaults[];
    count: number;
  };
  hasControlledAccess: boolean;
  isModal?: boolean;
}

export const ProjectView: React.FC<ProjectViewProps> = (
  projectData: ProjectViewProps,
) => {
  const dispatch = useCoreDispatch();
  const [manifestDownloadActive, setManifestDownloadActive] = useState(false);
  const [clinicalDownloadActive, setClinicalDownloadActive] = useState(false);
  const [biospecimenDownloadActive, setBiospecimenDownloadActive] =
    useState(false);
  const [showSaveCohort, setShowSaveCohort] = useState(false);

  const addLinkValue = () => (
    <span className="text-base-lightest">
      {getAnnotationsLinkParams(projectData) ? (
        <Link
          href={getAnnotationsLinkParams(projectData)}
          className="underline"
          target="_blank"
        >
          {projectData.annotation.count.toLocaleString()}
        </Link>
      ) : (
        projectData.annotation.count.toLocaleString()
      )}
    </span>
  );

  const Cases = (
    <span className="flex items-center gap-0.5">
      <div className="text-sm 2xl:text-xl">
        <FaUser />
      </div>

      <SingularOrPluralSpan
        count={projectData.summary?.case_count}
        title="Case"
      />
    </span>
  );

  const Files = (
    <span className="flex items-center gap-0.5">
      <div className="text-sm 2xl:text-xl">
        <FaFile />
      </div>

      <SingularOrPluralSpan
        count={projectData.summary?.file_count}
        title="File"
      />
    </span>
  );

  const Annotations = (
    <span className="flex items-center gap-0.5">
      <div className="text-sm 2xl:text-xl">
        <FaEdit />
      </div>
      <span>
        <span className="font-bold">{addLinkValue()} </span>
        {`Annotation${projectData.annotation.count === 1 ? `` : `s`}`}
      </span>
    </span>
  );

  const message = projectData.hasControlledAccess ? (
    <p className="font-content">
      The project has controlled access data which requires dbGaP Access. See
      instructions for{" "}
      <a
        href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data"
        className="text-utility-link underline"
        target="_blank"
        rel="noreferrer"
      >
        Obtaining Access to Controlled Data.
      </a>
    </p>
  ) : null;

  const handleBiospeciemenTSVDownload = () => {
    setBiospecimenDownloadActive(true);
    download({
      endpoint: "biospecimen_tar",
      method: "POST",
      dispatch,
      params: {
        filename: `biospecimen.project-${projectData.project_id}.${new Date()
          .toISOString()
          .slice(0, 10)}.tar.gz`,
        filters: {
          op: "in",
          content: {
            field: "cases.project.project_id",
            value: [projectData.project_id],
          },
        },
        size: projectData.summary?.case_count,
      },
      done: () => setBiospecimenDownloadActive(false),
    });
  };

  const handleBiospeciemenJSONDownload = () => {
    setBiospecimenDownloadActive(true);
    download({
      endpoint: "biospecimen_tar",
      method: "POST",
      dispatch,
      params: {
        format: "JSON",
        pretty: true,
        filename: `biospecimen.project-${projectData.project_id}.${new Date()
          .toISOString()
          .slice(0, 10)}.json`,
        filters: {
          op: "in",
          content: {
            field: "cases.project.project_id",
            value: [projectData.project_id],
          },
        },
        size: projectData.summary?.case_count,
      },
      done: () => setBiospecimenDownloadActive(false),
    });
  };

  const handleClinicalTSVDownload = () => {
    setClinicalDownloadActive(true);
    download({
      endpoint: "clinical_tar",
      method: "POST",
      dispatch,
      params: {
        filename: `clinical.project-${projectData.project_id}.${new Date()
          .toISOString()
          .slice(0, 10)}.tar.gz`,
        filters: {
          op: "in",
          content: {
            field: "cases.project.project_id",
            value: [projectData.project_id],
          },
        },
        size: projectData.summary?.case_count,
      },
      done: () => setClinicalDownloadActive(false),
    });
  };

  const handleClinicalJSONDownload = () => {
    setClinicalDownloadActive(true);
    download({
      endpoint: "clinical_tar",
      method: "POST",
      dispatch,
      params: {
        format: "JSON",
        pretty: true,
        filename: `clinical.project-${projectData.project_id}.${new Date()
          .toISOString()
          .slice(0, 10)}.json`,
        filters: {
          op: "in",
          content: {
            field: "cases.project.project_id",
            value: [projectData.project_id],
          },
        },
        size: projectData.summary?.case_count,
      },
      done: () => setClinicalDownloadActive(false),
    });
  };

  const handleManifestDownload = () => {
    setManifestDownloadActive(true);
    download({
      endpoint: "files",
      method: "POST",
      dispatch,
      params: {
        filters: {
          op: "in",
          content: {
            field: "cases.project.project_id",
            value: [projectData.project_id],
          },
        },
        return_type: "manifest",
        size: 10000,
      },
      done: () => setManifestDownloadActive(false),
    });
  };

  return (
    <>
      <SummaryHeader
        iconText="pr"
        headerTitle={projectData.project_id}
        isModal={projectData.isModal}
        leftElement={
          <div className="flex gap-2">
            <Tooltip
              label={`Save a new cohort of ${projectData.project_id} cases`}
              withArrow
            >
              <Button
                color="primary"
                variant="outline"
                className={`bg-base-max border-primary font-medium text-sm ${focusStyles}`}
                onClick={() => setShowSaveCohort(true)}
              >
                Save New Cohort
              </Button>
            </Tooltip>

            <SaveCohortModal
              opened={showSaveCohort}
              filters={{
                mode: "and",
                root: {
                  "cases.project.project_id": {
                    operator: "includes",
                    field: "cases.project.project_id",
                    operands: [projectData.project_id],
                  },
                },
              }}
              onClose={() => setShowSaveCohort(false)}
            />

            <DropdownWithIcon
              dropdownElements={[
                {
                  title: "TSV",
                  icon: <DownloadIcon size={16} aria-label="download" />,
                  onClick: handleBiospeciemenTSVDownload,
                },
                {
                  title: "JSON",
                  icon: <DownloadIcon size={16} aria-label="download" />,
                  onClick: handleBiospeciemenJSONDownload,
                },
              ]}
              TargetButtonChildren={
                <span className="font-medium text-sm">
                  {biospecimenDownloadActive ? "Processing" : "Biospecimen"}
                </span>
              }
              LeftIcon={
                biospecimenDownloadActive ? (
                  <Loader size={20} />
                ) : (
                  <DownloadIcon size="1rem" aria-label="download" />
                )
              }
            />
            <DropdownWithIcon
              dropdownElements={[
                {
                  title: "TSV",
                  icon: <DownloadIcon size={16} aria-label="download" />,
                  onClick: handleClinicalTSVDownload,
                },
                {
                  title: "JSON",
                  icon: <DownloadIcon size={16} aria-label="download" />,
                  onClick: handleClinicalJSONDownload,
                },
              ]}
              TargetButtonChildren={
                <span className="font-medium text-sm">
                  {clinicalDownloadActive ? "Processing" : "Clinical"}
                </span>
              }
              LeftIcon={
                clinicalDownloadActive ? (
                  <Loader size={20} />
                ) : (
                  <DownloadIcon size="1rem" aria-label="download" />
                )
              }
            />
            <Tooltip
              transitionProps={{ duration: 200, transition: "fade" }}
              width={220}
              label="Download a manifest for use with the GDC Data Transfer Tool. The GDC
              Data Transfer Tool is recommended for transferring large volumes of data."
              arrowSize={10}
              position="bottom"
              multiline
              withArrow
            >
              <Button
                variant="outline"
                leftIcon={
                  manifestDownloadActive ? (
                    <Loader size={20} />
                  ) : (
                    <DownloadIcon size="1.25em" aria-label="download" />
                  )
                }
                className={`text-primary bg-base-max border-primary hover:bg-primary-darkest hover:text-base-max ${focusStyles}`}
                classNames={{ label: "font-medium text-sm" }}
                onClick={handleManifestDownload}
              >
                {manifestDownloadActive ? "Processing" : "Manifest"}
              </Button>
            </Tooltip>
          </div>
        }
        rightElement={
          <div className="flex items-center gap-2 text-sm 2xl:text-2xl text-base-lightest leading-4 font-montserrat uppercase whitespace-no-wrap">
            Total of {Cases} {Files} {Annotations}
          </div>
        }
      />

      <div className={`mx-4 ${projectData.isModal ? "mt-4" : "mt-36"} `}>
        <div className="mt-8">
          <div className="flex justify-between gap-8">
            <HeaderTitle>Summary</HeaderTitle>
            {message && <div className="text-sm text-right">{message}</div>}
          </div>
          <div className="flex">
            <div className="basis-1/2">
              <HorizontalTable
                tableData={formatDataForSummary(projectData).slice(
                  0,
                  formatDataForSummary(projectData).length === 4 ? 2 : 3,
                )}
              />
            </div>
            <div className="basis-1/2">
              <HorizontalTable
                tableData={formatDataForSummary(projectData).slice(
                  formatDataForSummary(projectData).length === 4 ? 2 : 3,
                  formatDataForSummary(projectData).length,
                )}
              />
            </div>
          </div>

          {(projectData?.summary?.data_categories ||
            projectData?.summary?.experimental_strategies) && (
            <div className="flex gap-8 mt-8 mb-14">
              {projectData?.summary?.data_categories && (
                <CategoryTableSummary
                  title="Cases and File Counts by Data Category"
                  {...formatDataForDataCategoryTable(projectData)}
                />
              )}
              {projectData?.summary?.experimental_strategies && (
                <CategoryTableSummary
                  title="Cases and File Counts by Experimental Strategy"
                  {...formatDataForExpCategoryTable(projectData)}
                />
              )}
            </div>
          )}
          {projectData?.primary_site?.length > 1 && (
            <div className="mb-16">
              <PrimarySiteTable
                projectId={projectData?.project_id}
                primarySites={projectData?.primary_site}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
