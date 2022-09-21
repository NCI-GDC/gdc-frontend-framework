import { hideModal, useCoreDispatch } from "@gff/core";
import { Button, Text } from "@mantine/core";
import { BaseModal } from "./BaseModal";

const CartSizeLimitModal = ({
  openModal,
}: {
  openModal: boolean;
}): JSX.Element => {
  const dispatch = useCoreDispatch();
  return (
    <BaseModal
      title={
        <Text size="lg" className="font-medium">
          Access Alert
        </Text>
      }
      closeButtonLabel="Close"
      openModal={openModal}
    >
      <div>
        <p>Your cart contains more than 5 GBs of data.</p>

        <p>
          Please select the "Download {">"} Manifest" option and use the{" "}
          <a
            href="https://gdc.cancer.gov/access-data/gdc-data-transfer-tool"
            target="_blank"
            rel="noopener noreferrer"
            className="text-utility-link"
          >
            Data Transfer Tool
          </a>{" "}
          to download the files in your cart.
        </p>
      </div>
      <div className="flex justify-end mt-2.5">
        <Button
          onClick={() => dispatch(hideModal())}
          className="!bg-primary hover:!bg-primary-darker"
        >
          Close
        </Button>
      </div>
    </BaseModal>
  );
};

export default CartSizeLimitModal;
