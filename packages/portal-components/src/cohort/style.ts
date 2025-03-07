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

export const actionButtonVariant = `data-[variant="action"]:h-12 data-[variant="action"]:w-12 data-[variant="action"]:flex data-[variant="action"]:justify-center data-[variant="action"]:items-center
  data-[variant="action"]:transition-colors data-[variant="action"]:focus-visible:outline-none data-[variant="action"]:focus-visible:ring-offset-2 data-[variant="action"]:focus-visible:ring-inset
  data-[variant="action"]:focus-visible:ring-2 data-[variant="action"]:focus-visible:ring-focusColor data-[variant="action"]:disabled:opacity-50 data-[variant="action"]:disabled:bg-base-max data-[variant="action"]:disabled:text-primary
  data-[variant="action"]:text-primary data-[variant="action"]:hover:bg-primary-darkest data-[variant="action"]:hover:text-primary-content-lightest data-[variant="action"]:bg-base-max`;

export const darkFunctionVariant = `
data-[variant="darkFunction"]:flex
data-[variant="darkFunction"]:flex-row
data-[variant="darkFunction"]:items-center
data-[variant="darkFunction"]:bg-secondary
data-[variant="darkFunction"]:text-secondary-contrast
data-[variant="darkFunction"]:border
data-[variant="darkFunction"]:border-solid
data-[variant="darkFunction"]:font-heading
data-[variant="darkFunction"]:disabled:opacity-60
data-[variant="darkFunction"]:disabled:border-opacity-60
data-[variant="darkFunction"]:disabled:text-opacity-60`;
