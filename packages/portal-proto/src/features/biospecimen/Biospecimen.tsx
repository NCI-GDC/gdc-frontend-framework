import React, { useEffect, useState } from "react";
import { BioTree } from "@/components/BioTree/BioTree";
import { MdOutlineSearch, MdOutlineClear } from "react-icons/md";
import {
  Button,
  Input,
  Loader,
  LoadingOverlay,
  ActionIcon,
} from "@mantine/core";
import {
  BiospecimenEntityType,
  useBiospecimenDataQuery,
  useCoreDispatch,
  useCoreSelector,
  selectCart,
} from "@gff/core";
import { HorizontalTable } from "@/components/HorizontalTable";
import { formatEntityInfo, searchForStringInNode } from "./utils";
import { trimEnd, find, flatten, escapeRegExp } from "lodash";
import { useRouter } from "next/router";
import { entityTypes, overrideMessage } from "@/components/BioTree/types";
import { FiDownload as DownloadIcon } from "react-icons/fi";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import download from "@/utils/download";
import { HeaderTitle } from "@/components/tailwindComponents";
import { useDeepCompareEffect } from "use-deep-compare";

interface BiospecimenProps {
  readonly caseId: string;
  readonly bioId: string;
  readonly isModal?: boolean;
  readonly project_id: string;
  readonly submitter_id: string;
}

export const Biospecimen = ({
  caseId,
  bioId,
  isModal = false,
  project_id,
  submitter_id,
}: BiospecimenProps): JSX.Element => {
  const router = useRouter();
  const [biospecimenDownloadActive, setBiospecimenDownloadActive] =
    useState(false);
  const [treeStatusOverride, setTreeStatusOverride] =
    useState<overrideMessage | null>(null);
  const [selectedEntity, setSelectedEntity] =
    useState<BiospecimenEntityType>(null);
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [selectedType, setSelectedType] = useState(undefined);
  const [expandedCount, setExpandedCount] = useState(1);
  const [totalNodeCount, setTotalNodeCount] = useState(0);
  const [searchText, setSearchText] = useState(bioId || "");
  const [entityClicked, setEntityClicked] = useState(false);

  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();

  const { data: bioSpecimenData, isFetching: isBiospecimentDataFetching } =
    useBiospecimenDataQuery(caseId);

  useEffect(() => {
    setIsAllExpanded(expandedCount === totalNodeCount);
  }, [expandedCount, totalNodeCount]);

  const getType = (node) =>
    (entityTypes.find((type) => node[`${type.s}_id`]) || { s: null }).s;

  useDeepCompareEffect(() => {
    if (
      !isBiospecimentDataFetching &&
      bioSpecimenData?.samples?.hits?.edges?.length
    ) {
      const escapedSearchText = escapeRegExp(searchText);
      const founds = bioSpecimenData?.samples?.hits?.edges.map((e) => {
        return searchForStringInNode(escapedSearchText, e);
      });
      const flattened = flatten(founds);
      const foundNode =
        flattened.length > 0
          ? flattened[0]?.node
          : bioSpecimenData?.samples?.hits?.edges?.[0]?.node;

      if (!entityClicked && foundNode) {
        setSelectedEntity(foundNode);
        setSelectedType(getType(foundNode));
      }
    }
  }, [
    bioSpecimenData?.samples?.hits?.edges,
    isBiospecimentDataFetching,
    searchText,
    entityClicked,
  ]);

  const onSelectEntity = (entity, type) => {
    setSearchText("");
    setSelectedEntity(entity);
    setSelectedType(type.s);
    setEntityClicked(true);

    if (treeStatusOverride === overrideMessage.QueryMatches) {
      setTreeStatusOverride(null);
    }

    if (!isModal) {
      router.push(
        {
          query: {
            ...router.query,
            bioId: entity[`${type.s}_id`],
          },
        },
        undefined,
        { shallow: true },
      );
    }
  };

  const supplementalFiles = bioSpecimenData?.files?.hits?.edges || [];
  const withTrimmedSubIds = supplementalFiles.map(({ node }) => ({
    ...node,
    submitter_id: trimEnd(node.submitter_id, "_slide_image"),
  }));
  const selectedSlide = find(withTrimmedSubIds, {
    submitter_id: selectedEntity?.submitter_id,
  });

  const handleBiospeciemenTSVDownload = () => {
    setBiospecimenDownloadActive(true);
    download({
      endpoint: "biospecimen_tar",
      method: "POST",
      dispatch,
      params: {
        filename: `biospecimen.case-${submitter_id}-${project_id}.${new Date()
          .toISOString()
          .slice(0, 10)}.tar.gz`,
        filters: {
          op: "in",
          content: {
            field: "cases.case_id",
            value: [caseId],
          },
        },
      },
      done: () => setBiospecimenDownloadActive(false),
    });
  };

  const handleBiospeciemenJSONDownload = () => {
    setBiospecimenDownloadActive(true);
    download({
      endpoint: "biospecimen_tar",
      method: "POST",
      dispatch,
      params: {
        format: "JSON",
        pretty: true,
        filename: `biospecimen.case-${submitter_id}-${project_id}.${new Date()
          .toISOString()
          .slice(0, 10)}.json`,
        filters: {
          op: "in",
          content: {
            field: "cases.case_id",
            value: [caseId],
          },
        },
      },
      done: () => setBiospecimenDownloadActive(false),
    });
  };

  // TODO:  Need to add error message in place after this is moved to the Case Summary page for invalid case ids
  return (
    <div className="mt-14">
      {isBiospecimentDataFetching ? (
        <LoadingOverlay visible data-testid="loading-spinner" />
      ) : selectedEntity &&
        Object.keys(selectedEntity).length > 0 &&
        selectedType !== undefined ? (
        <>
          <div className="mb-2">
            <HeaderTitle>Biospecimen</HeaderTitle>
          </div>

          <DropdownWithIcon
            dropdownElements={[
              {
                title: "TSV",
                icon: <DownloadIcon size={16} aria-label="download" />,
                onClick: handleBiospeciemenTSVDownload,
              },
              {
                title: "JSON",
                icon: <DownloadIcon size={16} aria-label="download" />,
                onClick: handleBiospeciemenJSONDownload,
              },
            ]}
            TargetButtonChildren={
              biospecimenDownloadActive ? "Processing" : "Download"
            }
            LeftSection={
              biospecimenDownloadActive ? (
                <Loader size={20} />
              ) : (
                <DownloadIcon size="1rem" aria-label="download" />
              )
            }
          />

          <div className="flex mt-2 gap-4">
            <div className="basis-4/12">
              <div className="flex mb-4 gap-4">
                <Input
                  data-testid="textbox-biospecimen-search-bar"
                  leftSection={<MdOutlineSearch size={24} aria-hidden="true" />}
                  placeholder="Search"
                  className="basis-5/6"
                  classNames={{
                    input: "border-base-lighter",
                  }}
                  onChange={(e) => {
                    if (e.target.value.length === 0) {
                      setExpandedCount(0);
                      setTreeStatusOverride(overrideMessage.Expanded);
                      router.replace(`/cases/${caseId}`, undefined, {
                        shallow: true,
                      });
                    }
                    setEntityClicked && setEntityClicked(false);
                    setSearchText(e.target.value);
                  }}
                  value={searchText}
                  rightSection={
                    searchText.length > 0 && (
                      <ActionIcon
                        onClick={() => {
                          setExpandedCount(0);
                          setTreeStatusOverride(overrideMessage.Expanded);
                          setSearchText("");
                          setEntityClicked && setEntityClicked(false);
                          router.replace(`/cases/${caseId}`, undefined, {
                            shallow: true,
                          });
                        }}
                      >
                        <MdOutlineClear aria-label="clear search" />
                      </ActionIcon>
                    )
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
                  className="text-primary hover:bg-primary-darker hover:text-base-lightest"
                  disabled={searchText.length > 0}
                  variant="outline"
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
                    query={searchText.toLocaleLowerCase().trim()}
                    search={searchForStringInNode}
                  />
                )}
            </div>
            <div className="basis-3/4">
              <HorizontalTable
                customDataTestID="table-selection-information-biospecimen"
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
      ) : null}
    </div>
  );
};
