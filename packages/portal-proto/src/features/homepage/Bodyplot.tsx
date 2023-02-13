import { useCallback, useRef, useEffect, useState, useMemo } from "react";
import { createHumanBody, colorCodes } from "@nci-gdc/sapien";
import { useMouse } from "@mantine/hooks";
import { Text } from "@mantine/core";
import { useBodyplotCountsQuery } from "@gff/core";

const SCALE_CASE_COUNT = 1000;

interface PopupContentProps {
  label: string | number;
  caseCount: string | number;
  fileCount: string | number;
  setSize: (_1: number[]) => void;
}

/**
 * PopupContent is the content that appears when a user hovers over a body part
 * @param label the name of the body part
 * @param caseCount the number of cases that have data for this body part
 * @param fileCount the number of files that have data for this body part
 * @param setSize a function that sets the size of the popup
 */
const PopupContent = ({
  label,
  caseCount,
  fileCount,
  setSize,
}: PopupContentProps): JSX.Element => {
  // get the size of the content, so we can position the popup
  const contentRef = useRef(null);

  useEffect(() => {
    const { width = 0, height = 0 } =
      contentRef?.current?.getBoundingClientRect();
    setSize([width, height]);
  }, [setSize]);

  return (
    <div
      ref={contentRef}
      className="flex flex-col border-2 rounded border-base-lighter bg-base-max p-2"
    >
      <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-4 h-4 bg-white border-r border-t border-base-lighter"></div>
      <Text size="lg" color="red">
        {label}
      </Text>
      <div className="flex flex-row">
        <Text size="sm">{caseCount.toLocaleString()} cases </Text>
        <Text size="sm" className="pl-1">
          ({fileCount.toLocaleString()} files)
        </Text>
      </div>
    </div>
  );
};

/**
 * Bodyplot is the component that renders the bodyplot
 */
export const Bodyplot = (): JSX.Element => {
  const [extents, setExtents] = useState([0, 0]);
  const [bodyplotTooltipContent, setBodyplotTooltipContent] =
    useState(undefined);

  const { data } = useBodyplotCountsQuery({});
  const root = document.getElementById("human-body-parent");

  const processedData = useMemo(() => {
    return data
      ? data
          .map((d) => ({
            ...d,
            caseCount: d.caseCount / SCALE_CASE_COUNT,
            color: colorCodes[d.key],
          }))
          .sort((a, b) => (a.key > b.key ? 1 : -1))
      : [];
  }, [data]);

  const bodyplotRef = useRef(undefined);
  const { ref: mouseRef, x, y } = useMouse(); // get the mouse position
  const clickHandler = useCallback(() => () => null, []);
  const mouseOutHandler = useCallback(
    () => setBodyplotTooltipContent(undefined),
    [],
  );

  useMemo(() => {
    if (bodyplotRef?.current) {
      createHumanBody({
        title: "Cases by Major Primary Site",
        selector: bodyplotRef.current,
        width: 460,
        height: 500,
        data: processedData ?? [],
        labelSize: "10px",
        primarySiteKey: "key",
        fileCountKey: "fileCount",
        caseCountKey: "caseCount",
        tickInterval: 1,
        offsetLeft: root ? root.offsetLeft : 0,
        offsetTop: root ? root.offsetTop : 0,
        clickHandler: clickHandler,
        mouseOverHandler: setBodyplotTooltipContent,
        mouseOutHandler: mouseOutHandler,
      });
    }
  }, [clickHandler, mouseOutHandler, processedData, root, bodyplotRef]);

  return (
    <div ref={mouseRef} className="relative">
      <div
        className={`${
          bodyplotTooltipContent ? "opacity-100" : "opacity-0"
        }  overflow-visible transition-opacity duration-500 z-[1800] shadow-lg absolute`}
        style={{ left: x - extents[0] - 20, top: y - extents[1] / 2 }}
      >
        {bodyplotTooltipContent && (
          <PopupContent
            label={bodyplotTooltipContent?.key}
            caseCount={bodyplotTooltipContent?.caseCount * SCALE_CASE_COUNT}
            fileCount={bodyplotTooltipContent?.fileCount}
            setSize={setExtents}
          />
        )}
      </div>
      <div id="human-body-root" ref={bodyplotRef}></div>
    </div>
  );
};
