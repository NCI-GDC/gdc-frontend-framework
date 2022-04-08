import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Tabs, Input, Button, Badge, List } from "@mantine/core";
import { ImageViewerProp } from "./ImageViewer";
import { GdcFile } from "@gff/core";
import { parseSlideDetailsInfo } from "../features/files/utils";
import { MdOutlineSearch } from "react-icons/md";
import { Slides } from "./Slides";

const ImageViewer = dynamic(() => import("./ImageViewer"), {
  ssr: false,
});

interface MultipleImageViewerProps extends ImageViewerProp {}

export const MultipleImageViewer = ({
  tableData,
  imageId,
}: MultipleImageViewerProps): JSX.Element => {
  const [activeTab, setActiveTab] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [activeImage, setActiveImage] = useState(imageId);

  const trialMap = [
    {
      key: "text-1",
      value: "TCGA-EI-6506 - TCGA-READ",
      children: [
        {
          submitter_id: "TCGA-EI-6506-01A-01-BS1",
          file_id: "cf7aff1a-8ce0-4628-a0c0-6efe275a2417",
        },
        {
          submitter_id: "TCGA-EI-6506-01A-01-BS1",
          file_id: "a8695d33-2a50-4e1c-919f-bcee50764a7a",
        },
        {
          submitter_id: "TCGA-EI-6506-01Z-00-DX1",
          file_id: "efe6a14d-2f1a-4483-8d9f-2d9796108882",
        },
      ],
    },
    {
      key: "text-2",
      value: "TCGA-EI-6506 - TCGA-READ",
      children: [
        {
          submitter_id: "TCGA-AG-3609-01Z-00-DX1",
          file_id: "db3dcba4-1f71-48ea-8dc1-c5faae6c28e3",
        },
        {
          submitter_id: "TCGA-AG-3609-01A-02-BS2",
          file_id: "23369629-0fa9-485f-84f1-efc9ee4c31e4",
        },
        {
          submitter_id: "TCGA-AG-3609-01A-01-BS1",
          file_id: "d2b9b849-c660-4429-8aaa-589dd2d984d0",
        },
      ],
    },
    {
      key: "text-3",
      value: "TCGA-EI-6506 - TCGA-READ",
      children: [
        {
          submitter_id: "TCGA-EI-6506-01A-01-BS1",
          file_id: "cf7aff1a-8ce0-4628-a0c0-6efe275a2417",
        },
        {
          submitter_id: "TCGA-EI-6506-01A-01-BS1",
          file_id: "a8695d33-2a50-4e1c-919f-bcee50764a7a",
        },
        {
          submitter_id: "TCGA-EI-6506-01Z-00-DX1",
          file_id: "efe6a14d-2f1a-4483-8d9f-2d9796108882",
        },
      ],
    },
    {
      key: "text-4",
      value: "TCGA-EI-6506 - TCGA-READ",
      children: [
        {
          submitter_id: "TCGA-EI-6506-01A-01-BS1",
          file_id: "cf7aff1a-8ce0-4628-a0c0-6efe275a2417",
        },
        {
          submitter_id: "TCGA-EI-6506-01A-01-BS1",
          file_id: "a8695d33-2a50-4e1c-919f-bcee50764a7a",
        },
        {
          submitter_id: "TCGA-EI-6506-01Z-00-DX1",
          file_id: "efe6a14d-2f1a-4483-8d9f-2d9796108882",
        },
        {
          submitter_id: "TCGA-EI-6506-01Z-00-DX1",
          file_id: "efe6a14d-2f1a-4483-8d9f-2d9796108882",
        },
        {
          submitter_id: "TCGA-EI-6506-01Z-00-DX1",
          file_id: "efe6a14d-2f1a-4483-8d9f-2d9796108882",
        },
        {
          submitter_id: "TCGA-EI-6506-01Z-00-DX1",
          file_id: "efe6a14d-2f1a-4483-8d9f-2d9796108882",
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex w-100">
        <div className="flex flex-col w-1/6">
          <div className="flex">
            <h2 className="p-2 text-xl ml-4">Cases</h2>
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
                <Badge color="blue" variant="filled">
                  Go!
                </Badge>
              }
            />
          )}
        </div>

        <div className="w-1/6">
          <h2 className="p-2 text-xl mx-4">Slides</h2>
        </div>

        <div className="flex-1">
          <h2 className="p-2 text-xl mx-4">Image</h2>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/4">
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
            }}
            styles={{
              tabsListWrapper: { minWidth: "40%" },
            }}
          >
            {trialMap.map(({ key, value, children }) => {
              return (
                <Tabs.Tab key={key} label={value}>
                  <List>
                    {children.map(({ file_id, submitter_id }) => (
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
                    ))}
                  </List>
                </Tabs.Tab>
              );
            })}
          </Tabs>
        </div>

        <div className="flex-1">
          <ImageViewer imageId={activeImage} tableData={tableData} />
        </div>
      </div>
    </div>
  );
};
