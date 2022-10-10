import { Badge } from "@mantine/core";
import { isObject } from "lodash";
import { entityShortNameMapping } from "../QuickSearch/entityShortNameMapping";
import { TypeIcon } from "../TypeIcon";

export const findMatchingToken = (
  item: Record<string, any>,
  lq,
  value = "",
) => {
  const ks = Object.keys(item);
  for (let i = 0; i < ks.length; i++) {
    const k = ks[i];
    if (k === "isSelected" || k === "__dataID__") continue;
    const terms = [].concat(item[k]);
    for (let j = 0; j < terms.length; j++) {
      const term = terms[j];
      if (isObject(term)) {
        if (term.hits) {
          const edges = term.hits.edges || [];

          for (let jj = 0; jj < edges; jj++) {
            const nextValue = findMatchingToken(edges[jj].node, lq, value);
            if (!(value && value.length < nextValue.length)) {
              value = nextValue;
            }
          }
        }
        const nextValue = findMatchingToken(term, lq, value);
        if (!(value && nextValue && value.length < nextValue.length)) {
          value = nextValue;
        }
        continue;
      }
      if (
        (typeof term === "string" ? term : "")
          .toLocaleLowerCase()
          .replace(/[()]/g, "")
          .indexOf(lq) !== -1
      ) {
        value = term;
      }
    }
  }
  return value;
};

export const TraversableList = ({
  data,
  query,
}: {
  data: ReadonlyArray<Record<string, any>>;
  query: string;
}) => {
  const keyBoardPress = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "ArrowUp") {
      console.log("ArrowUp");
    } else if (event.key === "ArrowDown") {
      console.log("ArrowDown");
    } else if (event.key === "Escape") {
      console.log("Escape");
    } else if (event.key === "Enter") {
      console.log("Enter");
    }
  };

  return (
    <ul
      onKeyDown={keyBoardPress}
      className="absolute right-5 top-full bg-base-lightest w-[512px]"
    >
      {data.map((item) => (
        <li
          key={item.id}
          className="p-2 m-2 border-b-1 border-black hover:bg-primary-darkest hover:text-primary-contrast-darkest"
        >
          <div className="flex">
            <div className="self-center">
              <TypeIcon
                iconText={entityShortNameMapping[atob(item.id).split(":")[0]]}
              />
            </div>
            <div className="flex flex-col">
              <div style={{ width: 200 }}>
                <Badge>{item.symbol || atob(item.id).split(":")[1]}</Badge>
              </div>
              <span>{findMatchingToken(item, query)}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
