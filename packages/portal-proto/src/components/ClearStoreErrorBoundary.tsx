import React, { Component, ReactNode } from "react";
import { persistor } from "@gff/core";
import { Modal } from "@mantine/core";
import DarkFunctionButton from "./StyledComponents/DarkFunctionButton";
import ModalButtonContainer from "./StyledComponents/ModalButtonContainer";

class ClearStoreErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Modal opened onClose={undefined} title="Unexpected Error">
          <p className="py-2 px-4">
            An unexpected error has occurred. Your saved cohorts are being
            recovered, but your cart and sets may be lost.
          </p>
          <ModalButtonContainer>
            <DarkFunctionButton
              onClick={async () => {
                await persistor.purge();
                location.reload();
              }}
            >
              OK
            </DarkFunctionButton>
          </ModalButtonContainer>
        </Modal>
      );
    }

    return this.props.children;
  }
}

export default ClearStoreErrorBoundary;
