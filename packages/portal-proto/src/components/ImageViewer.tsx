import React, { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import { useImageDetails } from "@gff/core";
import { LoadingOverlay } from "@mantine/core";
import { toggleFullScreen } from "../utils";
import { SlideDetailButton } from "./SlideDetailButton";
import { HorizontalTableProps } from "./HorizontalTable";

export interface ImageViewerProp extends HorizontalTableProps {
  imageId: string;
}

const ImageViewer = ({ imageId, tableData }: ImageViewerProp): JSX.Element => {
  const [viewer, setViewer] = useState<OpenSeadragon.Viewer>(null);
  const { data: imageDetails, isFetching, isError } = useImageDetails(imageId);
  const osdContainerRef = useRef(null);
  const detailsButtonWrapperRef = useRef<HTMLDivElement>(null);

  const InitOpenseadragon = () => {
    viewer && viewer.destroy();

    OpenSeadragon.setString("Tooltips.Home", "Reset Zoom");

    const options: OpenSeadragon.Options = {
      id: "osd",
      prefixUrl: "/OpenseadragonImages/",
      visibilityRatio: 1,
      showNavigator: true,
      minZoomLevel: 0,
      showFullPageControl: false,
    };
    const view: OpenSeadragon.Viewer = OpenSeadragon(options);

    const fullPageButton = new OpenSeadragon.Button({
      tooltip: "Toggle Full Page",
      srcRest: "/OpenseadragonImages/fullpage_rest.png",
      srcGroup: "/OpenseadragonImages/fullpage_grouphover.png",
      srcHover: "/OpenseadragonImages/fullpage_hover.png",
      srcDown: "/OpenseadragonImages/fullpage_pressed.png",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div
        className={isError ? "flex bg-base-lightest h-img-viewer" : "hidden"}
      >
        Image is not available
      </div>
      <div>
        <LoadingOverlay visible={isFetching && !isError} />
      </div>
      <div
        ref={osdContainerRef}
        id="osd"
        className={
          isFetching || isError ? "invisible" : "flex bg-black h-img-viewer"
        }
      >
        <SlideDetailButton
          ref={detailsButtonWrapperRef}
          tableData={tableData}
        />
      </div>
    </>
  );
};

export default ImageViewer;
