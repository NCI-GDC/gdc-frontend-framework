import React, { useState } from "react";
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
            className={`text-sm cursor-pointer hover:underline hover:font-bold ml-3 ${
              selectedEntity[`${type.s}_id`] === entity[`${type.s}_id`]
                ? "underline font-bold"
                : ""
            }`}
            onClick={() => selectEntity(entity, type)}
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
  selectedEntity,
  selectEntity,
}: any) => {
  const shouldExpand = parentNode === "root";
  const [isExpanded, setIsExpanded] = useState(shouldExpand || false);
  return (
    <ul className="ml-3 mt-1 pl-2">
      <div className="flex" onClick={() => setIsExpanded((c) => !c)}>
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
              />
            </Node>
          );
        })}
    </ul>
  );
};
