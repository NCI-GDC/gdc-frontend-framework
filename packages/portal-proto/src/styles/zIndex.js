/**
 * These values should be used to set the z-index of ANY elements. They are set up so that when used, elements will stack correctly.
 * Already added Mantine components use these as their default props so no further customization should be needed. If a new Mantine component is
 * added, be sure to to add a z-index value and set `withinPortal: false` as default props in mantineTheme.ts (we are taking advantage of stacking context
 * so elements need to be in the stacking context of their parent and not a portal). If not using a Mantine component,
 * then import these constants or use the tailwind zIndex classes as appropriate to set the z-index.
 */

const LOADING_OVERLAY_Z_INDEX = 1;
const TABLE_HEADER_Z_INDEX = 10;
const MENU_Z_INDEX = 20;
const POPOVER_Z_INDEX = 30;
const TOOLTIP_Z_INDEX = 40;
const HEADER_Z_INDEX = 50;
const STICKY_HEADER_Z_INDEX = HEADER_Z_INDEX - 1;
const DRAWER_Z_INDEX = 60;
const MODAL_Z_INDEX = 70;

module.exports = {
  LOADING_OVERLAY_Z_INDEX,
  TABLE_HEADER_Z_INDEX,
  MENU_Z_INDEX,
  TOOLTIP_Z_INDEX,
  POPOVER_Z_INDEX,
  HEADER_Z_INDEX,
  STICKY_HEADER_Z_INDEX,
  DRAWER_Z_INDEX,
  MODAL_Z_INDEX,
};
