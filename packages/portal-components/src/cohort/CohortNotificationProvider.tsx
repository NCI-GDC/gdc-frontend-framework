import React, {
  useEffect,
  useState,
  createContext,
  PropsWithChildren,
} from "react";
import { Button } from "@mantine/core";
import { Notifications, showNotification } from "@mantine/notifications";
import { ContextModalProps, ModalsProvider } from "@mantine/modals";
import {
  DeleteCohortNotification,
  DiscardChangesCohortNotification,
  ErrorCohortNotification,
  NewCohortNotification,
  SavedCurrentCohortNotification,
  SavedCohortNotification,
  SavedCohortNotificationWithSetAsCurrent,
} from "./CohortNotifications";
import { MantineProvider } from "@mantine/core";

const SaveCohortErrorModal = ({ context, id }: ContextModalProps) => (
  <>
    <p className="py-2 px-4">There was a problem saving the cohort.</p>
    <div
      className="bg-base-lightest flex p-4 gap-4 justify-end mt-4 rounded-b-lg sticky"
      data-testid="modal-button-container"
    >
      <Button onClick={() => context.closeModal(id)} variant="darkFunction">
        OK
      </Button>
    </div>
  </>
);

export const CohortNotificationContext = createContext<
  ((cohortMessage: CohortNotificationCommand[]) => void) | undefined
>(undefined);

interface CohortNotificationWrapperProps extends PropsWithChildren {
  readonly useSetActiveCohort: () => (cohortId: string) => void;
}

interface CohortNotificationCommand {
  cmd: string;
  param1: string;
  param2?: string;
}

const CohortNotificationProvider: React.FC<CohortNotificationWrapperProps> = ({
  useSetActiveCohort,
  children,
}) => {
  const [cohortMessage, setCohortMessage] = useState<
    CohortNotificationCommand[]
  >([]);

  useEffect(() => {
    for (const message of cohortMessage) {
      switch (message.cmd) {
        case "newCohort":
          showNotification({
            message: <NewCohortNotification cohortName={message.param1} />,
            classNames: {
              description: "flex flex-col content-center text-center",
            },
            autoClose: 5000,
            closeButtonProps: { "aria-label": "Close notification" },
          });
          break;
        case "deleteCohort":
          showNotification({
            message: <DeleteCohortNotification cohortName={message.param1} />,
            classNames: {
              description: "flex flex-col content-center text-center",
            },
            autoClose: 5000,
            closeButtonProps: { "aria-label": "Close notification" },
          });
          break;
        case "savedCohort":
          showNotification({
            message: <SavedCohortNotification cohortName={message.param1} />,
            classNames: {
              description: "flex flex-col content-center text-center",
            },
            autoClose: 5000,
            closeButtonProps: { "aria-label": "Close notification" },
          });
          break;
        case "savedCohortSetCurrent":
          showNotification({
            message: (
              <SavedCohortNotificationWithSetAsCurrent
                cohortName={message.param1}
                cohortId={message.param2 as string}
                useSetActiveCohort={useSetActiveCohort}
              />
            ),
            classNames: {
              description: "flex flex-col content-center text-center",
            },
            autoClose: 5000,
            closeButtonProps: { "aria-label": "Close notification" },
          });
          break;
        case "savedCurrentCohort":
          showNotification({
            message: <SavedCurrentCohortNotification />,
            classNames: {
              description: "flex flex-col content-center text-center",
            },
            autoClose: 5000,
            closeButtonProps: { "aria-label": "Close notification" },
          });
          break;
        case "discardChanges":
          showNotification({
            message: <DiscardChangesCohortNotification />,
            classNames: {
              description: "flex flex-col content-center text-center",
            },
            autoClose: 5000,
            closeButtonProps: { "aria-label": "Close notification" },
          });
          break;
        case "error":
          showNotification({
            message: <ErrorCohortNotification errorType={message.param1} />,
            classNames: {
              description: "flex flex-col content-center text-center",
            },
            autoClose: 5000,
            closeButtonProps: { "aria-label": "Close notification" },
          });
          break;
      }

      setCohortMessage([]);
    }
  }, [cohortMessage, useSetActiveCohort]);

  return (
    <MantineProvider>
      <ModalsProvider modals={{ saveCohortError: SaveCohortErrorModal }}>
        <CohortNotificationContext.Provider value={setCohortMessage}>
          <Notifications position="top-center" />
          {children}
        </CohortNotificationContext.Provider>
      </ModalsProvider>
    </MantineProvider>
  );
};

export default CohortNotificationProvider;
