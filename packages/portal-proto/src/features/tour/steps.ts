export default
{
    '/user-flow/many-pages': [
        {
            selector: "#build-header-button",
            content: "Create cohorts through either existing filters (e.g. males with lung cancer) or through custom selection"
        },
        {
            selector: "#view-header-button",
            content: "View an overall summary of project-level information, including the available data for each project"
        },
        {
            selector: "#analysis-header-button",
            content: "Explore data by utilizing various case, genes and mutation filters",
        },
        {
            selector: "#repository-header-button",
            content: "See data files available for download at the GDC and apply file/case filters to narrow down your search",
        },
    ],
    '/user-flow/many-pages-v2': [
        {
            selector: "#cohorts-header-button",
            content: "Create cohorts through either existing filters (e.g. males with lung cancer) or through custom selection"
        },
        {
            selector: "#analysis-header-button",
            content: "Explore data by utilizing various case, genes and mutation filters",
        },
    ],
    '/user-flow/all-apps': [
        {
            selector: "#exploration-header-button",
            content: "Explore data by utilizing various case, genes and mutation filters",
        },
    ],
    '/user-flow/all-apps-v2': [
        {
            selector: "#cohorts-header-button",
            content: "Create cohorts through either existing filters (e.g. males with lung cancer) or through custom selection"
        },
        {
            selector: "#exploration-header-button",
            content: "Explore data by utilizing various case, genes and mutation filters",
        },
    ],
    '/user-flow/workbench/analysis_page': [
        {
            selector: '[data_tour="full_page_content"]',
            content: "General Introduction"
        },
        {
            selector: '[data-tour="context_bar"]',
            content: "Context management area to manages and view cohorts",
        },
        {
            selector: '[data-tour="cohort_management_bar"]',
            content: "Cohort management functions to create, delete, save, and load cohorts",
        },
        {
            selector: '[data-tour="cohort_summary"]',
            content: "Visual and tabular summary of current cohort",
        },
        {
            selector: '[data-tour="cohort_summary_charts"]',
            content: "Switch between summary chart and ...",
        },
        {
            selector: '[data-tour="cohort_summary_table"]',
            content: "table view",
        },
        {
            selector: '[data-tour="analysis_tool_management"]',
            content: "Applications and analysis tools",
        },
        {
            selector: '[data-tour="analysis_tool_filters"]',
            content: "Filter and sort GDC analysis tools in the area below",
        },
        {
            selector: '[data-tour="most_common_tools"]',
            content: "The most commonly used tools for exploration and data downloads",
        },
        {
            selector: '[data-tour="all_other_apps"]',
            content: "Analysis tools",
        },
    ],
}
