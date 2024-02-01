import React from "react";
import { Button } from "@mantine/core";
import { setActiveCohort, useCoreDispatch } from "@gff/core";
import { cleanNotifications } from "@mantine/notifications";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";

export interface CohortNotificationProps {
  readonly cohortName: string;
}

export const NewCohortNotification: React.FC<CohortNotificationProps> = ({
  cohortName,
}: CohortNotificationProps) => {
  return (
    <>
      <p>
        <b>{cohortName}</b> has been created. This is now your current cohort.
      </p>
    </>
  );
};

export const SavedCohortNotification: React.FC<CohortNotificationProps> = ({
  cohortName,
}: CohortNotificationProps) => {
  return (
    <>
      <p>
        <b>{cohortName}</b> has been saved. This is now your current cohort.
      </p>
    </>
  );
};

export interface CohortWithSetOptionNotificationProps
  extends CohortNotificationProps {
  readonly cohortId: string;
}

export const NewCohortNotificationWithSetAsCurrent: React.FC<
  CohortWithSetOptionNotificationProps
> = ({ cohortName, cohortId }: CohortWithSetOptionNotificationProps) => {
  const coreDispatch = useCoreDispatch();
  const isLoggedIn = useIsLoggedIn();
  return (
    <>
      <p>
        <b>{cohortName}</b> has been created.
        <Button
          variant="white"
          onClick={() => {
            coreDispatch(setActiveCohort(cohortId, isLoggedIn));
            cleanNotifications();
          }}
        >
          Set this as your current cohort.
        </Button>
      </p>
    </>
  );
};

export const SavedCohortNotificationWithSetAsCurrent: React.FC<
  CohortWithSetOptionNotificationProps
> = ({ cohortName, cohortId }: CohortWithSetOptionNotificationProps) => {
  const coreDispatch = useCoreDispatch();
  const isLoggedIn = useIsLoggedIn();
  return (
    <>
      <p>
        <b>{cohortName}</b> has been saved.
        <Button
          variant="white"
          onClick={() => {
            coreDispatch(setActiveCohort(cohortId, isLoggedIn));
            cleanNotifications();
          }}
        >
          Set this as your current cohort.
        </Button>
      </p>
    </>
  );
};

export const DeleteCohortNotification: React.FC<CohortNotificationProps> = ({
  cohortName,
}: CohortNotificationProps) => {
  return (
    <>
      <p>
        <b>{cohortName}</b> has been deleted.
      </p>
    </>
  );
};

export const SavedCurrentCohortNotification: React.FC = () => {
  return (
    <>
      <p>Cohort has been saved.</p>
    </>
  );
};

export const DiscardChangesCohortNotification: React.FC = () => {
  return (
    <>
      <p>Cohort changes have been discarded.</p>
    </>
  );
};

export const ErrorCohortNotification = ({
  errorType,
}: {
  errorType: string;
}): JSX.Element => {
  let errorText = "";
  if (errorType === "saving") {
    errorText = "There was a problem saving the cohort.";
  } else if (errorType === "deleting") {
    errorText = "There was a problem deleting the cohort.";
  } else if (errorType === "discarding") {
    errorText = "There was a problem discarding the unsaved changes";
  }
  return (
    <>
      <p>{errorText}</p>
    </>
  );
};
