import { Text } from "@mantine/core";
import { BaseModal } from "./BaseModal";

const CartSizeLimitModal = ({
  openModal,
}: {
  openModal: boolean;
}): JSX.Element => {
  return (
    <BaseModal
      title={
        <Text size="lg" className="font-medium">
          Access Alert
        </Text>
      }
      openModal={openModal}
      buttons={[{ title: "Accept", dataTestId: "button-cart-modal-accept" }]}
    >
      <div>
        <p>Your cart contains more than 5 GBs of data.</p>

        <p>
          Please select the &quot;Download &gt; Manifest&quot; option and use
          the{" "}
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
    </BaseModal>
  );
};

export default CartSizeLimitModal;
