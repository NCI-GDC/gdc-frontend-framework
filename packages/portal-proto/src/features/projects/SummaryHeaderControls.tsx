import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import { SaveCohortModal } from "@gff/portal-components";
import { focusStyles } from "@/utils/index";
import download from "@/utils/download";
import { useCoreDispatch } from "@gff/core";
import { Button, Loader, Tooltip } from "@mantine/core";
import { useState } from "react";
import { ProjectViewProps } from "./ProjectView";
import { getFormattedTimestamp } from "@/utils/date";
import { DownloadIcon } from "@/utils/icons";
import { cohortActionsHooks } from "../cohortBuilder/CohortManager/cohortActionHooks";
import { INVALID_COHORT_NAMES } from "../cohortBuilder/utils";

function SummaryHeaderControls({
  projectData,
}: {
  projectData: ProjectViewProps;
}) {
  const dispatch = useCoreDispatch();
  const [manifestDownloadActive, setManifestDownloadActive] = useState(false);
  const [clinicalDownloadActiveTSV, setClinicalDownloadActiveTSV] =
    useState(false);
  const [clinicalDownloadActiveJSON, setClinicalDownloadActiveJSON] =
    useState(false);
  const [biospecimenDownloadActiveTSV, setBiospecimenDownloadActiveTSV] =
    useState(false);
  const [biospecimenDownloadActiveJSON, setBiospecimenDownloadActiveJSON] =
    useState(false);
  const [showSaveCohort, setShowSaveCohort] = useState(false);

  const handleBiospeciemenTSVDownload = () => {
    setBiospecimenDownloadActiveTSV(true);
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
      done: () => setBiospecimenDownloadActiveTSV(false),
    });
  };

  const handleBiospeciemenJSONDownload = () => {
    setBiospecimenDownloadActiveJSON(true);
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
      done: () => setBiospecimenDownloadActiveJSON(false),
    });
  };

  const handleClinicalTSVDownload = () => {
    setClinicalDownloadActiveTSV(true);
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
      done: () => setClinicalDownloadActiveTSV(false),
    });
  };

  const handleClinicalJSONDownload = () => {
    setClinicalDownloadActiveJSON(true);
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
      done: () => setClinicalDownloadActiveJSON(false),
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
        filename: `gdc_manifest.${getFormattedTimestamp({
          includeTimes: true,
        })}.txt`,
      },
      done: () => setManifestDownloadActive(false),
    });
  };

  return (
    <div className="flex gap-2">
      <Tooltip
        label={`Save a new cohort of ${projectData.project_id} cases`}
        withArrow
      >
        <Button
          data-testid="button-save-new-cohort-project-summary"
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
        hooks={cohortActionsHooks}
        invalidCohortNames={INVALID_COHORT_NAMES}
      />

      <DropdownWithIcon
        customTargetButtonDataTestId="button-biospecimen-project-summary"
        dropdownElements={[
          {
            title: "TSV",
            icon: biospecimenDownloadActiveTSV ? (
              <Loader size={16} />
            ) : (
              <DownloadIcon size={16} aria-label="download" />
            ),
            onClick: handleBiospeciemenTSVDownload,
            isLoading: biospecimenDownloadActiveTSV,
          },
          {
            title: "JSON",
            icon: biospecimenDownloadActiveJSON ? (
              <Loader size={16} />
            ) : (
              <DownloadIcon size={16} aria-label="download" />
            ),
            onClick: handleBiospeciemenJSONDownload,
            isLoading: biospecimenDownloadActiveJSON,
          },
        ]}
        TargetButtonChildren={
          <span className="font-medium text-sm">Biospecimen</span>
        }
        LeftSection={<DownloadIcon size="1rem" aria-label="download" />}
        closeOnItemClick={false}
      />
      <DropdownWithIcon
        customTargetButtonDataTestId="button-clinical-project-summary"
        dropdownElements={[
          {
            title: "TSV",
            icon: clinicalDownloadActiveTSV ? (
              <Loader size={16} />
            ) : (
              <DownloadIcon size={16} aria-label="download" />
            ),
            onClick: handleClinicalTSVDownload,
            isLoading: clinicalDownloadActiveTSV,
          },
          {
            title: "JSON",
            icon: clinicalDownloadActiveJSON ? (
              <Loader size={16} />
            ) : (
              <DownloadIcon size={16} aria-label="download" />
            ),
            onClick: handleClinicalJSONDownload,
            isLoading: clinicalDownloadActiveJSON,
          },
        ]}
        TargetButtonChildren={
          <span className="font-medium text-sm">Clinical</span>
        }
        LeftSection={<DownloadIcon size="1rem" aria-label="download" />}
        closeOnItemClick={false}
      />
      <Tooltip
        transitionProps={{ duration: 200, transition: "fade" }}
        w={220}
        label={
          manifestDownloadActive
            ? "A previous download is being processed. Additional downloads may be started."
            : `Download a manifest for use with the GDC Data Transfer Tool. The GDC
          Data Transfer Tool is recommended for transferring large volumes of data.`
        }
        arrowSize={10}
        position="bottom"
        multiline
        withArrow
      >
        <Button
          data-testid="button-manifest-project-summary"
          variant="outline"
          leftSection={
            manifestDownloadActive ? (
              <Loader size="1rem" />
            ) : (
              <DownloadIcon size="1rem" aria-label="download" />
            )
          }
          className={`text-primary bg-base-max border-primary hover:bg-primary-darkest hover:text-base-max ${focusStyles}`}
          classNames={{ label: "font-medium text-sm" }}
          onClick={handleManifestDownload}
        >
          Manifest
        </Button>
      </Tooltip>
    </div>
  );
}

export default SummaryHeaderControls;
