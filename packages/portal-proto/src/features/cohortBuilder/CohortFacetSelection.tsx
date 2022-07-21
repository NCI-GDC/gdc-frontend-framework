import { useState } from "react";
import FacetSelection from "@/components/FacetSelection";
import { selectCohortBuilderConfigFilters } from "@gff/core";

import { Modal, Button } from "@mantine/core";

const CohortFacetSelection = () => {
  const handleFilterSelected = (facet: string) => {
    // TODO remove this when actually used
    console.log("facetSelected", facet);
  };

  return (
    <FacetSelection
      title={"Add Cohort Filter"}
      facetType="cases"
      handleFilterSelected={handleFilterSelected}
      usedFacetsSelector={selectCohortBuilderConfigFilters}
    />
  );
};

export const CohortFacetSelectionModal = () => {
  const [opened, setOpened] = useState(false);

  const handleFilterSelected = (facet: string) => {
    // TODO remove this when actually used
    console.log("facetSelected", facet);
    setOpened(false);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Introduce yourself!"
      >
        <FacetSelection
          title={"Add Cohort Filter"}
          facetType="cases"
          handleFilterSelected={handleFilterSelected}
          usedFacetsSelector={selectCohortBuilderConfigFilters}
        />
      </Modal>

      <Button onClick={() => setOpened(true)}>Add Facet</Button>
    </>
  );
};

export default CohortFacetSelection;
