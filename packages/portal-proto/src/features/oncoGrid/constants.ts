export const consequenceTypes = [
  "missense_variant",
  "frameshift_variant",
  "start_lost",
  "stop_lost",
  "stop_gained",
];

export const defaultColorMap = {
  cnv: {
    Gain: "#e76a6a",
    Loss: "#64b5f6",
  },
  mutation: {
    missense_variant: "#00e676",
    frameshift_variant: "#388e3c",
    start_lost: "#fdd835",
    stop_lost: "#a8a6a6",
    stop_gained: "#ce93d8",
  },
};