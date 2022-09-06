import { useEffect, useState, useMemo } from "react";
import { Table, Button, Pagination, Grid } from "@mantine/core";
import {
  useCoreSelector,
  selectCurrentCohort,
  setComparisonCohorts,
  useCoreDispatch,
  selectAvailableCohorts,
} from "@gff/core";
import { REGISTERED_APPS } from "./registeredApps";

interface AdditionalCohortSelectionProps {
  readonly app: string;
  readonly setActiveApp?: (id: string) => void;
  readonly setOpen: (open: boolean) => void;
}

const PAGE_SIZE = 10;

const AdditionalCohortSelection: React.FC<AdditionalCohortSelectionProps> = ({
  app,
  setActiveApp,
  setOpen,
}: AdditionalCohortSelectionProps) => {
  const dispatch = useCoreDispatch();
  const primaryCohortName = useCoreSelector((state) =>
    selectCurrentCohort(state),
  );
  const availableCohorts = useCoreSelector((state) =>
    selectAvailableCohorts(state),
  );

  const cohorts = useMemo(
    () =>
      availableCohorts.filter((cohort) => cohort.name !== primaryCohortName),
    [primaryCohortName, availableCohorts],
  );

  const [selectedCohort, setSelectedCohort] = useState(null);
  const [currentCohortPage, setCurrentCohortPage] = useState([]);
  const [activePage, setActivePage] = useState(1);

  useEffect(() => {
    setCurrentCohortPage(cohorts.slice(0, PAGE_SIZE));
    setActivePage(1);
  }, [cohorts]);

  const updatePage = (newPage: number) => {
    if (newPage > activePage) {
      setCurrentCohortPage(
        cohorts.slice(activePage * PAGE_SIZE, newPage * PAGE_SIZE),
      );
    } else {
      setCurrentCohortPage(
        cohorts.slice((newPage - 1) * PAGE_SIZE, (activePage - 1) * PAGE_SIZE),
      );
    }
    setActivePage(newPage);
  };

  const closeCohortSelection = () => {
    setOpen(false);
    setActivePage(1);
    setSelectedCohort(null);
  };
  const totalResults = cohorts.length || 0;
  const currentApp = REGISTERED_APPS.find((a) => a.id === app);

  return (
    <div className="bg-base-lightest flex flex-col flex-grow h-full ">
      <Grid className={`flex-grow p-2 m-2`}>
        <Grid.Col span={3} className="p-4 text-primary-content-darkest">
          <p>Select a cohort to compare with {primaryCohortName}</p>
        </Grid.Col>
        <Grid.Col span={9}>
          <Table className="h-full p-4">
            <thead>
              <tr>
                <th>Select</th>
                <th>Name</th>
                <th># Cases</th>
              </tr>
            </thead>
            {/* TODO: switch to using cohort id from name when updating to use cohort persistence */}
            <tbody>
              {currentCohortPage.map((cohort, idx) => (
                <tr
                  key={cohort.name}
                  className={`${
                    idx % 2 === 0 ? "bg-base-lightest" : "bg-base-lightest"
                  } h-4`}
                >
                  <td className="w-2/6">
                    <input
                      type="radio"
                      name="additional-cohort-selection"
                      id={cohort.id}
                      onChange={() => setSelectedCohort(cohort.name)}
                      checked={selectedCohort === cohort.name}
                    />
                  </td>
                  <td className="w-3/6">
                    <label htmlFor={cohort.name}>{cohort.name}</label>
                  </td>
                  <td className="w-1/6">{cohort?.counts}</td>
                </tr>
              ))}
              <tr />
            </tbody>
            <tfoot>
              <tr>
                <td className="pt-2">
                  <b>
                    Showing {1 + (activePage - 1) * PAGE_SIZE} -{" "}
                    {totalResults > PAGE_SIZE * activePage
                      ? PAGE_SIZE * activePage
                      : totalResults}{" "}
                  </b>
                  of <b>{totalResults}</b> cohorts
                </td>
                <td></td>
                <td className="pt-2">
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
      <div className={`p-4 bg-base-lightest w-full justify-between flex`}>
        <Button
          onClick={() => {
            setActiveApp(`${currentApp.id}Demo`);
            closeCohortSelection();
          }}
          className="bg-base-lightest border-primary-darkest text-primary-content-darkest"
        >
          Demo
        </Button>
        <div>
          <Button
            disabled={selectedCohort === null}
            variant={"filled"}
            className="bg-primary-darkest hover:bg-primary"
            onClick={() => {
              dispatch(setComparisonCohorts([selectedCohort]));
              closeCohortSelection();
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
