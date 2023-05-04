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
  edgeDetails,
  selectCurrentCohortFilters,
  setShouldResetEdgesState,
  useCoreDispatch,
  useCoreSelector,
  useImageViewer,
  FilterSet,
  joinFilters,
  parseJSONParam,
} from "@gff/core";
import { formatImageDetailsInfo } from "@/features/files/utils";
import { MdOutlineSearch } from "react-icons/md";
import { Slides } from "../Slides";
import { useRouter } from "next/router";

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
    if (!isFetching) {
      let inside: edgeDetails[];
      if (showMorePressed) {
        inside = data?.edges[Object.keys(data.edges)[activeTab]];
      } else {
        inside = data?.edges[Object.keys(data.edges)[0]];
      }
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
    dispatch(setShouldResetEdgesState());
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
    dispatch(setShouldResetEdgesState());
    setShowMorePressed(false);
    setSearchValues([searchText.toUpperCase(), ...searchValues]);
    setSearchText("");
    resetStates();
  };

  const shouldShowMoreButton = Object.keys(data.edges).length < data.total;

  return (
    <div className="mx-2 relative">
      <div className="flex justify-between my-4 items-center mx-4">
        <h1 className="text-xl">Slide Image Viewer</h1>
        <Button
          onClick={() => router.back()}
          size="xs"
          classNames={{ root: "bg-primary hover:bg-primary-dark" }}
        >
          Back
        </Button>
      </div>
      {isFetching ? (
        <LoadingOverlay visible={isFetching} />
      ) : (
        <div className="mb-16">
          {data.total === 0 ? (
            <Alert
              title="No Cases!"
              color="red"
              withCloseButton
              variant="outline"
              onClose={() => {
                setSearchText("");
                setSearchValues([]);
              }}
            >
              No cases with slide images for this filter
            </Alert>
          ) : (
            <div className="border-2 border-base-lighter mx-4">
              <div className="flex border-b-2 border-b-base-lighter py-2 pl-2">
                <div className="basis-12.5">
                  <div className="flex justify-between">
                    <h2 className="text-xl font-bold">Cases</h2>
                    <ActionIcon
                      onClick={() => setShowSearch((c) => !c)}
                      className="mr-5"
                    >
                      <MdOutlineSearch size={30} color="black" aria-label="" />
                    </ActionIcon>
                  </div>

                  {showSearch && (
                    <Input
                      placeholder="eg. TCGA-DD*, *DD*, TCGA-DD-AAVP"
                      className="w-11/12 mt-2"
                      rightSectionWidth={50}
                      onChange={(e) => setSearchText(e.target.value)}
                      rightSection={
                        <Badge
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
                    <div className="mb-2 ml-2 flex flex-col items-center gap-1">
                      {searchValues.map((value) => (
                        <Tooltip
                          key={value}
                          label="Click to Remove"
                          className="my-1"
                          position="top-start"
                          transition="skew-up"
                          transitionDuration={300}
                          withArrow
                          classNames={{
                            tooltip: "h-7 w-1/8",
                          }}
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

                <div className="basis-12.5">
                  <h2 className="text-xl font-bold">Slides</h2>
                </div>
                <div className="basis-9/12">
                  <h2 className="text-xl font-bold">Image</h2>
                </div>
              </div>

              <div className="flex max-h-screeen-50vh">
                {Object.keys(data?.edges).length > 0 && activeImage && (
                  <div className="basis-3/12">
                    <Tabs
                      orientation="vertical"
                      variant="pills"
                      value={activeTab.toString()}
                      onTabChange={onTabChange}
                      classNames={{
                        root: "max-h-screen-50vh gap-2 overflow-x-hidden flex",
                        tab: "bg-white hover:bg-primary",
                        tabsList: "bg-base-light overflow-y-auto basis-1/2",
                        tabLabel:
                          "text-xs text-primary-content-darkest px-2 group-hover:text-primary-contrast",
                        panel:
                          "max-h-screen-50vh overflow-y-auto basis-1/2 mt-1",
                      }}
                      styles={(theme) => ({
                        tab: {
                          backgroundColor: theme.white,
                          color: theme.colors.gray[9],
                          border: `1px solid ${theme.colors.gray[4]}`,
                          padding: "1em 1em",
                          borderRadius: theme.radius.md,
                        },
                      })}
                      keepMounted={false}
                    >
                      <Tabs.List className="flex-nowrap gap-0">
                        <>
                          {Object.keys(data?.edges).map((edge, index) => {
                            return (
                              <Tabs.Tab
                                key={edge}
                                value={index.toString()}
                                className={`mx-2 my-1 ${
                                  activeTab.toString() === index.toString()
                                    ? "bg-primary-dark [&>div]:text-primary-contrast [&>div]:font-bold"
                                    : "font-medium"
                                } truncate ...`}
                              >
                                {edge}
                              </Tabs.Tab>
                            );
                          })}

                          <div className="sticky bottom-0 text-center bg-base-lightest p-3">
                            {shouldShowMoreButton && (
                              <Button
                                onClick={() => {
                                  setCasesOffSet((o) => o + 10);
                                  setShowMorePressed(true);
                                }}
                                size="xs"
                                classNames={{
                                  root: "bg-primary hover:bg-primary-dark",
                                }}
                                aria-label="show 10 more cases"
                              >
                                Show More
                              </Button>
                            )}

                            <Text size="sm">
                              Showing{" "}
                              <strong>{Object.keys(data?.edges).length}</strong>{" "}
                              of <strong>{data?.total}</strong>
                            </Text>
                          </div>
                        </>
                      </Tabs.List>
                      {Object.keys(data?.edges).map((edge, index) => {
                        return (
                          <Tabs.Panel key={edge} value={index.toString()}>
                            <List>
                              {data.edges[edge].map((file, index) => (
                                <List.Item
                                  key={`${file.file_id}${file.submitter_id}`}
                                  className="w-full"
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
                  </div>
                )}

                <div className="basis-9/12">
                  {activeImage && (
                    <ImageViewer
                      imageId={activeImage}
                      tableData={imageDetails}
                    />
                  )}
                </div>
              </div>

              {/* <div className="ml-12 mt-10">
                {shouldShowMoreButton && (
                  <Button
                    onClick={() => {
                      setCasesOffSet((o) => o + 10);
                      setShowMorePressed(true);
                    }}
                    size="xs"
                    classNames={{
                      root: "bg-primary hover:bg-primary-dark ml-5",
                    }}
                    aria-label=""
                  >
                    Show More
                  </Button>
                )}

                <Text size="sm">
                  Showing <strong>{Object.keys(data?.edges).length}</strong> of{" "}
                  <strong>{data?.total}</strong>
                </Text>
              </div> */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
