import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Tabs,
  Input,
  Button,
  Badge,
  LoadingOverlay,
  List,
  Text,
  Alert,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import {
  selectCurrentCohortFilters,
  resetEdgesState,
  useCoreDispatch,
  useCoreSelector,
  useImageViewer,
  FilterSet,
  joinFilters,
  parseJSONParam,
} from "@gff/core";
import { formatImageDetailsInfo } from "@/features/files/utils";
import { MdOutlineSearch } from "react-icons/md";
import { useRouter } from "next/router";
import { Slides } from "../Slides";
import { HeaderTitle } from "@/components/tailwindComponents";

const ImageViewer = dynamic(() => import("./ImageViewer"), {
  ssr: false,
});

interface MultipleImageViewerProps {
  case_id?: string;
  selectedId?: string;
  isCohortCentric?: boolean;
  additionalFilters?: string;
  backLink?: string;
}

export const MultipleImageViewer = ({
  case_id,
  selectedId,
  isCohortCentric = false,
  additionalFilters = '{ "mode": "and", "root": {}',
}: MultipleImageViewerProps): JSX.Element => {
  const [activeTab, setActiveTab] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [showMorePressed, setShowMorePressed] = useState(false);
  const [activeImage, setActiveImage] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [searchValues, setSearchValues] = useState([]);
  const [imageDetails, setImageDetails] = useState([]);
  const [cases_offset, setCasesOffSet] = useState(0);
  const router = useRouter();
  const dispatch = useCoreDispatch();

  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );

  const filters = joinFilters(
    isCohortCentric ? cohortFilters : { mode: "and", root: {} },
    parseJSONParam(
      decodeURIComponent(additionalFilters),
      '{ "mode": "and", "root": {}}',
    ) as FilterSet,
  );

  const { data, isFetching } = useImageViewer({
    cases_offset,
    searchValues,
    case_id,
    caseFilters: filters,
  });

  useEffect(() => {
    return () => {
      dispatch(resetEdgesState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!isFetching) {
      const inside =
        data?.edges[Object.keys(data.edges)[showMorePressed ? activeTab : 0]];

      const index = inside?.findIndex((elem) => elem.file_id === selectedId);
      setActiveImage(selectedId || inside?.[activeSlide].file_id);
      setImageDetails(
        formatImageDetailsInfo(inside?.[index !== -1 ? index : activeSlide]),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, showMorePressed]);

  const resetStates = () => {
    setActiveTab(0);
    setActiveSlide(0);
    setCasesOffSet(0);
  };

  const removeFilters = (filter: string) => {
    setSearchValues(searchValues.filter((value) => value !== filter));
    dispatch(resetEdgesState());
    resetStates();
  };

  const onTabChange = (sValue: string) => {
    const active = parseInt(sValue);
    setActiveTab(active);
    setActiveSlide(0);
    const inside = data?.edges[Object.keys(data.edges)[active]];
    setActiveImage(inside?.[0].file_id);
    setImageDetails(formatImageDetailsInfo(inside?.[0]));
  };

  const performSearch = () => {
    dispatch(resetEdgesState());
    setShowMorePressed(false);
    setSearchValues([searchText.toUpperCase().trim(), ...searchValues]);
    setSearchText("");
    resetStates();
  };

  const shouldShowMoreButton = Object.keys(data?.edges).length < data.total;

  return (
    <>
      {isFetching ? (
        <LoadingOverlay data-testid="loading-spinner" visible={isFetching} />
      ) : (
        <div className="mx-6 relative mb-16 mt-4">
          <div className="flex justify-between items-center mb-4">
            <HeaderTitle>Slide Image Viewer</HeaderTitle>

            <Button
              data-testid="back-image-viewer"
              onClick={() => router.back()}
              size="xs"
              classNames={{ root: "bg-primary hover:bg-primary-dark" }}
            >
              Back
            </Button>
          </div>

          {data.total === 0 ? (
            <div className="flex">
              <Alert
                title="No Cases!"
                color="red"
                withCloseButton
                onClose={() => {
                  setSearchText("");
                  setSearchValues([]);
                }}
              >
                No cases with slide images for this filter
              </Alert>
            </div>
          ) : (
            <div className="border-2 border-base-lighter">
              <div className="flex border-b-2 border-b-base-lighter py-2 pl-2">
                <div className="w-[31em]">
                  <div className="flex w-full">
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h2 className="ml-2 text-xl font-bold">Cases</h2>
                        <ActionIcon
                          onClick={() => setShowSearch((c) => !c)}
                          className="mr-5"
                          aria-label="click search icon to show search bar"
                        >
                          <MdOutlineSearch
                            size={30}
                            color="black"
                            data-testid="search-icon-image-viewer"
                            aria-label="search icon"
                          />
                        </ActionIcon>
                      </div>

                      {showSearch && (
                        <Input
                          data-testid="search-bar-image-viewer"
                          placeholder="eg. TCGA-DD*, *DD*, TCGA-DD-AAVP"
                          className="mt-1 w-11/12"
                          rightSectionWidth={50}
                          onChange={(e) => setSearchText(e.target.value)}
                          rightSection={
                            <Badge
                              data-testid="go-image-viewer"
                              color="primary"
                              variant="filled"
                              className="cursor-pointer"
                              onClick={performSearch}
                            >
                              Go!
                            </Badge>
                          }
                          onKeyPress={(
                            e: React.KeyboardEvent<HTMLInputElement>,
                          ) => {
                            if (e.key === "Enter") {
                              performSearch();
                            }
                          }}
                          value={searchText}
                        />
                      )}

                      {searchValues.length > 0 && (
                        <div className="mt-2 flex flex-col gap-2">
                          {searchValues.map((value) => (
                            <Tooltip
                              key={value}
                              label="Click to Remove"
                              withArrow
                            >
                              <Badge
                                className="w-3/5 cursor-pointer"
                                size="lg"
                                color="cyan"
                                variant="filled"
                                onClick={() => removeFilters(value)}
                              >
                                {value}
                              </Badge>
                            </Tooltip>
                          ))}
                        </div>
                      )}
                    </div>
                    <div
                      className={`flex-1 text-left items-center ${
                        Object.keys(data?.edges).length <= 10 ? "-ml-2" : "ml-8"
                      }`}
                    >
                      <h2 className="text-xl font-bold">Slides</h2>
                    </div>
                  </div>
                </div>

                <div className="flex text-left">
                  <h2 className="text-xl font-bold">Image</h2>
                </div>
              </div>

              <div className="flex">
                {Object.keys(data?.edges).length > 0 && activeImage && (
                  <div className="flex-1/2 w-[31em]">
                    <Tabs
                      data-testid="cases-slides-image-viewer"
                      orientation="vertical"
                      variant="pills"
                      value={activeTab.toString()}
                      onChange={onTabChange}
                      keepMounted={false}
                      classNames={{
                        root: "max-h-screen-60vh gap-2 overflow-x-hidden min-w-[40%]",
                        list: "bg-base-light max-h-screen-60vh min-h-screen-60vh overflow-y-auto flex-nowrap py-1 w-1/2",
                        panel: "max-h-screen-60vh overflow-y-auto mt-1 w-1/2",
                      }}
                      styles={(theme) => ({
                        tab: {
                          backgroundColor: theme.white,
                          color: theme.colors.gray[9],
                          border: `1px solid ${theme.colors.gray[4]}`,
                          fontSize: theme.fontSizes.sm,
                          padding: `1em 1em`,
                          borderRadius: theme.radius.md,
                        },
                        tabLabel: {
                          borderColor: theme.colors.gray[7],
                          color: theme.white,
                          fontWeight: "bold",
                        },
                      })}
                    >
                      <Tabs.List>
                        {Object.keys(data?.edges).map((edge, index) => {
                          return (
                            <Tabs.Tab
                              data-testid={edge}
                              key={edge}
                              value={index.toString()}
                              className={`mx-2 mt-1 hover:bg-primary-dark [&>span]:hover:text-primary-contrast ${
                                activeTab.toString() === index.toString()
                                  ? "bg-primary-dark [&>span]:text-primary-contrast [&>span]:font-bold"
                                  : "bg-white [&>span]:text-black [&>span]:font-medium"
                              } truncate ...`}
                              styles={{
                                tab: {
                                  backgroundColor: "",
                                  color: "",
                                },
                                tabLabel: {
                                  color: "",
                                },
                              }}
                            >
                              {edge}
                            </Tabs.Tab>
                          );
                        })}
                      </Tabs.List>
                      {Object.keys(data?.edges).map((edge, index) => {
                        return (
                          <Tabs.Panel key={edge} value={index.toString()}>
                            <List classNames={{ itemWrapper: "w-full" }}>
                              {data?.edges[edge].map((file, index) => (
                                <List.Item
                                  key={`${file.file_id}${file.submitter_id}`}
                                  className="mb-2"
                                >
                                  <Slides
                                    file_id={file.file_id}
                                    submitter_id={file.submitter_id}
                                    setImageViewer={(file_id: string) => {
                                      setActiveImage(file_id);
                                      setActiveSlide(index);
                                      setImageDetails(
                                        formatImageDetailsInfo(file),
                                      );
                                    }}
                                    isActive={activeImage === file.file_id}
                                  />
                                </List.Item>
                              ))}
                            </List>
                          </Tabs.Panel>
                        );
                      })}
                    </Tabs>
                    <div className="text-center bg-base-lightest py-3 w-1/2">
                      {shouldShowMoreButton && (
                        <Button
                          data-testid="show-more-image-viewer"
                          onClick={() => {
                            setCasesOffSet((o) => o + 10);
                            setShowMorePressed(true);
                          }}
                          classNames={{
                            root: "bg-primary hover:bg-primary-dark",
                          }}
                          aria-label="show 10 more cases"
                        >
                          Show More
                        </Button>
                      )}

                      <Text data-testid="showing-image-viewer" size="sm">
                        Showing{" "}
                        <strong>{Object.keys(data?.edges).length}</strong> of{" "}
                        <strong>{data?.total}</strong>
                      </Text>
                    </div>
                  </div>
                )}

                <div data-testid="image-viewer" className="flex-1 ml-2">
                  {!isFetching && activeImage && (
                    <ImageViewer
                      imageId={activeImage}
                      tableData={imageDetails}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
