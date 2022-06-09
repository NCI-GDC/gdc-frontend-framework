import React, { useEffect, useReducer, useState } from "react";
import { BioTree, entityTypes } from "@/components/BioTree";
import { MdOutlineSearch, MdFileDownload } from "react-icons/md";
import { Button, Input } from "@mantine/core";
import { useBiospecimenData } from "@gff/core";
import { HorizontalTable } from "@/components/HorizontalTable";
import { formatEntityInfo } from "./utils";
import { trimEnd, find } from "lodash";
import {
  treeStatusInitialState,
  treeStatusStateReducer,
} from "./treeStatusReducer";

export const Biospecimen = ({ caseId }) => {
  const [treeStatusOverride, setTreeStatusOverride] = useState(null);

  const [treeStatusState, dispatch] = useReducer(
    treeStatusStateReducer,
    treeStatusInitialState,
  );

  console.log(treeStatusState);
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  useEffect(() => {
    setIsAllExpanded(
      treeStatusState.totalNodes === treeStatusState.expandedNodes,
    );
  }, [treeStatusState]);

  useEffect(() => {
    if (treeStatusState.totalNodes > 0 && treeStatusOverride) {
      dispatch({
        payload: {
          expanded: treeStatusOverride === "expanded",
        },
        type: "OVERRIDE_NODES",
      });
    }
  }, [treeStatusOverride]);

  const { data: bioSpecimenData, isFetching: isBiospecimentDataFetching } =
    useBiospecimenData(caseId);

  const [selectedEntity, setSelectedEntity] = useState({});

  useEffect(() => {
    if (
      !isBiospecimentDataFetching &&
      bioSpecimenData &&
      Object.keys(selectedEntity).length === 0
    ) {
      setSelectedEntity(bioSpecimenData?.samples?.hits?.edges[0]?.node || {});
      // need to select type too
    }
  }, [bioSpecimenData, isBiospecimentDataFetching, selectedEntity]);

  const supplementalFiles = bioSpecimenData?.files?.hits?.edges || [];
  const withTrimmedSubIds = supplementalFiles.map(({ node }) => ({
    ...node,
    submitter_id: trimEnd(node.submitter_id, "_slide_image"),
  }));
  const selectedSlide = find(withTrimmedSubIds, {
    submitter_id: selectedEntity?.submitter_id,
  });
  console.log("SELECTED ENTITY: ", selectedEntity);
  const [selectedType, setSelectedType] = useState("sample");
  console.log(
    "out is all expanded, treeStatusOverride: ",
    isAllExpanded,
    treeStatusOverride,
  );

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

      <div className="flex justify-between">
        <div className="mr-5">
          <div className="flex mb-4">
            <Input
              icon={<MdOutlineSearch size={24} />}
              placeholder="Search"
              className="w-96"
            />
            <Button
              onClick={() => {
                setTreeStatusOverride(isAllExpanded ? "collapsed" : "expanded");
                // console.log(
                //   "in is all expanded, treeStatusOverride: ",
                //   isAllExpanded,
                //   treeStatusOverride,
                // );
                treeStatusOverride;
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
                setSelectedEntity(entity);
                setSelectedType(type.s);
              }}
              type={{
                p: "samples",
                s: "sample",
              }}
              treeStatusOverride={treeStatusOverride}
              setTreeStatusOverride={setTreeStatusOverride}
              dispatch={dispatch}
              treeStatusState={treeStatusState}
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
