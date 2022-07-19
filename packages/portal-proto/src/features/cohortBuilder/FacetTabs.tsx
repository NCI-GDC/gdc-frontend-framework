import { FC } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import {
  GQLIndexType,
  GQLDocType,
  selectCohortBuilderConfig,
  useCoreSelector,
  FacetDefinition,
  CohortBuilderCategory,
} from "@gff/core";
import { EnumFacet } from "../facets/EnumFacet";
import NumericRangeFacet from "../facets/NumericRangeFacet";
import { Tabs } from "@mantine/core";
import { getFacetInfo } from "@/features/cohortBuilder/utils";

interface FacetGroupProps {
  readonly facets: ReadonlyArray<FacetDefinition>;
  readonly indexType?: GQLIndexType;
  readonly docType: GQLDocType;
  readonly columns: number;
}

export const FacetGroup: React.FC<FacetGroupProps> = ({
  facets,
  docType,
  indexType = "explore",
  columns,
}: FacetGroupProps) => {
  return (
    <div className="flex flex-col w-full bg-white overflow-y-scroll overflow-x-visible">
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 640: columns, 1400: columns }}
      >
        <Masonry gutter="0.5em" className="m-0">
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

interface FacetTabsProps {
  readonly columns?: number;
}

export const FacetTabs: FC<FacetTabsProps> = ({ columns }: FacetTabsProps) => {
  const tabsConfig = useCoreSelector((state) =>
    selectCohortBuilderConfig(state),
  );

  return (
    <div className="w-full">
      <Tabs
        variant="unstyled"
        orientation="vertical"
        styles={{
          tabControl: {
            backgroundColor: "#1d567e",
            textAlign: "left",
            color: "#f1f1f1",
            fontWeight: 500,
          },
          tabActive: {
            backgroundColor: "#FFFFFF",
            color: "#38393a",
          },
          body: {
            width: "100%",
            paddingLeft: 0,
            marginLeft: 0,
            paddingRight: "1em",
          },
        }}
      >
        {Object.values(tabsConfig).map((tabEntry: CohortBuilderCategory) => {
          return (
            <Tabs.Tab
              key={`cohortTab-${tabEntry.label}`}
              label={tabEntry.label}
            >
              <FacetGroup
                facets={getFacetInfo(tabEntry.facets)}
                docType={tabEntry.docType as GQLDocType}
                indexType={tabEntry.index as GQLIndexType}
                columns={columns}
              />
            </Tabs.Tab>
          );
        })}
      </Tabs>
    </div>
  );
};

export default FacetTabs;
