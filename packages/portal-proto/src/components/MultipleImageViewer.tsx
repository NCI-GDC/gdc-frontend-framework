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

const ImageViewer = dynamic(() => import("./ImageViewer"), {
  ssr: false,
});

export const MultipleImageViewer = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [activeImage, setActiveImage] = useState("");
  const [imageDetails, setImageDetails] = useState([]);
  const [offSet, setOffSet] = useState(0);

  const { data, isFetching } = useImageViewer(offSet);

  console.log("dataa: ", data);

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
          <h1 className="p-2 text-xl ml-4 text-black">Slide Image Viewer</h1>
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
                    variant="outline"
                    orientation="vertical"
                    active={activeTab}
                    onTabChange={setActiveTab}
                    classNames={{
                      root: "text-nci-blue",
                      tabsListWrapper: "max-h-[550px] overflow-x-hidden overflow-y-auto",
                      tabControl: "text-nci-blue bg-grey",
                      tabActive: "font-bold",
                      tabsList: "bg-grey",
                      tabLabel: "text-xs",
                      body: "max-h-[550px] overflow-y-auto",
                    }}
                    styles={{
                      tabActive: {
                        background: "blue",
                      },
                      tabsListWrapper: { minWidth: "40%" },
                    }}
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
            <div className="flex flex-col">
              <Text>
                Showing {Object.keys(data?.edges).length} of {data?.total}
              </Text>
              <Badge
                color="blue"
                variant="filled"
                className="cursor-pointer w-1/6"
                onClick={() => setOffSet((o) => o + 10)}
              >
                Show More
              </Badge>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
