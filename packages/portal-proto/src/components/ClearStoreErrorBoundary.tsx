import React, { Component, ReactNode } from "react";
import { NextRouter, withRouter } from "next/router";
import { Modal } from "@mantine/core";
import { persistor } from "@gff/core";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";
// Done this way because There is currently no way to write an error boundary as a function component.
interface ClearStoreErrorBoundaryProps {
  children: ReactNode;
  router: NextRouter;
}

class ClearStoreErrorBoundary extends Component<
  ClearStoreErrorBoundaryProps,
  { hasError: boolean }
> {
  constructor(props: ClearStoreErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      const { encounteredError } = this.props.router.query;
      // If the user has already encountered this error on the page and clearing the store didn't fix it,
      // push them to the homepage
      if (encounteredError) {
        this.props.router.push("/");
      } else {
        return (
          <Modal
            opened
            withCloseButton={false}
            onClose={undefined}
            title="Unexpected Error"
          >
            <p className="py-2 px-4">
              An unexpected error has occurred. Your saved cohorts are being
              recovered, but your cart and sets may be lost.
            </p>
            <ModalButtonContainer data-testid="modal-button-container">
              <DarkFunctionButton
                onClick={async () => {
                  await persistor.purge();
                  this.props.router
                    .replace({
                      query: {
                        ...this.props.router.query,
                        encounteredError: true,
                      },
                    })
                    .then(() => this.props.router.reload());
                }}
              >
                OK
              </DarkFunctionButton>
            </ModalButtonContainer>
          </Modal>
        );
      }
    }

    return this.props.children;
  }
}

export default withRouter(ClearStoreErrorBoundary);
