import React, { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import { useImageDetails } from "@gff/core";
import { LoadingOverlay } from "@mantine/core";
import { toggleFullScreen } from "../features/files/utils";
import { SlideDetailButton } from "./SlideDetailButton";
import { HorizontalTableProps } from "./HorizontalTable";

interface ImageViewerProp extends HorizontalTableProps {
  imageId: string;
}

const ImageViewer = ({ imageId, tableData }: ImageViewerProp) => {
  const [viewer, setViewer] = useState<OpenSeadragon.Viewer>(null);
  const { data: imageDetails, isFetching, isError } = useImageDetails(imageId);
  const osdContainerRef = useRef(null);
  const detailsButtonWrapperRef = useRef(null);

  const InitOpenseadragon = () => {
    viewer && viewer.destroy();
    const options: OpenSeadragon.Options = {
      id: "osd",
      prefixUrl:
        "https://cdn.jsdelivr.net/npm/openseadragon@3.0/build/openseadragon/images/",
      visibilityRatio: 1,
      showNavigator: true,
      minZoomLevel: 0,
      showFullPageControl: false,
    };
    const view: OpenSeadragon.Viewer = OpenSeadragon(options);

    const fullPageButton = new OpenSeadragon.Button({
      tooltip: "Toggle Full Page",
      srcRest:
        "https://raw.githubusercontent.com/openseadragon/openseadragon/master/images/fullpage_rest.png",
      srcGroup:
        "https://raw.githubusercontent.com/openseadragon/openseadragon/master/images/fullpage_grouphover.png",
      srcHover:
        "https://raw.githubusercontent.com/openseadragon/openseadragon/master/images/fullpage_hover.png",
      srcDown:
        "https://raw.githubusercontent.com/openseadragon/openseadragon/master/images/fullpage_pressed.png",
      onClick: () => toggleFullScreen(osdContainerRef),
    });

    view.addControl(fullPageButton.element, {
      anchor: OpenSeadragon.ControlAnchor.TOP_LEFT,
    });

    detailsButtonWrapperRef.current &&
      view.addControl(detailsButtonWrapperRef.current, {
        anchor: OpenSeadragon.ControlAnchor.TOP_LEFT,
      });

    setViewer(view);
  };

  useEffect(() => {
    InitOpenseadragon();

    return () => {
      viewer && viewer.destroy();
    };
  }, []);

  useEffect(() => {
    const reFetchNewImage = () => {
      if (imageId && viewer && imageDetails) {
        viewer.open({
          height: Number(imageDetails.Height),
          width: Number(imageDetails.Width),
          tileSize: Number(imageDetails.TileSize),
          tileOverlap: Number(imageDetails.Overlap),
          getTileUrl: (level, x, y) => {
            return `https://api.gdc.cancer.gov/tile/${imageId}?level=${level}&x=${x}&y=${y}`;
          },
        });
      }
    };

    reFetchNewImage();
  }, [imageId, viewer, imageDetails]);

  return (
    <>
      {isFetching ? (
        <div>
          <LoadingOverlay visible />
        </div>
      ) : isError ? (
        <div id="osd" className="flex bg-white h-img-viewer">
          Image is not available
        </div>
      ) : (
        <div
          ref={osdContainerRef}
          id="osd"
          className="flex bg-black h-img-viewer"
        />
      )}
      <SlideDetailButton ref={detailsButtonWrapperRef} tableData={tableData} />
    </>
  );
};

export default ImageViewer;
