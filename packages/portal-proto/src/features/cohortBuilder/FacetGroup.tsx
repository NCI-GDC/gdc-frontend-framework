import { EnumFacet } from "../facets/EnumFacet";
import NumericRangeFacet from "../facets/NumericRangeFacet";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import type { ReactTabsFunctionComponent, TabProps } from "react-tabs";
import React, { FC, useState } from "react";
import Select from "react-select";
import { get_facet_subcategories, get_facets } from "./dictionary";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { GQLIndexType, FacetDefinition } from "@gff/core";

/**
 *
 * Note all components in this file are deprecated in favor of FacetTabs
 * This has not been removed due to dependencies with older demos.
 *
 */

interface FacetGroupProps {
  readonly facetNames: ReadonlyArray<FacetDefinition>;
  readonly indexType?: GQLIndexType;
}

export const FacetGroup: React.FC<FacetGroupProps> = ({
  facetNames,
  indexType = "explore",
}: FacetGroupProps) => {
  return (
    <div className="flex flex-col border-r-2 border-l-2 border-b-2 border-t-0 border-accent-cool-darker p-3 h-screen/1.5 overflow-y-scroll">
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
          {facetNames.map((x, index) => {
            if (x.facet_type === "enum")
              return (
                <EnumFacet
                  key={`${x.full}-${index}`}
                  docType="cases"
                  indexType={indexType}
                  field={`${x.field}`}
                  facetName={x.field}
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
                  field={x.field}
                  facetName={x.field}
                  description={x.description}
                  rangeDatatype={x.facet_type}
                  docType="cases"
                  indexType={indexType}
                  minimum={x.range?.minimum}
                  maximum={x.range?.maximum}
                />
              );
            }
          })}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
};

const downloadableSubcategories = ["All"];

interface FacetTabWithSubmenuProps extends TabProps {
  category: string;
  subCategories: Array<string>;
  onSubcategoryChange: (c: string, sc: string) => void;
}

const FacetTabWithSubmenu: React.FC<
  ReactTabsFunctionComponent<FacetTabWithSubmenuProps>
> = ({
  category,
  subCategories,
  onSubcategoryChange,
  ...otherProps
}: FacetTabWithSubmenuProps) => {
  const menu_items = subCategories.map((n, index) => {
    return { label: n, value: index };
  });

  const [subCategory] = useState({ ...menu_items[0] });

  const handleChange = (x) => {
    onSubcategoryChange(category, x.label);
  };

  return (
    <Tab {...otherProps}>
      <div className="flex flex-row items-center justify-center ">
        {category}
        <Select
          components={{
            IndicatorSeparator: () => null,
          }}
          options={menu_items}
          defaultValue={subCategory}
          onChange={handleChange}
          className="px-2 w-48 bg-opacity-0 border-opacity-0"
          aria-label={`Select ${category} subcategory`}
        />
      </div>
    </Tab>
  );
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
FacetTabWithSubmenu.tabsRole = "Tab";

export const CohortTabbedFacets: FC = () => {
  const [subcategories, setSubcategories] = useState({
    Clinical: "All",
    Biospecimen: "All",
    Downloadable: "All",
  });
  const handleSubcategoryChanged = (category: string, subcategory: string) => {
    const state = { ...subcategories };
    state[category] = subcategory;
    setSubcategories(state);
  };

  return (
    <div className="w-100 px-10">
      <Tabs>
        <TabList>
          <FacetTabWithSubmenu
            category="Clinical"
            subCategories={get_facet_subcategories("Clinical")}
            onSubcategoryChange={handleSubcategoryChanged}
          ></FacetTabWithSubmenu>
          <FacetTabWithSubmenu
            category="Biospecimen"
            subCategories={get_facet_subcategories("Biospecimen")}
            onSubcategoryChange={handleSubcategoryChanged}
          ></FacetTabWithSubmenu>
          <FacetTabWithSubmenu
            category="Downloadable Data"
            subCategories={downloadableSubcategories}
            onSubcategoryChange={handleSubcategoryChanged}
          ></FacetTabWithSubmenu>
        </TabList>
        <TabPanel>
          <FacetGroup
            facetNames={
              get_facets(
                "Clinical",
                subcategories["Clinical"],
                25,
              ) as FacetDefinition[]
            }
          />
        </TabPanel>
        <TabPanel>
          <FacetGroup
            indexType="repository"
            facetNames={
              get_facets(
                "Biospecimen",
                subcategories["Biospecimen"],
              ) as FacetDefinition[]
            }
          />
        </TabPanel>
        <TabPanel>
          <FacetGroup
            facetNames={
              get_facets(
                "Downloadable",
                subcategories["Downloadable"],
              ) as FacetDefinition[]
            }
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default CohortTabbedFacets;
