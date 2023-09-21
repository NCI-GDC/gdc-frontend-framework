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
      <Modal size="xl" opened={opened} onClose={() => setOpened(false)}>
        <div className="p-4">
          <FacetSelection
            title="Add a Case Filter"
            facetType="cases"
            handleFilterSelected={handleFilterSelected}
            usedFacets={useCoreSelector((state) =>
              selectCohortBuilderConfigFilters(state),
            )}
          />
        </div>
      </Modal>

      <Button onClick={() => setOpened(true)}>Add Clinical Facet</Button>
    </>
  );
};
