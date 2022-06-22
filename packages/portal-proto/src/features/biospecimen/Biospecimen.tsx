import React, { useEffect, useState } from "react";
import { BioTree } from "@/components/BioTree/BioTree";
import {
  MdOutlineSearch,
  MdFileDownload,
  MdOutlineClear,
} from "react-icons/md";
import { Button, Input, Alert, LoadingOverlay } from "@mantine/core";
import {
  node,
  useBiospecimenData,
  useCoreDispatch,
  useCoreSelector,
  selectCart,
} from "@gff/core";
import { HorizontalTable } from "@/components/HorizontalTable";
import { formatEntityInfo, search } from "./utils";
import { trimEnd, find, flatten } from "lodash";
import { useRouter } from "next/router";
import { entityTypes, overrideMessage } from "@/components/BioTree/types";

interface BiospecimenProps {
  caseId: string;
  bioId: string;
}

export const Biospecimen = ({
  caseId,
  bioId,
}: BiospecimenProps): JSX.Element => {
  const router = useRouter();

  const [treeStatusOverride, setTreeStatusOverride] =
    useState<overrideMessage | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<Partial<node>>({});
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [selectedType, setSelectedType] = useState(undefined);
  const [expandedCount, setExpandedCount] = useState(1);
  const [totalNodeCount, setTotalNodeCount] = useState(0);
  const [searchText, setSearchText] = useState(bioId || "");

  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();

  const { data: bioSpecimenData, isFetching: isBiospecimentDataFetching } =
    useBiospecimenData(caseId);

  useEffect(() => {
    setIsAllExpanded(expandedCount === totalNodeCount);
  }, [expandedCount, totalNodeCount]);

  const getType = (node) =>
    (entityTypes.find((type) => node[`${type.s}_id`]) || { s: null }).s;

  useEffect(() => {
    if (
      !isBiospecimentDataFetching &&
      bioSpecimenData?.samples?.hits?.edges?.length
    ) {
      const founds = bioSpecimenData?.samples?.hits?.edges.map((e) =>
        search(searchText, e),
      );
      const flattened = flatten(founds);

      const foundNode = flattened[0]?.node;
      Object.keys(selectedEntity).length === 0 && setSelectedEntity(foundNode);
      !selectedType && foundNode && setSelectedType(getType(foundNode));
    }
  }, [
    bioSpecimenData?.samples?.hits?.edges,
    isBiospecimentDataFetching,
    searchText,
    selectedEntity,
    selectedType,
  ]);

  const onSelectEntity = (entity, type) => {
    setSelectedEntity(entity);
    setSelectedType(type.s);

    if (treeStatusOverride === overrideMessage.QueryMatches) {
      setTreeStatusOverride(null);
    }

    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          bioId: entity[`${type.s}_id`],
        },
      },
      undefined,
      { shallow: true },
    );
  };

  const supplementalFiles = bioSpecimenData?.files?.hits?.edges || [];
  const withTrimmedSubIds = supplementalFiles.map(({ node }) => ({
    ...node,
    submitter_id: trimEnd(node.submitter_id, "_slide_image"),
  }));
  const selectedSlide = find(withTrimmedSubIds, {
    submitter_id: selectedEntity?.submitter_id,
  });

  // TODO:  Need to add error message in place after this is moved to the Case Summary page for invalid case ids
  return (
    <div className="my-5">
      {isBiospecimentDataFetching ? (
        <LoadingOverlay visible data-testid="loading" />
      ) : Object.keys(selectedEntity).length > 0 &&
        selectedType !== undefined ? (
        <>
          <div className="flex justify-between">
            <h1>Biospecimen</h1>
            <Button
              className="px-1.5 min-h-[28px] min-w-[40px] border-nci-gray-light border rounded-[4px] "
              onClick={() => {
                alert("Download coming soon!!!");
              }}
            >
              <MdFileDownload size="1.25em" />
              Download
            </Button>
          </div>

          <div className="flex">
            <div className="mr-5">
              <div className="flex mb-4">
                <Input
                  icon={<MdOutlineSearch size={24} />}
                  placeholder="Search"
                  className="w-96"
                  onChange={(e) => {
                    if (e.target.value.length === 0) {
                      setExpandedCount(0);
                      setTreeStatusOverride(overrideMessage.Expanded);
                      router.replace(`/cases/${caseId}`, undefined, {
                        shallow: true,
                      });
                    }

                    setSearchText(e.target.value);
                  }}
                  value={searchText}
                  rightSection={
                    <MdOutlineClear
                      className={`hover:cursor-pointer ${
                        searchText.length === 0 ? "hidden" : "visible"
                      }`}
                      onClick={() => {
                        setExpandedCount(0);
                        setTreeStatusOverride(overrideMessage.Expanded);
                        setSearchText("");
                        router.replace(`/cases/${caseId}`, undefined, {
                          shallow: true,
                        });
                      }}
                    />
                  }
                />
                <Button
                  onClick={() => {
                    setTreeStatusOverride(
                      isAllExpanded
                        ? overrideMessage.Collapsed
                        : overrideMessage.Expanded,
                    );
                    setExpandedCount(0);
                  }}
                  className="ml-4 w-32"
                  disabled={searchText.length > 0}
                >
                  {isAllExpanded ? "Collapse All" : "Expand All"}
                </Button>
              </div>
              {!isBiospecimentDataFetching &&
                bioSpecimenData.samples?.hits?.edges.length > 0 && (
                  <BioTree
                    entities={bioSpecimenData.samples}
                    entityTypes={entityTypes}
                    parentNode="root"
                    selectedEntity={selectedEntity}
                    selectEntity={onSelectEntity}
                    type={{
                      p: "samples",
                      s: "sample",
                    }}
                    treeStatusOverride={treeStatusOverride}
                    setTreeStatusOverride={setTreeStatusOverride}
                    setTotalNodeCount={setTotalNodeCount}
                    setExpandedCount={setExpandedCount}
                    query={searchText.toLocaleLowerCase()}
                    search={search}
                  />
                )}
            </div>
            <div className="flex-1">
              <HorizontalTable
                tableData={formatEntityInfo(
                  selectedEntity,
                  selectedType,
                  caseId,
                  dispatch,
                  currentCart,
                  [selectedSlide],
                )}
              />
            </div>
          </div>
        </>
      ) : (
        // TODO: Need to Remove this part after moving this to the case summary
        <Alert title="Case ID not found" color="red" withCloseButton>
          Case Not Found with a case id <strong>{caseId}</strong>
        </Alert>
      )}
    </div>
  );
};
