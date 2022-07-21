import { useState } from "react";
import FacetSelection from "@/components/FacetSelection";
import { selectCohortBuilderConfigFilters } from "@gff/core";

import { Modal, Button } from "@mantine/core";
import { selectRepositoryConfigFacets } from "@/features/repositoryApp/fileFiltersSlice";

const FilesFacetSelection = () => {
  const handleFilterSelected = (facet: string) => {
    // TODO remove this when actually used
    console.log("facetSelected", facet);
  };

  return (
    <FacetSelection
      title={"Add Cohort Filter"}
      facetType="files"
      handleFilterSelected={handleFilterSelected}
      usedFacetsSelector={selectRepositoryConfigFacets}
    />
  );
};

export const FilesFacetSelectionModal = () => {
  const [opened, setOpened] = useState(false);

  const handleFilterSelected = (facet: string) => {
    // TODO remove this when actually used
    console.log("facetSelected", facet);
    setOpened(false);
  };

  return (
    <>
      <Modal size="lg" opened={opened} onClose={() => setOpened(false)}>
        <FacetSelection
          title={"Add Files Filter"}
          facetType="files"
          handleFilterSelected={handleFilterSelected}
          usedFacetsSelector={selectCohortBuilderConfigFilters}
        />
      </Modal>

      <Button onClick={() => setOpened(true)}>Add File Facet</Button>
    </>
  );
};

export default FilesFacetSelection;
