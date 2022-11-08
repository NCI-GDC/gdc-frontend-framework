interface CohortNotificationProps {
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

export const SavedCohortNotification: React.FC = () => {
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
