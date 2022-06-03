import { useState } from "react";
import { BioTree, entityTypes } from "@/components/BioTree";
import { MdOutlineSearch } from "react-icons/md";
import { Button, Input } from "@mantine/core";
import { useBiospecimenData } from "@gff/core";

export const Biospecimen = ({ caseId }) => {
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [treeStatusOverride, setTreeStatusOverride] = useState("Collapsed");

  const { data: bioSpecimenData, isFetching: isBiospecimentDataFetching } =
    useBiospecimenData(caseId);

  return (
    <div>
      <h1>Biospecimen</h1>
      <div className="flex mb-4">
        <Input
          icon={<MdOutlineSearch size={24} />}
          placeholder="Search"
          className="w-32"
        />
        <Button
          onClick={() => {
            setIsAllExpanded(!isAllExpanded);
            setTreeStatusOverride(isAllExpanded ? "collapsed" : "expanded");
          }}
          className="ml-4"
        >
          {isAllExpanded ? "Collapse All" : "Expand All"}
        </Button>
      </div>

      {!isBiospecimentDataFetching && (
        <BioTree
          entities={bioSpecimenData.samples}
          entityTypes={entityTypes}
          parentNode="root"
          type={{
            p: "samples",
            s: "sample",
          }}
          treeStatusOverride={treeStatusOverride}
        />
      )}
    </div>
  );
};
