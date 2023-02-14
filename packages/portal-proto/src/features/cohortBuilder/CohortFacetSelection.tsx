import { useState } from "react";
import FacetSelection from "@/components/FacetSelection";
import { selectCohortBuilderConfigFilters, useCoreSelector } from "@gff/core";

import { Modal, Button } from "@mantine/core";

export const CohortFacetSelectionModal = (): JSX.Element => {
  const [opened, setOpened] = useState(false);

  const handleFilterSelected = () => {
    setOpened(false);
  };

  return (
    <>
      <Modal
        size="lg"
        opened={opened}
        onClose={() => setOpened(false)}
        zIndex={400}
      >
        <FacetSelection
          title={"Add a Case Filter"}
          facetType="cases"
          handleFilterSelected={handleFilterSelected}
          usedFacets={useCoreSelector((state) =>
            selectCohortBuilderConfigFilters(state),
          )}
        />
      </Modal>

      <Button onClick={() => setOpened(true)}>Add Clinical Facet</Button>
    </>
  );
};
