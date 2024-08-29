import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import SaveCohortModal from "@/components/Modals/SaveCohortModal";
import { focusStyles } from "@/utils/index";
import download from "@/utils/download";
import { useCoreDispatch } from "@gff/core";
import { Button, Loader, Tooltip } from "@mantine/core";
import { useState } from "react";
import { FiDownload as DownloadIcon } from "react-icons/fi";
import { ProjectViewProps } from "./ProjectView";

function SummaryHeaderControls({
  projectData,
}: {
  projectData: ProjectViewProps;
}) {
  const dispatch = useCoreDispatch();
  const [manifestDownloadActive, setManifestDownloadActive] = useState(false);
  const [clinicalDownloadActive, setClinicalDownloadActive] = useState(false);
  const [biospecimenDownloadActive, setBiospecimenDownloadActive] =
    useState(false);
  const [showSaveCohort, setShowSaveCohort] = useState(false);

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
      />

      <DropdownWithIcon
        customDataTestId="button-biospecimen-project-summary"
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
        LeftSection={
          biospecimenDownloadActive ? (
            <Loader size={20} />
          ) : (
            <DownloadIcon size="1rem" aria-label="download" />
          )
        }
      />
      <DropdownWithIcon
        customDataTestId="button-clinical-project-summary"
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
        LeftSection={
          clinicalDownloadActive ? (
            <Loader size={20} />
          ) : (
            <DownloadIcon size="1rem" aria-label="download" />
          )
        }
      />
      <Tooltip
        transitionProps={{ duration: 200, transition: "fade" }}
        w={220}
        label="Download a manifest for use with the GDC Data Transfer Tool. The GDC
          Data Transfer Tool is recommended for transferring large volumes of data."
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
  );
}

export default SummaryHeaderControls;
