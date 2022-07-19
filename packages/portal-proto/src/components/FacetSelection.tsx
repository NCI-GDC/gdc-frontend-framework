import React, { useState, useEffect } from "react";
import { FacetDefinition } from "@gff/core";
import {
  Checkbox,
  Group,
  Highlight,
  SimpleGrid,
  TextInput,
  Title,
  UnstyledButton,
} from "@mantine/core";

interface FacetListProps {
  readonly data?: ReadonlyArray<FacetDefinition>;
  readonly searchString?: string;
  readonly handleFilterSelected: (_: string) => void;
}

/**
 * A Facet Filter List which is used to display and select a facet to add
 * to an application: CohortBuilder and Respository(Download) are
 * two which app that uses this.
 */
const FacetList: React.FC<FacetListProps> = ({
  data,
  searchString,
  handleFilterSelected,
}: FacetListProps) => {
  console.log("FacetList Render");
  return (
    <>
      <div className="flex flex-col h-screen/2 overflow-y-scroll">
        <SimpleGrid cols={1} spacing={1}>
          {data?.map((x, index) => {
            return (
              <button
                key={x.field}
                className={`flex flex-col justify-start px-1 ${
                  index % 2 == 0 ? "bg-nci-gray-lightest" : "bg-white"
                } text-nci-gray-darkest hover:bg-nci-blue-darkest hover:text-nci-gray-lightest transition-colors`}
                onClick={() => handleFilterSelected(x.full)}
              >
                <div className="flex-row  font-bold">
                  <Highlight highlight={searchString}>{x.field}</Highlight>
                </div>
                {x.description ? (
                  <div className="italic text-sm text-justify">
                    <Highlight highlight={searchString}>
                      {x.description}
                    </Highlight>
                  </div>
                ) : null}
              </button>
            );
          })}
        </SimpleGrid>
      </div>
    </>
  );
};

interface FacetSelectionProps {
  readonly filterType?: string;
  readonly title: string;
  readonly filters: ReadonlyArray<FacetDefinition>;
  readonly handleFilterSelected: (_: string) => void;
  readonly handleFilteredWithValuesChanged: (_: boolean) => void;
}

const FacetSelectionPanel = ({
  filters,
  title,
  handleFilterSelected,
  handleFilteredWithValuesChanged,
  filterType = "cases",
}: FacetSelectionProps) => {
  const [searchString, setSearchString] = useState("");
  const [filteredData, setFilteredData] = useState(undefined);

  useEffect(() => {
    if (!filters) return;
    if (searchString && searchString.length > 1) {
      const s = filters.filter((y) => {
        return searchString
          ? y.field.includes(searchString) ||
              y.description.includes(searchString)
          : true;
      });
      setFilteredData(s);
    } else {
      setFilteredData(filters);
    }
  }, [filters, searchString]);

  return (
    <>
      <div className="flex flex-col w-1/2">
        <Title order={3}>{title}</Title>
        <TextInput
          label="Search for a field:"
          placeholder="search"
          value={searchString}
          rightSection={
            searchString?.length > 0 ? (
              <UnstyledButton
                className="opacity-100"
                onClick={() => setSearchString("")}
              >
                x
              </UnstyledButton>
            ) : null
          }
          onChange={(evt) => setSearchString(evt.target.value)}
          aria-label="Search for a field"
        />
        <Group position="apart">
          <p>
            {filteredData?.length} {filterType} fields
          </p>
          <Checkbox
            label="Only show fields with values"
            onChange={(event) =>
              handleFilteredWithValuesChanged(event.currentTarget.checked)
            }
            aria-label="show only field with values"
          ></Checkbox>
        </Group>
        <FacetList
          data={filteredData}
          handleFilterSelected={handleFilterSelected}
          searchString={
            searchString && searchString.length > 1 ? searchString : ""
          }
        />
      </div>
    </>
  );
};

export default FacetSelectionPanel;
