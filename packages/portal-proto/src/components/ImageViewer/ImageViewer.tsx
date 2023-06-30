import React, { useEffect, useRef, useState } from "react";
import getConfig from "next/config";
import OpenSeadragon from "openseadragon";
import { useImageDetails } from "@gff/core";
import { LoadingOverlay } from "@mantine/core";
import { SlideDetailButton } from "./SlideDetailButton";
import { HorizontalTableProps } from "../HorizontalTable";
import { GDC_API } from "@gff/core";
import { toggleFullScreen } from "src/utils";
export interface ImageViewerProp extends HorizontalTableProps {
  imageId: string;
}

const ImageViewer = ({ imageId, tableData }: ImageViewerProp): JSX.Element => {
  const [viewer, setViewer] = useState<OpenSeadragon.Viewer>(null);

  const {
    publicRuntimeConfig: { basePath },
  } = getConfig();

  const { data: imageDetails, isFetching, isError } = useImageDetails(imageId);
  const osdContainerRef = useRef(null);
  const detailsButtonWrapperRef = useRef<HTMLDivElement>(null);

  const InitOpenseadragon = () => {
    viewer && viewer.destroy();

    OpenSeadragon.setString("Tooltips.Home", "Reset Zoom");

    const options: OpenSeadragon.Options = {
      id: "osd",
      prefixUrl: `${basePath}/OpenseadragonImages/`,
      visibilityRatio: 1,
      showNavigator: true,
      minZoomLevel: 0,
      showFullPageControl: false,
    };
    const view: OpenSeadragon.Viewer = OpenSeadragon(options);

    const fullPageButton = new OpenSeadragon.Button({
      tooltip: "Toggle Full Page",
      srcRest: `${basePath}/OpenseadragonImages/fullpage_rest.png`,
      srcGroup: `${basePath}/OpenseadragonImages/fullpage_grouphover.png`,
      srcHover: `${basePath}/OpenseadragonImages/fullpage_hover.png`,
      srcDown: `${basePath}/OpenseadragonImages/fullpage_pressed.png`,
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
    if (imageId && viewer && imageDetails) {
      viewer.open({
        height: Number(imageDetails.Height),
        width: Number(imageDetails.Width),
        tileSize: Number(imageDetails.TileSize),
        tileOverlap: Number(imageDetails.Overlap),
        getTileUrl: (level, x, y) => {
          return `${GDC_API}/tile/${imageId}?level=${level}&x=${x}&y=${y}`;
        },
      });
    }
  }, [imageId, viewer, imageDetails]);

  return (
    <>
      <div
        className={isError ? "flex bg-base-lightest h-img-viewer" : "hidden"}
      >
        Image is not available
      </div>

      <LoadingOverlay visible={isFetching && !isError} />

      <div
        ref={osdContainerRef}
        id="osd"
        className={
          isFetching || isError ? "invisible" : "flex bg-black h-screen/2"
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
