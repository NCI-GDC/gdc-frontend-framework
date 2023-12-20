export const SecondaryTabStyle =
  "flex flex-row items-center bg-base-max text-primary border font-medium " +
  "border-solid border-primary hover:bg-secondary-darker " +
  "hover:text-secondary-content-lightest rounded-md first:border-r-0 " +
  "last:border-l-0 first:rounded-r-none last:rounded-l-none " +
  "hover:border-secondary data-active:bg-secondary " +
  "data-active:text-secondary-content-max";

export const getCombinedClassesExpandCollapseQuery = (
  allQueryExpressionsCollapsed: boolean,
) => {
  const baseClasses =
    "flex gap-0 items-center border-1 border-base-max rounded-md w-7 h-7";
  const dynamicClasses = allQueryExpressionsCollapsed
    ? "text-primary bg-base-max"
    : "text-base-max bg-transparent";
  const disabledClasses = "disabled:opacity-50";
  const enabledHoverClasses =
    "enabled:hover:bg-primary-darkest enabled:hover:text-primary-content-lightest enabled:hover:border-primary-darkest";
  return `${dynamicClasses} ${disabledClasses} ${enabledHoverClasses} ${baseClasses}`;
};

export const getCombinedClassesForRowCollapse = (
  filtersSectionCollapsed: boolean,
) => {
  const baseClasses =
    "border-1 border-white rounded-md w-7 h-7 flex items-center";
  const dynamicClasses = !filtersSectionCollapsed
    ? "text-primary bg-base-max"
    : "text-base-max bg-transparent";
  const disabledClasses =
    "disabled:opacity-50 disabled:bg-base-max disabled:text-primary";
  const enabledHoverClasses =
    "enabled:hover:bg-primary-darkest enabled:hover:text-primary-content-lightest enabled:hover:border-primary-darkest";
  return `${disabledClasses} ${enabledHoverClasses} ${baseClasses} ${dynamicClasses}`;
};
