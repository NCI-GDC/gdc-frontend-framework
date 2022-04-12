import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Tabs,
  Input,
  Button,
  Badge,
  LoadingOverlay,
  List,
} from "@mantine/core";
import { ImageViewerProp } from "./ImageViewer";
import { GdcFile, useImageViewer } from "@gff/core";
import { parseSlideDetailsInfo } from "../features/files/utils";
import { MdOutlineSearch } from "react-icons/md";
import { Slides } from "./Slides";
import trimEnd from "lodash/trimEnd";
import find from "lodash/find";

const ImageViewer = dynamic(() => import("./ImageViewer"), {
  ssr: false,
});

interface MultipleImageViewerProps extends ImageViewerProp {}

export const getSlides = (caseNode) => {
  const portions = (
    caseNode.samples || {
      hits: { edges: [] },
    }
  ).hits.edges.reduce(
    (acc, { node }) => [...acc, ...node.portions.hits.edges.map((p) => p.node)],
    [],
  );
  const slideImageIds = caseNode.files.hits.edges.map(({ node }) => ({
    file_id: node.file_id,
    submitter_id: trimEnd(node.submitter_id, "_slide_image"),
  }));
  let slides = portions.reduce(
    (acc, { slides }) => [...acc, ...slides.hits.edges.map((p) => p.node)],
    [],
  );
  return slideImageIds.map((id) => {
    const matchBySubmitter = find(slides, { submitter_id: id.submitter_id });
    return { ...id, ...matchBySubmitter };
  });
};

export const MultipleImageViewer = ({
  tableData,
  imageId,
}: MultipleImageViewerProps): JSX.Element => {
  const [activeTab, setActiveTab] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [activeImage, setActiveImage] = useState("");

  const { data, isFetching } = useImageViewer();

  useEffect(() => {
    const inside = data?.edges[Object.keys(data.edges)[0]];
    setActiveImage(inside?.[0].file_id);
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
                <div className="flex-1/2 overflow-y-auto">
                  <Tabs
                    variant="outline"
                    orientation="vertical"
                    active={activeTab}
                    onTabChange={setActiveTab}
                    classNames={{
                      root: "text-nci-blue",
                      tabControl: "text-nci-blue",
                      tabActive: "font-bold",
                      tabsList: "bg-grey",
                      tabLabel: "text-xs",
                    }}
                    styles={{
                      tabsListWrapper: { minWidth: "40%" },
                    }}
                  >
                    {Object.keys(data.edges).map((edge) => {
                      return (
                        <Tabs.Tab key={edge} label={edge}>
                          <List>
                            {data.edges[edge].map(
                              ({ file_id, submitter_id }) => (
                                <List.Item
                                  key={`${file_id}${submitter_id}`}
                                  className="max-w-xs max-h-xs"
                                >
                                  <Slides
                                    file_id={file_id}
                                    submitter_id={submitter_id}
                                    setImageViewer={(file_id: string) =>
                                      setActiveImage(file_id)
                                    }
                                  />
                                </List.Item>
                              ),
                            )}
                          </List>
                        </Tabs.Tab>
                      );
                    })}
                  </Tabs>
                </div>
              )}

              <div className="flex-1 ml-2">
                {activeImage && (
                  <ImageViewer imageId={activeImage} tableData={tableData} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
