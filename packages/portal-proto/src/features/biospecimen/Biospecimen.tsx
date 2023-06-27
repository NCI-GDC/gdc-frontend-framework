import React, { useEffect, useState } from "react";
import { BioTree } from "@/components/BioTree/BioTree";
import { MdOutlineSearch, MdOutlineClear } from "react-icons/md";
import { Button, Input, LoadingOverlay } from "@mantine/core";
import {
  entityType,
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
import { HeaderTitle } from "../shared/tailwindComponents";
import { FiDownload as DownloadIcon } from "react-icons/fi";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";

interface BiospecimenProps {
  caseId: string;
  bioId: string;
  isModal?: boolean;
}

export const Biospecimen = ({
  caseId,
  bioId,
  isModal = false,
}: BiospecimenProps): JSX.Element => {
  const router = useRouter();

  const [treeStatusOverride, setTreeStatusOverride] =
    useState<overrideMessage | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<entityType>(null);
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [selectedType, setSelectedType] = useState(undefined);
  const [expandedCount, setExpandedCount] = useState(1);
  const [totalNodeCount, setTotalNodeCount] = useState(0);
  const [searchText, setSearchText] = useState(bioId || "");
  const [entityClicked, setEntityClicked] = useState(false);

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

      if (!entityClicked && foundNode) {
        setSelectedEntity(foundNode);
        setSelectedType(getType(foundNode));
      }
    }
  }, [
    bioSpecimenData?.samples?.hits?.edges,
    isBiospecimentDataFetching,
    searchText,
    selectedEntity,
    selectedType,
    entityClicked,
  ]);

  const onSelectEntity = (entity, type) => {
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
                title: "TSV (Coming soon)",
                icon: <DownloadIcon size={16} aria-label="download icon" />,
              },
              {
                title: "JSON (Coming soon)",
                icon: <DownloadIcon size={16} aria-label="download icon" />,
              },
            ]}
            TargetButtonChildren="Download"
            LeftIcon={<DownloadIcon size="1rem" aria-label="download icon" />}
          />

          <div className="flex mt-2 gap-4">
            <div className="basis-4/12">
              <div className="flex mb-4 gap-4">
                <Input
                  icon={<MdOutlineSearch size={24} />}
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
                    <MdOutlineClear
                      className={`hover:cursor-pointer ${
                        searchText.length === 0 ? "hidden" : "visible"
                      }`}
                      onClick={() => {
                        setExpandedCount(0);
                        setTreeStatusOverride(overrideMessage.Expanded);
                        setSearchText("");
                        setEntityClicked && setEntityClicked(false);
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
                    search={search}
                  />
                )}
            </div>
            <div className="basis-3/4">
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
      ) : null}
    </div>
  );
};
