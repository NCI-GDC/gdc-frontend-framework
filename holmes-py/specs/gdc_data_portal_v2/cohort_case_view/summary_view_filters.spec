# Cohort Case View - Summary View Filters
Date Created    : 10/01/2024
Version			    : 1.0
Owner		        : GDC QA
Description		  : Summary View Filters
Test-Case       : PEAR-2207

tags: gdc-data-portal-v2, regression, cohort-bar, case-view

## Navigate to Summary View
* On GDC Data Portal V2 app
* Navigate to "Analysis" from "Header" "section"
* Select "Add" from the Cohort Bar
* Expand or collapse the cohort bar
* Go to tab "Summary View" in Cohort Case View

## Validate Filter Card Presence
* Verify presence of filter cards in Cohort Summary View
  |facet_name                 |
  |---------------------------|
  |Primary Site               |
  |Disease Type               |
  |Project                    |
  |Program                    |
  |Gender                     |

## Apply Filters
* Make the following selections on a filter card in Cohort Summary View
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
* Collect case counts for the following filters in Cohort Summary View for cohort "CCV_SV_1"
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
  |General                |Project              |FM-AD                          |
  |General                |Program              |FM                             |
  |General                |Primary Site         |spinal cord, cranial nerves, and other parts of central nervous system|
  |Demographic            |Gender               |female                         |

## Custom Filters - Cases
* Clear active cohort filters
* Select Custom Filter "Cases" in Cohort Case View
* Upload "Myomatous Neoplasms" "txt" from "Cohort Case View" in "Cohort Filter Import" through "Browse"
* Is text "113 submitted case identifiers mapped to 113 unique GDC cases" present on the page
* Select "Submit"
* Wait for loading spinners to disappear
* Validate the cohort query filter area has these filters
  |facet_name         |selections           |position in filter area  |
  |-------------------|---------------------|-------------------------|
  |Case Id            |113 input case ids   |1                        |
* Collect case counts for the following filters in Cohort Summary View for cohort "CCV_CF_Cases"
  |facet_name           |selection                      |
  |---------------------|-------------------------------|
  |Disease Type         |myomatous neoplasms            |
* Collect Cohort Bar Case Count for comparison
* Verify "Disease Type_myomatous neoplasms_CCV_CF_Cases Count" and "Cohort Bar Case Count" are "Equal"

## Custom Filters - Genes
* Clear active cohort filters
* Navigate to "Cohort" from "Header" "section"
* Select Custom Filter "Mutated Genes" in Cohort Case View
* Upload "Gene List" "txt" from "Cohort Case View" in "Cohort Filter Import" through "Browse"
* Is text "10 submitted gene identifiers mapped to 10 unique GDC genes" present on the page
* Select "Submit"
* Wait for loading spinners to disappear
* Validate the cohort query filter area has these filters
  |facet_name         |selections           |position in filter area  |
  |-------------------|---------------------|-------------------------|
  |Mutated Gene       |10 input genes       |1                        |
* Validate expected custom filters "are" present in facet cards on the "Molecular Filters" tab on the Cohort Builder page
  |facet_name           |custom_filter_text                     |
  |---------------------|---------------------------------------|
  |Mutated Gene         |10 input genes                         |

## Custom Filters - Mutations
* Clear active cohort filters
* Select Custom Filter "Somatic Mutations" in Cohort Case View
* Upload "Single Mutation" "txt" from "Cohort Case View" in "Cohort Filter Import" through "Browse"
* Is text "1 submitted mutation identifier mapped to 1 unique GDC mutation" present on the page
* Select "Submit"
* Wait for loading spinners to disappear
* Validate the cohort query filter area has these filters
  |facet_name         |selections                           |position in filter area  |
  |-------------------|-------------------------------------|-------------------------|
  |Ssm Id             |fffffe32-4644-509e-8ff4-9ea2841c7094 |1                        |
* Validate expected custom filters "are" present in facet cards on the "Molecular Filters" tab on the Cohort Builder page
  |facet_name         |custom_filter_text                   |
  |-------------------|-------------------------------------|
  |Somatic Mutation   |fffffe32-4644-509e-8ff4-9ea2841c7094 |

## Flip Filters
* Perform the following actions on a filter card in Cohort Summary View
  |filter_name          |action               |
  |---------------------|---------------------|
  |Primary Site         |Chart view           |
  |Disease Type         |Chart view           |
  |Project              |Chart view           |
  |Program              |Chart view           |
  |Gender               |Chart view           |

## Collapse Cohort Case View
* Expand or collapse the cohort bar
