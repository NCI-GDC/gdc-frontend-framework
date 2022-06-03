import { FC } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import {
  GQLIndexType,
  GQLDocType,
  selectCohortBuilderConfig,
  useCoreSelector,
  FacetDefinition,
  selectFacetDefinitionByName,
} from "@gff/core";
import { EnumFacet } from "../facets/EnumFacet";
import NumericRangeFacet from "../facets/NumericRangeFacet";
import { Tabs } from "@mantine/core";

const getFacetInfo = (
  fields: ReadonlyArray<string>,
): ReadonlyArray<FacetDefinition> => {
  const results = fields.map((x) =>
    useCoreSelector((state) => selectFacetDefinitionByName(state, x)),
  );
  console.log(results);
  return results;
};

interface FacetGroupProps {
  readonly facets: ReadonlyArray<FacetDefinition>;
  readonly indexType?: GQLIndexType;
  readonly docType: GQLDocType;
}

export const FacetGroup: React.FC<FacetGroupProps> = ({
  facets,
  docType,
  indexType = "explore",
}: FacetGroupProps) => {
  console.log(facets);
  return (
    <div className="flex flex-col border-r-2 border-l-2 border-b-2 border-t-0 p-3 w-screen/1.5 overflow-y-scroll">
      <ResponsiveMasonry
        columnsCountBreakPoints={{
          350: 2,
          750: 3,
          900: 4,
          1400: 5,
          1800: 6,
          2200: 7,
        }}
      >
        <Masonry gutter="0.5em">
          {facets.map((x, index) => {
            if (x.facet_type === "enum")
              return (
                <EnumFacet
                  key={`${x.full}-${index}`}
                  docType={docType}
                  indexType={indexType}
                  field={x.full}
                  description={x.description}
                />
              );
            if (
              [
                "year",
                "years",
                "age",
                "numeric",
                "integer",
                "percent",
              ].includes(x.facet_type)
            ) {
              return (
                <NumericRangeFacet
                  key={`${x.full}-${index}`}
                  field={x.full}
                  description={x.description}
                  rangeDatatype={x.facet_type}
                  docType={docType}
                  indexType={indexType}
                  minimum={x?.range?.minimum}
                  maximum={x?.range?.maximum}
                />
              );
            }
          })}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
};

export const FacetTabs: FC = () => {
  const tabsConfig = useCoreSelector((state) =>
    selectCohortBuilderConfig(state),
  );

  return (
    <div className="w-100 px-10">
      <Tabs color="teal" variant="pills">
        {Object.values(tabsConfig).map((tabEntry) => {
          return (
            <Tabs.Tab
              key={`cohortTab-${tabEntry.label}`}
              label={tabEntry.label}
            >
              <FacetGroup
                facets={getFacetInfo(tabEntry.facets)}
                docType={tabEntry.docType as GQLDocType}
                indexType={tabEntry.index as GQLIndexType}
              />
            </Tabs.Tab>
          );
        })}
      </Tabs>
    </div>
  );
};

export default FacetTabs;
