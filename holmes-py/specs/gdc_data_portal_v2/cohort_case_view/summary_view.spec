# Cohort Case View - Summary View Filters
Date Created    : 10/01/2024
Version			: 1.0
Owner		    : GDC QA
Description		: Summary View Filters
Test-Case       : PEAR-2207

tags: gdc-data-portal-v2, regression, cohort-bar, case-view

## Navigate to Summary View
* On GDC Data Portal V2 app
* Navigate to "Analysis" from "Header" "section"
* Select "Add" from the Cohort Bar
* Expand or collapse the cohort bar
* Go to tab "Summary View" in Cohort Case View

## Validate Filter Card Presence
* Verify presence of filter cards in Cohort Case View
  |facet_name                 |
  |---------------------------|
  |Primary Site               |
  |Disease Type               |
  |Project                    |
  |Program                    |
  |Gender                     |

## Apply Filters
* Make the following selections on a filter card in Cohort Case View
  |facet_name           |selection            |
  |---------------------|---------------------|
  |Disease Type         |plasma cell tumors   |
  |Disease Type         |gliomas              |
  |Primary Site         |spinal cord, cranial nerves, and other parts of central nervous system|


* Collect Cohort Bar Case Count for comparison
* Collect case counts for the following filters in Cohort Case View for cohort "CCT_PS"
  |facet_name           |selection                      |
  |---------------------|-------------------------------|
  |Primary Site         |spinal cord, cranial nerves, and other parts of central nervous system|
* Verify "Primary Site_spinal cord, cranial nerves, and other parts of central nervous system_CCT_PS Count" and "Cohort Bar Case Count" are "Equal"
## Collapse Cohort Case View
* Expand or collapse the cohort bar
