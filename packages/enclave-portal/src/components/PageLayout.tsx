import React, { PropsWithChildren } from "react";
import { Footer, CohortManager } from "@gff/portal-components";
import Header from "@/components/Header";

const EXAMPLE_COHORT = {
  name: "Baily's Cohort",
  id: "0000-0000-1000-0000",
  filters: {
    mode: "and",
    root: {
      "cases.primary_site": {
        operator: "includes",
        field: "cases.primary_site",
        operands: ["breast", "bronchus and lung"],
      },
    },
  },
  modified: false,
  modified_datetime: new Date(2020, 1, 15).toISOString(),
};

interface PageLayoutProps extends PropsWithChildren {}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
}: PageLayoutProps) => {
  return (
    <>
      <Header />
      <CohortManager
        hooks={{
          useSelectAvailableCohorts: () => [EXAMPLE_COHORT],
          useSelectCurrentCohort: () => EXAMPLE_COHORT,
          useSetActiveCohort: () => (_) => {},
          useDeleteCohort: () => () => {},
          useDiscardChanges: () => () => {},
          useUpdateFilters: () => () => {},
          useAddUnsavedCohort: () => () => {},
          useSaveCohort: () => [
            async (_) => {
              return Promise.resolve([true, "id"]);
            },
            {},
          ],
          useReplaceCohort: () => [
            (_) => {
              return ["Name"];
            },
            {},
          ],
        }}
      />
      {children}
      <Footer
        useVersionInfoDetailsHook={() => ({ data: {}, isSuccess: true })}
        linkColData={[]}
        linkCloud={[]}
        appInfo={{}}
      />
    </>
  );
};

export default PageLayout;
