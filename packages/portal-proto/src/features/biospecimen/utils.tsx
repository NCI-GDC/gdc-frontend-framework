import { formatDataForHorizontalTable } from "../files/utils";
import { FaMicroscope, FaShoppingCart, FaDownload } from "react-icons/fa";
import { Tooltip } from "@mantine/core";
import Link from "next/link";
import { useCoreSelector, selectCart, useCoreDispatch } from "@gff/core";
import { addToCart } from "@/features/cart/updateCart";
import { isArray, isObject, get } from "lodash";

interface IHumanifyParams {
  term: string;
  capitalize?: boolean;
  facetTerm?: boolean;
}

type THumanify = ({}: IHumanifyParams) => string;

export const capitalize = (original: string) =>
  original
    .split(" ")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");

export const entityTypes = [
  { s: "portion", p: "portions" },
  { s: "aliquot", p: "aliquots" },
  { s: "analyte", p: "analytes" },
  { s: "slide", p: "slides" },
];

type TFormatValue = (value: any) => string;
export const formatValue: TFormatValue = (value) => {
  if (isArray(value)) {
    return value.length;
  }

  if (isObject(value)) {
    return value.name;
  }

  if (!value && !isNaN(value) && value !== 0) {
    return "--";
  }

  return value;
};

export const match = (query: string, entity: Object): boolean =>
  Object.keys(entity).some((k) => {
    const formatted = formatValue(entity[k]);
    return (
      typeof formatted === "string" && formatted.toLowerCase().includes(query)
    );
  });

export const search = (query: string, entity: Object): any[] => {
  const found = [];

  function searchEntity(entity, type, parents) {
    if (entity.node && match(query, entity.node)) found.push(entity);

    entityTypes?.forEach((type) => {
      get(entity, `node[${type.p}].hits.edges`, []).forEach((child) => {
        searchEntity(child, type.s, [entity[type.p], entity].concat(parents));
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

export const humanify: THumanify = ({
  term,
  capitalize: cap = true,
  facetTerm = false,
}) => {
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
  entity: any,
  foundType: any,
  caseId: string,
  selectedSlide?: any,
) => {
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();

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

  if (foundType === "slide" && !!selectedSlide) {
    filtered.push([
      "Slides",
      <div className="flex gap-4">
        <Tooltip label="View Slide Image">
          <Link
            href={`/user-flow/workbench/MultipleImageViewerPage?caseId=${caseId}`}
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
          <FaDownload />
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
