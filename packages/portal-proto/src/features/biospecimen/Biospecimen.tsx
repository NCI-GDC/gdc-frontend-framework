import { useEffect, useState } from "react";
import { BioTree, entityTypes } from "@/components/BioTree";
import { MdOutlineSearch, MdFileDownload } from "react-icons/md";
import { Button, Input, Tooltip } from "@mantine/core";
import { useBiospecimenData } from "@gff/core";
import { HorizontalTable } from "@/components/HorizontalTable";
import { formatEntityInfo } from "./utils";

export const Biospecimen = ({ caseId }) => {
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [treeStatusOverride, setTreeStatusOverride] = useState("Collapsed");

  const { data: bioSpecimenData, isFetching: isBiospecimentDataFetching } =
    useBiospecimenData(caseId);

  const [selectedEntity, setSelectedEntity] = useState({});

  //   useEffect(() => {
  //     setSelectedEntity(bioSpecimenData.samples?.hits?.edges[0].node);
  //   }, [bioSpecimenData]);

  const [selectedType, setSelectedType] = useState("sample");

  return (
    <div className="mb-5">
      <div className="flex justify-between">
        <h1>Biospecimen</h1>
        <Button
          className="px-1.5 min-h-[28px] nim-w-[40px] border-nci-gray-light border rounded-[4px] "
          onClick={() => {}}
        >
          <MdFileDownload size="1.25em" />
          Download
        </Button>
      </div>

      <div className="flex">
        <div className="flex-1">
          <div className="flex mb-4">
            <Input
              icon={<MdOutlineSearch size={24} />}
              placeholder="Search"
              className="w-96"
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
              selectedEntity={selectedEntity}
              selectEntity={(entity, type) => {
                console.log(entity);
                console.log(type);
                setSelectedEntity(entity);
                setSelectedType(type.s);
                formatEntityInfo(entity, type.s);
              }}
              type={{
                p: "samples",
                s: "sample",
              }}
              treeStatusOverride={treeStatusOverride}
            />
          )}
        </div>
        <div className="flex-1">
          <HorizontalTable
            tableData={formatEntityInfo(selectedEntity, selectedType)}
          />
        </div>
      </div>
    </div>
  );
};
