const colors = [
  "#0076d6", // blue
  "#cf4900", // orange warm
  "#be32d0", // violet warm
  "#008817", // green cool
  "#656bd7", // indigo
  "#947100", // yellow
  "#d83933", // red
  "#0081a1", // cyan
  "#4866ff", // indigo cool
  "#936f38", // gold
  "#fd4496", // magenta
  "#008480", // mint
  "#9355dc", // violet
  "#538200", // green
  "#d54309", // red warm
  "#0d7ea2", // blue cool
  "#2672de", // blue warm
  "#c05600", // orange
  "#745fe9", // indigo warm
  "#6a7d00", // green warm
  "#e41d3d", // red cool
  "#008480", // mint cool
];

export const lookupColor = (n: number): string => {
  return colors[n % colors.length];
};
