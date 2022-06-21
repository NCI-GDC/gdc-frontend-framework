// Credits to https://github.com/NCI-GDC/portal-ui/blob/develop/src/packages/%40ncigdc/modern_components/BiospecimenCard/utils.js for useful utilities functions

import { formatDataForHorizontalTable } from "../files/utils";
import { FaMicroscope, FaShoppingCart, FaDownload } from "react-icons/fa";
import { Tooltip } from "@mantine/core";
import Link from "next/link";
import { CoreDispatch, node } from "@gff/core";
import { addToCart } from "@/features/cart/updateCart";
import { get } from "lodash";
import { entityTypes } from "@/components/BioTree/types";

interface IHumanifyParams {
  term: string;
  capitalize?: boolean;
  facetTerm?: boolean;
}

export const capitalize = (original: string): string => {
  const customCapitalizations = {
    id: "ID",
    uuid: "UUID",
  };

  return original
    .split(" ")
    .map(
      (word) =>
        customCapitalizations[word.toLowerCase()] ||
        `${word.charAt(0).toUpperCase()}${word.slice(1)}`,
    )
    .join(" ");
};

export const match = (query: string, entity: Record<string, any>): boolean =>
  Object.keys(entity).some((k) => {
    return (
      typeof entity[k] === "string" && entity[k].toLowerCase().includes(query)
    );
  });

export const search = (
  query: string,
  entity: { node: Record<string, any> },
): any[] => {
  const found = [];

  function searchEntity(entity, _type, parents) {
    if (entity.node && match(query, entity.node)) found.push(entity);

    entityTypes?.forEach((_type) => {
      get(entity, `node[${_type.p}].hits.edges`, []).forEach((child) => {
        searchEntity(child, _type.s, [entity[_type.p], entity].concat(parents));
      });
    });
  }

  if (entity.node && match(query, entity.node)) found.push(entity);

  entityTypes?.forEach((type) => {
    get(entity, `node[${type.p}].hits.edges`, []).forEach((child) => {
      searchEntity(child, type.s, [entity[type.p], entity]);
    });
  });

  return found;
};

export const humanify = ({
  term,
  capitalize: cap = true,
  facetTerm = false,
}: IHumanifyParams): string => {
  let original;
  let humanified;
  if (facetTerm) {
    // Splits on capital letters followed by lowercase letters to find
    // words squished together in a string.
    original = term.split(/(?=[A-Z][a-z])/).join(" ");
    humanified = term.replace(/\./g, " ").replace(/_/g, " ").trim();
  } else {
    const split = (original || term).split(".");
    humanified = split[split.length - 1].replace(/_/g, " ").trim();

    // Special case 'name' to include any parent nested for sake of
    // specificity in the UI
    if (humanified === "name" && split.length > 1) {
      humanified = `${split[split.length - 2]} ${humanified}`;
    }
  }
  return cap ? capitalize(humanified) : humanified;
};

export const idFields = [
  "sample_id",
  "portion_id",
  "analyte_id",
  "slide_id",
  "aliquot_id",
];

export const formatEntityInfo = (
  entity: node,
  foundType: string,
  caseId: string,
  dispatch: CoreDispatch,
  currentCart: string[],
  selectedSlide?: any,
): {
  readonly headerName: string;
  readonly values: readonly (
    | string
    | number
    | boolean
    | JSX.Element
    | readonly string[]
  )[];
}[] => {
  const ids = {
    [`${foundType}_ID`]: entity.submitter_id,
    [`${foundType}_UUID`]: entity[idFields.find((id) => entity[id])],
  };

  const filtered = Object.entries(ids).concat(
    Object.entries(entity)
      .filter(
        ([key]) =>
          ![
            "submitter_id",
            "expanded",
            `${foundType}_id`,
            "__dataID__",
          ].includes(key),
      )
      .map(([key, value]) => [
        key,
        ["portions", "aliquots", "analytes", "slides"].includes(key)
          ? value.hits.total
          : value,
      ]),
  );

  if (foundType === "slide" && !!selectedSlide[0]) {
    filtered.push([
      "Slides",
      <div className="flex gap-4" key={selectedSlide[0]?.file_id}>
        <Tooltip label="View Slide Image">
          <Link
            href={`/user-flow/workbench/MultipleImageViewerPage?caseId=${caseId}&selectedId=${selectedSlide[0]?.file_id}`}
          >
            <a>
              <FaMicroscope />
            </a>
          </Link>
        </Tooltip>{" "}
        <Tooltip label="Add to Cart">
          <FaShoppingCart
            onClick={() => addToCart(selectedSlide, currentCart, dispatch)}
          />
        </Tooltip>
        <Tooltip label="Download">
          <FaDownload
            onClick={() => {
              alert("Download coming soon!!!");
            }}
          />
        </Tooltip>
      </div>,
    ]);
  }

  const headersConfig = filtered.map(([key]) => ({
    field: key,
    name: humanify({ term: key }),
  }));

  const obj = { ...ids, ...Object.fromEntries(filtered) };

  return formatDataForHorizontalTable(obj, headersConfig);
};
