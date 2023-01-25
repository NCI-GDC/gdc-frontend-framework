import React, { useEffect, useState } from "react";
import { Button, createStyles, Menu } from "@mantine/core";
import { v4 as uuidv4 } from "uuid";
import {
  useCoreSelector,
  selectSelectedCases,
  selectCohortMessage,
  useCoreDispatch,
  FilterSet,
  resetSelectedCases,
  addNewCohortWithFilterAndMessage,
  clearCohortMessage,
  selectAvailableCohorts,
} from "@gff/core";
import tw from "tailwind-styled-components";
import { IoMdArrowDropdown as Dropdown } from "react-icons/io";
import { showNotification } from "@mantine/notifications";
import { NewCohortNotificationWithSetAsCurrent } from "@/features/cohortBuilder/CohortNotifications";
import {
  SelectCohortsModal,
  WithOrWithoutCohortType,
} from "./SelectCohortsModal";
import { SaveOrCreateCohortModal } from "@/components/Modals/SaveOrCreateCohortModal";

interface CountsIconProps {
  $count?: number;
}

export const CountsIcon = tw.div<CountsIconProps>`
${(p: CountsIconProps) =>
  p.$count !== undefined && p.$count > 0 ? "bg-primary" : "bg-transparent"}
inline-flex
items-center
justify-center
w-8
h-5
text-primary-contrast
font-heading
rounded-md

`;

const useStyles = createStyles((theme) => ({
  item: {
    "&[data-hovered]": {
      backgroundColor: theme.colors.blue[3],
      color: theme.white,
    },
  },
}));

export const CasesCohortButton = (): JSX.Element => {
  const pickedCases: ReadonlyArray<string> = useCoreSelector((state) =>
    selectSelectedCases(state),
  );

  const cohortMessage = useCoreSelector((state) => selectCohortMessage(state));
  const cohorts = useCoreSelector((state) => selectAvailableCohorts(state));
  const coreDispatch = useCoreDispatch();

  const onNameChange = (name: string) =>
    cohorts.every((cohort) => cohort.name !== name);

  const createCohortFromCases = (name: string) => {
    const filters: FilterSet = {
      mode: "and",
      root: {
        "cases.case_id": {
          operator: "includes",
          field: "cases.case_id",
          operands: pickedCases,
        },
      },
    };
    coreDispatch(resetSelectedCases());
    coreDispatch(
      addNewCohortWithFilterAndMessage({
        filters: filters,
        message: "newCasesCohort",
        name,
        group: {
          ids: [...pickedCases],
          field: "cases.case_id",
          groupId: uuidv4(),
        },
      }),
    );
  };

  useEffect(() => {
    if (cohortMessage) {
      const cmdAndParam = cohortMessage.split("|", 3);
      if (cmdAndParam.length == 3) {
        if (cmdAndParam[0] === "newCasesCohort") {
          showNotification({
            message: (
              <NewCohortNotificationWithSetAsCurrent
                cohortName={cmdAndParam[1]}
                cohortId={cmdAndParam[2]}
              />
            ),
            classNames: {
              description: "flex flex-col content-center text-center",
            },
            autoClose: 5000,
          });
        }
      }
      coreDispatch(clearCohortMessage());
    }
  }, [cohortMessage, coreDispatch]);

  const { classes } = useStyles();
  const [openSelectCohorts, setOpenSelectCohorts] = useState(false);
  const [showCreateCohort, setShowCreateCohort] = useState(false);
  const [withOrWithoutCohort, setWithOrWithoutCohort] =
    useState<WithOrWithoutCohortType>(undefined);

  return (
    <Menu classNames={classes} position="bottom-start">
      <Menu.Target>
        <Button
          variant="outline"
          color="primary"
          disabled={pickedCases.length == 0}
          leftIcon={
            pickedCases.length ? (
              <CountsIcon $count={pickedCases.length}>
                {pickedCases.length}
              </CountsIcon>
            ) : null
          }
          rightIcon={<Dropdown size="1.25rem" />}
        >
          Create New Cohort
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label className="bg-primary text-primary-contrast font-heading font-bold mb-2">
          {pickedCases.length}
          {pickedCases.length > 1 ? " Cases" : " Case"}
        </Menu.Label>
        <Menu.Item
          onClick={() => {
            setShowCreateCohort(true);
          }}
        >
          Only Selected Cases
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            setWithOrWithoutCohort("with");
            setOpenSelectCohorts(true);
          }}
        >
          Existing Cohort With Selected Cases
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            setWithOrWithoutCohort("without");
            setOpenSelectCohorts(true);
          }}
        >
          Existing Cohort Without Selected Cases
        </Menu.Item>
      </Menu.Dropdown>
      {openSelectCohorts && (
        <SelectCohortsModal
          opened
          onClose={() => setOpenSelectCohorts(false)}
          withOrWithoutCohort={withOrWithoutCohort}
          pickedCases={pickedCases}
        />
      )}
      {showCreateCohort && (
        <SaveOrCreateCohortModal
          initialName={`Custom cohort ${new Date()
            .toLocaleString("en-CA", {
              timeZone: "America/Chicago",
              hour12: false,
            })
            .replace(",", "")}`}
          entity="cohort"
          action="create"
          opened
          onClose={() => setShowCreateCohort(false)}
          onActionClick={(newName: string) => {
            createCohortFromCases(newName);
          }}
          onNameChange={onNameChange}
        />
      )}
    </Menu>
  );
};
