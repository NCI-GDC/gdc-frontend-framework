import { useState } from "react";
import FacetSelection from "@/components/FacetSelection";
import { selectCohortBuilderConfigFilters } from "@gff/core";

import { Modal, Button } from "@mantine/core";

const CohortFacetSelection = (): JSX.Element => {
  const handleFilterSelected = () => null;

  return (
    <FacetSelection
      title={"Add Cohort Filter"}
      facetType="cases"
      handleFilterSelected={handleFilterSelected}
      usedFacetsSelector={selectCohortBuilderConfigFilters}
    />
  );
};

export const CohortFacetSelectionModal = (): JSX.Element => {
  const [opened, setOpened] = useState(false);

  const handleFilterSelected = () => {
    setOpened(false);
  };

  return (
    <>
      <Modal size="lg" opened={opened} onClose={() => setOpened(false)}>
        <FacetSelection
          title={"Add Cohort Filter"}
          facetType="cases"
          handleFilterSelected={handleFilterSelected}
          usedFacetsSelector={selectCohortBuilderConfigFilters}
        />
      </Modal>

      <Button onClick={() => setOpened(true)}>Add Clinical Facet</Button>
    </>
  );
};

export default CohortFacetSelection;
