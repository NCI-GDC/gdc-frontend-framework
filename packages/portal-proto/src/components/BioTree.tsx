import React, { useEffect, useState } from "react";
import {
  AiOutlinePlusSquare as ExpandMoreIcon,
  AiOutlineMinusSquare as ExpandLessIcon,
  AiOutlineCaretRight as Caret,
} from "react-icons/ai";
import { Badge } from "@mantine/core";

export const entityTypes = [
  {
    p: "samples",
    s: "sample",
  },
  {
    p: "portions",
    s: "portion",
  },
  {
    p: "aliquots",
    s: "aliquot",
  },
  {
    p: "analytes",
    s: "analyte",
  },
  {
    p: "slides",
    s: "slide",
  },
];

const Node = ({
  entity,
  entityTypes,
  type,
  children,
  selectedEntity,
  selectEntity,
}) => {
  return (
    <li>
      {entity[`${type.s}_id`] && entity.submitter_id && (
        <div className="flex">
          <span
            className={`text-sm cursor-pointer hover:underline hover:font-bold ml-3 mt-1 ${
              selectedEntity[`${type.s}_id`] === entity[`${type.s}_id`]
                ? "underline font-bold"
                : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              selectEntity(entity, type);
            }}
          >
            {entity.submitter_id}
          </span>
          {selectedEntity[`${type.s}_id`] === entity[`${type.s}_id`] && (
            <Caret className="ml-1" />
          )}
        </div>
      )}
      {entityTypes
        .filter(
          (childType) =>
            entity[childType.p] && entity[childType.p].hits.total > 0,
        )
        .map((childType) =>
          React.cloneElement(children, {
            entities: entity[childType.p],
            key: childType.p,
            type: childType,
          }),
        )}
    </li>
  );
};

export const BioTree = ({
  entities,
  entityTypes,
  type,
  parentNode,
  treeStatusOverride,
  setTreeStatusOverride,
  selectedEntity,
  selectEntity,
  dispatch,
  treeStatusState,
}: any) => {
  const shouldExpand =
    parentNode === "root" || treeStatusOverride === "expanded";
  const [isExpanded, setIsExpanded] = useState(shouldExpand);

  useEffect(() => {
    if (treeStatusOverride) {
      console.log("tree: ", treeStatusOverride);
      const override = treeStatusOverride === "expanded";
      setIsExpanded(override);
    }
  }, [treeStatusOverride]);

  useEffect(() => {
    dispatch({
      payload: {
        expanded: isExpanded,
        mounted: true,
      },
      type: "TOTAL_NODES",
    });

    return () => {
      console.log("unmounted: ", type.p);

      dispatch({
        payload: {
          expanded: isExpanded,
          mounted: false,
        },
        type: "TOTAL_NODES",
      });
    };
  }, []);

  return (
    <ul className="ml-3 my-2 pl-2">
      <div
        className="flex"
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
          dispatch({
            type: `${isExpanded ? "COLLAPSE" : "EXPAND"}_NODE`,
          });
          setTreeStatusOverride(null);
        }}
      >
        {isExpanded ? (
          <ExpandLessIcon
            className="hover:cursor-pointer"
            color="green"
            size={18}
          />
        ) : (
          <ExpandMoreIcon
            className="hover:cursor-pointer"
            color="blue"
            size={18}
          />
        )}
        <Badge variant="dot" className="ml-2">
          {type.p}
        </Badge>
      </div>
      {isExpanded &&
        entities?.hits?.edges?.map((entity) => {
          return (
            <Node
              entity={entity.node}
              entityTypes={entityTypes}
              key={
                entity.node.sample_id ||
                entity.node.portion_id ||
                entity.node.analyte_id ||
                entity.node.aliquot_id ||
                entity.node.slide_id
              }
              type={type}
              selectedEntity={selectedEntity}
              selectEntity={selectEntity}
            >
              <BioTree
                entityTypes={entityTypes}
                parentNode={entity.node.submitter_id}
                selectedEntity={selectedEntity}
                selectEntity={selectEntity}
                setTreeStatusOverride={setTreeStatusOverride}
                treeStatusOverride={treeStatusOverride}
                dispatch={dispatch}
                treeStatusState={treeStatusState}
              />
            </Node>
          );
        })}
    </ul>
  );
};
