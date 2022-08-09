import { TempTable } from "@/features/files/FileView";
import { hideModal, useCoreDispatch } from "@gff/core";
import { Modal } from "@mantine/core";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";

export const UserProfileModal = ({ openModal }: { openModal: boolean }) => {
  // probably call a selector which returns the info in this order
  const res = {
    projects: {
      phs_ids: {
        phs000178: ["_member_"],
        phs001648: ["_member_"],
        phs001337: ["_member_"],
        phs000218: ["_member_"],
        phs000235: ["_member_"],
      },
      gdc_ids: {
        "TCGA-CNTL": ["_member_"],
        "TCGA-KIRC": ["_member_"],
        "TCGA-ACC": ["_member_"],
        "TCGA-LUAD": ["_member_"],
        "TCGA-MESO": ["_member_"],
        "TCGA-STAD": ["_member_"],
        "TCGA-PAAD": ["_member_"],
        "TCGA-TGCT": ["_member_"],
        "TCGA-OV": ["_member_"],
        "TCGA-HNSC": ["_member_"],
        "TCGA-LGG": ["_member_"],
        "TCGA-FPPP": ["_member_"],
        "TCGA-BLCA": ["_member_"],
        "TCGA-SARC": ["_member_"],
        "TCGA-CHOL": ["_member_"],
        "TCGA-THYM": ["_member_"],
        "TCGA-TDI": ["_member_"],
        "TCGA-DEV1": ["_member_"],
        "TCGA-KIRP": ["_member_"],
        "TCGA-KICH": ["_member_"],
        "TCGA-GBM": ["_member_"],
        "TCGA-THCA": ["_member_"],
        "TCGA-LAML": ["_member_"],
        "TCGA-COAD": ["_member_"],
        "TCGA-UCEC": ["_member_"],
        "TCGA-LIHC": ["_member_"],
        "TCGA-PCPG": ["_member_"],
        "TCGA-CESC": ["_member_"],
        "TCGA-READ": ["_member_"],
        "TCGA-UCS": ["_member_"],
        "TCGA-ESCA": ["_member_"],
        "TCGA-PRAD": ["_member_"],
        "TCGA-UVM": ["_member_"],
        "TCGA-SKCM": ["_member_"],
        "TCGA-DLBC": ["_member_"],
        "TCGA-LUSC": ["_member_"],
        "TCGA-BRCA": ["_member_"],
        "WCDT-MCRPC": ["_member_"],
        "GENIE-NKI": ["_member_"],
        "GENIE-MDA": ["_member_"],
        "GENIE-DFCI": ["_member_"],
        "GENIE-UHN": ["_member_"],
        "GENIE-GRCC": ["_member_"],
        "GENIE-JHU": ["_member_"],
        "GENIE-MSK": ["_member_"],
        "GENIE-VICC": ["_member_"],
        "TARGET-ALL-P1": ["_member_"],
        "TARGET-CCSK": ["_member_"],
        "TARGET-MDLS": ["_member_"],
        "TARGET-NBL": ["_member_"],
        "TARGET-ALL-P2": ["_member_"],
        "TARGET-RT": ["_member_"],
        "TARGET-AML": ["_member_"],
        "TARGET-WT": ["_member_"],
        "TARGET-OS": ["_member_"],
        "TARGET-AML-IF": ["_member_"],
        "TARGET-ALL-P3": ["_member_"],
        "CGCI-HTMCP-DLBCL": [
          "_member_",
          "update",
          "download",
          "read",

          "delete",
          "release",
        ],
        "CGCI-HTMCP-LC": ["_member_"],
        "CGCI-BLGSP": ["_member_"],
        "CGCI-HTMCP-CC": ["_member_", "create"],
      },
    },
    username: "PARIBARTANDHAKAL",
  };
  const {
    projects: { gdc_ids },
  } = res;
  const dispatch = useCoreDispatch();
  const formatUserProfileData = () => {
    // get the unique permission properties
    const allPermissionValues = Array.from(
      new Set(
        gdc_ids &&
          Object.keys(gdc_ids).reduce(
            (acc, projectId) => [...acc, ...gdc_ids[projectId]],
            [],
          ),
      ),
    );

    const data =
      gdc_ids &&
      Object.keys(gdc_ids).map((projectId) => ({
        projectId,
        ...allPermissionValues.reduce(
          (acc, v) => ({
            ...acc,
            [v]: gdc_ids[projectId].includes(v) ? (
              <span>
                <FaCheck
                  aria-label="permission given"
                  aria-hidden
                  key={projectId}
                />
              </span>
            ) : (
              <span aria-label="no permission"></span>
            ),
          }),
          [],
        ),
      }));

    const headings = ["Project ID", ...allPermissionValues.map((v) => v)];

    return {
      headers: headings,
      tableRows: data,
    };
  };

  return (
    <Modal
      opened={openModal}
      onClose={() => {
        dispatch(hideModal());
      }}
      title={<h1>{`Username: ${res?.username}`}</h1>}
      overflow="inside"
      size="60%"
      className="relative"
      closeButtonLabel="Done"
    >
      <TempTable tableData={formatUserProfileData()} />
    </Modal>
  );
};
