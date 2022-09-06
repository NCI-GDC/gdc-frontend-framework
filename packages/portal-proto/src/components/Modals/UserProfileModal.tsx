import {
  hideModal,
  useCoreDispatch,
  useCoreSelector,
  selectUserDetailsInfo,
} from "@gff/core";
import { Button, Modal, Text } from "@mantine/core";
import { FaCheck } from "react-icons/fa";
import { theme } from "tailwind.config";
import { ScrollableTableWithFixedHeader } from "../ScrollableTableWithFixedHeader";

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
    <Modal
      opened={openModal}
      onClose={() => {
        dispatch(hideModal());
      }}
      title={<Text size="lg">{`Username: ${username}`}</Text>}
      size="60%"
      styles={() => ({
        header: {
          marginBottom: "5px",
        },
        close: {
          color: theme.extend.colors["gdc-grey"].darkest,
        },
      })}
      closeButtonLabel="Done"
      withinPortal={false}
    >
      <div className={`${!data ? "py-15px" : "py-5px"} border-y border-y-base`}>
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
                className="text-utility-link underline hover:text-accent-cool-darkest"
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
          className="!bg-primary hover:!bg-primary-darker"
        >
          Done
        </Button>
      </div>
    </Modal>
  );
};
