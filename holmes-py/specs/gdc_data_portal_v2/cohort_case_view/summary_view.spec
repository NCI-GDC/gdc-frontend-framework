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
  |Gender               |female               |
  |Project              |FM-AD                |
  |Program              |FM                   |

## Save Cohort
* Select "Save" from the Cohort Bar
* Name the cohort "CCV_SV_1" in the Cohort Bar section
* Perform action and validate modal text
  |Action to Perform|Text to validate in modal                  |Keep or Remove Modal|
  |-----------------|-------------------------------------------|--------------------|
  |Save             |Cohort has been saved                      |Remove Modal        |
* "CCV_SV_1" should be the active cohort

## Validate Cohort
* Collect Cohort Bar Case Count for comparison
* Collect case counts for the following filters in Cohort Case View for cohort "CCV_SV_1"
  |facet_name           |selection                      |
  |---------------------|-------------------------------|
  |Primary Site         |spinal cord, cranial nerves, and other parts of central nervous system|
  |Disease Type         |plasma cell tumors             |
* Verify "Primary Site_spinal cord, cranial nerves, and other parts of central nervous system_CCV_SV_1 Count" and "Cohort Bar Case Count" are "Equal"
* Navigate to "Cohort" from "Header" "section"
* Collect case counts for the following filters on the Cohort Builder page for cohort "CB-CCV_SV_1"
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |General                |Disease Type         |plasma cell tumors             |
* Verify "Disease Type_plasma cell tumors_CCV_SV_1 Count" and "Disease Type_plasma cell tumors_CB-CCV_SV_1 Count" are "Equal"
* Validate checkboxes are "Checked" on the Cohort Builder page
  |tab_name               |facet_name           |selection                      |
  |-----------------------|---------------------|-------------------------------|
  |General                |Disease Type         |plasma cell tumors             |
  |General                |Disease Type         |gliomas                        |

## Collapse Cohort Case View
* Expand or collapse the cohort bar
