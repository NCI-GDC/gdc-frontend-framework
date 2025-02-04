export const chartDivId = "cancer-distribution-bar-chart-cnv";

export interface CheckboxState {
  amplification: boolean;
  gain: boolean;
  heterozygousDeletion: boolean;
  homozygousDeletion: boolean;
}

export interface CheckboxConfig {
  key: keyof CheckboxState;
  label: string;
  id: string;
  className: string;
}

export const checkboxConfigs: CheckboxConfig[] = [
  {
    key: "amplification",
    label: "Amplification",
    id: "cancer-dist-amplification",
    className: "form-checkbox text-[#900000]",
  },
  {
    key: "gain",
    label: "Gain",
    id: "cancer-dist-gain",
    className: "form-checkbox text-[#D33636]",
  },
  {
    key: "heterozygousDeletion",
    label: "Heterozygous Deletion",
    id: "cancer-dist-loss",
    className: "form-checkbox text-[#0C70E8]",
  },
  {
    key: "homozygousDeletion",
    label: "Homozygous Deletion",
    id: "cancer-dist-homozygous-deletion",
    className: "form-checkbox text-[#00457C]",
  },
];

export const cnvMapping = {
  homozygousDeletion: { prop: "homozygousDeletion", color: "#00457C" },
  heterozygousDeletion: { prop: "loss", color: "#0C70E8" },
  gain: { prop: "gain", color: "#D33636" },
  amplification: { prop: "amplification", color: "#900000" },
};

export const hovertemplate =
  "%{customdata[0]} Cases Affected in <b>%{x}</b><br />%{customdata[0]} / %{customdata[1]} (%{y:.2f}%)<extra></extra>";
