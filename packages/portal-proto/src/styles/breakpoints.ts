export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "custom-repo-width": 1420,
} as const;

export const MD_BREAKPOINT = BREAKPOINTS.md;
export const LG_BREAKPOINT = BREAKPOINTS.lg;
export const XL_BREAKPOINT = BREAKPOINTS.xl;
export const REPO_BREAKPOINT = BREAKPOINTS["custom-repo-width"];
