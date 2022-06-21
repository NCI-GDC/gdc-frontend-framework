import React, { useEffect, useRef } from "react";
import {
  AiOutlinePlusSquare as ExpandMoreIcon,
  AiOutlineMinusSquare as ExpandLessIcon,
} from "react-icons/ai";
import { ImArrowRight as ArrowRight } from "react-icons/im";
import { Badge } from "@mantine/core";
import Highlight from "../Highlight";
import { BioTreeProps, NodeProps, overrideMessage } from "./types";

const Node = ({
  entity,
  entityTypes,
  type,
  children,
  selectedEntity,
  selectEntity,
  query,
  search,
}: NodeProps): JSX.Element => {
  return (
    <li>
      {entity[`${type.s}_id`] && entity.submitter_id && (
        <div className="flex">
          <span
            className={`text-sm cursor-pointer hover:underline hover:font-bold ml-3 mt-1
            ${
              selectedEntity[`${type.s}_id`] === entity[`${type.s}_id`]
                ? "border-1 border-black rounded p-1"
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
            onClick={() => {
              selectEntity(entity, type);
            }}
            onKeyDown={() => {
              selectEntity(entity, type);
            }}
            role="button"
            tabIndex={0}
          >
            <Highlight search={query} text={entity.submitter_id} />
          </span>
          {selectedEntity[`${type.s}_id`] === entity[`${type.s}_id`] && (
            <ArrowRight className="ml-1 mt-2.5" />
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
}: BioTreeProps): JSX.Element => {
  const shouldExpand =
    parentNode === "root" ||
    [overrideMessage.Expanded, overrideMessage.QueryMatches].includes(
      treeStatusOverride,
    );

  const isExpanded = useRef(shouldExpand);

  useEffect(() => {
    if (query.length > 0) {
      if (
        entities.hits.edges.some((e) => search(query, e).length) ||
        ["samples", "portions", "analytes", "aliquots", "slides"].find((t) =>
          t.includes(query),
        ) ||
        type.p.includes(query)
      ) {
        isExpanded.current = true;
        setTreeStatusOverride(overrideMessage.QueryMatches);
      } else {
        isExpanded.current = false;
        setTreeStatusOverride(null);
      }
    } else if (treeStatusOverride) {
      const override = treeStatusOverride === overrideMessage.Expanded;
      isExpanded.current = override;
      override && setExpandedCount((c) => c + 1);
    }
  }, [
    treeStatusOverride,
    query,
    setExpandedCount,
    setTotalNodeCount,
    entities.hits.edges,
    search,
    setTreeStatusOverride,
    type.p,
  ]);

  useEffect(() => {
    setTotalNodeCount((c) => c + 1);

    return () => {
      setTotalNodeCount((c) => c - 1);
      isExpanded.current && setExpandedCount((c) => Math.max(c - 1, 0));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTreeClick = () => {
    isExpanded.current = !isExpanded.current;
    isExpanded.current
      ? setExpandedCount((c) => c + 1)
      : setExpandedCount((c) => Math.max(c - 1, 0));
    setTreeStatusOverride(null);
  };

  return (
    <ul className="ml-4 my-2 pl-4">
      <div
        className="flex"
        onClick={onTreeClick}
        onKeyDown={onTreeClick}
        role="treeitem"
        tabIndex={0}
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
                type={type}
              />
            </Node>
          );
        })}
    </ul>
  );
};
