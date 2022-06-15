import React, { useEffect, useRef } from "react";
import {
  AiOutlinePlusSquare as ExpandMoreIcon,
  AiOutlineMinusSquare as ExpandLessIcon,
} from "react-icons/ai";
import { ImArrowRight as ArrowRight } from "react-icons/im";
import { Badge } from "@mantine/core";
import Highlight from "./Highlight";
import { node } from "@gff/core";
import { overrideMessage } from "@/features/biospecimen/utils";

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

interface BioTreeProps {
  entities?: {
    hits: {
      edges: {
        node: node;
      }[];
    };
  };
  entityTypes: Array<{
    s: string;
    p: string;
  }>;
  type: {
    p: string;
    s: string;
  };
  parentNode: string;
  treeStatusOverride: overrideMessage | null;
  setTreeStatusOverride: any;
  selectedEntity: node;
  selectEntity: any;
  setExpandedCount: any;
  setTotalNodeCount: any;
  query: string;
  search: any;
}

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
}: BioTreeProps) => {
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
  }, [treeStatusOverride, query, setExpandedCount, setTotalNodeCount]);

  useEffect(() => {
    setTotalNodeCount((c) => c + 1);

    return () => {
      setTotalNodeCount((c) => c - 1);
      isExpanded.current && setExpandedCount((c) => Math.max(c - 1, 0));
    };
  }, []);

  return (
    <ul className="ml-4 my-2 pl-4">
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
                type={type}
              />
            </Node>
          );
        })}
    </ul>
  );
};
