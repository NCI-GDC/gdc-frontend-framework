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
} from "@mantine/core";
import {
  setIsPerformingSearch,
  useCoreDispatch,
  useImageViewer,
} from "@gff/core";
import { formatImageDetailsInfo } from "../features/files/utils";
import { MdOutlineSearch } from "react-icons/md";
import { Slides } from "./Slides";
import { useRouter } from "next/router";

const ImageViewer = dynamic(() => import("./ImageViewer"), {
  ssr: false,
});

interface MultipleImageViewerProps {
  case_id?: string;
}

export const MultipleImageViewer = ({
  case_id,
}: MultipleImageViewerProps): JSX.Element => {
  const [activeTab, setActiveTab] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [activeImage, setActiveImage] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchValues, setSearchValues] = useState([]);
  const [imageDetails, setImageDetails] = useState([]);
  const [offSet, setOffSet] = useState(0);
  const router = useRouter();
  const dispatch = useCoreDispatch();

  const { data, isFetching } = useImageViewer({
    cases_offset: offSet,
    searchValues,
    case_id,
  });

  useEffect(() => {
    const inside = data?.edges[Object.keys(data.edges)[0]];
    setActiveImage(inside?.[0].file_id);
    setImageDetails(formatImageDetailsInfo(inside?.[0]));
  }, [isFetching]);

  const removeFilters = (filter: string) => {
    setSearchValues(searchValues.filter((value) => value !== filter));
  };

  const performSearch = () => {
    dispatch(setIsPerformingSearch(true));
    setSearchValues([...searchValues, searchText.toUpperCase()]);
  };

  const shouldShowMoreButton = Object.keys(data.edges).length < data.total;

  return (
    <>
      {isFetching ? (
        <div>
          <LoadingOverlay visible />
        </div>
      ) : (
        <div>
          <div className="flex justify-between">
            <h1 className="p-2 text-xl ml-4 text-black">Slide Image Viewer</h1>
            {/* TODO: for cases summary push the cases summary page route once it's available (using props to know when to go back or not) */}
            <Button
              onClick={() => router.back()}
              size="xs"
              className="mr-2 mt-2"
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
            <div className="flex flex-col border-1 border-[#c8c8c8] m-2 mt-0">
              <div className="flex border-b-1 border-b-[#c8c8c8]">
                <div className="flex flex-col w-1/6">
                  <div className="flex">
                    <h2 className="p-2 text-xl ml-4 text-black">Cases</h2>
                    <Button
                      onClick={() => setShowSearch((c) => !c)}
                      variant="subtle"
                      size="xs"
                      className="mt-3"
                      compact
                    >
                      <MdOutlineSearch
                        size={30}
                        color="black"
                        className="mt-1"
                      />
                    </Button>
                  </div>

                  {showSearch && (
                    <Input
                      placeholder="eg. TCGA-DD*, *DD*, TCGA-DD-AAVP"
                      className="w-[220px] m-2 mt-1"
                      rightSectionWidth={50}
                      onChange={(e) => setSearchText(e.target.value)}
                      rightSection={
                        <Badge
                          color="blue"
                          variant="filled"
                          className="cursor-pointer"
                          onClick={performSearch}
                        >
                          Go!
                        </Badge>
                      }
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          performSearch();
                        }
                      }}
                    />
                  )}

                  {searchValues.length > 0 && (
                    <div className="mb-2 ml-2 flex flex-col">
                      {searchValues.map((value) => (
                        <Tooltip
                          key={value}
                          label="Click to Remove"
                          className="my-1"
                          position="top"
                          placement="start"
                          transition="skew-up"
                          transitionDuration={300}
                          transitionTimingFunction="ease"
                          withArrow
                          classNames={{
                            body: "h-7",
                            root: "w-1/4",
                          }}
                        >
                          <Badge
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

                <div className="w-1/6">
                  <h2 className="p-2 text-xl ml-4 text-black">Slides</h2>
                </div>

                <div className="flex-1">
                  <h2 className="p-2 text-xl mx-4 text-black">Image</h2>
                </div>
              </div>

              <div className="flex max-h-[550px]">
                {activeImage && (
                  <div className="flex-1/2">
                    <Tabs
                      variant="unstyled"
                      orientation="vertical"
                      active={activeTab}
                      onTabChange={setActiveTab}
                      classNames={{
                        tabsListWrapper:
                          "max-h-[550px] overflow-x-hidden overflow-y-auto",
                        tabControl: "ml-2 mt-1",
                        tabsList: "bg-grey",
                        tabLabel: "text-xs",
                        body: "max-h-[550px] overflow-y-auto",
                      }}
                      styles={(theme) => ({
                        tabControl: {
                          backgroundColor: theme.white,
                          color: theme.colors.gray[9],
                          border: `1px solid ${theme.colors.gray[4]}`,
                          fontSize: theme.fontSizes.md,
                          padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`,
                          borderRadius: theme.radius.md,
                        },

                        tabActive: {
                          backgroundColor: theme.colors.gray[7],
                          borderColor: theme.colors.gray[7],
                          color: theme.white,
                          fontWeight: "bold",
                        },
                        tabsListWrapper: { minWidth: "40%" },
                      })}
                    >
                      {Object.keys(data.edges).map((edge) => {
                        return (
                          <Tabs.Tab key={edge} label={edge}>
                            <List>
                              {data.edges[edge].map((file) => (
                                <List.Item
                                  key={`${file.file_id}${file.submitter_id}`}
                                  className="max-w-xs max-h-xs"
                                >
                                  <Slides
                                    file_id={file.file_id}
                                    submitter_id={file.submitter_id}
                                    setImageViewer={(file_id: string) => {
                                      setActiveImage(file_id);
                                      setImageDetails(
                                        formatImageDetailsInfo(file),
                                      );
                                    }}
                                    isActive={activeImage === file.file_id}
                                  />
                                </List.Item>
                              ))}
                            </List>
                          </Tabs.Tab>
                        );
                      })}
                    </Tabs>
                  </div>
                )}

                <div className="flex-1 ml-2">
                  {activeImage && (
                    <ImageViewer
                      imageId={activeImage}
                      tableData={imageDetails}
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col w-44 ml-3 mt-5">
                {shouldShowMoreButton && (
                  <Button
                    onClick={() => {
                      dispatch(setIsPerformingSearch(false));
                      setOffSet((o) => o + 10);
                    }}
                    size="xs"
                  >
                    Show More
                  </Button>
                )}

                <Text className="ml-3">
                  Showing <strong>{Object.keys(data?.edges).length}</strong> of{" "}
                  <strong>{data?.total}</strong>
                </Text>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
