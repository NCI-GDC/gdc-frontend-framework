import {
  hideModal,
  useCoreDispatch,
  useCoreSelector,
  selectUserDetailsInfo,
} from "@gff/core";
import { Button, Modal, Text } from "@mantine/core";
import { FaCheck } from "react-icons/fa";
import { ScrollableTableWithFixedHeader } from "../ScrollableTableWithFixedHeader";
import { BaseModal } from "./BaseModal";

export const UserProfileModal = ({
  openModal,
}: {
  openModal: boolean;
}): JSX.Element => {
  const dispatch = useCoreDispatch();
  const userInfo = useCoreSelector((state) => selectUserDetailsInfo(state));
  const {
    projects: { gdc_ids },
    username,
  } = userInfo?.data || {};

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

  const headings = [
    "Project ID",
    ...allPermissionValues.map((v) => {
      if (v === "_member_") {
        return "member";
      }
      return v;
    }),
  ];

  return (
    <BaseModal
      title={
        <Text size="lg" className="font-medium">{`Username: ${username}`}</Text>
      }
      closeButtonLabel="Done"
      openModal={openModal}
      size="60%"
    >
      <div
        className={`${!data ? "py-15px" : "py-5px"} border-y border-y-nci-gray`}
      >
        {data.length > 0 ? (
          <ScrollableTableWithFixedHeader
            tableData={{
              headers: headings,
              tableRows: data,
            }}
          />
        ) : (
          <div data-testid="warningText">
            <Text className="mb-4">
              You do not have any access to controlled access data for projects
              available in the GDC Data Portal.
            </Text>
            <Text>
              For instructions on{" "}
              <a
                href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data"
                target="_blank"
                rel="noreferrer"
                className="text-nci-blue underline hover:text-nci-blue-darkest"
              >
                how to apply for access to controlled data
              </a>
              , please visit our documentation on how to apply for access
              through dbGAP.
            </Text>
          </div>
        )}
      </div>

      <div className="flex justify-end mt-2.5">
        <Button
          onClick={() => dispatch(hideModal())}
          className="bg-nci-blue hover:bg-nci-blue-darker"
        >
          Done
        </Button>
      </div>
    </BaseModal>
  );
};
