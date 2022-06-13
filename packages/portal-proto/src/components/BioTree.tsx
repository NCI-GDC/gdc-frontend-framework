import React, { useEffect, useRef, useState } from "react";
import {
  AiOutlinePlusSquare as ExpandMoreIcon,
  AiOutlineMinusSquare as ExpandLessIcon,
  AiOutlineCaretRight as Caret,
} from "react-icons/ai";
import { Badge } from "@mantine/core";
import Highlight from "./Highlight";

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
  query,
  search,
}) => {
  return (
    <li>
      {entity[`${type.s}_id`] && entity.submitter_id && (
        <div className="flex">
          <span
            className={`text-sm cursor-pointer hover:underline hover:font-bold ml-3 mt-1
            ${
              selectedEntity[`${type.s}_id`] === entity[`${type.s}_id`]
                ? "underline"
                : ""
            }
            ${
              query &&
              (search(query, { node: entity }) || [])
                .map((e) => e.node)
                .some((e) => e[`${type.s}_id`] === entity[`${type.s}_id`])
                ? "bg-yellow-300"
                : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              selectEntity(entity, type);
            }}
          >
            <Highlight search={query} text={entity.submitter_id} />
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
  setExpandedCount,
  setTotalNodeCount,
  query,
  search,
}: any) => {
  const shouldExpand =
    parentNode === "root" ||
    ["expanded", "query matches"].includes(treeStatusOverride);

  const isExpanded = useRef(shouldExpand);

  useEffect(() => {
    console.log(type.p);
    console.log(query);
    console.log("here: ", entities.hits.edges);

    if (query.length > 0) {
      if (
        entities.hits.edges.some((e) => search(query, e).length) ||
        ["samples", "portions", "analytes", "aliquots", "slides"].find((t) =>
          t.includes(query),
        ) ||
        type.p.includes(query)
      ) {
        const message = "query matches";
        isExpanded.current = true;
        setTreeStatusOverride(message);
      } else {
        isExpanded.current = false;
        setTreeStatusOverride(null);
      }
    } else if (treeStatusOverride) {
      console.log("got here");
      const override = treeStatusOverride === "expanded";
      isExpanded.current = override;
      override && setExpandedCount((c) => c + 1);
    }
  }, [treeStatusOverride, query]);

  useEffect(() => {
    setTotalNodeCount((c) => c + 1);

    return () => {
      setTotalNodeCount((c) => c - 1);
      isExpanded.current && setExpandedCount((c) => Math.max(c - 1, 0));
    };
  }, []);

  return (
    <ul className="ml-3 my-2 pl-2">
      <div
        className="flex"
        onClick={() => {
          isExpanded.current = !isExpanded.current;
          isExpanded.current
            ? setExpandedCount((c) => c + 1)
            : setExpandedCount((c) => Math.max(c - 1, 0));
          setTreeStatusOverride(null);
        }}
      >
        {isExpanded.current ? (
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

        <Badge
          variant="filled"
          color={query && type.p.includes(query) ? "yellow" : ""}
        >
          <Highlight search={query} text={type.p} />
        </Badge>
      </div>
      {isExpanded.current &&
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
              search={search}
              query={query}
            >
              <BioTree
                entityTypes={entityTypes}
                parentNode={entity.node.submitter_id}
                selectedEntity={selectedEntity}
                selectEntity={selectEntity}
                setTreeStatusOverride={setTreeStatusOverride}
                treeStatusOverride={treeStatusOverride}
                setExpandedCount={setExpandedCount}
                setTotalNodeCount={setTotalNodeCount}
                search={search}
                query={query}
              />
            </Node>
          );
        })}
    </ul>
  );
};
