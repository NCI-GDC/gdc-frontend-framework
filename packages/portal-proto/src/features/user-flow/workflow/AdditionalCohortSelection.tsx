import { useEffect, useState } from "react";
import { Drawer, Table, Button, Pagination, Grid } from "@mantine/core";
import { AppRegistrationEntry } from "@/features/user-flow/workflow/utils";
import {
  useCoreSelector,
  selectCurrentCohort,
  selectAvailableCohorts,
  useGetCohortsQuery,
} from "@gff/core";
import { classNames } from "react-select/src/utils";

interface AdditionalCohortSelectionProps {
  readonly entry: AppRegistrationEntry;
  readonly onClick: (id: string, name: string) => void;
  readonly setAdditionalCohort: (additionalCohort: string) => void;
}

const PAGE_SIZE = 2;

const AdditionalCohortSelection: React.FC<AdditionalCohortSelectionProps> = ({
  entry,
  onClick,
  setAdditionalCohort,
}) => {
  const [selectedCohort, setSelectedCohort] = useState(null);
  const primaryCohortName = useCoreSelector((state) =>
    selectCurrentCohort(state),
  );
  const [currentCohortPage, setCurrentCohortPage] = useState([]);
  const [activePage, setActivePage] = useState(1);

  const cohorts = useGetCohortsQuery();
  useEffect(() => {
    if (cohorts.currentData) {
      setCurrentCohortPage(cohorts.currentData.slice(0, PAGE_SIZE));
    }
  }, [cohorts.isSuccess]);

  const updatePage = (newPage: number) => {
    if (newPage > activePage) {
      setCurrentCohortPage(
        cohorts.currentData.slice(activePage * PAGE_SIZE, newPage * PAGE_SIZE),
      );
    } else {
      setCurrentCohortPage(
        cohorts.currentData.slice(
          (newPage - 1) * PAGE_SIZE,
          (activePage - 1) * PAGE_SIZE,
        ),
      );
    }
    setActivePage(newPage);
  };

  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <Drawer
      opened={drawerOpen}
      onClose={() => setSelectedCohort(null)}
      position={"bottom"}
      withinPortal={false}
      size={"xl"}
    >
      <Grid>
        <Grid.Col span={3}>
          <p>Select a cohort to compare with {primaryCohortName}</p>
        </Grid.Col>
        <Grid.Col span={9}>
          <Table>
            <thead>
              <tr>
                <th>Select</th>
                <th>Name</th>
                <th># Cases</th>
              </tr>
            </thead>
            <tbody>
              {currentCohortPage.map((cohort) => (
                <tr>
                  <td>
                    <input
                      type="radio"
                      name="additonal-cohort-selection"
                      id={cohort.id}
                      onChange={() => setSelectedCohort(cohort.id)}
                    />
                  </td>
                  <td>
                    <label htmlFor={cohort.id}>{cohort.name}</label>
                  </td>
                  <td>{cohort?.counts}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <p>
                Showing {} - {} of {cohorts.currentData?.length || 0}
              </p>
              <Pagination
                total={(cohorts.currentData?.length || 0) / PAGE_SIZE + 1}
                page={activePage}
                onChange={updatePage}
              />
            </tfoot>
          </Table>
        </Grid.Col>
      </Grid>
      <div className="absolute bottom-0 p-4  bg-nci-gray-lightest w-full flex justify-between">
        <Button
          onClick={() => onClick(`${entry.id}Demo`, `${entry.name} Demo`)}
          className="bg-white border-nci-blue-darkest text-nci-blue-darkest"
        >
          Demo
        </Button>
        <div>
          <Button
            onClick={() => onClick(undefined, undefined)}
            className="mr-4 bg-white border-nci-blue-darkest text-nci-blue-darkest"
          >
            Cancel
          </Button>
          <Button
            disabled={selectedCohort === null}
            variant={"filled"}
            className="bg-nci-blue-darkest hover:bg-nci-blue"
            onClick={() => {
              setDrawerOpen(false);
              setAdditionalCohort(selectedCohort);
            }}
          >
            Run
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default AdditionalCohortSelection;
