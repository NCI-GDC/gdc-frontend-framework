export default {
  "/user-flow/many-pages": [
    {
      selector: "#build-header-button",
      content:
        "Create cohorts through either existing filters (e.g. males with lung cancer) or through custom selection",
    },
    {
      selector: "#view-header-button",
      content:
        "View an overall summary of project-level information, including the available data for each project",
    },
    {
      selector: "#analysis-header-button",
      content:
        "Explore data by utilizing various case, genes and mutation filters",
    },
    {
      selector: "#repository-header-button",
      content:
        "See data files available for download at the GDC and apply file/case filters to narrow down your search",
    },
  ],
  "/user-flow/many-pages-v2": [
    {
      selector: "#cohorts-header-button",
      content:
        "Create cohorts through either existing filters (e.g. males with lung cancer) or through custom selection",
    },
    {
      selector: "#analysis-header-button",
      content:
        "Explore data by utilizing various case, genes and mutation filters",
    },
  ],
  "/user-flow/all-apps": [
    {
      selector: "#exploration-header-button",
      content:
        "Explore data by utilizing various case, genes and mutation filters",
    },
  ],
  "/user-flow/all-apps-v2": [
    {
      selector: "#cohorts-header-button",
      content:
        "Create cohorts through either existing filters (e.g. males with lung cancer) or through custom selection",
    },
    {
      selector: "#exploration-header-button",
      content:
        "Explore data by utilizing various case, genes and mutation filters",
    },
  ],
  "/analysis_page": [
    {
      selector: '[data_tour="full_page_content"]',
      content:
        "Welcome to the GDC Analysis Center! This is where you'll interact with your cohorts and the many apps available in the GDC. Let's take a look around.",
    },
    {
      selector: '[data-tour="context_bar"]',
      content:
        "At the top of the page is the Cohort Widget. The Cohort Widget provides easy access to information and various functionality related to your cohorts.",
    },
    {
      selector: '[data-tour="cohort_management_bar"]',
      content:
        "Over here you can see your current cohort and the number of cases in it. Use the dropdown to switch between your different cohorts. Buttons for managing your cohorts are available on the right.",
    },
    {
      selector: '[data-tour="cohort_summary"]',
      content:
        "Also in the Cohort Widget are useful summary charts about the composition of your cohort. Here's a tip: click on the flip icon to access filters for your current cohort. Go ahead and try it out now.",
    },
    {
      selector: '[data-tour="cohort_summary_charts"]',
      content:
        "The Summary View button allows you to switch to a visual summary of your cohort...",
    },
    {
      selector: '[data-tour="cohort_summary_table"]',
      content:
        "...while the Table View button lets you see details about individual cases in your cohort. Go ahead and click the button if you'd like.",
    },
    {
      selector: '[data-tour="analysis_tool_management"]',
      content:
        "In the middle, you'll find the the most commonly used apps, as well as tools for locating apps of interest.",
    },
    {
      selector: '[data-tour="most_common_tools"]',
      content:
        "Here are the Studies, Cohort Builder, and Repository apps. You can always mouse over apps to learn more about what they do. Go ahead and give it a try.",
    },
    {
      selector: '[data-tour="analysis_tool_filters"]',
      content:
        "You can use the sort options or select different tags to find your apps of interest.",
    },
    {
      selector: '[data-tour="all_other_apps"]',
      content:
        "Finally, here are the other apps available in the GDC for your research. If you click on an app to launch it, it will load here in this space. We are always expanding our catalog of apps, so be sure to check back often. Thanks for joining us on this tour!",
    },
  ],
};
