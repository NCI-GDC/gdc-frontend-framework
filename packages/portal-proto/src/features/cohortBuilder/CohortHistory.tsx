import { Badge, Modal, Text, Timeline } from "@mantine/core";
import {
  Operation,
  fieldNameToTitle,
  selectCurrentCohort,
  useCoreSelector,
} from "@gff/core";
import { Includes } from "@gff/core/dist/dts";

export const isIncludes = (o: Operation): o is Includes =>
  (o as Includes).operator === "includes";

function isOperation(x: any): x is Operation {
  return (x as Operation).operator !== undefined;
}

interface CohortChangeProps {
  readonly change: Operation | string;
}

const convertHistoryOperationToComponent = (operation: Operation) => {
  return (
    <div>
      {" "}
      {isIncludes(operation) ? (
        <div className="flex flex-row items-center ">
          <Text className="pr-1 border-r-2 border-primary mr-1 ">
            {fieldNameToTitle(operation.field)}
          </Text>{" "}
          <Badge variant="filled" color="primary">
            {operation.operands}
          </Badge>{" "}
        </div>
      ) : isOperation(operation) ? (
        <Text>{operation.operator}</Text>
      ) : (
        <Text>{operation}</Text>
      )}
    </div>
  );
};
const CohortChange = ({ change }: CohortChangeProps): JSX.Element => {
  const isOp = isOperation(change);
  return isOperation(change) ? (
    convertHistoryOperationToComponent(change)
  ) : (
    <Text>Operation {isOp ? "true" : "false"}</Text>
  );
};

const CohortHistory = () => {
  const currentCohort = useCoreSelector((state) => selectCurrentCohort(state));

  console.log(" currentCohort.history", currentCohort.history);
  return (
    <div>
      <Timeline active={1} bulletSize={24} lineWidth={2}>
        {currentCohort.history?.map((historyItem, index) => {
          return (
            <Timeline.Item key={index} title={historyItem.operation}>
              <CohortChange change={historyItem.change} />
            </Timeline.Item>
          );
        })}
      </Timeline>
    </div>
  );
};

interface CohortHistoryModalProps {
  readonly opened: boolean;
  readonly onClose: () => void;
}
const CohortHistoryModal = ({ opened, onClose }: CohortHistoryModalProps) => {
  return (
    <Modal
      opened={opened}
      withinPortal={false}
      onClose={() => onClose()}
      title="Cohort History"
      size="xl"
    >
      <CohortHistory />
    </Modal>
  );
};

export default CohortHistoryModal;
