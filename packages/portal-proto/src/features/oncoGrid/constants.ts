export const consequenceTypes = {
  missense_variant: "Missense",
  frameshift_variant: "Frameshift",
  start_lost: "Start Lost",
  stop_lost: "Stop Lost",
  stop_gained: "Stop Gained",
};

export const cnvTypes = {
  loss: "Loss",
  gain: "Gain",
};

export const suggestedColorMap = {
  cnv: {
    gain: "#e76a6a",
    loss: "#64b5f6",
  },
  mutation: {
    missense_variant: "#00e676",
    frameshift_variant: "#388e3c",
    start_lost: "#fdd835",
    stop_lost: "#a8a6a6",
    stop_gained: "#ce93d8",
  },
};

export const defaultColorMap = {
  cnv: {
    gain: "#e76a6a",
    loss: "#64b5f6",
  },
  mutation: {
    missense_variant: "#388e3c",
    frameshift_variant: "#388e3c",
    start_lost: "#388e3c",
    stop_lost: "#388e3c",
    stop_gained: "#388e3c",
  },
};

export const heatMapColor = "#2E7D32";

export interface ColorMapType {
  readonly cnv: Record<string, string>;
  readonly mutation: Record<string, string>;
}