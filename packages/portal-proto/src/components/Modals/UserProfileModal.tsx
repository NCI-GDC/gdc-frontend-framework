import { TempTable } from "@/features/files/FileView";
import {
  hideModal,
  useCoreDispatch,
  useCoreSelector,
  selectUserDetailsInfo,
} from "@gff/core";
import { Button, Modal, Text } from "@mantine/core";
import { FaCheck } from "react-icons/fa";
export const UserProfileModal = ({ openModal }: { openModal: boolean }) => {
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

  const headings = ["Project ID", ...allPermissionValues.map((v) => v)];

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
      })}
      closeButtonLabel="Done"
    >
      <div
        style={{
          borderTop: "1px solid gray",
          borderBottom: "1px solid gray",
          padding: `${!data ? "15px" : "5px"} 0`,
        }}
      >
        {data ? (
          <TempTable
            tableData={{
              headers: headings,
              tableRows: data,
            }}
            customWrapperStyle={{
              height: "500px",
              overflow: "hidden",
              overflowY: "scroll",
            }}
            customTableStyle={{
              position: "sticky",
              top: 0,
              width: "100%",
            }}
          />
        ) : (
          <>
            <Text style={{ marginBottom: "1rem" }}>
              You do not have any access to controlled access data for projects
              available in the GDC Data Portal.
            </Text>
            <Text>
              For instructions on{" "}
              <a
                href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data"
                target="_blank"
                style={{ color: "#2a72a5", textDecoration: "underline" }}
              >
                how to apply for access to controlled data
              </a>
              , please visit our documentation on how to apply for access
              through dbGAP.
            </Text>
          </>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "10px",
        }}
      >
        <Button onClick={() => dispatch(hideModal())}>Done</Button>
      </div>
    </Modal>
  );
};
