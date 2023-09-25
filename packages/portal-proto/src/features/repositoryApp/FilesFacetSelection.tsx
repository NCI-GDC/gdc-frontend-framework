import { useState } from "react";
import FacetSelection from "@/components/FacetSelection";
import { useAppSelector } from "@/features/repositoryApp/appApi";
import { Modal, Button } from "@mantine/core";
import { selectRepositoryConfigFacets } from "@/features/repositoryApp/repositoryConfigSlice";

const FilesFacetSelection = (): JSX.Element => {
  const handleFilterSelected = (facet: string) => {
    // TODO remove this when actually used
    console.log("facetSelected", facet);
  };

  return (
    <FacetSelection
      title="Add a File Filter"
      facetType="files"
      handleFilterSelected={handleFilterSelected}
      usedFacets={useAppSelector((state) =>
        selectRepositoryConfigFacets(state),
      )}
    />
  );
};

export const FilesFacetSelectionModal = (): JSX.Element => {
  const [opened, setOpened] = useState(false);

  const handleFilterSelected = (facet: string) => {
    // TODO remove this when actually used
    console.log("facetSelected", facet);
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
          title="Add Files Filter"
          facetType="files"
          handleFilterSelected={handleFilterSelected}
          usedFacets={useAppSelector((state) =>
            selectRepositoryConfigFacets(state),
          )}
        />
      </Modal>

      <Button onClick={() => setOpened(true)}>Add File Facet</Button>
    </>
  );
};

export default FilesFacetSelection;
