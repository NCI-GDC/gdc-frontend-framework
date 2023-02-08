import { createHumanBody } from "@nci-gdc/sapien";
import { useResizeObserver } from "@mantine/hooks";
import { useLayoutEffect } from "react";
export const Bodyplot = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore

  const [ref, rect] = useResizeObserver();

  const data = [
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
  ];

  data.sort((a, b) => (a._key > b._key ? 1 : -1));

  useLayoutEffect(() => {
    ref.current
      ? createHumanBody({
          selector: ref.current,
          width: 700,
          height: 600,
          data: data,
          labelSize: "10px",
          fileCountKey: "_file_count",
          clickHandler: (d) => console.dir(d),
        })
      : null;
  }, [data, ref]);

  return <div id="human-body-root" ref={ref}></div>;
};
