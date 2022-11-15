import React from "react";
import { Button } from "@mantine/core";
import { setCurrentCohortId, useCoreDispatch } from "@gff/core";
import { cleanNotifications } from "@mantine/notifications";

export interface CohortNotificationProps {
  readonly cohortName: string;
}

export const NewCohortNotification: React.FC<CohortNotificationProps> = ({
  cohortName,
}: CohortNotificationProps) => {
  return (
    <>
      <p>{cohortName} has been created. This is now your current cohort.</p>
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

  return (
    <>
      <p>
        {cohortName} has been created.
        <Button
          variant="white"
          onClick={() => {
            coreDispatch(setCurrentCohortId(cohortId));
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
      <p>{cohortName} has been deleted.</p>
    </>
  );
};
