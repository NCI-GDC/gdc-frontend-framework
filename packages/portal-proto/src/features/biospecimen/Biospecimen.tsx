import React, { useEffect, useState } from "react";
import { BioTree, entityTypes } from "@/components/BioTree";
import {
  MdOutlineSearch,
  MdFileDownload,
  MdOutlineClear,
} from "react-icons/md";
import { Button, Input, ActionIcon } from "@mantine/core";
import { useBiospecimenData } from "@gff/core";
import { HorizontalTable } from "@/components/HorizontalTable";
import { formatEntityInfo, search } from "./utils";
import { trimEnd, find, flatten } from "lodash";

export const Biospecimen = ({ caseId }) => {
  const [treeStatusOverride, setTreeStatusOverride] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState({});
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [selectedType, setSelectedType] = useState("sample");
  const [expandedCount, setExpandedCount] = useState(1);
  const [totalNodeCount, setTotalNodeCount] = useState(0);
  const [searchText, setSearchText] = useState("");

  console.log("expandedCount, totalNodeCount: ", expandedCount, totalNodeCount);
  const { data: bioSpecimenData, isFetching: isBiospecimentDataFetching } =
    useBiospecimenData(caseId);

  useEffect(() => {
    setIsAllExpanded(expandedCount === totalNodeCount);
  }, [expandedCount, totalNodeCount]);

  const getType = (node) =>
    (entityTypes.find((type) => node[`${type.s}_id`]) || { s: null }).s;

  useEffect(() => {
    if (!isBiospecimentDataFetching && bioSpecimenData) {
      const founds = bioSpecimenData.samples.hits?.edges.map((e) =>
        search(searchText, e),
      );

      console.log("FOUNDS: ", founds);
      const flattened = flatten(founds);
      const foundNode = ((flattened || [])[0] || { node: {} }).node;
      const selectedNode = (searchText && foundNode) || selectedEntity;
      const foundType = (searchText && getType(foundNode)) || selectedType;
      const selected = Object.keys(selectedNode).length
        ? selectedNode
        : bioSpecimenData.samples.hits?.edges[0].node;
      setSelectedEntity(selected || {});
      setSelectedType(foundType);
    }
  }, [bioSpecimenData, isBiospecimentDataFetching, selectedType, searchText]);

  const supplementalFiles = bioSpecimenData?.files?.hits?.edges || [];
  const withTrimmedSubIds = supplementalFiles.map(({ node }) => ({
    ...node,
    submitter_id: trimEnd(node.submitter_id, "_slide_image"),
  }));
  const selectedSlide = find(withTrimmedSubIds, {
    submitter_id: selectedEntity?.submitter_id,
  });

  return (
    <div className="mb-5">
      <div className="flex justify-between">
        <h1>Biospecimen</h1>
        <Button
          className="px-1.5 min-h-[28px] min-w-[40px] border-nci-gray-light border rounded-[4px] "
          onClick={() => {}}
        >
          <MdFileDownload size="1.25em" />
          Download
        </Button>
      </div>

      <div className="flex">
        <div className="mr-5">
          <div className="flex mb-4">
            <Input
              icon={<MdOutlineSearch size={24} />}
              placeholder="Search"
              className="w-96"
              onChange={(e) => {
                // e.target.value.length === 0 &&
                //   treeStatusOverride === "query matches" &&
                //   setTreeStatusOverride(null);
                if (e.target.value.length === 0) {
                  setExpandedCount(0);
                  setTreeStatusOverride("expanded");
                }
                setSearchText(e.target.value);
              }}
              value={searchText}
              rightSection={
                <MdOutlineClear
                  className={`hover:cursor-pointer ${
                    searchText.length === 0 ? "hidden" : "visible"
                  }`}
                  onClick={() => {
                    setExpandedCount(0);
                    setTreeStatusOverride("expanded");
                    setSearchText("");
                  }}
                />
              }
            />
            <Button
              onClick={() => {
                setTreeStatusOverride(isAllExpanded ? "collapsed" : "expanded");
                setExpandedCount(0);
              }}
              className="ml-4"
              disabled={searchText.length > 0}
            >
              {isAllExpanded ? "Collapse All" : "Expand All"}
            </Button>
          </div>
          {!isBiospecimentDataFetching &&
            bioSpecimenData.samples?.hits?.edges.length > 0 && (
              <BioTree
                entities={bioSpecimenData.samples}
                entityTypes={entityTypes}
                parentNode="root"
                selectedEntity={selectedEntity}
                selectEntity={(entity, type) => {
                  setSelectedEntity(entity);
                  setSelectedType(type.s);
                  // setSearchText("");
                }}
                type={{
                  p: "samples",
                  s: "sample",
                }}
                treeStatusOverride={treeStatusOverride}
                setTreeStatusOverride={setTreeStatusOverride}
                setTotalNodeCount={setTotalNodeCount}
                setExpandedCount={setExpandedCount}
                query={searchText.toLocaleLowerCase()}
                search={search}
              />
            )}
        </div>
        <div className="flex-1">
          {selectedEntity && selectedType && (
            <HorizontalTable
              tableData={formatEntityInfo(
                selectedEntity,
                selectedType,
                caseId,
                [selectedSlide],
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
};
