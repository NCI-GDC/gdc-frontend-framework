import {
  MutableRefObject,
  useCallback,
  useRef,
  useLayoutEffect,
  useEffect,
  useState,
  useMemo,
} from "react";
import { createHumanBody } from "@nci-gdc/sapien";
import { useMouse } from "@mantine/hooks";
import { Text } from "@mantine/core";
import { useBodyplotCountsQuery, BodyplotCountsData } from "@gff/core";

interface BodyplotProps {
  data: BodyplotCountsData[];
  clickHandler?: (key: string) => void;
  mouseOverHandler?: (e: any) => void;
  mouseOutHandler?: (e: any) => void;
}

export const useBodyplot = ({
  clickHandler = () => null,
  mouseOverHandler = undefined,
  mouseOutHandler = undefined,
}: BodyplotProps): MutableRefObject<any> => {
  const ref = useRef(undefined);

  // sample data until we have real data
  // TODO replace with real data
  // const data: BodyplotCountsData[] = useMemo(
  //   () =>
  //     [
  //       { key: "Kidney", caseCount: 1692, fileCount: 1692 },
  //       { key: "Brain", caseCount: 1133, fileCount: 1133 },
  //       { key: "Nervous System", caseCount: 1120, fileCount: 1120 },
  //       { key: "Breast", caseCount: 1098, fileCount: 1098 },
  //       { key: "Lung", caseCount: 1089, fileCount: 1089 },
  //       { key: "Blood", caseCount: 923, fileCount: 923 },
  //       { key: "Colorectal", caseCount: 635, fileCount: 635 },
  //       { key: "Uterus", caseCount: 617, fileCount: 617 },
  //       { key: "Ovary", caseCount: 608, fileCount: 608 },
  //       { key: "Head and Neck", caseCount: 528, fileCount: 528 },
  //       { key: "Thyroid", caseCount: 507, fileCount: 507 },
  //       { key: "Prostate", caseCount: 500, fileCount: 500 },
  //       { key: "Stomach", caseCount: 478, fileCount: 478 },
  //       { key: "Skin", caseCount: 470, fileCount: 470 },
  //       { key: "Bladder", caseCount: 412, fileCount: 412 },
  //       { key: "Bone", caseCount: 384, fileCount: 384 },
  //       { key: "Liver", caseCount: 377, fileCount: 377 },
  //       { key: "Cervix", caseCount: 308, fileCount: 308 },
  //       { key: "Adrenal Gland", caseCount: 271, fileCount: 271 },
  //       { key: "Soft Tissue", caseCount: 261, fileCount: 261 },
  //       { key: "Bone Marrow", caseCount: 200, fileCount: 200 },
  //       { key: "Pancreas", caseCount: 185, fileCount: 185 },
  //       { key: "Esophagus", caseCount: 185, fileCount: 185 },
  //       { key: "Testis", caseCount: 150, fileCount: 150 },
  //       { key: "Thymus", caseCount: 124, fileCount: 124 },
  //       { key: "Pleura", caseCount: 87, fileCount: 87 },
  //       { key: "Eye", caseCount: 80, fileCount: 80 },
  //       { key: "Lymph Nodes", caseCount: 58, fileCount: 58 },
  //       { key: "Bile Duct", caseCount: 51, fileCount: 51 },
  //     ].sort((a, b) => (a.key > b.key ? 1 : -1)),
  //   [],
  // );

  const root = document.getElementById("human-body-parent");

  const data3 = data2
    .map((d) => ({
      ...d,
      color: "rgb(190, 48, 44)",
    }))
    .sort((a, b) => (a.key > b.key ? 1 : -1));

  useLayoutEffect(() => {
    data
      ? createHumanBody({
          title: "Cases by Major Primary Site",
          selector: ref.current,
          width: 400,
          height: 500,
          data: data3,
          labelSize: "10px",
          primarySiteKey: "key",
          fileCountKey: "fileCount",
          caseCountKey: "caseCount",
          tickInterval: 1000,
          offsetLeft: root ? root.offsetLeft : 0,
          offsetTop: root ? root.offsetTop : 0,
          clickHandler: clickHandler,
          mouseOverHandler: mouseOverHandler,
          mouseOutHandler: mouseOutHandler,
        })
      : null;
  }, [clickHandler, data, mouseOutHandler, mouseOverHandler, ref, root]);

  return ref;
};

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
        <Text size="sm"> ({fileCount.toLocaleString()} files)</Text>
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

  console.log("before data", data);

  const { ref: mouseRef, x, y } = useMouse(); // get the mouse position
  const clickHandler = useCallback(() => () => null, []);
  const mouseOutHandler = useCallback(
    () => setBodyplotTooltipContent(undefined),
    [],
  );
  const container = useBodyplot({
    data: data ?? [],
    clickHandler: clickHandler,
    mouseOverHandler: setBodyplotTooltipContent,
    mouseOutHandler: mouseOutHandler, // handler for mouseout to hide tooltip
  });

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
            caseCount={bodyplotTooltipContent?.caseCount}
            fileCount={bodyplotTooltipContent?.fileCount}
            setSize={setExtents}
          />
        )}
      </div>
      <div id="human-body-root" ref={container}></div>
    </div>
  );
};
