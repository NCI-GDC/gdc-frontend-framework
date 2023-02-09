import {
  MutableRefObject,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { createHumanBody } from "@nci-gdc/sapien";
import { useMouse, useResizeObserver } from "@mantine/hooks";
import { Box, Tooltip } from "@mantine/core";

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
  const [ref] = useResizeObserver();

  // sample data until we have real data
  // TODO replace with real data
  const data: BodyplotDataEntry[] = useMemo(
    () => [
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
    ],
    [],
  );

  data.sort((a, b) => (a._key > b._key ? 1 : -1));
  const root = document.getElementById("human-body-parent");

  useLayoutEffect(() => {
    ref.current
      ? createHumanBody({
          selector: ref.current,
          width: 400,
          height: 500,
          data: data,
          labelSize: "10px",
          fileCountKey: "_file_count",
          caseCountKey: "_count",
          tickInterval: 250,
          offsetLeft: root ? root.offsetLeft : 0,
          offsetTop: root ? root.offsetTop : 0,
          clickHandler: clickHandler,
          mouseOverHandler: mouseOverHandler,
          mouseOutHandler: mouseOutHandler,
        })
      : null;
  }, [data, ref, root]);

  return ref;
};

export const Bodyplot = (): JSX.Element => {
  const { ref: mouseRef, x, y } = useMouse(); // for bodyplot tooltip
  const clickHandler = useCallback(() => () => null, []);

  const container = useBodyplot({
    clickHandler: clickHandler,
  });
  return (
    <div id="human-body-root" ref={container}>
      <div ref={mouseRef} className="relative">
        <Box
          className="bg-base-lightest min-w-[150px]"
          sx={{ left: x + 20, top: y - 20, position: "absolute" }}
        >
          {survivalPlotLineTooltipContent}
        </Box>
        <div className="survival-plot" ref={container} />
      </div>
    </div>
  );
};
