import {
  MutableRefObject,
  useCallback,
  useRef,
  useLayoutEffect,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createHumanBody } from "@nci-gdc/sapien";
import { useMouse } from "@mantine/hooks";
import { Text } from "@mantine/core";

export interface BodyplotDataEntry {
  _key: string;
  _count: number;
  _file_count: number;
}

interface BodyplotProps {
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
  const data: BodyplotDataEntry[] = useMemo(
    () =>
      [
        { _key: "Kidney", _count: 1692, _file_count: 1692 },
        { _key: "Brain", _count: 1133, _file_count: 1133 },
        { _key: "Nervous System", _count: 1120, _file_count: 1120 },
        { _key: "Breast", _count: 1098, _file_count: 1098 },
        { _key: "Lung", _count: 1089, _file_count: 1089 },
        { _key: "Blood", _count: 923, _file_count: 923 },
        { _key: "Colorectal", _count: 635, _file_count: 635 },
        { _key: "Uterus", _count: 617, _file_count: 617 },
        { _key: "Ovary", _count: 608, _file_count: 608 },
        { _key: "Head and Neck", _count: 528, _file_count: 528 },
        { _key: "Thyroid", _count: 507, _file_count: 507 },
        { _key: "Prostate", _count: 500, _file_count: 500 },
        { _key: "Stomach", _count: 478, _file_count: 478 },
        { _key: "Skin", _count: 470, _file_count: 470 },
        { _key: "Bladder", _count: 412, _file_count: 412 },
        { _key: "Bone", _count: 384, _file_count: 384 },
        { _key: "Liver", _count: 377, _file_count: 377 },
        { _key: "Cervix", _count: 308, _file_count: 308 },
        { _key: "Adrenal Gland", _count: 271, _file_count: 271 },
        { _key: "Soft Tissue", _count: 261, _file_count: 261 },
        { _key: "Bone Marrow", _count: 200, _file_count: 200 },
        { _key: "Pancreas", _count: 185, _file_count: 185 },
        { _key: "Esophagus", _count: 185, _file_count: 185 },
        { _key: "Testis", _count: 150, _file_count: 150 },
        { _key: "Thymus", _count: 124, _file_count: 124 },
        { _key: "Pleura", _count: 87, _file_count: 87 },
        { _key: "Eye", _count: 80, _file_count: 80 },
        { _key: "Lymph Nodes", _count: 58, _file_count: 58 },
        { _key: "Bile Duct", _count: 51, _file_count: 51 },
      ].sort((a, b) => (a._key > b._key ? 1 : -1)),
    [],
  );

  const root = document.getElementById("human-body-parent");

  useLayoutEffect(() => {
    ref.current
      ? createHumanBody({
          title: "Cases by Major Primary Site",
          selector: ref.current,
          width: 400,
          height: 500,
          data: data,
          labelSize: "10px",
          fileCountKey: "_file_count",
          caseCountKey: "_count",
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

  const { ref: mouseRef, x, y } = useMouse(); // get the mouse position
  const clickHandler = useCallback(() => () => null, []);
  const mouseOutHandler = useCallback(
    () => setBodyplotTooltipContent(undefined),
    [],
  );
  const container = useBodyplot({
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
            label={bodyplotTooltipContent?._key}
            caseCount={bodyplotTooltipContent?._count}
            fileCount={bodyplotTooltipContent?._file_count}
            setSize={setExtents}
          />
        )}
      </div>
      <div id="human-body-root" ref={container}></div>
    </div>
  );
};
