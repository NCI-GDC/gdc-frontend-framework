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
} from "@mantine/core";
import { useImageViewer } from "@gff/core";
import { formatImageDetailsInfo } from "../features/files/utils";
import { MdOutlineSearch } from "react-icons/md";
import { Slides } from "./Slides";
import { useRouter } from "next/router";

const ImageViewer = dynamic(() => import("./ImageViewer"), {
  ssr: false,
});

export const MultipleImageViewer = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [activeImage, setActiveImage] = useState("");
  const [imageDetails, setImageDetails] = useState([]);
  const [offSet, setOffSet] = useState(0);
  const router = useRouter();

  const { data, isFetching } = useImageViewer(offSet);

  useEffect(() => {
    const inside = data?.edges[Object.keys(data.edges)[0]];
    setActiveImage(inside?.[0].file_id);
    setImageDetails(formatImageDetailsInfo(inside?.[0]));
  }, [isFetching]);

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
                    <MdOutlineSearch size={30} color="black" className="mt-1" />
                  </Button>
                </div>

                {showSearch && (
                  <Input
                    placeholder="eg. TCGA-DD*, *DD*, TCGA-DD-AAVP"
                    className="m-2"
                    rightSectionWidth={50}
                    rightSection={
                      <Badge
                        color="blue"
                        variant="filled"
                        className="cursor-pointer"
                      >
                        Go!
                      </Badge>
                    }
                  />
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
                  <ImageViewer imageId={activeImage} tableData={imageDetails} />
                )}
              </div>
            </div>
            <div className="flex flex-col w-44 ml-3 mt-5">
              <Button onClick={() => setOffSet((o) => o + 10)} size="xs">
                Show More
              </Button>

              <Text className="ml-3">
                Showing <strong>{Object.keys(data?.edges).length}</strong> of{" "}
                <strong>{data?.total}</strong>
              </Text>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
