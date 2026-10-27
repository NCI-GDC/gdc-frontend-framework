"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Modal } from "@mantine/core";
import { persistor as corePersistor } from "@gff/core";
import { persistor as repositoryPersistor } from "@/features/repositoryApp/appApi";
import { persistor as projectsPersistor } from "@/features/projectsCenter/appApi";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";

const Error = () => {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();
  const encounteredError = query.get("encounteredError");
  const app = query.get("app");
  // If the user has already encountered this error on the page and clearing the store didn't fix it,
  // push them to the homepage
  if (encounteredError) {
    router.push("/");
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
              if (app === "Downloads") {
                await repositoryPersistor.purge();
              } else if (app === "Projects") {
                await projectsPersistor.purge();
              }

              await corePersistor.purge();

              const newParams = new URLSearchParams(query.toString());
              newParams.set("encounteredError", "true");

              router.replace(`${pathname}?=${newParams.toString()}`);
              router.refresh();
            }}
          >
            OK
          </DarkFunctionButton>
        </ModalButtonContainer>
      </Modal>
    );
  }
};

export default Error;
