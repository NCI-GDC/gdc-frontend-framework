import { hideModal, useCoreDispatch } from "@gff/core";
import { Button, Modal, Text } from "@mantine/core";
import { LoginButton } from "../LoginButton";

export const SessionExpireModal = ({
  openModal,
}: {
  openModal: boolean;
}): JSX.Element => {
  const dispatch = useCoreDispatch();
  return (
    <Modal
      opened={openModal}
      title={
        <Text size="lg" className="bold">
          Session Expired
        </Text>
      }
      onClose={() => {
        dispatch(hideModal());
      }}
      styles={() => ({
        header: {
          marginBottom: "5px",
        },
      })}
      closeButtonLabel="Done"
      withinPortal={false}
      data-testid="sessionmodal"
    >
      <div
        className=""
        style={{
          borderTop: "1px solid gray",
          borderBottom: "1px solid gray",
          padding: "15px 0",
        }}
      >
        <Text size="sm"> Your session has expired.</Text>
        <div style={{ display: "flex", alignContent: "center" }}>
          <Text size="sm" className="mt-1">
            Please
          </Text>{" "}
          <LoginButton fromSession />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "10px",
        }}
      >
        <Button onClick={() => dispatch(hideModal())}>Cancel</Button>
      </div>
    </Modal>
  );
};
