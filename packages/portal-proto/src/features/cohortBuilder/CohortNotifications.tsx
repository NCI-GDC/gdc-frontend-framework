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
      <p>{cohortName} has been deleted.</p>
    </>
  );
};
