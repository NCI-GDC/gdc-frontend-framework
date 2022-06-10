import { useEffect, useState } from "react";
import { Drawer, Table, Button, Pagination, Grid } from "@mantine/core";
import {
  useCoreSelector,
  selectCurrentCohort,
  useGetCohortsQuery,
  setComparisonCohorts,
  useCoreDispatch,
} from "@gff/core";
import { AppRegistrationEntry } from "@/features/user-flow/workflow/utils";

interface AdditionalCohortSelectionProps {
  readonly entry: AppRegistrationEntry;
  readonly onClick: (id: string, name: string) => void;
}

const PAGE_SIZE = 10;

const AdditionalCohortSelection: React.FC<AdditionalCohortSelectionProps> = ({
  entry,
  onClick,
}) => {
  const dispatch = useCoreDispatch();
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
      setActivePage(1);
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
  const totalResults = cohorts.currentData?.length || 0;

  return (
    <div className="bg-white">
      <Grid>
        <Grid.Col span={3} className="p-4">
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
                <tr key={cohort.id}>
                  <td>
                    <input
                      type="radio"
                      name="additonal-cohort-selection"
                      id={cohort.id}
                      onChange={() => setSelectedCohort(cohort.id)}
                      checked={selectedCohort === cohort.id}
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
              <tr>
                <td>
                  Showing {1 + (activePage - 1) * PAGE_SIZE} -{" "}
                  {totalResults > PAGE_SIZE * activePage
                    ? PAGE_SIZE * activePage
                    : totalResults}{" "}
                  of {totalResults}
                </td>
                <td>
                  <Pagination
                    total={Math.ceil(totalResults / PAGE_SIZE)}
                    page={activePage}
                    onChange={updatePage}
                  />
                </td>
              </tr>
            </tfoot>
          </Table>
        </Grid.Col>
      </Grid>
      <div className="p-4  bg-nci-gray-lightest w-full flex justify-between">
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
              dispatch(setComparisonCohorts([selectedCohort]));
            }}
          >
            Run
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdditionalCohortSelection;
