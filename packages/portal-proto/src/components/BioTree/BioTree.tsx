import React, { useEffect, useRef } from "react";
import {
  AiOutlinePlusCircle as ExpandMoreIcon,
  AiFillMinusCircle as ExpandLessIcon,
} from "react-icons/ai";
import { BsArrowRight as ArrowRight } from "react-icons/bs";
import Highlight from "../Highlight";
import { BioTreeProps, NodeProps, overrideMessage } from "./types";
import { UnstyledButton } from "@mantine/core";

const Node = ({
  entity,
  entityTypes,
  type,
  children,
  selectedEntity,
  selectEntity,
  query,
}: NodeProps): JSX.Element => {
  return (
    <li className="ml-6">
      {entity[`${type.s}_id`] && entity.submitter_id && (
        <div className="flex">
          <span
            className={`w-full flex justify-between text-xs cursor-pointer hover:underline hover:font-bold ml-3 mt-1 py-1 px-6 border border-base-lighter ${
              selectedEntity?.[`${type.s}_id`] === entity[`${type.s}_id`]
                ? "bg-accent-vivid text-base-max font-bold"
                : "bg-nci-violet-lightest"
            }
         `}
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
            {selectedEntity?.[`${type.s}_id`] === entity[`${type.s}_id`] && (
              <ArrowRight color="white" size={16} />
            )}
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
    if (query) return;
    isExpanded.current = !isExpanded.current;
    isExpanded.current
      ? setExpandedCount((c) => c + 1)
      : setExpandedCount((c) => Math.max(c - 1, 0));
    setTreeStatusOverride(null);
  };

  const generateKey = (node) => {
    let key: string;
    switch (type.s) {
      case "sample":
        key = node.sample_id;
        break;
      case "portion":
        key = node.portion_id;
        break;
      case "aliquot":
        key = node.aliquot_id;
        break;
      case "slide":
        key = node.slide_id;
        break;
      case "analyte":
        key = node.analyte_id;
        break;
    }
    return key;
  };
  return (
    <ul className="my-2">
      <li>
        <UnstyledButton
          onClick={onTreeClick}
          className="flex gap-1 ml-2 w-full"
          aria-expanded={isExpanded.current}
        >
          {isExpanded.current ? (
            <ExpandLessIcon
              className="cursor-pointer text-accent-vivid self-center"
              size={18}
            />
          ) : (
            <ExpandMoreIcon
              className="cursor-pointer text-accent-vivid self-center"
              size={18}
            />
          )}

          <span className="border border-base-lighter border-l-6 border-l-accent-vivid font-medium py-1 text-xs w-full pl-4 uppercase text-primary cursor-pointer">
            <Highlight search={query} text={type.p} />
          </span>
        </UnstyledButton>
      </li>
      {isExpanded.current &&
        entities?.hits?.edges?.map((entity) => (
          <Node
            entity={entity.node}
            entityTypes={entityTypes}
            key={generateKey(entity.node)}
            type={type}
            selectedEntity={selectedEntity}
            selectEntity={selectEntity}
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
        ))}
    </ul>
  );
};
