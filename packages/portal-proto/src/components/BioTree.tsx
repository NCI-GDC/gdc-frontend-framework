import React, { useState } from "react";
import {
  AiOutlinePlusSquare as ExpandMoreIcon,
  AiOutlineMinusSquare as ExpandLessIcon,
} from "react-icons/ai";

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

const Node = ({ entity, entityTypes, type, children }) => {
  return (
    <li>
      {entity[`${type.s}_id`] && entity.submitter_id && (
        <div>
          <span
            className="cursor-pointer hover:underline"
            onClick={() => alert(entity.submitter_id)}
          >
            {entity.submitter_id}
          </span>
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

const capitalize = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);

export const BioTree = ({
  entities,
  entityTypes,
  type,
  parentNode,
  treeStatusOverride,
}: any) => {
  const shouldExpand = parentNode === "root";
  const [isExpanded, setIsExpanded] = useState(shouldExpand || false);
  return (
    <ul className="ml-2 pl-2">
      <div className="flex" onClick={() => setIsExpanded((c) => !c)}>
        {isExpanded ? (
          <ExpandLessIcon color="green" size={18} />
        ) : (
          <ExpandMoreIcon color="green" size={18} />
        )}
        <span>{capitalize(type.p)}</span>
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
            >
              <BioTree
                entityTypes={entityTypes}
                parentNode={entity.node.submitter_id}
              />
            </Node>
          );
        })}
    </ul>
  );
};
