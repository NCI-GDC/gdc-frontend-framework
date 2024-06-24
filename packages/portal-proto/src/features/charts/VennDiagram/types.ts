import { GroupProps, ElementProps, PathStyleProps } from "zrender";

export interface ChartData {
  readonly key: string;
  readonly value: number | string;
  readonly highlighted: boolean;
}

export interface VennDiagramProps {
  readonly chartData: ChartData[];
  readonly labels: string[];
  readonly ariaLabel: string;
  readonly onClickHandler?: (key: string) => void;
  readonly interactable?: boolean;
}

export interface GraphicComponentGroupOption extends ElementProps, GroupProps {
  type: "group";
  id: string;
  style: PathStyleProps;
  children: GraphicComponentGroupOption[];
}
